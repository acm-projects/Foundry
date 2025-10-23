"""
AWS CloudFormation Deployment Module

Simple, universal CloudFormation deployment that works with any template.
"""

import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from typing import Dict, Optional


class AWSDeploymentError(Exception):
    """Custom exception for AWS deployment errors"""
    pass


class CloudFormationDeployer:
    """
    Simple CloudFormation deployment handler.
    Works with any CF template regardless of resources.
    """
    
    def __init__(self, region: str = 'us-east-1'):
        """Initialize AWS clients."""
        try:
            self.region = region
            self.cf_client = boto3.client('cloudformation', region_name=region)
            self.ec2_client = boto3.client('ec2', region_name=region)
        except NoCredentialsError:
            raise AWSDeploymentError(
                "AWS credentials not found. Please configure AWS credentials."
            )
    
    def get_default_vpc_resources(self) -> Dict[str, str]:
        """
        Find default VPC resources (VPC, Subnet, Security Group).
        
        Returns:
            Dictionary with VpcId, SubnetId, and SecurityGroupId
        """
        try:
            # Get default VPC
            vpcs = self.ec2_client.describe_vpcs(
                Filters=[{'Name': 'isDefault', 'Values': ['true']}]
            )
            
            if not vpcs['Vpcs']:
                raise AWSDeploymentError("No default VPC found")
            
            vpc_id = vpcs['Vpcs'][0]['VpcId']
            
            # Get a subnet in this VPC
            subnets = self.ec2_client.describe_subnets(
                Filters=[{'Name': 'vpc-id', 'Values': [vpc_id]}]
            )
            
            if not subnets['Subnets']:
                raise AWSDeploymentError(f"No subnets found in VPC {vpc_id}")
            
            subnet_id = subnets['Subnets'][0]['SubnetId']
            
            # Get default security group
            sgs = self.ec2_client.describe_security_groups(
                Filters=[
                    {'Name': 'vpc-id', 'Values': [vpc_id]},
                    {'Name': 'group-name', 'Values': ['default']}
                ]
            )
            
            if not sgs['SecurityGroups']:
                raise AWSDeploymentError(f"No security group found in VPC {vpc_id}")
            
            sg_id = sgs['SecurityGroups'][0]['GroupId']
            
            return {
                'VpcId': vpc_id,
                'SubnetId': subnet_id,
                'SecurityGroupId': sg_id
            }
            
        except ClientError as e:
            raise AWSDeploymentError(f"Failed to get VPC resources: {str(e)}")
    
    def deploy_stack(
        self, 
        template_body: str, 
        stack_name: str,
        parameters: Optional[Dict[str, str]] = None
    ) -> str:
        """
        Deploy a CloudFormation stack.
        
        Args:
            template_body: CloudFormation template as JSON string
            stack_name: Name for the stack
            parameters: Optional parameters (auto-discovered if not provided)
            
        Returns:
            Stack ID
        """
        try:
            # If parameters not provided, auto-discover them
            if parameters is None:
                parameters = self.get_default_vpc_resources()
            
            # Convert parameters to CloudFormation format
            cf_parameters = [
                {'ParameterKey': key, 'ParameterValue': value}
                for key, value in parameters.items()
            ]
            
            # Create the stack
            response = self.cf_client.create_stack(
                StackName=stack_name,
                TemplateBody=template_body,
                Parameters=cf_parameters,
                OnFailure='ROLLBACK'
            )
            
            return response['StackId']
            
        except ClientError as e:
            error_msg = e.response['Error']['Message']
            raise AWSDeploymentError(f"Failed to create stack: {error_msg}")
    
    def get_stack_status(self, stack_name: str) -> Dict:
        """
        Get the current status of a CloudFormation stack.
        
        Args:
            stack_name: Name of the stack
            
        Returns:
            Dictionary with status and outputs
        """
        try:
            response = self.cf_client.describe_stacks(StackName=stack_name)
            stack = response['Stacks'][0]
            
            return {
                'status': stack['StackStatus'],
                'outputs': stack.get('Outputs', [])
            }
            
        except ClientError as e:
            raise AWSDeploymentError(f"Failed to get stack status: {str(e)}")
