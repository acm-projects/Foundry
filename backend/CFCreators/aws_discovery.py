import boto3
from botocore.exceptions import NoRegionError


def get_ec2_client():
    """Create an EC2 client using the backend's default AWS configuration."""
    try:
        return boto3.client("ec2")
    except NoRegionError as error:
        # If no region is configured for the backend host/profile, boto3 raises this.
        raise RuntimeError(
            "AWS region is not configured for the backend. "
            "Configure a default region in your AWS setup (e.g., ~/.aws/config or instance role)."
        ) from error


def get_default_vpc_id():
    """Return the default VPC ID for this account/region. Error if none exists."""
    ec2 = get_ec2_client()
    response = ec2.describe_vpcs(Filters=[{"Name": "is-default", "Values": ["true"]}])
    vpcs = response.get("Vpcs", [])
    if not vpcs:
        raise RuntimeError(
            "No default VPC found in this region. Create one or update the app to choose a specific VPC."
        )
    return vpcs[0]["VpcId"]


def pick_subnet_id(vpc_id: str):
    """Pick a subnet within the VPC. Prefer ones that auto-assign public IP; otherwise first by AZ name."""
    ec2 = get_ec2_client()
    response = ec2.describe_subnets(Filters=[{"Name": "vpc-id", "Values": [vpc_id]}])
    subnets = response.get("Subnets", [])
    if not subnets:
        raise RuntimeError(f"No subnets found in VPC {vpc_id}.")
    # Prefer public-IP-on-launch, then sort by AZ for stability
    subnets.sort(
        key=lambda s: (not s.get("MapPublicIpOnLaunch", False), s.get("AvailabilityZone", ""))
    )
    return subnets[0]["SubnetId"]


def pick_security_group_id(vpc_id: str):
    """Prefer the VPC's 'default' security group; if missing, use the first SG in that VPC."""
    ec2 = get_ec2_client()
    resp_default = ec2.describe_security_groups(
        Filters=[
            {"Name": "vpc-id", "Values": [vpc_id]},
            {"Name": "group-name", "Values": ["default"]},
        ]
    )
    security_groups = resp_default.get("SecurityGroups", [])
    if not security_groups:
        resp_any = ec2.describe_security_groups(Filters=[{"Name": "vpc-id", "Values": [vpc_id]}])
        security_groups = resp_any.get("SecurityGroups", [])
    if not security_groups:
        raise RuntimeError(f"No security groups found in VPC {vpc_id}.")
    return security_groups[0]["GroupId"]


def suggest_stack_parameters():
    """
    Return exactly the CFN Parameter keys our template expects:
    VpcId, SubnetId, SecurityGroupId (+ Region for logs/UI).
    """
    ec2 = get_ec2_client()
    region = ec2.meta.region_name or ""
    vpc_id = get_default_vpc_id()
    subnet_id = pick_subnet_id(vpc_id)
    security_group_id = pick_security_group_id(vpc_id)
    return {
        "VpcId": vpc_id,
        "SubnetId": subnet_id,
        "SecurityGroupId": security_group_id,
        "Region": region,
    }


def pick_two_subnets_for_rds(vpc_id: str):
    """For RDS later: return subnets in two different AZs within the VPC."""
    ec2 = get_ec2_client()
    response = ec2.describe_subnets(Filters=[{"Name": "vpc-id", "Values": [vpc_id]}])
    subnets = response.get("Subnets", [])
    subnets_by_az = {}
    for subnet in subnets:
        subnets_by_az.setdefault(subnet["AvailabilityZone"], []).append(subnet["SubnetId"])
    az_list = [az for az, ids in subnets_by_az.items() if ids]
    if len(az_list) < 2:
        raise RuntimeError("RDS requires subnets in at least two Availability Zones.")
    return [subnets_by_az[az_list[0]][0], subnets_by_az[az_list[1]][0]]


if __name__ == "__main__":
    # quick manual test
    print(suggest_stack_parameters())
