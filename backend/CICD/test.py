import requests
import boto3
import os 
from boto3.exceptions import S3UploadFailedError
from addYamlZip import addBuildSpec, dummyTemplate

OWNER = "efrain-grubs"
REPO = "my-next-app"
REF = "main"


zip_url = f"https://api.github.com/repos/{OWNER}/{REPO}/zipball/{REF}"  # download zip from github repo



out_file = f"{REPO}-{REF}.zip"  #output file name

headers = {"user":"test"}

response = requests.get(zip_url, headers=headers,allow_redirects=True)  #make the request to download the zip file


if response.status_code == 200: 
    with open(out_file, "wb") as file:
        file.write(response.content)  #write the content to a file. should appear inside the cicd folder 
    print(f"Downloaded {out_file} successfully.")
    addBuildSpec(out_file, dummyTemplate, overWrite=True) #should be adding yaml file to the zip



    #verifying injection:
    import zipfile
    with zipfile.ZipFile(out_file, "r") as z:
        print("Contents of the zip after injection:")
        z.namelist() # Should now include 'buildspec.yml'
        
else: 
    print(f"Failed to download file: {response.status_code} - {response.text}")



S3_BUCKET_NAME = "foundry-codebuild-zip"
S3_PREFIX = "artifacts"


S3_KEY = f"{S3_PREFIX}/{OWNER}/{out_file}"  # the path for the file in the s3 bucket





def upload_to_s3(file_name, bucket, object_name): 
    # This will use the credentials found in the next location in the chain
    s3_client = boto3.client('s3') 
    try:
        s3_client.upload_file(file_name, bucket, object_name) #upload the file to s3
        print(f"Uploaded {file_name} to s3://{bucket}/{object_name} successfully.")
    except S3UploadFailedError as e:
        print(f"Failed to upload file to S3: {e}")  


if os.path.exists(out_file):
    upload_to_s3(out_file, S3_BUCKET_NAME, S3_KEY)
    try:
        os.remove(out_file)
        print(f"Cleaned up local file: {out_file}")
    except OSError as e:
        print(f"Error removing local file {out_file}: {e}")
else:
    print(f" Local file not found: {out_file}")


