import boto3 
import time 
import uuid


def trigger_codebuild(project_name, s3_bucket, s3_key,path,id): #in the future it will be their build id or something

    codebuild_client = boto3.client('codebuild',region_name='us-east-1')
    
    try:
       
        response = codebuild_client.start_build(
            projectName=project_name,
            sourceTypeOverride='S3',
            sourceLocationOverride=f"{s3_bucket}/{s3_key}",
            buildspecOverride=path,
            artifactsOverride={ 
                'type': 'S3',
                'location': 'foundry-artifacts-bucket',
                'name': f'founryCICD-{id}',
                'packaging': 'ZIP',
                 
               
               
               }
      
        )

       
        
        
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
                #codeDeploy()
                print('hello world')

               
        
        return {
            'build_status': build_status
        }
    

  
    except Exception as e:
        print(f"Failed to trigger CodeBuild: {e}")
        return {
            'success': False,
            'error': str(e)
        }