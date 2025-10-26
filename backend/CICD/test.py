import requests
import boto3
import os 
from boto3.exceptions import S3UploadFailedError
from addYamlZip import addBuildSpec, dummyTemplate, appspecTemplate,addAppSpec
import time


OWNER = "efrain-grubs"
REPO = "ai-vs-human-written-text"
REF = "main"


zip_url = f"https://api.github.com/repos/{OWNER}/{REPO}/zipball/{REF}"  # download zip from github repo



out_file = f"{REPO}-{REF}.zip"  #output file name

headers = {"user":"test"}

response = requests.get(zip_url, headers=headers,allow_redirects=True)  #make the request to download the zip file


if response.status_code == 200: 
    with open(out_file, "wb") as file:
        file.write(response.content)  #write the content to a file
    print(f"Downloaded {out_file} successfully.")
   
    path = addBuildSpec(out_file, dummyTemplate, overWrite=True) #should be adding yaml file to the zip

    print("magical path for zip file",path)
    addAppSpec(out_file, appspecTemplate, overWrite=True)


     
else: 
    print(f"Failed to download file: {response.status_code} - {response.text}")



S3_BUCKET_NAME = "foundry-codebuild-zip"
S3_PREFIX = "artifacts"


S3_KEY = f"{S3_PREFIX}/{OWNER}/{out_file}"  # the path for the file in the s3 bucket


#this function basically calls codebuild to start a build with the s3 location


def codeDeploy(): 
    print("code deploy called")



def trigger_codebuild(project_name, s3_bucket, s3_key):

    codebuild_client = boto3.client('codebuild',region_name='us-east-1')
    
    try:
       
        response = codebuild_client.start_build(
            projectName=project_name,
            sourceTypeOverride='S3',
            sourceLocationOverride=f"{s3_bucket}/{s3_key}"
      
        )

        #print("response",response)
        
        
        print(f"CodeBuild started successfully!")

        while True: #checking for the build status every 10 seconds until it is complete
            build_id = response['build']['id']
            build_info = codebuild_client.batch_get_builds(ids=[build_id]) #api call to get build info
            build_status = build_info['builds'][0]['buildStatus'] 
            print(f"Current build status: {build_status}")
            if build_status in ['SUCCEEDED', 'FAILED', 'FAULT', 'STOPPED', 'TIMED_OUT']:
                break
            time.sleep(10)


            if(build_status == 'SUCCEEDED'):
                codeDeploy()

               
        
        return {
            'build_status': build_status
        }
    

  
    except Exception as e:
        print(f"Failed to trigger CodeBuild: {e}")
        return {
            'success': False,
            'error': str(e)
        }






def upload_to_s3(file_name, bucket, object_name): 
   
    s3_client = boto3.client('s3') 
    try:
        s3_client.upload_file(file_name, bucket, object_name) #upload the file to s3
        print(f"Uploaded {file_name} to s3://{bucket}/{object_name} successfully.")


#s3://foundry-codebuild-zip/artifacts/efrain-grubs/my-next-app-main.zip
        # Trigger CodeBuild after successful upload
        #trigger_codebuild("foundryCICD", bucket, object_name)







    except S3UploadFailedError as e:
        print(f"Failed to upload file to S3: {e}")  



upload_to_s3(out_file, S3_BUCKET_NAME, S3_KEY)
# if os.path.exists(out_file):
#     upload_to_s3(out_file, S3_BUCKET_NAME, S3_KEY)

    
#     try:
#         os.remove(out_file)
#         print(f"Cleaned up local file: {out_file}")
#     except OSError as e:
#         print(f"Error removing local file {out_file}: {e}")
# else:
#     print(f" Local file not found: {out_file}")




