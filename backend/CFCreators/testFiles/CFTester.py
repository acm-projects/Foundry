import sys
from pathlib import Path
import json

# Add parent directory to path to allow imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from CFCreators import CFCreator


def load_json_template(filename="EC2_template.json"):
    """
    Load a JSON template from the JSONTemplates folder.
    """
    json_path = Path(__file__).parent / "JSONTemplates" / filename
    
    if not json_path.exists():
        raise FileNotFoundError(f"Template file not found: {json_path}")
    
    with open(json_path, 'r') as f:
        return json.load(f)


def save_cf_template(cf_template, output_filename="EC2CF.json"):
    """
    Save the CloudFormation template to the createdCFs folder.
    """
    output_path = Path(__file__).parent / "createdCFs" / output_filename
    
    # Convert the template to JSON string
    cf_json = cf_template.to_json()
    
    # Save to file with pretty formatting
    with open(output_path, 'w') as f:
        # Parse and re-format for prettier output
        cf_dict = json.loads(cf_json)
        json.dump(cf_dict, f, indent=2)
    
    return output_path


def test_cf_generation():
    """
    Test function to pass frontend JSON through the CloudFormation generation pipeline
    and print the resulting template.
    """
    # Load the frontend JSON from file
    frontend_json = load_json_template("EC2_template.json")
    
    print("=" * 80)
    print("FRONTEND JSON INPUT (from JSONTemplates/EC2_template.json):")
    print("=" * 80)
    import json
    print(json.dumps(frontend_json, indent=2))
    print("\n")
    
    print("=" * 80)
    print("GENERATING CLOUDFORMATION TEMPLATE...")
    print("=" * 80)
    print("\n")
    
    # Call the CF generation pipeline and get the template
    cf_template = CFCreator.createGeneration(frontend_json)
    
    # Save the template to createdCFs folder
    output_path = save_cf_template(cf_template, "EC2CF.json")
    
    print("\n")
    print("=" * 80)
    print("GENERATION COMPLETE")
    print("=" * 80)
    print(f"\n✅ CloudFormation template saved to: {output_path}")
    print("=" * 80)


if __name__ == "__main__":
    test_cf_generation()
