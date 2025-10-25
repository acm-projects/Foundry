# Single Service Creator Module
# Contains individual service creation modules for CloudFormation resources

from .EC2_creation import add_ec2_instance, resolve_image_id
from .S3_creation import add_s3_bucket, generate_unique_bucket_name
from .RDS_creation import add_rds_instance
from .DynamoDB_creation import add_dynamodb_table
from .IAM_creation import create_ec2_s3_role, create_ec2_dynamodb_role, create_ec2_multi_service_role

__all__ = [
    'add_ec2_instance',
    'resolve_image_id',
    'add_s3_bucket',
    'generate_unique_bucket_name',
    'add_rds_instance',
    'add_dynamodb_table',
    'create_ec2_s3_role',
    'create_ec2_dynamodb_role',
    'create_ec2_multi_service_role',
]
