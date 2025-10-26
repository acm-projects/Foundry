import boto3 

#out_file is the parameter representing the file to be deployed
def codeDeploy(out_file): 


    code_deploy = boto3.client("codedeploy", region_name="us-east-1")


    try: 
        response = code_deploy.create_deployment(

            #fill in parameters
        )


    except Exception as e: 
        print(f"Failed to trigger CodeDeploy: {e}")