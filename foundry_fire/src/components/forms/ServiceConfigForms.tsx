import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { ServiceConfig } from "../../types";

interface BaseServiceFormProps {
  config: ServiceConfig;
  onChange: (field: string, value: string) => void;
  errors?: string[];
}

export const S3ConfigForm: React.FC<BaseServiceFormProps> = ({
  config,
  onChange,
  errors,
}) => (
  <div className="space-y-3">
    <div>
      <Label htmlFor="bucketName" className="text-xs font-medium">
        Bucket Name *
      </Label>
      <Input
        id="bucketName"
        placeholder="my-s3-bucket"
        value={config.bucketName || ""}
        onChange={(e) => onChange("bucketName", e.target.value)}
        className="h-8 text-xs"
      />
    </div>

    <div>
      <Label htmlFor="region" className="text-xs font-medium">
        Region
      </Label>
      <Select
        value={config.region || "us-east-1"}
        onValueChange={(value: string) => onChange("region", value)}
      >
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
      <Label htmlFor="versioning" className="text-xs font-medium">
        Versioning
      </Label>
      <Select
        value={config.versioning || "disabled"}
        onValueChange={(value: string) => onChange("versioning", value)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="enabled">Enabled</SelectItem>
          <SelectItem value="disabled">Disabled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export const EC2ConfigForm: React.FC<BaseServiceFormProps> = ({
  config,
  onChange,
}) => (
  <div className="space-y-3">
    <div>
      <Label htmlFor="instanceType" className="text-xs font-medium">
        Instance Type
      </Label>
      <Select
        value={config.instanceType || "t2.micro"}
        onValueChange={(value: string) => onChange("instanceType", value)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="t2.micro">t2.micro</SelectItem>
          <SelectItem value="t2.small">t2.small</SelectItem>
          <SelectItem value="t2.medium">t2.medium</SelectItem>
          <SelectItem value="m5.large">m5.large</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="amiId" className="text-xs font-medium">
        AMI ID *
      </Label>
      <Input
        id="amiId"
        placeholder="ami-12345678"
        value={config.amiId || ""}
        onChange={(e) => onChange("amiId", e.target.value)}
        className="h-8 text-xs"
      />
    </div>

    <div>
      <Label htmlFor="keyPairName" className="text-xs font-medium">
        Key Pair Name *
      </Label>
      <Input
        id="keyPairName"
        placeholder="my-key-pair"
        value={config.keyPairName || ""}
        onChange={(e) => onChange("keyPairName", e.target.value)}
        className="h-8 text-xs"
      />
    </div>

    <div>
      <Label htmlFor="securityGroupId" className="text-xs font-medium">
        Security Group ID *
      </Label>
      <Input
        id="securityGroupId"
        placeholder="sg-12345678"
        value={config.securityGroupId || ""}
        onChange={(e) => onChange("securityGroupId", e.target.value)}
        className="h-8 text-xs"
      />
    </div>

    <div>
      <Label htmlFor="subnetVpc" className="text-xs font-medium">
        Subnet VPC *
      </Label>
      <Input
        id="subnetVpc"
        placeholder="subnet-12345678"
        value={config.subnetVpc || ""}
        onChange={(e) => onChange("subnetVpc", e.target.value)}
        className="h-8 text-xs"
      />
    </div>
  </div>
);

export const RDSConfigForm: React.FC<BaseServiceFormProps> = ({
  config,
  onChange,
}) => (
  <div className="space-y-3">
    <div>
      <Label htmlFor="dbEngine" className="text-xs font-medium">
        Database Engine *
      </Label>
      <Select
        value={config.dbEngine || ""}
        onValueChange={(value: string) => onChange("dbEngine", value)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select engine" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mysql">MySQL</SelectItem>
          <SelectItem value="postgres">PostgreSQL</SelectItem>
          <SelectItem value="mariadb">MariaDB</SelectItem>
          <SelectItem value="oracle-ee">Oracle</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="dbInstanceClass" className="text-xs font-medium">
        Instance Class *
      </Label>
      <Select
        value={config.dbInstanceClass || ""}
        onValueChange={(value: string) => onChange("dbInstanceClass", value)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select class" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="db.t3.micro">db.t3.micro</SelectItem>
          <SelectItem value="db.t3.small">db.t3.small</SelectItem>
          <SelectItem value="db.t3.medium">db.t3.medium</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="allocatedStorage" className="text-xs font-medium">
        Storage (GB) *
      </Label>
      <Input
        id="allocatedStorage"
        placeholder="20"
        value={config.allocatedStorage || ""}
        onChange={(e) => onChange("allocatedStorage", e.target.value)}
        className="h-8 text-xs"
      />
    </div>

    <div>
      <Label htmlFor="masterUsername" className="text-xs font-medium">
        Master Username *
      </Label>
      <Input
        id="masterUsername"
        placeholder="admin"
        value={config.masterUsername || ""}
        onChange={(e) => onChange("masterUsername", e.target.value)}
        className="h-8 text-xs"
      />
    </div>

    <div>
      <Label htmlFor="masterPassword" className="text-xs font-medium">
        Master Password *
      </Label>
      <Input
        id="masterPassword"
        type="password"
        placeholder="Enter password"
        value={config.masterPassword || ""}
        onChange={(e) => onChange("masterPassword", e.target.value)}
        className="h-8 text-xs"
      />
    </div>
  </div>
);

export const DynamoDBConfigForm: React.FC<BaseServiceFormProps> = ({
  config,
  onChange,
}) => (
  <div className="space-y-3">
    <div>
      <Label htmlFor="tableName" className="text-xs font-medium">
        Table Name *
      </Label>
      <Input
        id="tableName"
        placeholder="my-table"
        value={config.tableName || ""}
        onChange={(e) => onChange("tableName", e.target.value)}
        className="h-8 text-xs"
      />
    </div>

    <div>
      <Label htmlFor="partitionKey" className="text-xs font-medium">
        Partition Key *
      </Label>
      <Input
        id="partitionKey"
        placeholder="id"
        value={config.partitionKey || ""}
        onChange={(e) => onChange("partitionKey", e.target.value)}
        className="h-8 text-xs"
      />
    </div>

    <div>
      <Label htmlFor="partitionKeyType" className="text-xs font-medium">
        Partition Key Type
      </Label>
      <Select
        value={config.partitionKeyType || "S"}
        onValueChange={(value: string) => onChange("partitionKeyType", value)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="S">String</SelectItem>
          <SelectItem value="N">Number</SelectItem>
          <SelectItem value="B">Binary</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="billingMode" className="text-xs font-medium">
        Billing Mode
      </Label>
      <Select
        value={config.billingMode || "PAY_PER_REQUEST"}
        onValueChange={(value: string) => onChange("billingMode", value)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PAY_PER_REQUEST">On-Demand</SelectItem>
          <SelectItem value="PROVISIONED">Provisioned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

// Common form fields for all services
export const CommonConfigForm: React.FC<BaseServiceFormProps> = ({
  config,
  onChange,
}) => (
  <div className="space-y-3">
    <div>
      <Label htmlFor="displayName" className="text-xs font-medium">
        Display Name
      </Label>
      <Input
        id="displayName"
        placeholder="Enter display name"
        value={config.displayName || ""}
        onChange={(e) => onChange("displayName", e.target.value)}
        className="h-8 text-xs"
      />
    </div>

    <div>
      <Label htmlFor="environment" className="text-xs font-medium">
        Environment
      </Label>
      <Select
        value={config.environment || "development"}
        onValueChange={(value: string) => onChange("environment", value)}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="development">Development</SelectItem>
          <SelectItem value="staging">Staging</SelectItem>
          <SelectItem value="production">Production</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="description" className="text-xs font-medium">
        Description
      </Label>
      <Textarea
        id="description"
        placeholder="Enter description"
        value={config.description || ""}
        onChange={(e) => onChange("description", e.target.value)}
        className="min-h-[60px] text-xs resize-none"
      />
    </div>
  </div>
);
