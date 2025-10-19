# make_stack.py
from troposphere import Template, Parameter, Ref
from . import EC2_creation

def make_stack_template(normalized: dict) -> Template:
    t = Template()
    t.set_version("2010-09-09")  # AWSTemplateFormatVersion
    t.set_description("Foundry v1 - Single stack for EC2 (S3/RDS/DynamoDB to be added later)")

    # Optional: helpful parameter UI grouping in the Console
    t.set_metadata({
        "AWS::CloudFormation::Interface": {
            "ParameterGroups": [
                {
                    "Label": {"default": "Networking"},
                    "Parameters": ["SubnetId", "SecurityGroupId"]
                }
            ],
            "ParameterLabels": {
                "SubnetId": {"default": "Target Subnet"},
                "SecurityGroupId": {"default": "Instance Security Group"},
            }
        }
    })

    # v1 networking parameters
    # Keep VpcId if you plan to use it soon; otherwise you can drop it for now
    vpc_param = t.add_parameter(Parameter("VpcId", Type="AWS::EC2::VPC::Id", Description="(Reserved for future use)"))
    subnet_param = t.add_parameter(Parameter("SubnetId", Type="AWS::EC2::Subnet::Id", Description="Target subnet"))
    sg_param = t.add_parameter(Parameter("SecurityGroupId", Type="AWS::EC2::SecurityGroup::Id", Description="Security group"))

    # Dispatch per node type
    for node in normalized.get("nodes", []):
        if node.get("type") == "EC2":
            # unique logical id based on node id (remove hyphens and colons for CloudFormation compatibility)
            node_id = node.get('id', 'Instance').replace('-', '').replace(':', '').replace('_', '')
            logical_id = f"EC2{node_id}"
            EC2_creation.add_ec2_instance(t, node, subnet_param, sg_param, logical_id=logical_id)
        
        if node.get("type") == "S3":
            pass
        if node.get("type") == "RDS":
            pass
        if node.get("type") == "DynamoDB":
            pass
        # S3/RDS/DynamoDB → add later in the same pattern

    return t