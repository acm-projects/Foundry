import requests
import boto3
import os 
from boto3.exceptions import S3UploadFailedError
from addYamlZip import addBuildSpec, dummyTemplate, appspecTemplate,addAppSpec,fastapi_buildspec_template
from deploymentScripts import addStartScript,start_sh_template,stop_sh_template,addStopScript,addInstallScript,install_sh_template
import time
from trigger_codebuild import trigger_codebuild
import uuid


OWNER = "enayas"
REPO = "fastapi-test-repo"
REF = "main"

zip_url = f"https://api.github.com/repos/{OWNER}/{REPO}/zipball/{REF}"  # download zip from github repo



out_file = f"{REPO}-{REF}.zip"  #output file name

headers = {"user":"test"}

response = requests.get(zip_url, headers=headers,allow_redirects=True)  #make the request to download the zip file


if response.status_code == 200: 
    with open(out_file, "wb") as file:
        file.write(response.content)  #write the content to a file
    print(f"Downloaded {out_file} successfully.")
   
    path = addBuildSpec(out_file, fastapi_buildspec_template, overWrite=True) #should be adding yaml file to the zip

    print("magical path for zip file",path)
    addAppSpec(out_file, appspecTemplate, overWrite=True)
    addStartScript(out_file, start_sh_template, overWrite=True)
    addStopScript(out_file, stop_sh_template, overWrite=True)
    addInstallScript(out_file, install_sh_template, overWrite=True)



     
else: 
    print(f"Failed to download file: {response.status_code} - {response.text}")



S3_BUCKET_NAME = "foundry-codebuild-zip"



S3_KEY = f"{OWNER}/{out_file}"  # the path for the file in the s3 bucket


#this function basically calls codebuild to start a build with the s3 location


def codeDeploy(): 
    print("code deploy called")

def upload_to_s3(file_name, bucket, object_name): 
   
    s3_client = boto3.client('s3') 
    try:
        s3_client.upload_file(file_name, bucket, object_name) #upload the file to s3
        print(f"Uploaded {file_name} to s3://{bucket}/{object_name} successfully.")

    except S3UploadFailedError as e:
        print(f"Failed to upload file to S3: {e}")  



upload_to_s3(out_file, S3_BUCKET_NAME, S3_KEY)
trigger_codebuild("foundryCICD",S3_BUCKET_NAME,S3_KEY,path,f"{OWNER}-{REPO}")





