# make_stack.py
from troposphere import Template, Parameter, Ref
from .singleServiceCreator import EC2_creation, S3_creation, RDS_creation, DynamoDB_creation

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
    # Keep VpcId if you plan to use it soon; otherwise you can drop it for now
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

    # Dispatch per node type
    for node in normalized.get("nodes", []):
        if node.get("type") == "EC2":
            # unique logical id based on node id (remove hyphens and colons for CloudFormation compatibility)
            node_id = node.get('id', 'Instance').replace('-', '').replace(':', '').replace('_', '')
            logical_id = f"EC2{node_id}"
            EC2_creation.add_ec2_instance(t, node, subnet_param, sg_param, logical_id=logical_id)
        
        if node.get("type") == "S3":
            # unique logical id based on node id (sanitize for CloudFormation)
            node_id = node.get('id', 'Bucket').replace('-', '').replace(':', '').replace('_', '')
            logical_id = f"S3{node_id}"
            S3_creation.add_s3_bucket(t, node, logical_id=logical_id)
        
        if node.get("type") == "RDS":
            # unique logical id based on node id (sanitize for CloudFormation)
            node_id = node.get('id', 'Instance').replace('-', '').replace(':', '').replace('_', '')
            logical_id = f"RDS{node_id}"
            RDS_creation.add_rds_instance(
                t, node, db_subnet_group_param, sg_param, 
                logical_id=logical_id, build_id=build_id
            )
        
        if node.get("type") == "DynamoDB":
            # unique logical id based on node id (sanitize for CloudFormation)
            node_id = node.get('id', 'Table').replace('-', '').replace(':', '').replace('_', '')
            logical_id = f"DynamoDB{node_id}"
            DynamoDB_creation.add_dynamodb_table(
                t, node, logical_id=logical_id, build_id=build_id
            )

    return t