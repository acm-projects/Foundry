# EC2_creation.py
from typing import Dict, Any, Optional
from troposphere import Template, Ref, Base64, Sub, Tags, Output, GetAtt
import troposphere.ec2 as ec2

# Mapping of friendly image names to AWS SSM Parameter Store paths
# These SSM parameters are maintained by AWS and automatically point to the latest AMI
IMAGE_NAME_TO_SSM = {
    "Amazon Linux": "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64",
    "Ubuntu": "/aws/service/canonical/ubuntu/server/22.04/stable/current/amd64/hvm/ebs-gp2/ami-id",
    "Windows": "/aws/service/ami-windows-latest/Windows_Server-2022-English-Full-Base",
    # Note: macOS is not included as it requires dedicated hosts and cannot use standard SSM parameters
    # If macOS support is needed, user must provide a specific AMI ID from their dedicated host setup
}

def resolve_image_id(image_input: str) -> str:
    """
    Resolve image ID from either:
    1. A friendly name (Amazon Linux, Ubuntu, Windows, macOS) -> returns SSM parameter
    2. A direct AMI ID (ami-xxxxx) -> returns as-is
    
    Args:
        image_input: Either a friendly name or AMI ID
        
    Returns:
        Either an SSM parameter path or AMI ID string
    """
    # If it's already an AMI ID, return it
    if image_input.startswith("ami-"):
        return image_input
    
    # Otherwise, look up the SSM parameter for the friendly name
    ssm_param = IMAGE_NAME_TO_SSM.get(image_input)
    
    if ssm_param:
        # Return a CloudFormation resolve expression for SSM parameter
        return f"{{{{resolve:ssm:{ssm_param}}}}}"
    
    # If no mapping found, return as-is (will likely fail validation)
    return image_input


def add_ec2_instance(
    t: Template,
    node: Dict[str, Any],
    subnet_param,
    sg_param,
    *,
    logical_id: str = "EC2Instance",
    instance_profile: Optional[Any] = None,
    environment_variables: Optional[Dict[str, str]] = None,
) -> ec2.Instance:
    """
    Add an AWS::EC2::Instance to the given Template.
    Expects node['data'] with: name, imageId, instanceType, optional keyName, userData, storage{...}.
    The imageId can be either:
    - A friendly name: "Amazon Linux", "Ubuntu", "Windows", "macOS"
    - A direct AMI ID: "ami-xxxxx"
    
    Networking comes from Parameters: SubnetId, SecurityGroupId.
    
    Args:
        t: Troposphere Template object
        node: Node dictionary from ReactFlow canvas
        subnet_param: Parameter reference for subnet
        sg_param: Parameter reference for security group
        logical_id: CloudFormation logical resource ID
        instance_profile: Optional IAM instance profile for permissions
        environment_variables: Optional dict of env vars to inject into UserData
    
    Returns:
        The created EC2 Instance resource
    """
    data = node["data"]
    storage = data.get("storage") or {}
    user_data = data.get("userData", "")

    # Resolve the image ID (convert friendly name to SSM parameter or use AMI ID directly)
    resolved_image_id = resolve_image_id(data["imageId"])
    
    # Build environment variable exports for UserData
    env_var_script = ""
    if environment_variables:
        env_var_lines = []
        for key, value in environment_variables.items():
            # Add to current session and to /etc/environment for persistence
            env_var_lines.append(f'export {key}="{value}"')
            env_var_lines.append(f'echo "export {key}=\\"{value}\\"" >> /etc/environment')
        env_var_script = "\n".join(env_var_lines)
    
    # Combine environment variables with user's custom UserData
    if env_var_script:
        combined_user_data = f"""#!/bin/bash
# Auto-generated environment variables for service connections
{env_var_script}

# User-provided UserData
{user_data}
"""
    else:
        combined_user_data = user_data if user_data else ""
    
    # Root volume (locked defaults with per-node overrides)
    block_devices = [
        ec2.BlockDeviceMapping(
            DeviceName="/dev/xvda",  # common Linux HVM root; adjust per-AMI family if needed
            Ebs=ec2.EBSBlockDevice(
                VolumeSize=storage.get("rootVolumeSizeGiB", 20),
                VolumeType=storage.get("rootVolumeType", "gp3"),
                DeleteOnTermination=storage.get("deleteOnTermination", True),
            ),
        )
    ]

    # Build properties (omit optionals when None so Troposphere doesn't render them)
    props: Dict[str, Any] = dict(
        ImageId=resolved_image_id,            # resolved AMI ID or SSM parameter
        InstanceType=data["instanceType"],
        SubnetId=Ref(subnet_param),
        SecurityGroupIds=[Ref(sg_param)],
        BlockDeviceMappings=block_devices,
        Tags=Tags(Name=data["name"]),
    )
    
    # Add IAM instance profile if provided
    if instance_profile:
        props["IamInstanceProfile"] = Ref(instance_profile)
    
    if data.get("keyName"):
        props["KeyName"] = data["keyName"]
    if combined_user_data:
        props["UserData"] = Base64(Sub(combined_user_data))

    instance = ec2.Instance(logical_id, **props)
    t.add_resource(instance)

    # Helpful, namespaced outputs (avoid collisions when multiple EC2s exist)
    t.add_output([
        Output(f"{logical_id}Id", Value=Ref(instance)),
        Output(f"{logical_id}PrivateIp", Value=GetAtt(instance, "PrivateIp")),
        Output(f"{logical_id}PublicIp", Value=GetAtt(instance, "PublicIp")),  # blank if no public IP
        Output(f"{logical_id}NameTag", Value=data["name"]),
    ])

    return instance
