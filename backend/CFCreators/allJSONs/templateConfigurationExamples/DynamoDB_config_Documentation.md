# DynamoDB Configuration Example - Field Documentation

This document explains all fields in the DynamoDB configuration template.

## Node Structure

```json
{
  "id": "dynamodb-node-1",         // Unique identifier for this node
  "type": "DynamoDB",              // Must be "DynamoDB"
  "position": { "x": 100, "y": 200 },
  "data": { ... }                  // DynamoDB configuration (see below)
}
```

---

## Required Fields

### `tableName` (string)

- **Purpose**: Name of the DynamoDB table
- **Rules**:
  - 3-255 characters
  - Letters, numbers, underscores, hyphens, and dots
  - Must be unique in your AWS account per region
- **Example**: `"my-dynamodb-table"`

### `attributeDefinitions` (array of objects)

- **Purpose**: Define attributes used in keys or indexes
- **Structure**: `[{ "attributeName": "string", "attributeType": "S|N|B" }]`
- **Attribute Types**:
  - `"S"` - String
  - `"N"` - Number
  - `"B"` - Binary
- **Note**: Only define attributes used in key schema or indexes
- **Example**:
  ```json
  [
    { "attributeName": "userId", "attributeType": "S" },
    { "attributeName": "timestamp", "attributeType": "N" }
  ]
  ```

### `keySchema` (array of objects)

- **Purpose**: Define the primary key structure
- **Structure**: `[{ "attributeName": "string", "keyType": "HASH|RANGE" }]`
- **Key Types**:
  - `"HASH"` - Partition key (required, must be first)
  - `"RANGE"` - Sort key (optional, must be second if used)
- **Rules**:
  - Must have exactly 1 HASH key
  - Can have 0 or 1 RANGE key
  - Attributes must be defined in attributeDefinitions
- **Example**:
  ```json
  [
    { "attributeName": "userId", "keyType": "HASH" },
    { "attributeName": "timestamp", "keyType": "RANGE" }
  ]
  ```

---

## Billing Mode

### `billingMode` (string)

- **Purpose**: How you pay for reads/writes
- **Valid values**:
  - `"PAY_PER_REQUEST"` - On-demand pricing (recommended for unpredictable workloads)
  - `"PROVISIONED"` - Pre-allocated capacity (lower cost for steady workloads)
- **Default**: `"PAY_PER_REQUEST"`
- **Example**: `"PAY_PER_REQUEST"`

### `provisionedThroughput` (object, conditional)

- **Purpose**: Specify read/write capacity (only for PROVISIONED billing)
- **Required**: Only if `billingMode` is `"PROVISIONED"`
- **Structure**:
  ```json
  {
    "readCapacityUnits": 5, // Number of reads per second
    "writeCapacityUnits": 5 // Number of writes per second
  }
  ```
- **Range**: 1-40000 per table
- **Cost**: Lower than on-demand for consistent traffic
- **Note**: Ignored if billingMode is PAY_PER_REQUEST
- **Example**: `{ "readCapacityUnits": 5, "writeCapacityUnits": 5 }`

---

## Indexes (Optional)

### `globalSecondaryIndexes` (array of objects, optional)

- **Purpose**: Query table using alternative keys
- **Use case**: Query data by different attributes
- **Limit**: Up to 20 GSIs per table
- **Structure**:
  ```json
  [
    {
      "indexName": "EmailIndex",
      "keySchema": [{ "attributeName": "email", "keyType": "HASH" }],
      "projection": {
        "projectionType": "ALL" // or "KEYS_ONLY" or "INCLUDE"
      },
      "provisionedThroughput": {
        "readCapacityUnits": 5,
        "writeCapacityUnits": 5
      }
    }
  ]
  ```
- **Projection Types**:
  - `"ALL"` - All attributes (most flexible, higher storage cost)
  - `"KEYS_ONLY"` - Only key attributes (lowest storage cost)
  - `"INCLUDE"` - Specific attributes (specify nonKeyAttributes array)
- **Note**: provisionedThroughput ignored if table uses PAY_PER_REQUEST
- **Default**: `[]` (no GSIs)

### `localSecondaryIndexes` (array of objects, optional)

- **Purpose**: Alternative sort key with same partition key
- **Use case**: Query same partition key with different sort orders
- **Limit**: Up to 5 LSIs per table
- **Constraint**: Can only be created at table creation time (cannot add later)
- **Structure**:
  ```json
  [
    {
      "indexName": "TimestampIndex",
      "keySchema": [
        { "attributeName": "userId", "keyType": "HASH" },
        { "attributeName": "createdAt", "keyType": "RANGE" }
      ],
      "projection": {
        "projectionType": "ALL"
      }
    }
  ]
  ```
- **Default**: `[]` (no LSIs)

---

## Streams and Change Data Capture

### `streamSpecification` (object, optional)

- **Purpose**: Enable DynamoDB Streams for change data capture
- **Use cases**: Trigger Lambda functions, replicate data, audit logs
- **Structure**:
  ```json
  {
    "streamEnabled": true,
    "streamViewType": "NEW_AND_OLD_IMAGES"
  }
  ```
- **Stream View Types**:
  - `"KEYS_ONLY"` - Only key attributes
  - `"NEW_IMAGE"` - Entire item after modification
  - `"OLD_IMAGE"` - Entire item before modification
  - `"NEW_AND_OLD_IMAGES"` - Both before and after (most common)
- **Default**: `{ "streamEnabled": false }`
- **Example**: `{ "streamEnabled": true, "streamViewType": "NEW_AND_OLD_IMAGES" }`

---

## Security and Encryption

### `sseSpecification` (object, optional)

- **Purpose**: Encryption at rest
- **Structure**:
  ```json
  {
    "sseEnabled": true,
    "sseType": "KMS", // or "AES256"
    "kmsMasterKeyId": null // AWS-managed key if null
  }
  ```
- **SSE Types**:
  - `"AES256"` - AWS-owned key (default, no cost)
  - `"KMS"` - AWS-managed key or customer-managed key (better control, small cost)
- **Default**: `{ "sseEnabled": true, "sseType": "AES256" }`
- **Production**: Use KMS for compliance requirements
- **Example**: `{ "sseEnabled": true, "sseType": "KMS", "kmsMasterKeyId": null }`

---

## Backup and Recovery

### `pointInTimeRecoveryEnabled` (boolean, optional)

- **Purpose**: Enable continuous backups for point-in-time recovery
- **Benefit**: Restore table to any point in last 35 days
- **Cost**: Additional charge based on table size
- **Default**: `false`
- **Production**: Set to `true`
- **Example**: `true`

---

## Time To Live (TTL)

### `timeToLiveEnabled` (boolean, optional)

- **Purpose**: Automatically delete expired items
- **Use case**: Session data, temporary records, logs
- **Default**: `false`
- **Example**: `false`

### `timeToLiveAttributeName` (string, optional)

- **Purpose**: Name of the attribute containing expiration timestamp
- **Required**: Only if `timeToLiveEnabled` is `true`
- **Format**: Attribute must contain Unix timestamp (seconds since epoch)
- **Example**: `"expirationTime"` or `null`
- **Note**: Items deleted within 48 hours of expiration (not instant)

---

## Tags

### `tags` (array of objects, optional)

- **Purpose**: Metadata for organization and cost tracking
- **Limit**: Up to 50 tags per table
- **Structure**:
  ```json
  [
    { "key": "Environment", "value": "Production" },
    { "key": "Application", "value": "Foundry" },
    { "key": "CostCenter", "value": "Engineering" }
  ]
  ```
- **Default**: `[]`
- **Best practice**: Use consistent tagging strategy
- **Example**: `[{ "key": "Environment", "value": "Production" }]`

---

## Deletion Protection

### `deletionProtectionEnabled` (boolean, optional)

- **Purpose**: Prevent accidental table deletion
- **Default**: `false`
- **Production**: Set to `true` for critical tables
- **Note**: Must disable before deleting table
- **Example**: `false`

---

## Field Dependencies

### Billing Mode

- If `billingMode` is `"PROVISIONED"`:
  - **Must** provide `provisionedThroughput`
  - **Must** provide `provisionedThroughput` for each GSI
- If `billingMode` is `"PAY_PER_REQUEST"`:
  - `provisionedThroughput` is **ignored**
  - GSI `provisionedThroughput` is **ignored**

### Time To Live

- If `timeToLiveEnabled` is `true`:
  - **Must** provide `timeToLiveAttributeName`
  - Attribute does **not** need to be in `attributeDefinitions`

### Indexes

- All attributes in key schemas **must** be in `attributeDefinitions`
- LSI must share same partition key as table
- GSI can use any attributes

### Encryption

- If `sseType` is `"KMS"`:
  - Can optionally provide `kmsMasterKeyId`
  - If `null`, uses AWS-managed key

---

## Minimal Configuration Example

```json
{
  "id": "dynamo-simple",
  "type": "DynamoDB",
  "data": {
    "tableName": "simple-table",
    "billingMode": "PAY_PER_REQUEST",
    "attributeDefinitions": [{ "attributeName": "id", "attributeType": "S" }],
    "keySchema": [{ "attributeName": "id", "keyType": "HASH" }]
  }
}
```

## Production Configuration Example

```json
{
  "id": "dynamo-production",
  "type": "DynamoDB",
  "data": {
    "tableName": "users-production",
    "billingMode": "PAY_PER_REQUEST",
    "attributeDefinitions": [
      { "attributeName": "userId", "attributeType": "S" },
      { "attributeName": "email", "attributeType": "S" },
      { "attributeName": "timestamp", "attributeType": "N" }
    ],
    "keySchema": [
      { "attributeName": "userId", "keyType": "HASH" },
      { "attributeName": "timestamp", "keyType": "RANGE" }
    ],
    "globalSecondaryIndexes": [
      {
        "indexName": "EmailIndex",
        "keySchema": [{ "attributeName": "email", "keyType": "HASH" }],
        "projection": { "projectionType": "ALL" }
      }
    ],
    "streamSpecification": {
      "streamEnabled": true,
      "streamViewType": "NEW_AND_OLD_IMAGES"
    },
    "sseSpecification": {
      "sseEnabled": true,
      "sseType": "KMS",
      "kmsMasterKeyId": null
    },
    "pointInTimeRecoveryEnabled": true,
    "deletionProtectionEnabled": true,
    "tags": [
      { "key": "Environment", "value": "Production" },
      { "key": "Application", "value": "Foundry" }
    ]
  }
}
```

---

## Common Use Cases

### User Sessions Table

```json
{
  "tableName": "user-sessions",
  "keySchema": [{ "attributeName": "sessionId", "keyType": "HASH" }],
  "timeToLiveEnabled": true,
  "timeToLiveAttributeName": "expirationTime"
}
```

### Orders Table with Multiple Query Patterns

```json
{
  "tableName": "orders",
  "keySchema": [{ "attributeName": "orderId", "keyType": "HASH" }],
  "globalSecondaryIndexes": [
    {
      "indexName": "UserIndex",
      "keySchema": [
        { "attributeName": "userId", "keyType": "HASH" },
        { "attributeName": "orderDate", "keyType": "RANGE" }
      ]
    },
    {
      "indexName": "StatusIndex",
      "keySchema": [{ "attributeName": "orderStatus", "keyType": "HASH" }]
    }
  ]
}
```

---

## Best Practices

1. **Choose the right billing mode**

   - Unpredictable/spiky traffic → PAY_PER_REQUEST
   - Steady, predictable traffic → PROVISIONED (with Auto Scaling)

2. **Design efficient keys**

   - Use high-cardinality attributes for partition keys
   - Avoid "hot" partitions (uneven distribution)
   - Use sort keys for range queries

3. **Index strategically**

   - Only create indexes you'll actually query
   - Each GSI adds storage and write costs
   - Use projection wisely (KEYS_ONLY when possible)

4. **Enable protection**

   - Point-in-time recovery for critical tables
   - Deletion protection for production
   - Encryption at rest with KMS for compliance

5. **Use TTL for cleanup**

   - Automatically expire old data
   - Saves storage costs
   - No additional charges for TTL deletes

6. **Tag consistently**
   - Use tags for cost allocation
   - Organize by environment, team, application
   - Helps with governance and reporting

---

## Cost Considerations

**Factors affecting cost:**

- Billing mode (on-demand vs provisioned)
- Storage (first 25 GB/month free)
- Number of reads/writes
- Global secondary indexes (separate storage and throughput)
- Streams (if enabled)
- Backups (point-in-time recovery)
- Data transfer out

**Free Tier** (Always free):

- 25 GB of storage
- 25 provisioned write capacity units (WCU)
- 25 provisioned read capacity units (RCU)
- 25 GB of data transfer out
- 2.5 million stream read requests

**Cost Optimization:**

- Use on-demand for dev/test environments
- Use provisioned with Auto Scaling for production
- Project only needed attributes in indexes
- Use TTL to automatically delete old data
- Compress large items

---

## Performance Tips

1. **Partition key design**

   - Distribute traffic evenly
   - Avoid sequential keys (use UUIDs)

2. **Batch operations**

   - Use BatchGetItem and BatchWriteItem
   - Reduces API calls

3. **Query vs Scan**

   - Always use Query when possible
   - Scan is expensive (reads entire table)

4. **Consistent reads**

   - Use eventually consistent reads (cheaper) when possible
   - Use strongly consistent only when necessary

5. **Item size**
   - Keep items under 4 KB when possible
   - Larger items cost more in RCU/WCU
