# S3_creation.py
from typing import Dict, Any
from troposphere import Template, Ref, Output, GetAtt, Sub
import troposphere.s3 as s3
import uuid


def generate_unique_bucket_name(user_bucket_name: str = None, user_id: str = None, build_id: str = None) -> str:
    """
    Generate a unique S3 bucket name following the pattern:
    <userid>-<buildid>-<s3newid>-<userspecifiedbucketname>
    
    Args:
        user_bucket_name: User-specified bucket name (optional)
        user_id: User ID (to be supplied later, optional for now)
        build_id: Build ID (to be supplied later, optional for now)
        
    Returns:
        Unique bucket name in lowercase
        
    Example:
        user123-build456-s3789abc-my-app-storage
        
    Note:
        - If user_id or build_id not provided, they will be omitted
        - s3newid is always generated using UUID to ensure uniqueness
        - All parts are converted to lowercase and invalid characters removed
    """
    parts = []
    
    # Add user_id if provided (placeholder for future)
    if user_id:
        parts.append(sanitize_bucket_name_part(user_id))
    
    # Add build_id if provided (placeholder for future)
    if build_id:
        parts.append(sanitize_bucket_name_part(build_id))
    
    # Always add unique S3 ID using UUID (shortened to 8 characters)
    s3_unique_id = f"s3{uuid.uuid4().hex[:8]}"
    parts.append(s3_unique_id)
    
    # Add user-specified bucket name if provided
    if user_bucket_name:
        parts.append(sanitize_bucket_name_part(user_bucket_name))
    
    # Join all parts with hyphens
    bucket_name = "-".join(parts)
    
    # Ensure it meets S3 naming requirements
    # - Must be lowercase
    # - 3-63 characters
    # - Only letters, numbers, and hyphens
    # - Cannot start or end with hyphen
    bucket_name = bucket_name.lower()
    bucket_name = bucket_name.strip('-')
    
    # Truncate if too long (max 63 chars)
    if len(bucket_name) > 63:
        bucket_name = bucket_name[:63].rstrip('-')
    
    # If somehow empty or too short, add a default prefix
    if len(bucket_name) < 3:
        bucket_name = f"foundry-{s3_unique_id}"
    
    return bucket_name


def sanitize_bucket_name_part(name: str) -> str:
    """
    Sanitize a part of the bucket name to meet S3 requirements.
    
    Args:
        name: Raw name part
        
    Returns:
        Sanitized name part (lowercase, only letters/numbers/hyphens)
    """
    # Convert to lowercase
    name = name.lower()
    
    # Replace invalid characters with hyphens
    valid_chars = []
    for char in name:
        if char.isalnum():
            valid_chars.append(char)
        elif char in ['-', '_']:
            valid_chars.append('-')
        else:
            valid_chars.append('-')
    
    # Join and remove consecutive hyphens
    name = ''.join(valid_chars)
    while '--' in name:
        name = name.replace('--', '-')
    
    return name.strip('-')


def add_s3_bucket(
    t: Template,
    node: Dict[str, Any],
    *,
    logical_id: str = "S3Bucket",
    user_id: str = None,
    build_id: str = None,
) -> s3.Bucket:
    """
    Add an AWS::S3::Bucket to the given Template.
    Expects node['data'] with: bucketName (optional).
    
    Generates unique bucket name using pattern:
    <userid>-<buildid>-<s3newid>-<userspecifiedbucketname>
    
    All security settings are hardcoded:
    - Encryption: Always enabled (AES-256)
    - Public Access: Always blocked
    - Versioning: Disabled
    - Ownership Controls: BucketOwnerEnforced (ACLs disabled)
    
    Args:
        t: CloudFormation Template object
        node: Node data from frontend JSON
        logical_id: CloudFormation logical resource ID (default: "S3Bucket")
        user_id: User ID for bucket naming (optional, to be supplied in future)
        build_id: Build ID for bucket naming (optional, to be supplied in future)
        
    Returns:
        The created S3 Bucket resource
    """
    data = node["data"]
    
    # Get user-specified bucket name (optional)
    user_bucket_name = data.get("bucketName")
    
    # Generate unique bucket name
    # For now, user_id and build_id are None (will be passed from frontend in the future)
    bucket_name = generate_unique_bucket_name(
        user_bucket_name=user_bucket_name,
        user_id=user_id,
        build_id=build_id
    )
    
    print(f"  → Generated unique S3 bucket name: {bucket_name}")
    
    # Build bucket properties
    props: Dict[str, Any] = dict(
        # Use the generated unique bucket name
        BucketName=bucket_name,
        
        # Encryption configuration (always enabled)
        BucketEncryption=s3.BucketEncryption(
            ServerSideEncryptionConfiguration=[
                s3.ServerSideEncryptionRule(
                    ServerSideEncryptionByDefault=s3.ServerSideEncryptionByDefault(
                        SSEAlgorithm="AES256"
                    )
                )
            ]
        ),
        
        # Public access block configuration (always block public access)
        PublicAccessBlockConfiguration=s3.PublicAccessBlockConfiguration(
            BlockPublicAcls=True,
            BlockPublicPolicy=True,
            IgnorePublicAcls=True,
            RestrictPublicBuckets=True
        ),
        
        # Ownership controls (disable ACLs - AWS best practice)
        OwnershipControls=s3.OwnershipControls(
            Rules=[
                s3.OwnershipControlsRule(
                    ObjectOwnership="BucketOwnerEnforced"
                )
            ]
        )
    )
    
    # Create the S3 bucket
    bucket = s3.Bucket(logical_id, **props)
    t.add_resource(bucket)
    
    # Add helpful outputs
    t.add_output([
        Output(
            f"{logical_id}Name",
            Value=Ref(bucket),
            Description="Name of the S3 bucket"
        ),
        Output(
            f"{logical_id}Arn",
            Value=GetAtt(bucket, "Arn"),
            Description="ARN of the S3 bucket"
        ),
        Output(
            f"{logical_id}DomainName",
            Value=GetAtt(bucket, "DomainName"),
            Description="Domain name of the S3 bucket"
        )
    ])
    
    return bucket
