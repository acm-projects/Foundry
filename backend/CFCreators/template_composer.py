# make_stack.py
from troposphere import Template, Parameter, Ref
from .singleServiceCreator import (
    EC2_creation, S3_creation, RDS_creation, DynamoDB_creation,
    create_ec2_s3_role, create_ec2_dynamodb_role, create_ec2_multi_service_role
)

def make_stack_template(normalized: dict) -> Template:
    t = Template()
    t.set_version("2010-09-09")  # AWSTemplateFormatVersion
    t.set_description("Foundry v1 - Single stack for EC2/S3/RDS/DynamoDB")

    # Check if we have RDS nodes to determine if we need RDS-specific parameters
    has_rds = any(node.get("type") == "RDS" for node in normalized.get("nodes", []))
    
    # Build parameter list dynamically based on resource types
    parameter_list = ["SubnetId", "SecurityGroupId"]
    if has_rds:
        parameter_list.append("DBSubnetGroupName")
    
    # Optional: helpful parameter UI grouping in the Console
    t.set_metadata({
        "AWS::CloudFormation::Interface": {
            "ParameterGroups": [
                {
                    "Label": {"default": "Networking"},
                    "Parameters": parameter_list
                }
            ],
            "ParameterLabels": {
                "SubnetId": {"default": "Target Subnet"},
                "SecurityGroupId": {"default": "Instance Security Group"},
                "DBSubnetGroupName": {"default": "DB Subnet Group"},
            }
        }
    })

    # v1 networking parameters
    vpc_param = t.add_parameter(Parameter("VpcId", Type="AWS::EC2::VPC::Id", Description="(Reserved for future use)"))
    subnet_param = t.add_parameter(Parameter("SubnetId", Type="AWS::EC2::Subnet::Id", Description="Target subnet"))
    sg_param = t.add_parameter(Parameter("SecurityGroupId", Type="AWS::EC2::SecurityGroup::Id", Description="Security group"))
    
    # RDS-specific parameters (only add if RDS nodes exist)
    db_subnet_group_param = None
    if has_rds:
        db_subnet_group_param = t.add_parameter(Parameter(
            "DBSubnetGroupName",
            Type="String",
            Description="DB Subnet Group for RDS instances (must span at least 2 AZs)"
        ))
    
    # Build ID for resource naming (can be passed from frontend or generated)
    build_id = normalized.get("buildId", "foundry-build")
    
    # ========== PHASE 1: Parse edges and build dependency map ==========
    edges = normalized.get("edges", [])
    ec2_dependencies = {}  # {ec2_node_id: {"s3": [s3_nodes], "dynamodb": [dynamo_nodes], "rds": [rds_nodes]}}
    
    for edge in edges:
        source = edge.get("source")  # Resource providing data (S3, RDS, DynamoDB)
        target = edge.get("target")  # EC2 that needs access
        
        # Find the node types
        source_node = next((n for n in normalized.get("nodes", []) if n.get("id") == source), None)
        target_node = next((n for n in normalized.get("nodes", []) if n.get("id") == target), None)
        
        if not source_node or not target_node:
            continue
        
        source_type = source_node.get("type")
        target_type = target_node.get("type")
        
        # We only handle EC2 as target (EC2 → S3, EC2 → RDS, EC2 → DynamoDB)
        if target_type == "EC2":
            if target not in ec2_dependencies:
                ec2_dependencies[target] = {"s3": [], "dynamodb": [], "rds": []}
            
            if source_type == "S3":
                ec2_dependencies[target]["s3"].append(source)
            elif source_type == "DynamoDB":
                ec2_dependencies[target]["dynamodb"].append(source)
            elif source_type == "RDS":
                ec2_dependencies[target]["rds"].append(source)
    
    # ========== PHASE 2: Create non-EC2 resources first and store references ==========
    resource_refs = {}  # {node_id: {"type": "S3", "logical_id": "S3bucket1", "resource": <obj>}}
    
    for node in normalized.get("nodes", []):
        node_id = node.get('id')
        node_type = node.get('type')
        
        if node_type == "S3":
            sanitized_id = node_id.replace('-', '').replace(':', '').replace('_', '')
            logical_id = f"S3{sanitized_id}"
            s3_resource = S3_creation.add_s3_bucket(t, node, logical_id=logical_id)
            resource_refs[node_id] = {
                "type": "S3",
                "logical_id": logical_id,
                "resource": s3_resource
            }
        
        elif node_type == "RDS":
            sanitized_id = node_id.replace('-', '').replace(':', '').replace('_', '')
            logical_id = f"RDS{sanitized_id}"
            rds_resource = RDS_creation.add_rds_instance(
                t, node, db_subnet_group_param, sg_param,
                logical_id=logical_id, build_id=build_id
            )
            resource_refs[node_id] = {
                "type": "RDS",
                "logical_id": logical_id,
                "resource": rds_resource,
                "db_name": node.get("data", {}).get("dbName", ""),
                "master_username": node.get("data", {}).get("masterUsername", ""),
                "master_password": node.get("data", {}).get("masterUserPassword", ""),
                "engine": node.get("data", {}).get("engine", "postgres"),
            }
        
        elif node_type == "DynamoDB":
            sanitized_id = node_id.replace('-', '').replace(':', '').replace('_', '')
            logical_id = f"DynamoDB{sanitized_id}"
            dynamodb_resource = DynamoDB_creation.add_dynamodb_table(
                t, node, logical_id=logical_id, build_id=build_id
            )
            resource_refs[node_id] = {
                "type": "DynamoDB",
                "logical_id": logical_id,
                "resource": dynamodb_resource
            }
    
    # ========== PHASE 3: Create EC2 instances with IAM roles and env vars ==========
    for node in normalized.get("nodes", []):
        if node.get("type") != "EC2":
            continue
        
        node_id = node.get('id')
        sanitized_id = node_id.replace('-', '').replace(':', '').replace('_', '')
        logical_id = f"EC2{sanitized_id}"
        
        # Check if this EC2 has any dependencies
        dependencies = ec2_dependencies.get(node_id, {"s3": [], "dynamodb": [], "rds": []})
        has_s3 = len(dependencies["s3"]) > 0
        has_dynamodb = len(dependencies["dynamodb"]) > 0
        has_rds_dep = len(dependencies["rds"]) > 0
        
        instance_profile = None
        environment_variables = {}
        
        # If EC2 has connections, create IAM role and env vars
        if has_s3 or has_dynamodb:
            services = {}
            
            # Collect S3 buckets
            if has_s3:
                services["s3_buckets"] = [
                    resource_refs[s3_id]["resource"] 
                    for s3_id in dependencies["s3"] 
                    if s3_id in resource_refs
                ]
                # Add S3 bucket names as environment variables
                for idx, s3_id in enumerate(dependencies["s3"]):
                    if s3_id in resource_refs:
                        env_var_name = f"S3_BUCKET_{idx+1}" if idx > 0 else "S3_BUCKET_NAME"
                        environment_variables[env_var_name] = Ref(resource_refs[s3_id]["resource"])
            
            # Collect DynamoDB tables
            if has_dynamodb:
                services["dynamodb_tables"] = [
                    resource_refs[dynamo_id]["resource"]
                    for dynamo_id in dependencies["dynamodb"]
                    if dynamo_id in resource_refs
                ]
                # Add DynamoDB table names as environment variables
                for idx, dynamo_id in enumerate(dependencies["dynamodb"]):
                    if dynamo_id in resource_refs:
                        env_var_name = f"DYNAMODB_TABLE_{idx+1}" if idx > 0 else "DYNAMODB_TABLE_NAME"
                        environment_variables[env_var_name] = Ref(resource_refs[dynamo_id]["resource"])
            
            # Create multi-service IAM role
            iam_role, instance_profile = create_ec2_multi_service_role(
                t, services, logical_id=f"{logical_id}Role"
            )
        
        # Add RDS connection info as environment variables (no IAM needed, uses credentials)
        if has_rds_dep:
            for idx, rds_id in enumerate(dependencies["rds"]):
                if rds_id in resource_refs:
                    rds_ref = resource_refs[rds_id]
                    prefix = f"DB_{idx+1}_" if idx > 0 else "DB_"
                    
                    # Import GetAtt for RDS endpoint
                    from troposphere import GetAtt
                    
                    environment_variables[f"{prefix}HOST"] = GetAtt(rds_ref["resource"], "Endpoint.Address")
                    environment_variables[f"{prefix}PORT"] = GetAtt(rds_ref["resource"], "Endpoint.Port")
                    environment_variables[f"{prefix}NAME"] = rds_ref["db_name"]
                    environment_variables[f"{prefix}USER"] = rds_ref["master_username"]
                    environment_variables[f"{prefix}PASSWORD"] = rds_ref["master_password"]
                    environment_variables[f"{prefix}ENGINE"] = rds_ref["engine"]
        
        # Create EC2 instance with IAM profile and environment variables
        EC2_creation.add_ec2_instance(
            t, node, subnet_param, sg_param,
            logical_id=logical_id,
            instance_profile=instance_profile,
            environment_variables=environment_variables if environment_variables else None
        )

    return t