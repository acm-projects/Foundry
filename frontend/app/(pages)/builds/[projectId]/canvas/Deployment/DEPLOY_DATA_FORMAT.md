# Deploy Data Format Examples

## When the Deploy button is clicked, the backend receives:

### Example 1: Single EC2 Instance

```json
{
  "nodes": [
    {
      "id": "EC2:abc123xyz",
      "type": "EC2",
      "position": {
        "x": -60,
        "y": 100
      },
      "data": {
        "label": "EC2",
        "name": "web-01",
        "imageID": "Ubuntu",
        "instanceType": "t3.micro"
      },
      "measured": {
        "width": 40,
        "height": 40
      }
    }
  ],
  "edges": [],
  "viewport": {
    "x": 0,
    "y": 0,
    "zoom": 1
  }
}
```

### Example 2: EC2 + S3 + RDS + DynamoDB with Connections

```json
{
  "nodes": [
    {
      "id": "EC2:web-server-123",
      "type": "EC2",
      "position": { "x": 200, "y": 100 },
      "data": {
        "label": "EC2",
        "name": "web-01",
        "imageID": "Ubuntu",
        "instanceType": "t3.micro"
      }
    },
    {
      "id": "S3:storage-456",
      "type": "S3",
      "position": { "x": 50, "y": 100 },
      "data": {
        "label": "S3",
        "bucketName": "my-app-bucket"
      }
    },
    {
      "id": "RDS:database-789",
      "type": "RDS",
      "position": { "x": 50, "y": 250 },
      "data": {
        "label": "RDS",
        "dbName": "mydatabase",
        "engine": "postgres",
        "masterUsername": "dbadmin",
        "masterUserPassword": "SecurePass123!"
      }
    },
    {
      "id": "DynamoDB:table-101",
      "type": "DynamoDB",
      "position": { "x": 50, "y": 400 },
      "data": {
        "label": "DynamoDB",
        "tableName": "users-table",
        "partitionKey": "userId",
        "partitionKeyType": "S",
        "sortKey": "timestamp",
        "sortKeyType": "N"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-s3-ec2",
      "source": "S3:storage-456",
      "target": "EC2:web-server-123"
    },
    {
      "id": "edge-rds-ec2",
      "source": "RDS:database-789",
      "target": "EC2:web-server-123"
    },
    {
      "id": "edge-dynamo-ec2",
      "source": "DynamoDB:table-101",
      "target": "EC2:web-server-123"
    }
  ],
  "viewport": {
    "x": 150,
    "y": 50,
    "zoom": 1.2
  }
}
```

## What Each Node Type Contains

### EC2 Node Data

```javascript
{
  label: "EC2",
  name: "web-01",              // User input from config menu
  imageID: "Ubuntu",           // Dropdown: Ubuntu | Amazon Linux | Windows
  instanceType: "t3.micro"     // Dropdown: t3.micro | t3.small | c7i-flex.large | m7i-flex.large
}
```

### S3 Node Data

```javascript
{
  label: "S3",
  bucketName: "my-app-bucket"  // User input (3-63 chars, lowercase, numbers, hyphens)
}
```

### RDS Node Data

```javascript
{
  label: "RDS",
  dbName: "mydatabase",                  // User input
  engine: "postgres",                    // Dropdown: postgres | mysql
  masterUsername: "dbadmin",             // User input
  masterUserPassword: "SecurePass123!"   // User input (password field)
}
```

### DynamoDB Node Data

```javascript
{
  label: "DynamoDB",
  tableName: "users-table",      // User input
  partitionKey: "userId",        // User input
  partitionKeyType: "S",         // Dropdown: S (String) | N (Number)
  sortKey: "timestamp",          // User input (optional)
  sortKeyType: "N"               // Dropdown: S (String) | N (Number)
}
```

## Backend Processing

The backend should:

1. Parse the `nodes` array to get all resources and their configurations
2. Parse the `edges` array to determine dependencies (which resources connect to EC2)
3. Use the node `type` to determine which creation script to call (EC2_creation.py, S3_creation.py, etc.)
4. Extract configuration from the node's `data` property
5. Generate CloudFormation template with IAM roles based on edges
6. Deploy the stack

## Validation

The frontend validates:

- All required fields are filled before allowing deployment
- Proper format for bucket names, usernames, etc.
- Field lengths and character restrictions

The backend should validate:

- Node types are supported (EC2, S3, RDS, DynamoDB)
- All required data fields exist for each node type
- Edge connections are valid (only connect TO EC2)
