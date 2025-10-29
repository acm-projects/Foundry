import requests
import boto3
import os 
from boto3.exceptions import S3UploadFailedError
from addYamlZip import addBuildSpec, dummyTemplate, appspecTemplate, fastapi_buildspec_template, fastapi_appspec_template, addAppSpec 
from deploymentScripts import addStartScript, start_sh_template, stop_sh_template, install_sh_template, fastapi_start_sh_template, fastapi_stop_sh_template, fastapi_install_sh_template, addStopScript,addInstallScript
import time
import zipfile
import io
from trigger_codebuild import trigger_codebuild
import uuid


OWNER = "enayas"
REPO = "fastapi-test-repo"
REF = "main"


zip_url = f"https://api.github.com/repos/{OWNER}/{REPO}/zipball/{REF}"  # download zip from github repo



out_file = f"{REPO}-{REF}.zip"  #output file name

headers = {"user":"test"}

response = requests.get(zip_url, headers=headers,allow_redirects=True)  #make the request to download the zip file

# hello so this function is just checking whether the user repo is a frontend (next, angular), or fastapi, or express repo
def detect_project_type_in_zip(zip_path):
    with zipfile.ZipFile(zip_path, 'r') as z:
        names = [n.lower() for n in z.namelist()]
        fastapi_markers = [
            "main.py", "app/main.py", "app/api", "requirements.txt"
        ]
        if any("fastapi" in n or "uvicorn" in n for n in names) or \
           any(m in names for m in fastapi_markers):
            return "fastapi"
        
        express_markers = [
            "package.json", "server.js", "app.js"
        ]
        if any("express" in n or "node_modules" in n for n in names) or \
           any(m in names for m in express_markers):
            return "express"

        frontend_markers = [
            "angular.json", "vite.config.js", "next.config.js",
            "react", "src/app", "frontend/package.json"
        ]
        if any(m in n for n in frontend_markers):
            return "frontend"

    return "unknown"



if response.status_code == 200: 
    with open(out_file, "wb") as file:
        file.write(response.content)  #write the content to a file
    print(f"Downloaded {out_file} successfully.")
   
    project_type = detect_project_type_in_zip(out_file)
    print(f"Detected project type: {project_type}")

    if project_type == "fastapi":
        print("Adding FastAPI templates...")
        path = addBuildSpec(out_file, fastapi_buildspec_template, overWrite=True)
        addAppSpec(out_file, fastapi_appspec_template, overWrite=True)
        addStartScript(out_file, fastapi_start_sh_template, overWrite=True)
        addStopScript(out_file, fastapi_stop_sh_template, overWrite=True)
        addInstallScript(out_file, fastapi_install_sh_template, overWrite=True)

    else:
        print("Adding default (Next.js / Express) templates...")
        path = addBuildSpec(out_file, dummyTemplate, overWrite=True)
        addAppSpec(out_file, appspecTemplate, overWrite=True)
        addStartScript(out_file, start_sh_template, overWrite=True)
        addStopScript(out_file, stop_sh_template, overWrite=True)
        addInstallScript(out_file, install_sh_template, overWrite=True)



     
else: 
    print(f"Failed to download file: {response.status_code} - {response.text}")



S3_BUCKET_NAME = "foundry-codebuild-zip"
S3_PREFIX = "artifacts"


S3_KEY = f"{S3_PREFIX}/{OWNER}/{out_file}"  # the path for the file in the s3 bucket


#this function basically calls codebuild to start a build with the s3 location


def codeDeploy(): 
    print("code deploy called")






def upload_to_s3(file_name, bucket, object_name): 
   
    s3_client = boto3.client('s3') 
    try:
        s3_client.upload_file(file_name, bucket, object_name) #upload the file to s3
        print(f"Uploaded {file_name} to s3://{bucket}/{object_name} successfully.")


#s3://foundry-codebuild-zip/artifacts/efrain-grubs/my-next-app-main.zip
        # Trigger CodeBuild after successful upload
        trigger_codebuild(
            project_name="foundryCICD",
            s3_bucket=S3_BUCKET_NAME,
            s3_key=S3_KEY,
            path=path,           # path returned from addBuildSpec()
            id=str(uuid.uuid4()) # unique artifact name for CodeBuild
        )







    except S3UploadFailedError as e:
        print(f"Failed to upload file to S3: {e}")  



upload_to_s3(out_file, S3_BUCKET_NAME, S3_KEY)
if os.path.exists(out_file):
    
    try:
        os.remove(out_file)
        print(f"Cleaned up local file: {out_file}")
    except OSError as e:
        print(f"Error removing local file {out_file}: {e}")
else:
    print(f" Local file not found: {out_file}")




