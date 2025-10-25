#!/usr/bin/env python3
"""
Test script to verify RDS parameter is only added when RDS nodes exist
"""
import json
from CFCreators.template_composer import make_stack_template

print("=" * 80)
print("TEST 1: EC2 + S3 (No RDS) - Should NOT have DBSubnetGroupName parameter")
print("=" * 80)

test_ec2_s3 = {
    "nodes": [
        {
            "id": "s3_bucket_1",
            "type": "S3",
            "data": {
                "label": "S3",
                "bucketName": "akstestbucket"
            }
        },
        {
            "id": "react_flow_id",
            "type": "EC2",
            "data": {
                "label": "EC2",
                "name": "Thisisatestec2",
                "imageId": "Ubuntu",
                "instanceType": "t3.micro",
                "storage": {
                    "rootVolumeSizeGiB": 20,
                    "rootVolumeType": "gp3",
                    "deleteOnTermination": True
                }
            }
        }
    ]
}

template = make_stack_template(test_ec2_s3)
params = list(template.parameters.keys())
resources = list(template.resources.keys())

print(f"✓ Parameters: {params}")
print(f"✓ Resources: {resources}")
print(f"✓ Has DBSubnetGroupName: {'DBSubnetGroupName' in params}")

if 'DBSubnetGroupName' in params:
    print("✗ FAILED: DBSubnetGroupName should NOT be present without RDS!")
else:
    print("✓ SUCCESS: DBSubnetGroupName correctly omitted when no RDS")

print("\n" + "=" * 80)
print("TEST 2: RDS Only - Should have DBSubnetGroupName parameter")
print("=" * 80)

test_rds = {
    "nodes": [
        {
            "id": "rds_instance_1",
            "type": "RDS",
            "data": {
                "dbName": "mydatabase",
                "engine": "postgres",
                "masterUsername": "admin",
                "masterUserPassword": "MySecurePassword123!"
            }
        }
    ],
    "buildId": "test-build"
}

template_rds = make_stack_template(test_rds)
params_rds = list(template_rds.parameters.keys())
resources_rds = list(template_rds.resources.keys())

print(f"✓ Parameters: {params_rds}")
print(f"✓ Resources: {resources_rds}")
print(f"✓ Has DBSubnetGroupName: {'DBSubnetGroupName' in params_rds}")

if 'DBSubnetGroupName' not in params_rds:
    print("✗ FAILED: DBSubnetGroupName SHOULD be present with RDS!")
else:
    print("✓ SUCCESS: DBSubnetGroupName correctly added for RDS")

print("\n" + "=" * 80)
print("All tests completed!")
print("=" * 80)
