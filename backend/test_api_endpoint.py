"""
Test the FastAPI canvas deployment endpoint
"""
import requests
import json
import time

# Base URL for the FastAPI server
BASE_URL = "http://localhost:8000/canvas"

def test_deploy_endpoint():
    """Test the POST /canvas/deploy endpoint"""
    
    print("=" * 80)
    print("TESTING CANVAS DEPLOYMENT ENDPOINT")
    print("=" * 80)
    
    # Send empty canvas data (API will use test template)
    canvas_data = {
        "nodes": [],
        "edges": [],
        "viewport": {"x": 0, "y": 0, "zoom": 1}
    }
    
    print("\n[1/2] Sending deployment request...")
    print(f"POST {BASE_URL}/deploy")
    
    try:
        response = requests.post(
            f"{BASE_URL}/deploy",
            json=canvas_data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("\n✓ Deployment initiated!")
            print(json.dumps(result, indent=2))
            
            stack_name = result.get('stackName')
            region = result.get('region')
            
            # Test status endpoint
            print("\n[2/2] Checking deployment status...")
            print(f"GET {BASE_URL}/deploy/status/{stack_name}")
            
            time.sleep(2)  # Wait a bit
            
            status_response = requests.get(
                f"{BASE_URL}/deploy/status/{stack_name}",
                params={"region": region}
            )
            
            if status_response.status_code == 200:
                status = status_response.json()
                print("\n✓ Status retrieved!")
                print(json.dumps(status, indent=2))
            else:
                print(f"\n✗ Status check failed: {status_response.status_code}")
                print(status_response.text)
                
        else:
            print(f"\n✗ Deployment failed: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("\n✗ Could not connect to FastAPI server")
        print("Make sure the server is running:")
        print("  cd /path/to/backend")
        print("  uvicorn main:app --reload")
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")


if __name__ == "__main__":
    test_deploy_endpoint()
