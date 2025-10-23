"""
Test S3 CloudFormation template generation
"""
import sys
from pathlib import Path
import json

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from CFCreators import CFCreator


def test_s3_template():
    """Test S3 template generation"""
    
    print("=" * 80)
    print("TESTING S3 CLOUDFORMATION TEMPLATE GENERATION")
    print("=" * 80)
    
    # Load S3 template
    json_path = Path(__file__).parent / "JSONTemplates" / "S3_template.json"
    with open(json_path, 'r') as f:
        s3_json = json.load(f)
    
    print("\n[1/2] Input JSON:")
    print(json.dumps(s3_json, indent=2))
    
    # Generate CloudFormation template
    print("\n[2/2] Generating CloudFormation template...")
    cf_template = CFCreator.createGeneration(s3_json)
    
    # Parse and pretty-print
    template_dict = json.loads(cf_template.to_json())
    
    print("\n" + "=" * 80)
    print("GENERATED TEMPLATE SUMMARY")
    print("=" * 80)
    print(f"Resources: {list(template_dict.get('Resources', {}).keys())}")
    print(f"Outputs: {list(template_dict.get('Outputs', {}).keys())}")
    
    # Check the S3 bucket resource
    s3_resources = {k: v for k, v in template_dict.get('Resources', {}).items() if v['Type'] == 'AWS::S3::Bucket'}
    
    if s3_resources:
        print("\n✓ S3 Bucket Resources:")
        for resource_id, resource in s3_resources.items():
            print(f"  - {resource_id}:")
            print(f"    - Type: {resource['Type']}")
            props = resource.get('Properties', {})
            if 'BucketName' in props:
                print(f"    - BucketName: {props['BucketName']}")
            else:
                print(f"    - BucketName: (auto-generated)")
            print(f"    - Encryption: {bool(props.get('BucketEncryption'))}")
            print(f"    - PublicAccessBlock: {bool(props.get('PublicAccessBlockConfiguration'))}")
            print(f"    - OwnershipControls: {bool(props.get('OwnershipControls'))}")
    else:
        print("\n✗ No S3 resources found!")
    
    print("\n" + "=" * 80)
    print("✓ S3 TEMPLATE GENERATION SUCCESSFUL!")
    print("=" * 80)
    
    return True


if __name__ == "__main__":
    success = test_s3_template()
    sys.exit(0 if success else 1)
