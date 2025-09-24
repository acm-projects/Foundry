import { X, Settings, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState, useEffect } from 'react';

interface DroppedService {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  instanceId: string;
}

interface ConfigurationSidebarProps {
  service: DroppedService | null;
  onClose: () => void;
  onDelete: (instanceId: string) => void;
  onUpdate?: (instanceId: string, config: any) => void;
  configuration?: any;
}

type SidebarView = 'config' | 'delete';

export function ConfigurationSidebar({ service, onClose, onDelete, onUpdate, configuration }: ConfigurationSidebarProps) {
  const [config, setConfig] = useState<any>({});
  const [currentView, setCurrentView] = useState<SidebarView>('config');

  useEffect(() => {
    if (service && configuration) {
      setConfig(configuration);
    } else if (service) {
      // Initialize with empty config based on service type
      setConfig({});
    }
    // Reset to config view when service changes
    setCurrentView('config');
  }, [service, configuration]);

  if (!service) return null;

  const handleDelete = () => {
    onDelete(service.instanceId);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedConfig = { ...config, [field]: value };
    setConfig(updatedConfig);
    if (onUpdate) {
      onUpdate(service.instanceId, updatedConfig);
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(service.instanceId, config);
    }
    onClose();
  };

  const renderServiceInputs = () => {
    switch (service.id) {
      case 's3':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="bucketName" className="text-xs font-medium">Bucket Name *</Label>
              <Input
                id="bucketName"
                placeholder="my-s3-bucket"
                value={config.bucketName || ''}
                onChange={(e) => handleInputChange('bucketName', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="region" className="text-xs font-medium">Region</Label>
              <Select value={config.region || ''} onValueChange={(value) => handleInputChange('region', value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east-1">us-east-1</SelectItem>
                  <SelectItem value="us-west-2">us-west-2</SelectItem>
                  <SelectItem value="eu-west-1">eu-west-1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="displayName" className="text-xs font-medium">Display Name</Label>
              <Input
                id="displayName"
                placeholder="My S3 Bucket"
                value={config.displayName || ''}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        );

      case 'ec2':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="amiId" className="text-xs font-medium">AMI ID *</Label>
              <Input
                id="amiId"
                placeholder="ami-0123456789abcdef0"
                value={config.amiId || ''}
                onChange={(e) => handleInputChange('amiId', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="instanceType" className="text-xs font-medium">Instance Type</Label>
              <Select value={config.instanceType || ''} onValueChange={(value) => handleInputChange('instanceType', value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select instance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="t3.micro">t3.micro</SelectItem>
                  <SelectItem value="t3.small">t3.small</SelectItem>
                  <SelectItem value="t3.medium">t3.medium</SelectItem>
                  <SelectItem value="m5.large">m5.large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="keyPairName" className="text-xs font-medium">Key Pair Name *</Label>
              <Input
                id="keyPairName"
                placeholder="my-key-pair"
                value={config.keyPairName || ''}
                onChange={(e) => handleInputChange('keyPairName', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="securityGroupId" className="text-xs font-medium">Security Group ID *</Label>
              <Input
                id="securityGroupId"
                placeholder="sg-0123456789abcdef0"
                value={config.securityGroupId || ''}
                onChange={(e) => handleInputChange('securityGroupId', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="subnetVpc" className="text-xs font-medium">Subnet/VPC *</Label>
              <Input
                id="subnetVpc"
                placeholder="subnet-0123456789abcdef0"
                value={config.subnetVpc || ''}
                onChange={(e) => handleInputChange('subnetVpc', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        );

      case 'rds':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="dbEngine" className="text-xs font-medium">DB Engine *</Label>
              <Select value={config.dbEngine || ''} onValueChange={(value) => handleInputChange('dbEngine', value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select DB engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="mariadb">MariaDB</SelectItem>
                  <SelectItem value="oracle">Oracle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dbInstanceClass" className="text-xs font-medium">DB Instance Class *</Label>
              <Select value={config.dbInstanceClass || ''} onValueChange={(value) => handleInputChange('dbInstanceClass', value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select instance class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="db.t3.micro">db.t3.micro</SelectItem>
                  <SelectItem value="db.t3.small">db.t3.small</SelectItem>
                  <SelectItem value="db.m5.large">db.m5.large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="allocatedStorage" className="text-xs font-medium">Storage (GB) *</Label>
              <Input
                id="allocatedStorage"
                placeholder="20"
                type="number"
                value={config.allocatedStorage || ''}
                onChange={(e) => handleInputChange('allocatedStorage', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="masterUsername" className="text-xs font-medium">Master Username *</Label>
              <Input
                id="masterUsername"
                placeholder="admin"
                value={config.masterUsername || ''}
                onChange={(e) => handleInputChange('masterUsername', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="masterPassword" className="text-xs font-medium">Master Password *</Label>
              <Input
                id="masterPassword"
                type="password"
                placeholder="••••••••"
                value={config.masterPassword || ''}
                onChange={(e) => handleInputChange('masterPassword', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="vpcSubnetGroup" className="text-xs font-medium">VPC Subnet Group *</Label>
              <Input
                id="vpcSubnetGroup"
                placeholder="default-subnet-group"
                value={config.vpcSubnetGroup || ''}
                onChange={(e) => handleInputChange('vpcSubnetGroup', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        );

      case 'dynamodb':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="tableName" className="text-xs font-medium">Table Name *</Label>
              <Input
                id="tableName"
                placeholder="my-dynamodb-table"
                value={config.tableName || ''}
                onChange={(e) => handleInputChange('tableName', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="partitionKey" className="text-xs font-medium">Partition Key *</Label>
              <Input
                id="partitionKey"
                placeholder="id"
                value={config.partitionKey || ''}
                onChange={(e) => handleInputChange('partitionKey', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="sortKey" className="text-xs font-medium">Sort Key (Optional)</Label>
              <Input
                id="sortKey"
                placeholder="timestamp"
                value={config.sortKey || ''}
                onChange={(e) => handleInputChange('sortKey', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="billingMode" className="text-xs font-medium">Billing Mode</Label>
              <Select value={config.billingMode || 'PAY_PER_REQUEST'} onValueChange={(value) => handleInputChange('billingMode', value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAY_PER_REQUEST">Pay per request</SelectItem>
                  <SelectItem value="PROVISIONED">Provisioned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-xs text-gray-500 py-4">
            No configuration available for this service type.
          </div>
        );
    }
  };

  const renderConfigurationView = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">{service.name}</h2>
            <p className="text-xs text-gray-500 capitalize">{service.type}</p>
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="hover:bg-gray-100 h-7 w-7 p-0"
        >
          <X size={14} />
        </Button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-4">
          {/* Service Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="font-medium text-xs mb-2 text-gray-700">Service Configuration</h3>
            <div className="text-xs text-gray-600 mb-3">
              Configure your {service.name} instance with the required parameters.
            </div>
          </div>

          {/* Configuration Form */}
          <div className="space-y-3">
            <div className="border-b border-gray-200 pb-2">
              <h4 className="text-xs font-medium text-gray-700">Required Fields</h4>
              <p className="text-xs text-gray-500">Fields marked with * are required</p>
            </div>
            {renderServiceInputs()}
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 text-xs mb-1">Instance Details</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>ID: {service.instanceId.slice(-8)}</div>
              <div>Position: ({service.position.x}, {service.position.y})</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-3 flex-shrink-0">
        <div className="flex justify-between gap-2">
          <Button
            onClick={() => setCurrentView('delete')}
            variant="destructive"
            size="sm"
            className="flex items-center gap-1 h-7 text-xs"
          >
            <Trash2 size={12} />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} size="sm" className="h-7 text-xs">
              Close
            </Button>
            <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 h-7 text-xs" size="sm">
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  const renderDeleteView = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCurrentView('config')}
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 h-7 w-7 p-0"
          >
            <ArrowLeft size={14} />
          </Button>
          <div className="w-7 h-7 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Delete Service</h2>
            <p className="text-xs text-gray-500">Confirm deletion</p>
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="hover:bg-gray-100 h-7 w-7 p-0"
        >
          <X size={14} />
        </Button>
      </div>

      {/* Delete Confirmation Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-4">
          {/* Warning Section */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-red-900 text-sm">Warning: Permanent Deletion</h3>
                <p className="text-xs text-red-700 mt-1">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="text-xs text-red-800 space-y-2">
              <p>You are about to permanently delete:</p>
              <div className="bg-red-100 rounded p-2 ml-4">
                <div className="font-medium">{service.name}</div>
                <div className="text-red-600 capitalize">{service.type} • ID: {service.instanceId.slice(-8)}</div>
              </div>
            </div>
          </div>

          {/* Impact Information */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h4 className="font-medium text-orange-900 text-xs mb-2">What will happen:</h4>
            <ul className="text-xs text-orange-800 space-y-1">
              <li>• Service configuration will be lost</li>
              <li>• All connections to this service will be removed</li>
              <li>• Any dependent services may be affected</li>
              <li>• This action will trigger a workflow update</li>
            </ul>
          </div>

          {/* Service Details */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 text-xs mb-2">Service Details</h4>
            <div className="text-xs text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium capitalize">{service.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Instance ID:</span>
                <span className="font-mono">{service.instanceId.slice(-12)}</span>
              </div>
              <div className="flex justify-between">
                <span>Position:</span>
                <span>({service.position.x}, {service.position.y})</span>
              </div>
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="bg-gray-100 border-l-4 border-gray-400 p-3">
            <p className="text-xs text-gray-700">
              Please review the information above carefully. Once deleted, you'll need to recreate this service and reconfigure it manually.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-3 flex-shrink-0">
        <div className="flex justify-between gap-2">
          <Button
            onClick={() => setCurrentView('config')}
            variant="outline"
            size="sm"
            className="h-7 text-xs"
          >
            <ArrowLeft size={12} className="mr-1" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} size="sm" className="h-7 text-xs">
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="destructive" 
              size="sm" 
              className="h-7 text-xs bg-red-600 hover:bg-red-700"
            >
              <Trash2 size={12} className="mr-1" />
              Delete Permanently
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-[336px] h-[79vh] bg-white border border-gray-200 shadow-2xl rounded-xl flex flex-col overflow-hidden">
      {currentView === 'config' ? renderConfigurationView() : renderDeleteView()}
    </div>
  );
}