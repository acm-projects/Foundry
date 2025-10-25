# RDS Configuration Example - Field Documentation

This document explains all fields in the RDS configuration template.

## Node Structure

```json
{
  "id": "rds-node-1",              // Unique identifier for this node
  "type": "RDS",                   // Must be "RDS"
  "position": { "x": 100, "y": 200 },
  "data": { ... }                  // RDS configuration (see below)
}
```

---

## Required Fields

### `dbInstanceIdentifier` (string)

- **Purpose**: Unique name for the RDS instance
- **Rules**:
  - 1-63 characters
  - Lowercase letters, numbers, and hyphens only
  - Must start with a letter
  - Cannot end with a hyphen or contain two consecutive hyphens
- **Example**: `"my-database-instance"`

### `engine` (string)

- **Purpose**: Database engine type
- **Valid values**:
  - `"postgres"` - PostgreSQL
  - `"mysql"` - MySQL
  - `"mariadb"` - MariaDB
  - `"oracle-ee"` - Oracle Enterprise Edition
  - `"oracle-se2"` - Oracle Standard Edition Two
  - `"sqlserver-ex"` - SQL Server Express
  - `"sqlserver-se"` - SQL Server Standard
  - `"sqlserver-ee"` - SQL Server Enterprise
  - `"aurora-postgresql"` - Aurora PostgreSQL
  - `"aurora-mysql"` - Aurora MySQL
- **Example**: `"postgres"`

### `dbInstanceClass` (string)

- **Purpose**: Compute and memory capacity
- **Format**: `db.{instance_class}.{size}`
- **Common values**:
  - `"db.t3.micro"` - 1 vCPU, 1 GB RAM (Free tier eligible)
  - `"db.t3.small"` - 2 vCPU, 2 GB RAM
  - `"db.t3.medium"` - 2 vCPU, 4 GB RAM
  - `"db.m5.large"` - 2 vCPU, 8 GB RAM
  - `"db.r5.large"` - 2 vCPU, 16 GB RAM (memory optimized)
- **Example**: `"db.t3.micro"`

### `masterUsername` (string)

- **Purpose**: Master/admin username for the database
- **Rules**:
  - 1-16 characters
  - Must start with a letter
  - Cannot be a reserved word (e.g., "admin", "root" for some engines)
- **Example**: `"admin"`

### `masterUserPassword` (string)

- **Purpose**: Master password for the database
- **Rules**:
  - 8-128 characters
  - Cannot contain `/`, `"`, `@`, or space
- **Security Note**: In production, use AWS Secrets Manager instead of hardcoding
- **Example**: `"MySecurePassword123!"`

---

## Optional Fields (with Defaults)

### `dbName` (string, optional)

- **Purpose**: Name of the initial database to create
- **Default**: No database created (engine dependent)
- **Rules**: Database name rules vary by engine
- **Example**: `"mydatabase"`

### `engineVersion` (string, optional)

- **Purpose**: Specific engine version
- **Default**: Latest version for the engine
- **Examples**:
  - PostgreSQL: `"15.3"`, `"14.7"`, `"13.10"`
  - MySQL: `"8.0.33"`, `"5.7.42"`
- **Example**: `"15.3"`

### `allocatedStorage` (integer)

- **Purpose**: Storage size in GB
- **Default**: `20`
- **Range**:
  - PostgreSQL/MySQL: 20-65536 GB
  - SQL Server: 20-16384 GB
- **Example**: `20`

### `storageType` (string)

- **Purpose**: Type of storage
- **Valid values**:
  - `"gp3"` - General Purpose SSD (latest, recommended)
  - `"gp2"` - General Purpose SSD (older)
  - `"io1"` - Provisioned IOPS SSD
  - `"standard"` - Magnetic (not recommended)
- **Default**: `"gp3"`
- **Example**: `"gp3"`

### `iops` (integer, optional)

- **Purpose**: Provisioned IOPS (only for io1 storage)
- **Default**: `null` (not used for gp3/gp2)
- **Range**: 1000-256000 (must be in 1000:1 ratio with storage)
- **Example**: `null` or `3000`

### `multiAZ` (boolean)

- **Purpose**: Enable Multi-AZ deployment for high availability
- **Default**: `false`
- **Impact**:
  - `true` - Creates standby replica in different AZ (higher cost, HA)
  - `false` - Single AZ (lower cost)
- **Example**: `false`

### `publiclyAccessible` (boolean)

- **Purpose**: Whether instance can be accessed from the internet
- **Default**: `false`
- **Security**: Keep `false` for production databases
- **Example**: `false`

### `backupRetentionPeriod` (integer)

- **Purpose**: Number of days to retain automated backups
- **Default**: `7`
- **Range**: 0-35 days
- **Note**: 0 disables automated backups
- **Example**: `7`

### `preferredBackupWindow` (string, optional)

- **Purpose**: Daily time range for automated backups (UTC)
- **Format**: `"HH:MM-HH:MM"` (must be at least 30 minutes)
- **Default**: AWS chooses automatically
- **Example**: `"03:00-04:00"` (3 AM - 4 AM UTC)

### `preferredMaintenanceWindow` (string, optional)

- **Purpose**: Weekly time range for system maintenance (UTC)
- **Format**: `"ddd:HH:MM-ddd:HH:MM"` (at least 30 minutes)
- **Default**: AWS chooses automatically
- **Example**: `"mon:04:00-mon:05:00"` (Monday 4-5 AM UTC)

### `enableCloudwatchLogsExports` (array of strings, optional)

- **Purpose**: Export specific log types to CloudWatch Logs
- **Valid values** (engine dependent):
  - PostgreSQL: `["postgresql"]`
  - MySQL: `["error", "general", "slowquery"]`
  - SQL Server: `["agent", "error"]`
- **Default**: `[]` (no logs exported)
- **Example**: `["postgresql"]`

### `storageEncrypted` (boolean)

- **Purpose**: Enable encryption at rest
- **Default**: `true` (recommended)
- **Note**: Cannot be changed after creation
- **Example**: `true`

### `deletionProtection` (boolean)

- **Purpose**: Prevent accidental deletion
- **Default**: `false`
- **Production**: Set to `true` for production databases
- **Example**: `false`

### `skipFinalSnapshot` (boolean)

- **Purpose**: Skip final snapshot when deleting instance
- **Default**: `true` (for testing)
- **Production**: Set to `false` to create final snapshot before deletion
- **Example**: `true`

### `finalDBSnapshotIdentifier` (string, optional)

- **Purpose**: Name for the final snapshot (if skipFinalSnapshot is false)
- **Required**: Only if `skipFinalSnapshot` is `false`
- **Example**: `"my-db-final-snapshot"` or `null`

---

## Field Dependencies

### Storage Configuration

- If `storageType` is `"io1"`, you **must** provide `iops`
- If `storageType` is `"gp3"` or `"gp2"`, `iops` is ignored

### Backup Configuration

- If `skipFinalSnapshot` is `false`, you **must** provide `finalDBSnapshotIdentifier`
- If `backupRetentionPeriod` is `0`, `preferredBackupWindow` is ignored

### Multi-AZ

- Multi-AZ is not available for all instance classes (e.g., db.t2.micro)
- Check AWS documentation for availability

---

## Minimal Configuration Example

```json
{
  "id": "rds-simple",
  "type": "RDS",
  "data": {
    "dbInstanceIdentifier": "my-db",
    "engine": "postgres",
    "dbInstanceClass": "db.t3.micro",
    "masterUsername": "admin",
    "masterUserPassword": "MyPassword123!"
  }
}
```

## Production Configuration Example

```json
{
  "id": "rds-production",
  "type": "RDS",
  "data": {
    "dbInstanceIdentifier": "prod-database",
    "dbName": "production",
    "engine": "postgres",
    "engineVersion": "15.3",
    "dbInstanceClass": "db.r5.large",
    "allocatedStorage": 100,
    "storageType": "gp3",
    "masterUsername": "admin",
    "masterUserPassword": "REPLACE_WITH_SECRETS_MANAGER",
    "multiAZ": true,
    "publiclyAccessible": false,
    "backupRetentionPeriod": 30,
    "storageEncrypted": true,
    "deletionProtection": true,
    "skipFinalSnapshot": false,
    "finalDBSnapshotIdentifier": "prod-db-final-snapshot",
    "enableCloudwatchLogsExports": ["postgresql"]
  }
}
```

---

## Security Best Practices

1. **Never hardcode passwords** - Use AWS Secrets Manager
2. **Always encrypt** - Set `storageEncrypted: true`
3. **Enable deletion protection** - Set `deletionProtection: true` for production
4. **Use private subnets** - Set `publiclyAccessible: false`
5. **Enable Multi-AZ** - For production high availability
6. **Backup retention** - Set to 30 days for production
7. **CloudWatch Logs** - Enable for monitoring and debugging

---

## Cost Considerations

**Factors affecting cost:**

- Instance class (larger = more expensive)
- Storage size and type (io1 > gp3 > gp2)
- Multi-AZ (doubles instance cost)
- Backup storage (beyond free tier)
- Data transfer

**Free Tier** (12 months):

- 750 hours/month of db.t2.micro or db.t3.micro
- 20 GB of General Purpose (SSD) storage
- 20 GB of backup storage

---

## Engine-Specific Notes

### PostgreSQL

- Default port: 5432
- Supports JSON/JSONB types
- Best for complex queries and data integrity

### MySQL

- Default port: 3306
- Popular for web applications
- Wide ecosystem support

### SQL Server

- Default port: 1433
- Windows-based applications
- License included in RDS cost

### Aurora

- MySQL or PostgreSQL compatible
- Better performance and scalability
- Higher cost but better for large workloads
