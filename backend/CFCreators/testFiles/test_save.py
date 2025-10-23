"""
Quick test to verify CloudFormation templates are saved to createdCFs folder
"""
import sys
from pathlib import Path
import json

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from CFCreators import CFCreator


def test_save_cf_template():
    """Test that CF templates are saved to createdCFs"""
    
    print("=" * 80)
    print("TESTING CLOUDFORMATION TEMPLATE SAVING")
    print("=" * 80)
    
    # Load test template
    json_path = Path(__file__).parent / "JSONTemplates" / "S3_template.json"
    with open(json_path, 'r') as f:
        s3_data = json.load(f)
    
    print("\n[1/2] Generating CloudFormation template for S3...")
    
    # Generate template (will auto-save to createdCFs)
    cf_template = CFCreator.createGeneration(s3_data, save_to_file=True)
    
    print("\n[2/2] Checking createdCFs folder...")
    created_cfs_dir = Path(__file__).parent / "createdCFs"
    
    if created_cfs_dir.exists():
        cf_files = list(created_cfs_dir.glob("CF_*.json"))
        print(f"✓ Found {len(cf_files)} CloudFormation template(s) in createdCFs/")
        
        if cf_files:
            latest_file = max(cf_files, key=lambda p: p.stat().st_mtime)
            print(f"\n✓ Latest template: {latest_file.name}")
            print(f"  Size: {latest_file.stat().st_size} bytes")
    else:
        print("✗ createdCFs folder does not exist!")
    
    print("\n" + "=" * 80)
    print("✓ TEST COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    test_save_cf_template()
