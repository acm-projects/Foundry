"""
Test the CFCreator deployment functions
"""
import sys
from pathlib import Path
import json

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import from the CFCreators package
import CFCreators.CFCreator as CFCreator


def test_deployment_functions():
    """Test the CFCreator.deployToAWS() function"""
    
    # Load test template
    json_path = Path(__file__).parent / "JSONTemplates" / "EC2_template.json"
    with open(json_path, 'r') as f:
        canvas_data = json.load(f)
    
    print("Testing CFCreator.deployToAWS()...")
    print()
    
    # Deploy using CFCreator (auto-generate stack name with timestamp)
    result = CFCreator.deployToAWS(
        canvas_data=canvas_data,
        stack_name=None,  # Will auto-generate with timestamp
        region='us-east-1'
    )
    
    print("\n" + "=" * 80)
    print("DEPLOYMENT RESULT:")
    print("=" * 80)
    print(json.dumps(result, indent=2, default=str))
    
    if result['success']:
        print("\n✓ Deployment successful!")
        
        # Test status check
        print("\n" + "=" * 80)
        print("Testing CFCreator.getStackStatus()...")
        print("=" * 80)
        
        status = CFCreator.getStackStatus(
            stack_name=result['stackName'],
            region=result['region']
        )
        
        print(json.dumps(status, indent=2, default=str))
        
        return True
    else:
        print("\n✗ Deployment failed!")
        return False


if __name__ == "__main__":
    success = test_deployment_functions()
    sys.exit(0 if success else 1)
