import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Trash2, Settings, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import {
  S3ConfigForm,
  EC2ConfigForm,
  RDSConfigForm,
  DynamoDBConfigForm,
  CommonConfigForm,
} from "../forms/ServiceConfigForms";
import { DroppedService, ServiceConfig } from "../../types";

interface ServiceConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: DroppedService | null;
  onDelete: (instanceId: string) => void;
  onUpdate: (instanceId: string, config: ServiceConfig) => void;
  configuration?: ServiceConfig;
  isPanel?: boolean;
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
): string[] => {
  const errors: string[] = [];

  switch (serviceId) {
    case "s3":
      if (!config.bucketName?.trim()) errors.push("Bucket name is required");
      break;
    case "ec2":
      const ec2Required = [
        "amiId",
        "keyPairName",
        "securityGroupId",
        "subnetVpc",
      ];
      ec2Required.forEach((field) => {
        if (!config[field as keyof ServiceConfig]?.toString().trim()) {
          errors.push(
            `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`
          );
        }
      });
      break;
    case "rds":
      const rdsRequired = [
        "dbEngine",
        "dbInstanceClass",
        "allocatedStorage",
        "masterUsername",
        "masterPassword",
      ];
      rdsRequired.forEach((field) => {
        if (!config[field as keyof ServiceConfig]?.toString().trim()) {
          errors.push(
            `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`
          );
        }
      });
      break;
    case "dynamodb":
      if (!config.tableName?.trim()) errors.push("Table name is required");
      if (!config.partitionKey?.trim())
        errors.push("Partition key is required");
      break;
  }

  return errors;
};

export const ServiceConfigDialog: React.FC<ServiceConfigDialogProps> = ({
  isOpen,
  onClose,
  service,
  onDelete,
  onUpdate,
  configuration,
  isPanel = false,
}) => {
  const [config, setConfig] = useState<ServiceConfig>({
    displayName: service?.name || "",
    region: "us-east-1",
    environment: "development",
    description: "",
    ...configuration,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationError, setShowValidationError] = useState(false);

  useEffect(() => {
    if (service && configuration) {
      setConfig({ ...config, ...configuration });
    } else if (service) {
      setConfig({
        displayName: service.name,
        region: "us-east-1",
        environment: "development",
        description: "",
      });
    }
    setValidationErrors([]);
    setShowValidationError(false);
  }, [service, configuration]);

  if (!service) return null;

  const handleInputChange = (field: string, value: string) => {
    const updatedConfig = { ...config, [field]: value };
    setConfig(updatedConfig);
    setShowValidationError(false);
  };

  const handleSave = () => {
    const errors = validateServiceConfig(service.id, config);

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      return;
    }

    onUpdate(service.instanceId, config);
    onClose();
  };

  const handleDelete = () => {
    onDelete(service.instanceId);
    onClose();
  };

  const ServiceForm = getServiceFormComponent(service.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${
          isPanel ? "max-w-lg" : "max-w-2xl"
        } max-h-[85vh] overflow-hidden`}
      >
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure {service.name}
            <span className="text-xs text-muted-foreground font-normal">
              ({service.instanceId})
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {showValidationError && validationErrors.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="text-sm">
                  <p className="font-medium mb-1">Configuration errors:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {/* Common Configuration */}
            <div>
              <h3 className="text-sm font-medium mb-3">General Settings</h3>
              <CommonConfigForm
                config={config}
                onChange={handleInputChange}
                errors={validationErrors}
              />
            </div>

            {/* Service-Specific Configuration */}
            {ServiceForm && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-3">
                    Service Configuration
                  </h3>
                  <ServiceForm
                    config={config}
                    onChange={handleInputChange}
                    errors={validationErrors}
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <Separator className="my-4" />
          <div className="flex justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-3 w-3" />
              Delete Service
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
