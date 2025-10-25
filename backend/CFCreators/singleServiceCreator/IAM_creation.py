# IAM_creation.py
from typing import Dict, Any, List
from troposphere import Template, Ref, GetAtt, Sub
import troposphere.iam as iam

def create_ec2_s3_role(
    t: Template,
    s3_bucket_resource,
    *,
    logical_id: str = "EC2S3Role"
) -> tuple:
    """
    Create IAM role and instance profile for EC2 to access S3.
    
    Args:
        t: Troposphere Template object
        s3_bucket_resource: The S3 bucket resource object
        logical_id: CloudFormation logical resource ID for the role
    
    Returns:
        Tuple of (iam_role, instance_profile)
    """
    
    # Create IAM Role with EC2 assume role policy
    role = iam.Role(
        logical_id,
        AssumeRolePolicyDocument={
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "ec2.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        },
        Policies=[
            iam.Policy(
                PolicyName=f"{logical_id}S3AccessPolicy",
                PolicyDocument={
                    "Version": "2012-10-17",
                    "Statement": [{
                        "Effect": "Allow",
                        "Action": [
                            "s3:GetObject",
                            "s3:PutObject",
                            "s3:DeleteObject",
                            "s3:ListBucket"
                        ],
                        "Resource": [
                            GetAtt(s3_bucket_resource, "Arn"),              # Bucket itself
                            Sub(f"${{BucketArn}}/*", BucketArn=GetAtt(s3_bucket_resource, "Arn"))  # Objects in bucket
                        ]
                    }]
                }
            )
        ],
        Tags=[
            {"Key": "Name", "Value": logical_id},
            {"Key": "ManagedBy", "Value": "CloudFormation"}
        ]
    )
    
    t.add_resource(role)
    
    # Create Instance Profile (required bridge between IAM role and EC2)
    instance_profile = iam.InstanceProfile(
        f"{logical_id}InstanceProfile",
        Roles=[Ref(role)]
    )
    
    t.add_resource(instance_profile)
    
    return role, instance_profile


def create_ec2_dynamodb_role(
    t: Template,
    dynamodb_table_resource,
    *,
    logical_id: str = "EC2DynamoDBRole"
) -> tuple:
    """
    Create IAM role and instance profile for EC2 to access DynamoDB.
    
    Args:
        t: Troposphere Template object
        dynamodb_table_resource: The DynamoDB table resource object
        logical_id: CloudFormation logical resource ID for the role
    
    Returns:
        Tuple of (iam_role, instance_profile)
    """
    
    # Create IAM Role with EC2 assume role policy
    role = iam.Role(
        logical_id,
        AssumeRolePolicyDocument={
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "ec2.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        },
        Policies=[
            iam.Policy(
                PolicyName=f"{logical_id}DynamoDBAccessPolicy",
                PolicyDocument={
                    "Version": "2012-10-17",
                    "Statement": [{
                        "Effect": "Allow",
                        "Action": [
                            "dynamodb:GetItem",
                            "dynamodb:PutItem",
                            "dynamodb:UpdateItem",
                            "dynamodb:DeleteItem",
                            "dynamodb:Query",
                            "dynamodb:Scan"
                        ],
                        "Resource": GetAtt(dynamodb_table_resource, "Arn")
                    }]
                }
            )
        ],
        Tags=[
            {"Key": "Name", "Value": logical_id},
            {"Key": "ManagedBy", "Value": "CloudFormation"}
        ]
    )
    
    t.add_resource(role)
    
    # Create Instance Profile
    instance_profile = iam.InstanceProfile(
        f"{logical_id}InstanceProfile",
        Roles=[Ref(role)]
    )
    
    t.add_resource(instance_profile)
    
    return role, instance_profile


def create_ec2_multi_service_role(
    t: Template,
    services: Dict[str, Any],
    *,
    logical_id: str = "EC2MultiServiceRole"
) -> tuple:
    """
    Create IAM role with policies for multiple services (S3, DynamoDB, RDS).
    
    Args:
        t: Troposphere Template object
        services: Dict with keys like 's3_buckets', 'dynamodb_tables' containing resource objects
        logical_id: CloudFormation logical resource ID for the role
    
    Returns:
        Tuple of (iam_role, instance_profile)
    """
    
    policies = []
    
    # Add S3 policies if S3 buckets exist
    if "s3_buckets" in services and services["s3_buckets"]:
        s3_resources = []
        for bucket in services["s3_buckets"]:
            s3_resources.append(GetAtt(bucket, "Arn"))
            # Use Sub() to concatenate GetAtt with string
            s3_resources.append(Sub(f"${{BucketArn}}/*", BucketArn=GetAtt(bucket, "Arn")))
        
        policies.append(
            iam.Policy(
                PolicyName="S3AccessPolicy",
                PolicyDocument={
                    "Version": "2012-10-17",
                    "Statement": [{
                        "Effect": "Allow",
                        "Action": [
                            "s3:GetObject",
                            "s3:PutObject",
                            "s3:DeleteObject",
                            "s3:ListBucket"
                        ],
                        "Resource": s3_resources
                    }]
                }
            )
        )
    
    # Add DynamoDB policies if tables exist
    if "dynamodb_tables" in services and services["dynamodb_tables"]:
        dynamodb_resources = [GetAtt(table, "Arn") for table in services["dynamodb_tables"]]
        
        policies.append(
            iam.Policy(
                PolicyName="DynamoDBAccessPolicy",
                PolicyDocument={
                    "Version": "2012-10-17",
                    "Statement": [{
                        "Effect": "Allow",
                        "Action": [
                            "dynamodb:GetItem",
                            "dynamodb:PutItem",
                            "dynamodb:UpdateItem",
                            "dynamodb:DeleteItem",
                            "dynamodb:Query",
                            "dynamodb:Scan"
                        ],
                        "Resource": dynamodb_resources
                    }]
                }
            )
        )
    
    # Create IAM Role
    role = iam.Role(
        logical_id,
        AssumeRolePolicyDocument={
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "ec2.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        },
        Policies=policies,
        Tags=[
            {"Key": "Name", "Value": logical_id},
            {"Key": "ManagedBy", "Value": "CloudFormation"}
        ]
    )
    
    t.add_resource(role)
    
    # Create Instance Profile
    instance_profile = iam.InstanceProfile(
        f"{logical_id}InstanceProfile",
        Roles=[Ref(role)]
    )
    
    t.add_resource(instance_profile)
    
    return role, instance_profile
