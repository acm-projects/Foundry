/**
 * Formats React Flow data for backend deployment
 * This is what gets sent to POST /canvas/deploy
 * 
 * Example output:
 * {
 *   "nodes": [
 *     {
 *       "id": "EC2:abc123",
 *       "type": "EC2",
 *       "position": { "x": -60, "y": 100 },
 *       "data": {
 *         "label": "EC2",
 *         "name": "web-01",
 *         "imageID": "Ubuntu",
 *         "instanceType": "t3.micro"
 *       }
 *     },
 *     {
 *       "id": "S3:xyz789",
 *       "type": "S3",
 *       "position": { "x": 200, "y": 100 },
 *       "data": {
 *         "label": "S3",
 *         "bucketName": "my-app-bucket"
 *       }
 *     },
 *     {
 *       "id": "RDS:rds456",
 *       "type": "RDS",
 *       "position": { "x": 400, "y": 100 },
 *       "data": {
 *         "label": "RDS",
 *         "dbName": "mydatabase",
 *         "engine": "postgres",
 *         "masterUsername": "dbadmin",
 *         "masterUserPassword": "SecurePass123!"
 *       }
 *     },
 *     {
 *       "id": "DynamoDB:ddb789",
 *       "type": "DynamoDB",
 *       "position": { "x": 600, "y": 100 },
 *       "data": {
 *         "label": "DynamoDB",
 *         "tableName": "my-table",
 *         "partitionKey": "id",
 *         "partitionKeyType": "S",
 *         "sortKey": "timestamp",
 *         "sortKeyType": "N"
 *       }
 *     }
 *   ],
 *   "edges": [
 *     {
 *       "id": "edge1",
 *       "source": "S3:xyz789",
 *       "target": "EC2:abc123"
 *     },
 *     {
 *       "id": "edge2",
 *       "source": "RDS:rds456",
 *       "target": "EC2:abc123"
 *     }
 *   ],
 *   "viewport": {
 *     "x": 0,
 *     "y": 0,
 *     "zoom": 1
 *   }
 * }
 */

export function formatDeployData(reactFlowData) {
  // The data is already in the correct format from React Flow
  // Each node's data property contains the configuration from the config menus
  return reactFlowData;
}

export function validateDeployData(reactFlowData) {
  const errors = [];
  
  reactFlowData.nodes.forEach(node => {
    const { type, data } = node;
    
    // Validate EC2
    if (type === "EC2") {
      if (!data.name) errors.push(`EC2 ${node.id}: Missing name`);
      if (!data.imageId) errors.push(`EC2 ${node.id}: Missing imageId`);
      if (!data.instanceType) errors.push(`EC2 ${node.id}: Missing instanceType`);
    }
    
    // Validate S3
    if (type === "S3") {
      if (!data.bucketName) errors.push(`S3 ${node.id}: Missing bucketName`);
    }
    
    // Validate RDS
    if (type === "RDS") {
      if (!data.dbName) errors.push(`RDS ${node.id}: Missing dbName`);
      if (!data.engine) errors.push(`RDS ${node.id}: Missing engine`);
      if (!data.masterUsername) errors.push(`RDS ${node.id}: Missing masterUsername`);
      if (!data.masterUserPassword) errors.push(`RDS ${node.id}: Missing masterUserPassword`);
    }
    
    // Validate DynamoDB
    if (type === "DynamoDB") {
      if (!data.tableName) errors.push(`DynamoDB ${node.id}: Missing tableName`);
      if (!data.partitionKey) errors.push(`DynamoDB ${node.id}: Missing partitionKey`);
      if (!data.partitionKeyType) errors.push(`DynamoDB ${node.id}: Missing partitionKeyType`);
    }
  });
  
  return errors;
}
