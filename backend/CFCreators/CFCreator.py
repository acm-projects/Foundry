from . import template_composer
from .aws_deployer import CloudFormationDeployer, AWSDeploymentError
from datetime import datetime
from pathlib import Path
import json


def createGeneration(data: dict, save_to_file: bool = True):
    """
    Takes frontend ReactFlow JSON and generates a CloudFormation template.
    
    Args:
        data: Frontend ReactFlow JSON containing nodes and edges
        save_to_file: Whether to save the template to createdCFs folder (default: True)
        
    Returns:
        CloudFormation Template object
    """
    CFTemplate = template_composer.make_stack_template(data)
    
    # Print the CloudFormation template in JSON format
    print("CLOUDFORMATION TEMPLATE (JSON):")
    print("=" * 80)
    print(CFTemplate.to_json())
    print("=" * 80)
    
    # Save to allJSONs/createdCFs folder
    if save_to_file:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = Path(__file__).parent / "allJSONs" / "createdCFs" / f"CF_{timestamp}.json"
        
        # Ensure createdCFs directory exists
        output_path.parent.mkdir(exist_ok=True)
        
        # Convert to JSON and save with pretty formatting
        cf_json = CFTemplate.to_json()
        cf_dict = json.loads(cf_json)
        
        with open(output_path, 'w') as f:
            json.dump(cf_dict, f, indent=2)
        
        print(f"\n✓ CloudFormation template saved to: {output_path.relative_to(Path(__file__).parent.parent)}")
    
    return CFTemplate





def deployToAWS(canvas_data: dict, stack_name: str = None, region: str = 'us-east-1'):
    """
    Complete deployment pipeline: Generate CloudFormation template and deploy to AWS.
    
    Args:
        canvas_data: Frontend ReactFlow JSON containing nodes and edges
        stack_name: Name for the CloudFormation stack (auto-generated if not provided)
        region: AWS region to deploy to (default: us-east-1)
        
    Returns:
        Dictionary with deployment details:
        {
            'success': bool,
            'stackId': str,
            'stackName': str,
            'region': str,
            'status': str,
            'outputs': list,
            'message': str
        }
    """
    
    print("=" * 80)
    print("STARTING AWS DEPLOYMENT PIPELINE")
    print("=" * 80)
    
    try:
        # Step 1: Generate CloudFormation template
        print("\n[1/4] Generating CloudFormation template...")
        cf_template = createGeneration(canvas_data)
        template_json = cf_template.to_json()
        
        template_dict = json.loads(template_json)
        print(f"✓ Template generated")
        print(f"  - Resources: {list(template_dict.get('Resources', {}).keys())}")
        
        # Step 2: Initialize AWS deployer
        print(f"\n[2/4] Initializing AWS deployer (region: {region})...")
        deployer = CloudFormationDeployer(region=region)
        print("✓ AWS deployer initialized")
        
        # Step 3: Auto-discover VPC resources
        print("\n[3/4] Auto-discovering VPC resources...")
        vpc_resources = deployer.get_default_vpc_resources()
        print("✓ VPC resources discovered:")
        print(f"  - VPC: {vpc_resources['VpcId']}")
        print(f"  - Subnet: {vpc_resources['SubnetId']}")
        print(f"  - Security Group: {vpc_resources['SecurityGroupId']}")
        
        # Step 4: Deploy to AWS
        if not stack_name:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            stack_name = f"foundry-stack-{timestamp}"
        
        print(f"\n[4/4] Deploying stack '{stack_name}' to AWS...")
        stack_id = deployer.deploy_stack(
            template_body=template_json,
            stack_name=stack_name
        )
        
        # Get initial status
        status_info = deployer.get_stack_status(stack_name)
        
        
        print("\n" + "=" * 80)
        print("✓ DEPLOYMENT SUCCESSFUL!")
        print("=" * 80)
        print(f"Stack ID: {stack_id}")
        print(f"Stack Name: {stack_name}")
        print(f"Status: {status_info['status']}")
        
        return {
            'success': True,
            'stackId': stack_id,
            'stackName': stack_name,
            'region': region,
            'status': status_info['status'],
            'outputs': status_info.get('outputs', []),
            'message': 'Deployment initiated successfully'
        }
        
    except AWSDeploymentError as e:
        error_msg = f"AWS Deployment Error: {str(e)}"
        print(f"\n✗ {error_msg}")
        return {
            'success': False,
            'message': error_msg,
            'error': str(e)
        }
    
    except Exception as e:
        error_msg = f"Unexpected Error: {str(e)}"
        print(f"\n✗ {error_msg}")
        return {
            'success': False,
            'message': error_msg,
            'error': str(e)
        }







def getStackStatus(stack_name: str, region: str = 'us-east-1'):
    """
    Get the current status of a deployed CloudFormation stack.
    
    Args:
        stack_name: Name of the CloudFormation stack
        region: AWS region (default: us-east-1)
        
    Returns:
        Dictionary with stack status and outputs:
        {
            'success': bool,
            'stackName': str,
            'region': str,
            'status': str,
            'outputs': list
        }
    """
    try:
        deployer = CloudFormationDeployer(region=region)
        status_info = deployer.get_stack_status(stack_name)
        
        return {
            'success': True,
            'stackName': stack_name,
            'region': region,
            'status': status_info['status'],
            'outputs': status_info.get('outputs', [])
        }
        
    except AWSDeploymentError as e:
        return {
            'success': False,
            'message': str(e),
            'error': str(e)
        }
    except Exception as e:
        return {
            'success': False,
            'message': str(e),
            'error': str(e)
        }

