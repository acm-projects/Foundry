import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, Settings } from 'lucide-react';
import { useState } from 'react';

interface ServiceConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    name: string;
    type: string;
    instanceId: string;
  } | null;
  onDelete: (instanceId: string) => void;
  onUpdate: (instanceId: string, config: any) => void;
  configuration?: any;
  isPanel?: boolean;
}

export function ServiceConfigDialog({ 
  isOpen, 
  onClose, 
  service, 
  onDelete, 
  onUpdate,
  configuration,
  isPanel = false
}: ServiceConfigDialogProps) {
  const [config, setConfig] = useState({
    displayName: service?.name || '',
    region: 'us-east-1',
    environment: 'development',
    description: '',
    // S3 specific fields
    bucketName: '',
    versioning: 'disabled',
    // EC2 specific fields
    amiId: '',
    instanceType: 't2.micro',
    keyPairName: '',
    securityGroupId: '',
    subnetVpc: '',
    // RDS specific fields
    dbEngine: '',
    dbInstanceClass: '',
    allocatedStorage: '',
    masterUsername: '',
    masterPassword: '',
    vpcSubnetGroup: '',
    // DynamoDB specific fields
    tableName: '',
    partitionKey: '',
    partitionKeyType: 'S',
    sortKey: '',
    sortKeyType: 'S',
    billingMode: 'PAY_PER_REQUEST',
    ...(configuration || {})
  });
  const [showValidationError, setShowValidationError] = useState(false);

  if (!service) return null;

  const handleSave = () => {
    // Validate required fields based on service type
    if (service.id === 's3' && !config.bucketName.trim()) {
      setShowValidationError(true);
      return; // Don't save if bucket name is empty for S3
    }
    
    if (service.id === 'ec2') {
      const requiredFields = [config.amiId, config.keyPairName, config.securityGroupId, config.subnetVpc];
      if (requiredFields.some(field => !field.trim())) {
        setShowValidationError(true);
        return; // Don't save if any required EC2 field is empty
      }
    }
    
    if (service.id === 'rds') {
      const requiredFields = [config.dbEngine, config.dbInstanceClass, config.allocatedStorage, config.masterUsername, config.masterPassword, config.vpcSubnetGroup];
      if (requiredFields.some(field => !field.trim())) {
        setShowValidationError(true);
        return; // Don't save if any required RDS field is empty
      }
    }
    
    if (service.id === 'dynamodb') {
      const requiredFields = [config.tableName, config.partitionKey];
      if (requiredFields.some(field => !field.trim())) {
        setShowValidationError(true);
        return; // Don't save if any required DynamoDB field is empty
      }
    }
    

    
    onUpdate(service.instanceId, config);
    handleClose();
  };

  const isFormValid = () => {
    if (service.id === 's3') {
      return config.bucketName.trim().length > 0;
    }
    if (service.id === 'ec2') {
      const requiredFields = [config.amiId, config.keyPairName, config.securityGroupId, config.subnetVpc];
      return requiredFields.every(field => field.trim().length > 0);
    }
    if (service.id === 'rds') {
      const requiredFields = [config.dbEngine, config.dbInstanceClass, config.allocatedStorage, config.masterUsername, config.masterPassword, config.vpcSubnetGroup];
      return requiredFields.every(field => field.trim().length > 0);
    }
    if (service.id === 'dynamodb') {
      const requiredFields = [config.tableName, config.partitionKey];
      return requiredFields.every(field => field.trim().length > 0);
    }

    return true;
  };

  const handleClose = () => {
    setShowValidationError(false);
    onClose();
  };

  const handleDelete = () => {
    onDelete(service.instanceId);
    handleClose();
  };

  const getServiceSpecificFields = () => {
    switch (service.id) {
      case 'rds':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="db-engine" className="flex items-center gap-1">
                DB Engine
                <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={config.dbEngine} 
                onValueChange={(value) => {
                  setConfig({ ...config, dbEngine: value });
                  if (showValidationError && value) {
                    setShowValidationError(false);
                  }
                }}
              >
                <SelectTrigger className={`${showValidationError && !config.dbEngine ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="oracle-se">Oracle SE</SelectItem>
                  <SelectItem value="sqlserver">SQL Server</SelectItem>
                  <SelectItem value="mariadb">MariaDB</SelectItem>
                  <SelectItem value="aurora">Aurora</SelectItem>
                </SelectContent>
              </Select>
              {showValidationError && !config.dbEngine && (
                <p className="text-destructive text-sm">DB Engine is required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-instance" className="flex items-center gap-1">
                DB Instance Class
                <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={config.dbInstanceClass} 
                onValueChange={(value) => {
                  setConfig({ ...config, dbInstanceClass: value });
                  if (showValidationError && value) {
                    setShowValidationError(false);
                  }
                }}
              >
                <SelectTrigger className={`${showValidationError && !config.dbInstanceClass ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select instance class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="db.t3.micro">db.t3.micro</SelectItem>
                  <SelectItem value="db.t3.small">db.t3.small</SelectItem>
                  <SelectItem value="db.t3.medium">db.t3.medium</SelectItem>
                  <SelectItem value="db.m5.large">db.m5.large</SelectItem>
                  <SelectItem value="db.m5.xlarge">db.m5.xlarge</SelectItem>
                  <SelectItem value="db.r5.large">db.r5.large</SelectItem>
                  <SelectItem value="db.r5.xlarge">db.r5.xlarge</SelectItem>
                </SelectContent>
              </Select>
              {showValidationError && !config.dbInstanceClass && (
                <p className="text-destructive text-sm">DB Instance Class is required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="allocated-storage" className="flex items-center gap-1">
                Allocated Storage (GB)
                <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="allocated-storage" 
                value={config.allocatedStorage}
                onChange={(e) => {
                  setConfig({ ...config, allocatedStorage: e.target.value });
                  if (showValidationError && e.target.value.trim()) {
                    setShowValidationError(false);
                  }
                }}
                placeholder="20" 
                type="number"
                min="20"
                required
                className={`${showValidationError && !config.allocatedStorage.trim() ? 'border-destructive' : ''}`}
              />
              {showValidationError && !config.allocatedStorage.trim() && (
                <p className="text-destructive text-sm">Allocated Storage is required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="master-username" className="flex items-center gap-1">
                Master Username
                <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="master-username" 
                value={config.masterUsername}
                onChange={(e) => {
                  setConfig({ ...config, masterUsername: e.target.value });
                  if (showValidationError && e.target.value.trim()) {
                    setShowValidationError(false);
                  }
                }}
                placeholder="admin" 
                required
                className={`${showValidationError && !config.masterUsername.trim() ? 'border-destructive' : ''}`}
              />
              {showValidationError && !config.masterUsername.trim() && (
                <p className="text-destructive text-sm">Master Username is required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="master-password" className="flex items-center gap-1">
                Master User Password
                <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="master-password" 
                type="password"
                value={config.masterPassword}
                onChange={(e) => {
                  setConfig({ ...config, masterPassword: e.target.value });
                  if (showValidationError && e.target.value.trim()) {
                    setShowValidationError(false);
                  }
                }}
                placeholder="Enter secure password" 
                required
                className={`${showValidationError && !config.masterPassword.trim() ? 'border-destructive' : ''}`}
              />
              {showValidationError && !config.masterPassword.trim() && (
                <p className="text-destructive text-sm">Master Password is required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vpc-subnet-group" className="flex items-center gap-1">
                VPC / Subnet Group
                <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="vpc-subnet-group" 
                value={config.vpcSubnetGroup}
                onChange={(e) => {
                  setConfig({ ...config, vpcSubnetGroup: e.target.value });
                  if (showValidationError && e.target.value.trim()) {
                    setShowValidationError(false);
                  }
                }}
                placeholder="subnet-group-name or vpc-12345678" 
                required
                className={`${showValidationError && !config.vpcSubnetGroup.trim() ? 'border-destructive' : ''}`}
              />
              {showValidationError && !config.vpcSubnetGroup.trim() && (
                <p className="text-destructive text-sm">VPC / Subnet Group is required</p>
              )}
            </div>
          </>
        );
      case 'dynamodb':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="table-name" className="flex items-center gap-1">
                Table Name
                <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="table-name" 
                value={config.tableName}
                onChange={(e) => {
                  setConfig({ ...config, tableName: e.target.value });
                  if (showValidationError && e.target.value.trim()) {
                    setShowValidationError(false);
                  }
                }}
                placeholder="my-dynamodb-table" 
                required
                className={`${showValidationError && !config.tableName.trim() ? 'border-destructive' : ''}`}
              />
              {showValidationError && !config.tableName.trim() && (
                <p className="text-destructive text-sm">Table Name is required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="partition-key" className="flex items-center gap-1">
                Partition Key (Primary Key)
                <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input 
                  id="partition-key" 
                  value={config.partitionKey}
                  onChange={(e) => {
                    setConfig({ ...config, partitionKey: e.target.value });
                    if (showValidationError && e.target.value.trim()) {
                      setShowValidationError(false);
                    }
                  }}
                  placeholder="id" 
                  className={`flex-1 ${showValidationError && !config.partitionKey.trim() ? 'border-destructive' : ''}`}
                  required
                />
                <Select 
                  value={config.partitionKeyType} 
                  onValueChange={(value) => setConfig({ ...config, partitionKeyType: value })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">String</SelectItem>
                    <SelectItem value="N">Number</SelectItem>
                    <SelectItem value="B">Binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showValidationError && !config.partitionKey.trim() && (
                <p className="text-destructive text-sm">Partition Key is required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort-key">Sort Key (Optional)</Label>
              <div className="flex gap-2">
                <Input 
                  id="sort-key" 
                  value={config.sortKey}
                  onChange={(e) => setConfig({ ...config, sortKey: e.target.value })}
                  placeholder="timestamp" 
                  className="flex-1"
                />
                <Select 
                  value={config.sortKeyType} 
                  onValueChange={(value) => setConfig({ ...config, sortKeyType: value })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">String</SelectItem>
                    <SelectItem value="N">Number</SelectItem>
                    <SelectItem value="B">Binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-mode">Billing Mode</Label>
              <Select 
                value={config.billingMode} 
                onValueChange={(value) => setConfig({ ...config, billingMode: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAY_PER_REQUEST">On-Demand (Pay per request)</SelectItem>
                  <SelectItem value="PROVISIONED">Provisioned (Fixed capacity)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (isPanel) {
    // Render as a panel (without Dialog wrapper)
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b">
          <Settings size={20} />
          <h2 className="text-lg font-semibold">Configure {service.name}</h2>
        </div>
        
        <div className="space-y-4 flex-1 overflow-y-auto">
          {service.id === 's3' ? (
            // S3 simplified configuration - only bucket name
            <div className="space-y-2">
              <Label htmlFor="bucket-name" className="flex items-center gap-1">
                Bucket Name
                <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="bucket-name" 
                value={config.bucketName}
                onChange={(e) => {
                  setConfig({ ...config, bucketName: e.target.value });
                  if (showValidationError && e.target.value.trim()) {
                    setShowValidationError(false);
                  }
                }}
                placeholder="my-s3-bucket" 
                required
                className={`${showValidationError && !config.bucketName.trim() ? 'border-destructive' : ''}`}
              />
              {showValidationError && !config.bucketName.trim() && (
                <p className="text-destructive text-sm">Bucket name is required</p>
              )}
            </div>
          ) : service.id === 'ec2' ? (
            // EC2 simplified configuration - only AWS-specific fields (all required)
            <>
              <div className="space-y-2">
                <Label htmlFor="ami-id" className="flex items-center gap-1">
                  AMI ID
                  <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="ami-id" 
                  value={config.amiId}
                  onChange={(e) => {
                    setConfig({ ...config, amiId: e.target.value });
                    if (showValidationError && e.target.value.trim()) {
                      setShowValidationError(false);
                    }
                  }}
                  placeholder="ami-12345678" 
                  required
                  className={`${showValidationError && !config.amiId.trim() ? 'border-destructive' : ''}`}
                />
                {showValidationError && !config.amiId.trim() && (
                  <p className="text-destructive text-sm">AMI ID is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="instance-type">Instance Type</Label>
                <Select 
                  value={config.instanceType} 
                  onValueChange={(value) => setConfig({ ...config, instanceType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="t2.micro">t2.micro</SelectItem>
                    <SelectItem value="t2.small">t2.small</SelectItem>
                    <SelectItem value="t2.medium">t2.medium</SelectItem>
                    <SelectItem value="t3.micro">t3.micro</SelectItem>
                    <SelectItem value="t3.small">t3.small</SelectItem>
                    <SelectItem value="t3.medium">t3.medium</SelectItem>
                    <SelectItem value="m5.large">m5.large</SelectItem>
                    <SelectItem value="m5.xlarge">m5.xlarge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="key-pair" className="flex items-center gap-1">
                  Key Pair Name
                  <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="key-pair" 
                  value={config.keyPairName}
                  onChange={(e) => {
                    setConfig({ ...config, keyPairName: e.target.value });
                    if (showValidationError && e.target.value.trim()) {
                      setShowValidationError(false);
                    }
                  }}
                  placeholder="my-key-pair" 
                  required
                  className={`${showValidationError && !config.keyPairName.trim() ? 'border-destructive' : ''}`}
                />
                {showValidationError && !config.keyPairName.trim() && (
                  <p className="text-destructive text-sm">Key Pair Name is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="security-group" className="flex items-center gap-1">
                  Security Group ID
                  <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="security-group" 
                  value={config.securityGroupId}
                  onChange={(e) => {
                    setConfig({ ...config, securityGroupId: e.target.value });
                    if (showValidationError && e.target.value.trim()) {
                      setShowValidationError(false);
                    }
                  }}
                  placeholder="sg-12345678" 
                  required
                  className={`${showValidationError && !config.securityGroupId.trim() ? 'border-destructive' : ''}`}
                />
                {showValidationError && !config.securityGroupId.trim() && (
                  <p className="text-destructive text-sm">Security Group ID is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subnet-vpc" className="flex items-center gap-1">
                  Subnet/VPC
                  <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="subnet-vpc" 
                  value={config.subnetVpc}
                  onChange={(e) => {
                    setConfig({ ...config, subnetVpc: e.target.value });
                    if (showValidationError && e.target.value.trim()) {
                      setShowValidationError(false);
                    }
                  }}
                  placeholder="subnet-12345678 / vpc-12345678" 
                  required
                  className={`${showValidationError && !config.subnetVpc.trim() ? 'border-destructive' : ''}`}
                />
                {showValidationError && !config.subnetVpc.trim() && (
                  <p className="text-destructive text-sm">Subnet/VPC is required</p>
                )}
              </div>
            </>
          ) : service.id === 'rds' ? (
            // RDS simplified configuration - only bare minimum CloudFormation fields
            <>
              {getServiceSpecificFields()}
            </>
          ) : service.id === 'dynamodb' ? (
            // DynamoDB simplified configuration - only essential fields
            <>
              {getServiceSpecificFields()}
            </>
          ) : (
            // Full configuration for other services
            <>
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={config.displayName}
                  onChange={(e) => setConfig({ ...config, displayName: e.target.value })}
                  placeholder="Enter display name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={config.region} onValueChange={(value) => setConfig({ ...config, region: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                    <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                    <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                    <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select value={config.environment} onValueChange={(value) => setConfig({ ...config, environment: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Service-specific fields */}
              {getServiceSpecificFields()}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  placeholder="Enter description (optional)"
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t mt-6">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isFormValid()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings size={20} />
            Configure {service.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {service.id === 's3' ? (
            // S3 simplified configuration - only bucket name
            <div className="space-y-2">
              <Label htmlFor="bucket-name" className="flex items-center gap-1">
                Bucket Name
                <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="bucket-name" 
                value={config.bucketName}
                onChange={(e) => {
                  setConfig({ ...config, bucketName: e.target.value });
                  if (showValidationError && e.target.value.trim()) {
                    setShowValidationError(false);
                  }
                }}
                placeholder="my-s3-bucket" 
                required
                className={`${showValidationError && !config.bucketName.trim() ? 'border-destructive' : ''}`}
              />
              {showValidationError && !config.bucketName.trim() && (
                <p className="text-destructive text-sm">Bucket name is required</p>
              )}
            </div>
          ) : service.id === 'ec2' ? (
            // EC2 simplified configuration - only AWS-specific fields (all required)
            <>
              <div className="space-y-2">
                <Label htmlFor="ami-id" className="flex items-center gap-1">
                  AMI ID
                  <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="ami-id" 
                  value={config.amiId}
                  onChange={(e) => {
                    setConfig({ ...config, amiId: e.target.value });
                    if (showValidationError && e.target.value.trim()) {
                      setShowValidationError(false);
                    }
                  }}
                  placeholder="ami-12345678" 
                  required
                  className={`${showValidationError && !config.amiId.trim() ? 'border-destructive' : ''}`}
                />
                {showValidationError && !config.amiId.trim() && (
                  <p className="text-destructive text-sm">AMI ID is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="instance-type">Instance Type</Label>
                <Select 
                  value={config.instanceType} 
                  onValueChange={(value) => setConfig({ ...config, instanceType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="t2.micro">t2.micro</SelectItem>
                    <SelectItem value="t2.small">t2.small</SelectItem>
                    <SelectItem value="t2.medium">t2.medium</SelectItem>
                    <SelectItem value="t3.micro">t3.micro</SelectItem>
                    <SelectItem value="t3.small">t3.small</SelectItem>
                    <SelectItem value="t3.medium">t3.medium</SelectItem>
                    <SelectItem value="m5.large">m5.large</SelectItem>
                    <SelectItem value="m5.xlarge">m5.xlarge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="key-pair" className="flex items-center gap-1">
                  Key Pair Name
                  <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="key-pair" 
                  value={config.keyPairName}
                  onChange={(e) => {
                    setConfig({ ...config, keyPairName: e.target.value });
                    if (showValidationError && e.target.value.trim()) {
                      setShowValidationError(false);
                    }
                  }}
                  placeholder="my-key-pair" 
                  required
                  className={`${showValidationError && !config.keyPairName.trim() ? 'border-destructive' : ''}`}
                />
                {showValidationError && !config.keyPairName.trim() && (
                  <p className="text-destructive text-sm">Key Pair Name is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="security-group" className="flex items-center gap-1">
                  Security Group ID
                  <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="security-group" 
                  value={config.securityGroupId}
                  onChange={(e) => {
                    setConfig({ ...config, securityGroupId: e.target.value });
                    if (showValidationError && e.target.value.trim()) {
                      setShowValidationError(false);
                    }
                  }}
                  placeholder="sg-12345678" 
                  required
                  className={`${showValidationError && !config.securityGroupId.trim() ? 'border-destructive' : ''}`}
                />
                {showValidationError && !config.securityGroupId.trim() && (
                  <p className="text-destructive text-sm">Security Group ID is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subnet-vpc" className="flex items-center gap-1">
                  Subnet/VPC
                  <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="subnet-vpc" 
                  value={config.subnetVpc}
                  onChange={(e) => {
                    setConfig({ ...config, subnetVpc: e.target.value });
                    if (showValidationError && e.target.value.trim()) {
                      setShowValidationError(false);
                    }
                  }}
                  placeholder="subnet-12345678 / vpc-12345678" 
                  required
                  className={`${showValidationError && !config.subnetVpc.trim() ? 'border-destructive' : ''}`}
                />
                {showValidationError && !config.subnetVpc.trim() && (
                  <p className="text-destructive text-sm">Subnet/VPC is required</p>
                )}
              </div>
            </>
          ) : service.id === 'rds' ? (
            // RDS simplified configuration - only bare minimum CloudFormation fields
            <>
              {getServiceSpecificFields()}
            </>
          ) : service.id === 'dynamodb' ? (
            // DynamoDB simplified configuration - only essential fields
            <>
              {getServiceSpecificFields()}
            </>
          ) : (
            // Full configuration for other services
            <>
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={config.displayName}
                  onChange={(e) => setConfig({ ...config, displayName: e.target.value })}
                  placeholder="Enter display name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={config.region} onValueChange={(value) => setConfig({ ...config, region: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                    <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                    <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                    <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select value={config.environment} onValueChange={(value) => setConfig({ ...config, environment: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Service-specific fields */}
              {getServiceSpecificFields()}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  placeholder="Enter description (optional)"
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isFormValid()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}