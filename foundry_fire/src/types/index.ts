export interface DroppedService {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  instanceId: string;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface SavedWorkflow {
  id: string;
  name: string;
  description: string;
  services: DroppedService[];
  connections: Connection[];
  configurations: Record<string, any>;
  status: 'draft' | 'deployed' | 'live';
  lastModified: string;
  createdAt: string;
  cost: number;
  hasCreated: boolean;
  hasDeployedCode: boolean;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar: string;
  lastActive: string;
}

export interface ServiceConfig {
  displayName?: string;
  region?: string;
  environment?: string;
  description?: string;
  // S3 specific
  bucketName?: string;
  versioning?: string;
  // EC2 specific
  amiId?: string;
  instanceType?: string;
  keyPairName?: string;
  securityGroupId?: string;
  subnetVpc?: string;
  // RDS specific
  dbEngine?: string;
  dbInstanceClass?: string;
  allocatedStorage?: string;
  masterUsername?: string;
  masterPassword?: string;
  vpcSubnetGroup?: string;
  // DynamoDB specific
  tableName?: string;
  partitionKey?: string;
  partitionKeyType?: 'S' | 'N' | 'B';
  sortKey?: string;
  sortKeyType?: 'S' | 'N' | 'B';
  billingMode?: string;
}

export type PageType = 'landing' | 'workflows' | 'canvas' | 'cost-monitoring' | 'logging' | 'education';

export type SidebarView = 'config' | 'delete';