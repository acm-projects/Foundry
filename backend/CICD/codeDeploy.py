import boto3

def codeDeploy():
    code_deploy = boto3.client("codedeploy", region_name="us-east-1")

    try:
        response = code_deploy.create_deployment(
            applicationName="MyApp",
            deploymentGroupName="MyDeploymentGroup",
            revision={
                'revisionType': 'S3',
                's3Location': {
                    'bucket': 'foundry-codebuild-zip',
                    'key': 'artifacts/efrain-grubs/ai-vs-human-written-text-main.zip',
                    'bundleType': 'zip'
                }
            },
            deploymentConfigName='CodeDeployDefault.AllAtOnce',
            description='Deploying latest build to EC2'
        )

        print("Deployment started:", response['deploymentId'])

    except Exception as e:
        print(f"Failed to trigger CodeDeploy: {e}")