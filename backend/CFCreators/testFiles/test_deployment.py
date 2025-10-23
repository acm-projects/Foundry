"""
Complete end-to-end test of the deployment pipeline:
1. Load EC2_template.json
2. Generate CloudFormation template
3. Deploy to AWS using aws_deployer
4. Check deployment status

NOTE: This requires AWS credentials to be configured!
"""

import sys
from pathlib import Path
import json

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from CFCreators import CFCreator
from CFCreators.aws_deployer import CloudFormationDeployer, AWSDeploymentError


def test_full_pipeline():
    """Test the complete deployment pipeline"""
    
    print("=" * 80)
    print("TESTING COMPLETE DEPLOYMENT PIPELINE")
    print("=" * 80)
    
    # Step 1: Load the JSON template
    print("\n[1/5] Loading EC2_template.json...")
    json_path = Path(__file__).parent / "JSONTemplates" / "EC2_template.json"
    with open(json_path, 'r') as f:
        frontend_json = json.load(f)
    
    print(f"✓ Loaded template with {len(frontend_json['nodes'])} node(s)")
    print(f"  - Node type: {frontend_json['nodes'][0]['type']}")
    print(f"  - Instance: {frontend_json['nodes'][0]['data']['name']}")
    print(f"  - Image: {frontend_json['nodes'][0]['data']['imageId']}")
    print(f"  - Type: {frontend_json['nodes'][0]['data']['instanceType']}")
    
    # Step 2: Generate CloudFormation template
    print("\n[2/5] Generating CloudFormation template...")
    cf_template = CFCreator.createGeneration(frontend_json)
    template_json = cf_template.to_json()
    
    print("✓ CloudFormation template generated")
    template_dict = json.loads(template_json)
    print(f"  - Parameters: {list(template_dict.get('Parameters', {}).keys())}")
    print(f"  - Resources: {list(template_dict.get('Resources', {}).keys())}")
    print(f"  - Outputs: {list(template_dict.get('Outputs', {}).keys())}")
    
    # Step 3: Initialize deployer
    print("\n[3/5] Initializing AWS CloudFormation deployer...")
    try:
        deployer = CloudFormationDeployer(region='us-east-1')
        print("✓ AWS deployer initialized successfully")
    except AWSDeploymentError as e:
        print(f"✗ FAILED: {e}")
        print("\nPlease configure AWS credentials:")
        print("  - Run: aws configure")
        print("  - Or set environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY")
        return False
    
    # Step 4: Get VPC resources (test auto-discovery)
    print("\n[4/5] Auto-discovering VPC resources...")
    try:
        vpc_resources = deployer.get_default_vpc_resources()
        print("✓ VPC resources discovered:")
        print(f"  - VPC ID: {vpc_resources['VpcId']}")
        print(f"  - Subnet ID: {vpc_resources['SubnetId']}")
        print(f"  - Security Group ID: {vpc_resources['SecurityGroupId']}")
    except AWSDeploymentError as e:
        print(f"✗ FAILED: {e}")
        return False
    
    # Step 5: Deploy to AWS!
    try:
        stack_name = "fullPipelineTest5"
        print(f"\n[5/5] Deploying stack '{stack_name}' to AWS...")
        
        stack_id = deployer.deploy_stack(
            template_body=template_json,
            stack_name=stack_name
        )
        
        print(f"✓ Stack deployment initiated!")
        print(f"  - Stack ID: {stack_id}")
        print(f"  - Stack Name: {stack_name}")
        
        # Check status
        status = deployer.get_stack_status(stack_name)
        print(f"  - Current Status: {status['status']}")
        
        print("\n" + "=" * 80)
        print("✓ DEPLOYMENT SUCCESSFUL!")
        print("=" * 80)
        print("\nTo check status later, run:")
        print(f"  aws cloudformation describe-stacks --stack-name {stack_name}")
        
        return True
        
    except AWSDeploymentError as e:
        print(f"\n✗ DEPLOYMENT FAILED: {e}")
        return False
    
    return True


if __name__ == "__main__":
    success = test_full_pipeline()
    sys.exit(0 if success else 1)
