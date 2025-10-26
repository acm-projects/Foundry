import boto3
from boto3.exceptions import S3UploadFailedError
from CICD import trigger_codebuild
import time
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



