from . import template_composer

def createGeneration(data: dict):
    """
    Takes frontend ReactFlow JSON and generates a CloudFormation template.
    """
    CFTemplate = template_composer.make_stack_template(data)
    
    # Print the CloudFormation template in JSON format
    print("CLOUDFORMATION TEMPLATE (JSON):")
    print("=" * 80)
    print(CFTemplate.to_json())
    print("=" * 80)
    
    return CFTemplate


# def createGeneration(data: dict):
#     #for i in dict 
#     # print("inside createGeenration", data)

#     nodeData = data['nodes'] 
#     # print(nodeData)
#     for node in nodeData:
#         if node['type'] == 'EC2':
#             EC2Creation(node)
#             # print("EC2") 

#     # for i in data:
#     #     print(i)
#     return True

# def EC2Creation(EC2Data: dict):
#     print(EC2Data)
#     pass