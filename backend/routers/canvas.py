from fastapi import APIRouter, HTTPException,Header
from typing import Optional
from pydantic import BaseModel
from CFCreators import CFCreator
import httpx
import requests
from CICD.addYamlZip import addAppSpec, addBuildSpec, dummyTemplate, appspecTemplate
from CICD.upload_s3 import upload_to_s3
import time
from CICD.trigger_codebuild import trigger_codebuild
from CICD.deploymentScripts import addStartScript,start_sh_template,stop_sh_template,addStopScript,addInstallScript,install_sh_template
from CICD.code_Deploy import codeDeploy

router = APIRouter(prefix="/canvas")

@router.post('/deploy')
def deploy_initiate(canvas: dict):
    try:
        print("="*50)
        print("DEPLOY REQUEST RECEIVED")
        print("="*50)
        print("Canvas data:", canvas)
        print("Number of nodes:", len(canvas.get('nodes', [])))
        print("Number of edges:", len(canvas.get('edges', [])))
        
        # Generate a unique build_id as integer (timestamp-based)
        import time
        build_id = int(time.time() * 1000)  # Millisecond timestamp as integer
        
        # Uncomment when ready to process
        # CFCreator.createGeneration(canvas)
        
        return {
            "status": "success",
            "message": "Canvas received successfully",
            "build_id": build_id,  # Return integer build_id to frontend
            "nodes_count": len(canvas.get('nodes', [])),
            "edges_count": len(canvas.get('edges', []))
        }
    except Exception as e:
        print(f"ERROR in deploy_initiate: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Deployment failed: {str(e)}")


@router.post('/deploy/update')
def deploy_update(canvas: dict, build_id: Optional[int] = None):
    try:
        print("="*50)
        print("UPDATE REQUEST RECEIVED")
        print("="*50)
        
        # Validate that build_id is provided
        if not build_id:
            raise HTTPException(
                status_code=400, 
                detail="Missing required field: build_id. The update endpoint requires build_id to identify which build to update."
            )
        
        print(f"Build ID: {build_id}")
        print("Canvas data:", canvas)
        print("Number of nodes:", len(canvas.get('nodes', [])))
        print("Number of edges:", len(canvas.get('edges', [])))
        
        # TODO: Implement update logic
        # This should:
        # 1. Compare with existing CloudFormation stack using build_id
        # 2. Generate a changeset
        # 3. Apply updates to existing resources
        # For now, treating as a new deployment
        
        # Uncomment when ready to process
        # CFCreator.createGeneration(canvas, build_id)
        
        return {
            "status": "success",
            "message": "Canvas update received successfully",
            "build_id": build_id,
            "nodes_count": len(canvas.get('nodes', [])),
            "edges_count": len(canvas.get('edges', [])),
            "action": "update"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR in deploy_update: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")



@router.get('/')
async def get_repos(authorization: Optional[str] = Header(None)): 

    if not authorization: 
        raise HTTPException(status_code=401, detail="Authorization header missing")
    


    token = authorization.split(" ")[1]

    async with httpx.AsyncClient() as client:  
        response = await client.get(f"https://api.github.com/users/{token}/repos")
        

        repos = response.json()

        simplified = [
        {
            "name": repo["name"],
            "html_url": repo["html_url"],
            "zip_url": f"https://github.com/{token}/{repo['name']}//main.zip", 
            "owner": repo["owner"]["login"],
            "ref": "main",


        }
        for repo in repos
    ]
        return simplified

@router.post("/builds")
async def cicd(Data: dict):


    url = Data.get("repo")

    owner = url.split("/")[3]
    repo = url.split("/")[4]

    print(owner,repo)
    ref = "main"

    zip_url = f"https://api.github.com/repos/{owner}/{repo}/zipball/{ref}" 

    print(zip_url)


    out_file = f"{repo}-{ref}.zip"

    headers = {"user":"test"}

    response = requests.get(zip_url, headers=headers,allow_redirects=True)  #make the request to download the zip file

    S3_BUCKET_NAME = "foundry-codebuild-zip"



    S3_KEY = f"{owner}/{out_file}"  # the path for the file in the s3 bucket

    print(S3_KEY)


    if response.status_code == 200: 
        with open(out_file, "wb") as file:
            file.write(response.content)  #write the content to a file
        print(f"Downloaded {out_file} successfully.")
        path = addBuildSpec(out_file, dummyTemplate, overWrite=True)


        addAppSpec(out_file, appspecTemplate, overWrite=True)
        addStartScript(out_file, start_sh_template, overWrite=True)
        addStopScript(out_file, stop_sh_template, overWrite=True)
        addInstallScript(out_file, install_sh_template, overWrite=True)
    
       

        
    else: 
        print(f"Failed to download file: {response.status_code} - {response.text}")

    # upload_to_s3(out_file, S3_BUCKET_NAME, S3_KEY)
    
    upload_to_s3(out_file, S3_BUCKET_NAME, S3_KEY)



    time.sleep(10)  #wait for a few seconds to ensure the file is available in s3

    status = trigger_codebuild("foundryCICD", S3_BUCKET_NAME, S3_KEY,path,f"{owner}-{repo}")

    print(status)

    if(status['build_status'] == 'SUCCEEDED'):
        codeDeploy(owner,repo,"foundry-artifacts-bucket",f"founryCICD-{owner}-{repo}")
        print("hello world")



      
        

        

    
       


    



    
    

    



    


       
     


