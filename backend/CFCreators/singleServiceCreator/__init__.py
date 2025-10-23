# Single Service Creator Module
# Contains individual service creation modules for CloudFormation resources

from .EC2_creation import add_ec2_instance, resolve_image_id
from .S3_creation import add_s3_bucket, generate_unique_bucket_name

__all__ = [
    'add_ec2_instance',
    'resolve_image_id',
    'add_s3_bucket',
    'generate_unique_bucket_name'
]
