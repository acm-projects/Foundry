import React, { useState, useEffect } from "react";
import { X, Settings, Trash2, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  S3ConfigForm,
  EC2ConfigForm,
  RDSConfigForm,
  DynamoDBConfigForm,
  CommonConfigForm,
} from "../forms/ServiceConfigForms";
import { DroppedService, ServiceConfig, SidebarView } from "../../types";

interface ConfigurationSidebarProps {
  service: DroppedService | null;
  onClose: () => void;
  onDelete: (instanceId: string) => void;
  onUpdate?: (instanceId: string, config: ServiceConfig) => void;
  configuration?: ServiceConfig;
}

const getServiceFormComponent = (serviceId: string) => {
  switch (serviceId) {
    case "s3":
      return S3ConfigForm;
    case "ec2":
      return EC2ConfigForm;
    case "rds":
      return RDSConfigForm;
    case "dynamodb":
      return DynamoDBConfigForm;
    default:
      return null;
  }
};

const validateServiceConfig = (
  serviceId: string,
  config: ServiceConfig
): boolean => {
  switch (serviceId) {
    case "s3":
      return !!config.bucketName?.trim();
    case "ec2":
      return !![
        config.amiId,
        config.keyPairName,
        config.securityGroupId,
        config.subnetVpc,
      ].every((field) => field?.trim());
    case "rds":
      return !![
        config.dbEngine,
        config.dbInstanceClass,
        config.allocatedStorage,
        config.masterUsername,
        config.masterPassword,
      ].every((field) => field?.trim());
    case "dynamodb":
      return !![config.tableName, config.partitionKey].every((field) =>
        field?.trim()
      );
    default:
      return true;
  }
};

export const ConfigurationSidebar: React.FC<ConfigurationSidebarProps> = ({
  service,
  onClose,
  onDelete,
  onUpdate,
  configuration,
}) => {
  const [config, setConfig] = useState<ServiceConfig>({});
  const [currentView, setCurrentView] = useState<SidebarView>("config");
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  useEffect(() => {
    if (service && configuration) {
      setConfig(configuration);
    } else if (service) {
      setConfig({
        displayName: service.name,
        region: "us-east-1",
        environment: "development",
      });
    }
    setCurrentView("config");
    setHasValidationErrors(false);
  }, [service, configuration]);

  if (!service) return null;

  const handleDelete = () => {
    onDelete(service.instanceId);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedConfig = { ...config, [field]: value };
    setConfig(updatedConfig);
    setHasValidationErrors(false);

    if (onUpdate) {
      onUpdate(service.instanceId, updatedConfig);
    }
  };

  const handleSave = () => {
    const isValid = validateServiceConfig(service.id, config);

    if (!isValid) {
      setHasValidationErrors(true);
      return;
    }

    if (onUpdate) {
      onUpdate(service.instanceId, config);
    }
    onClose();
  };

  const ServiceForm = getServiceFormComponent(service.id);

  const renderConfigView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-background/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <h3 className="font-medium">{service.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {service.type}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Instance: {service.instanceId}
        </p>
      </div>

      {/* Validation Error */}
      {hasValidationErrors && (
        <div className="p-3 border-b">
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              Please fill in all required fields before saving.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Configuration Forms */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* General Settings */}
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
            General Settings
          </h4>
          <CommonConfigForm config={config} onChange={handleInputChange} />
        </div>

        {/* Service-Specific Settings */}
        {ServiceForm && (
          <>
            <Separator />
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                {service.type} Configuration
              </h4>
              <ServiceForm config={config} onChange={handleInputChange} />
            </div>
          </>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t p-4 bg-background/50">
        <div className="flex gap-2 mb-2">
          <Button size="sm" onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setCurrentView("delete")}
          className="w-full flex items-center gap-2"
        >
          <Trash2 className="h-3 w-3" />
          Delete Service
        </Button>
      </div>
    </div>
  );

  const renderDeleteView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-background/50">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("config")}
            className="p-1 h-6 w-6"
          >
            <ArrowLeft className="h-3 w-3" />
          </Button>
          <h3 className="font-medium text-destructive">Delete Service</h3>
        </div>
      </div>

      {/* Delete Confirmation */}
      <div className="flex-1 p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-2">
              Are you sure you want to delete this service?
            </p>
            <p className="text-sm mb-2">
              <strong>{service.name}</strong> ({service.instanceId})
            </p>
            <p className="text-sm">
              This action cannot be undone. All connections and configurations
              will be lost.
            </p>
          </AlertDescription>
        </Alert>
      </div>

      {/* Footer Actions */}
      <div className="border-t p-4 bg-background/50">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentView("config")}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-xl z-40">
      {currentView === "config" ? renderConfigView() : renderDeleteView()}
    </div>
  );
};
