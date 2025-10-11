import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAppState } from "./hooks/useAppState";

// Component imports with new paths
import { ServiceSidebar } from "./components/ServiceSidebar";
import { ServiceCanvas } from "./components/canvas/ServiceCanvas";
import { ConfigurationSidebar } from "./components/dialogs/ConfigurationSidebar";
import { ServiceConfigDialog } from "./components/dialogs/ServiceConfigDialog";
import { SettingsDialog } from "./components/dialogs/SettingsDialog";
import { WorkflowCreationDialog } from "./components/dialogs/WorkflowCreationDialog";
import { WorkflowNamingDialog } from "./components/dialogs/WorkflowNamingDialog";
import { LandingPage } from "./components/pages/LandingPage";
import { WorkflowsPage } from "./components/pages/WorkflowsPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { CostMonitoringPage } from "./components/pages/CostMonitoringPage";
import { LoggingPage } from "./components/pages/LoggingPage";
import { TeamsPage } from "./components/pages/TeamsPage";
import { ChatbotPage } from "./components/pages/ChatbotPage";
import { Navbar } from "./components/Navbar";
import { Button } from "./components/ui/button";
import {
  Rocket,
  Code,
  Play,
  DollarSign,
  Home,
  Save,
  Activity,
  Settings,
} from "lucide-react";

export default function App() {
  const appState = useAppState();

  const {
    // State
    droppedServices,
    connections,
    selectedService,
    serviceConfigurations,
    currentPage,
    savedWorkflows,
    currentWorkflowId,
    workflowName,
    workflowDescription,
    isConnecting,
    connectionStart,
    showConfigPanel,
    nodeErrors,
    isSettingsDialogOpen,
    isWorkflowCreationDialogOpen,
    isWorkflowNamingDialogOpen,
    hasCreated,
    hasDeployedCode,
    animatingConnections,
    isCreationAnimating,
    createdConnections,
    // Functions
    addService,
    removeService,
    updateServicePosition,
    updateServiceConfig,
    addConnection,
    removeConnection,
    saveWorkflow,
    loadWorkflow,
    deleteWorkflow,
    resetCanvas,
    resetWorkflow,
    // Setters
    setSelectedService,
    setCurrentPage,
    setWorkflowName,
    setWorkflowDescription,
    setIsConnecting,
    setConnectionStart,
    setShowConfigPanel,
    setNodeErrors,
    setIsSettingsDialogOpen,
    setIsWorkflowCreationDialogOpen,
    setIsWorkflowNamingDialogOpen,
    setHasCreated,
    setHasDeployedCode,
    setAnimatingConnections,
    setIsCreationAnimating,
    setCreatedConnections,
  } = appState;

  // Helper functions
  const handleDrop = (service: any, position: { x: number; y: number }) => {
    addService(service, position);
    // Auto-open config panel for new services
    const existingCount = droppedServices.filter(
      (s) => s.id === service.id
    ).length;
    const newServiceId = `${service.id}-${Date.now()}-${existingCount}`;
    const newService = {
      id: service.id,
      name: `${service.name} ${existingCount + 1}`,
      type: service.type,
      position,
      instanceId: newServiceId,
    };
    setSelectedService(newService);
    setShowConfigPanel(true);
  };

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setShowConfigPanel(true);
  };

  const handleStartConnection = (serviceId: string) => {
    setIsConnecting(true);
    setConnectionStart(serviceId);
  };

  const handleCompleteConnection = (targetId: string) => {
    if (connectionStart && connectionStart !== targetId) {
      addConnection(connectionStart, targetId);
    }
    setIsConnecting(false);
    setConnectionStart(null);
  };

  const handleCancelConnection = () => {
    setIsConnecting(false);
    setConnectionStart(null);
  };

  const isServiceConfigured = (service: any) => {
    const config = serviceConfigurations[service.instanceId];
    if (!config) return false;

    switch (service.id) {
      case "s3":
        return !!config.bucketName?.trim();
      case "ec2":
        return !![
          config.amiId,
          config.keyPairName,
          config.securityGroupId,
          config.subnetVpc,
        ].every((f) => f?.trim());
      case "rds":
        return !![
          config.dbEngine,
          config.dbInstanceClass,
          config.allocatedStorage,
          config.masterUsername,
          config.masterPassword,
        ].every((f) => f?.trim());
      case "dynamodb":
        return !![config.tableName, config.partitionKey].every((f) =>
          f?.trim()
        );
      default:
        return true;
    }
  };

  const handleCreate = async () => {
    const unconfiguredServices = droppedServices.filter(
      (service) => !isServiceConfigured(service)
    );

    if (unconfiguredServices.length > 0) {
      const errorNodes = unconfiguredServices.map((s) => s.instanceId);
      setNodeErrors(errorNodes);
      return;
    }

    if (droppedServices.length === 0) return;

    setIsCreationAnimating(true);
    setAnimatingConnections(connections.map((c) => c.id));

    try {
      const response = await fetch("/api/create-cloudformation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: droppedServices,
          connections: connections,
          configurations: serviceConfigurations,
        }),
      });

      if (response.ok) {
        setHasCreated(true);
        setCreatedConnections(connections.map((c) => c.id));
        setNodeErrors([]);
      }
    } catch (error) {
      console.error("Creation failed:", error);
    } finally {
      setIsCreationAnimating(false);
      setAnimatingConnections([]);
    }
  };

  const handleDeploy = async () => {
    if (!hasCreated) return;

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: currentWorkflowId,
          services: droppedServices,
          configurations: serviceConfigurations,
        }),
      });

      if (response.ok) {
        setHasDeployedCode(true);
      }
    } catch (error) {
      console.error("Deployment failed:", error);
    }
  };

  // Page rendering
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;

      case "workflows":
        return (
          <WorkflowsPage
            workflows={savedWorkflows}
            onCreateNew={() => {
              resetWorkflow();
              setCurrentPage("dashboard");
            }}
            onOpenWorkflow={(workflowId) => {
              loadWorkflow(workflowId);
              setCurrentPage("dashboard");
            }}
            onDeleteWorkflow={deleteWorkflow}
            onBack={() => setCurrentPage("landing")}
          />
        );

      case "dashboard":
        return (
          <DashboardPage 
            onNavigate={setCurrentPage} 
            workflowName={workflowName}
          />
        );

      case "canvas":
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="flex h-full">
              <ServiceSidebar />
              <div className="flex-1 relative">
                <ServiceCanvas
                  services={droppedServices}
                  connections={connections}
                  onDrop={handleDrop}
                  onServiceClick={handleServiceClick}
                  onStartConnection={handleStartConnection}
                  onCompleteConnection={handleCompleteConnection}
                  onCancelConnection={handleCancelConnection}
                  isConnecting={isConnecting}
                  connectionStart={connectionStart}
                  animatingConnections={animatingConnections}
                  createdConnections={createdConnections}
                  nodeErrors={nodeErrors}
                  onUpdatePosition={updateServicePosition}
                />

                {/* Canvas Action Buttons */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    onClick={handleCreate}
                    disabled={
                      droppedServices.length === 0 || isCreationAnimating
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isCreationAnimating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Code className="h-4 w-4 mr-2" />
                        Create
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleDeploy}
                    disabled={!hasCreated}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Deploy
                  </Button>

                  <Button
                    onClick={saveWorkflow}
                    variant="outline"
                    disabled={droppedServices.length === 0}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>

                  <Button
                    onClick={() => setIsSettingsDialogOpen(true)}
                    variant="outline"
                    size="icon"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Configuration Sidebar */}
              {showConfigPanel && (
                <ConfigurationSidebar
                  service={selectedService}
                  onClose={() => {
                    setShowConfigPanel(false);
                    setSelectedService(null);
                  }}
                  onDelete={removeService}
                  onUpdate={updateServiceConfig}
                  configuration={
                    selectedService
                      ? serviceConfigurations[selectedService.instanceId]
                      : undefined
                  }
                />
              )}
            </div>
          </DndProvider>
        );

      case "cost-monitoring":
        return (
          <CostMonitoringPage
            onBackToHome={() => setCurrentPage("workflows")}
            services={droppedServices}
          />
        );

      case "logging":
        return (
          <LoggingPage onBackToCanvas={() => setCurrentPage("workflows")} />
        );

      case "education":
        return <TeamsPage onBackToHome={() => setCurrentPage("workflows")} />;

      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navigation Bar - Only show on non-landing pages */}
      {currentPage !== "landing" && (
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          workflowName={workflowName}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 ${
          currentPage === "landing" ? "overflow-auto" : "overflow-hidden"
        }`}
      >
        {renderCurrentPage()}
      </div>

      {/* Dialogs */}
      <SettingsDialog
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
        workflowName={workflowName}
        workflowId={currentWorkflowId}
        onDeleteWorkflow={deleteWorkflow}
      />

      <WorkflowCreationDialog
        isOpen={isWorkflowCreationDialogOpen}
        onClose={() => setIsWorkflowCreationDialogOpen(false)}
        onCreate={(name: string, description: string) => {
          resetWorkflow();
          setWorkflowName(name);
          setCurrentPage("canvas");
          setIsWorkflowCreationDialogOpen(false);
        }}
      />

      <WorkflowNamingDialog
        isOpen={isWorkflowNamingDialogOpen}
        onClose={() => setIsWorkflowNamingDialogOpen(false)}
        onSave={(name: string, description: string) => {
          setWorkflowName(name);
          setWorkflowDescription(description);
          saveWorkflow();
          setIsWorkflowNamingDialogOpen(false);
        }}
        initialName={workflowName}
        initialDescription={workflowDescription}
      />
    </div>
  );
}
