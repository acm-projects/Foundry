"""
Check the status of the deployed CloudFormation stack
"""
import sys
from pathlib import Path
import json

sys.path.insert(0, str(Path(__file__).parent.parent))

from CFCreators.aws_deployer import CloudFormationDeployer

deployer = CloudFormationDeployer(region='us-east-1')

print("Checking stack status...")
print("=" * 80)

status = deployer.get_stack_status('fullPipelineTest1')

print(f"Stack Status: {status['status']}")
print(f"\nOutputs:")
for output in status.get('outputs', []):
    print(f"  - {output['OutputKey']}: {output.get('OutputValue', 'N/A')}")
