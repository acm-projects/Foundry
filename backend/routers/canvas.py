from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from CFCreators import CFCreator
import json
from pathlib import Path


router = APIRouter(prefix="/canvas")

@router.post('/deploy')
def deploy_initiate(canvas: dict):
    """
    Deploy canvas infrastructure to AWS CloudFormation.
    
    Currently uses EC2_template.json for testing.
    In the future, will use the actual canvas data from the frontend.
    
    Args:
        canvas: Frontend ReactFlow JSON (currently ignored, using test template)
        
    Returns:
        Deployment result with stack information
    """
    print("=" * 80)
    print("DEPLOYMENT REQUEST RECEIVED")
    print("=" * 80)
    
    # TODO: Remove this once frontend sends proper canvas data
    # For now, load the test template
    template_path = Path(__file__).parent.parent / "CFCreators" / "allJSONs" / "JSONTemplates" / "EC2_template.json"
    
    try:
        #this code here will be repalced by the canvas_data = canvas line at the bottom
        # with open(template_path, 'r') as f:
        #     canvas_data = json.load(f)
        
        # print(f"Using test template: {template_path}")
        # print(f"Canvas data received (will be used in future): {json.dumps(canvas, indent=2)}")
        
        # TODO: Replace canvas_data with canvas once frontend integration is complete
        canvas_data = canvas
        
    except FileNotFoundError:
        raise HTTPException(
            status_code=500,
            detail=f"Test template not found: {template_path}"
        )
    

    
    
    
    # Deploy to AWS using CFCreator
    try:
        result = CFCreator.deployToAWS(
            canvas_data=canvas_data,
            stack_name=None,  # Auto-generate unique name with timestamp
            region='us-east-1'
        )
        
        if result['success']:
            print("\n✓ Deployment successful!")
            return {
                "success": True,
                "message": "Deployment initiated successfully",
                "stackId": result['stackId'],
                "stackName": result['stackName'],
                "region": result['region'],
                "status": result['status'],
                "outputs": result.get('outputs', [])
            }
        else:
            print(f"\n✗ Deployment failed: {result.get('message')}")
            raise HTTPException(
                status_code=500,
                detail=result.get('message', 'Deployment failed')
            )
            
    except Exception as e:
        print(f"\n✗ Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Deployment error: {str(e)}"
        )


@router.get('/deploy/status/{stack_name}')
def get_deployment_status(stack_name: str, region: str = 'us-east-1'):
    """
    Get the current status of a CloudFormation stack deployment.
    
    Args:
        stack_name: Name of the CloudFormation stack
        region: AWS region (default: us-east-1)
        
    Returns:
        Stack status and outputs
    """
    try:
        result = CFCreator.getStackStatus(stack_name, region)
        
        if result['success']:
            return {
                "success": True,
                "stackName": result['stackName'],
                "region": result['region'],
                "status": result['status'],
                "outputs": result.get('outputs', [])
            }
        else:
            raise HTTPException(
                status_code=404,
                detail=result.get('message', 'Stack not found')
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting stack status: {str(e)}"
        )