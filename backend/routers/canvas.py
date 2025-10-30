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
    print(canvas)
    # CFCreator.createGeneration(canvas)


    return canvas



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



      
        

        

    
       


    



    
    

    



    


       
     


