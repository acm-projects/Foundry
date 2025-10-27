import boto3

def codeDeploy():
    code_deploy = boto3.client("codedeploy", region_name="us-east-1")

    try:

        create_app = code_deploy.create_application(  #makes application on code deploy
            applicationName="MyApp",
            computePlatform="Server"
            )
        

        create_deployment_group = code_deploy.create_deployment_group(

            applicationName="MyApp",
            deploymentGroupName="MyDeploymentGroup",            #makes deployment group on codedeploy   
            serviceRoleArn="arn:aws:iam::575380174326:role/serviceRoleCodeDeploy",
            ec2TagFilters=[{'Key': 'Name','Value': 'cicd','Type': 'KEY_AND_VALUE'} ]
           

          
            )
        

        response = code_deploy.create_deployment(
            applicationName="MyApp",
            deploymentGroupName="MyDeploymentGroup",
            revision={
                'revisionType': 'S3',
                's3Location': {
                    'bucket': 'foundry-artifacts-bucket',
                    'key': 'foundry-artifacts-bucket',
                    'bundleType': 'zip'
                }
            },
            deploymentConfigName='CodeDeployDefault.AllAtOnce',
            description='Deploying latest build to EC2'
        )

        print("Deployment started:", response['deploymentId'])

    except Exception as e:
        print(f"Failed to trigger CodeDeploy: {e}")


codeDeploy()