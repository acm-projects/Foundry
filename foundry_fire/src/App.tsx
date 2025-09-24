import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ServiceSidebar } from './components/ServiceSidebar';
import { ServiceCanvas } from './components/ServiceCanvas';
import { ConfigurationSidebar } from './components/ConfigurationSidebar';
import { SettingsDialog } from './components/SettingsDialog';
import { WorkflowCreationDialog } from './components/WorkflowCreationDialog';
import { WorkflowNamingDialog } from './components/WorkflowNamingDialog';
import { CostMonitoringPage } from './components/CostMonitoringPage';
import { TeamsPage } from './components/TeamsPage';
import { WorkflowsPage } from './components/WorkflowsPage';
import { LoggingPage } from './components/LoggingPage';
import { ChatbotPage } from './components/ChatbotPage';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { Button } from './components/ui/button';
import { Rocket, Code, Play, DollarSign, Home, Save, Activity, Settings } from 'lucide-react';

interface DroppedService {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  instanceId: string;
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
}

interface SavedWorkflow {
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

export default function App() {
  const [droppedServices, setDroppedServices] = useState<DroppedService[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedService, setSelectedService] = useState<DroppedService | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [serviceConfigurations, setServiceConfigurations] = useState<Record<string, any>>({});
  const [hasCreated, setHasCreated] = useState(false);
  const [hasDeployedCode, setHasDeployedCode] = useState(false);
  const [currentPage, setCurrentPage] = useState<'landing' | 'workflows' | 'canvas' | 'cost-monitoring' | 'logging' | 'education'>('landing');
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [animatingConnections, setAnimatingConnections] = useState<string[]>([]);
  const [isCreationAnimating, setIsCreationAnimating] = useState(false);
  const [createdConnections, setCreatedConnections] = useState<string[]>([]);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [nodeErrors, setNodeErrors] = useState<string[]>([]); // Track nodes with validation errors
  const [isWorkflowCreationDialogOpen, setIsWorkflowCreationDialogOpen] = useState(false);
  const [isWorkflowNamingDialogOpen, setIsWorkflowNamingDialogOpen] = useState(false);
  const [previousPage, setPreviousPage] = useState<'workflows' | 'canvas'>('workflows'); // Track where user came from

  const handleDrop = (service: any, position: { x: number; y: number }) => {
    // Count existing services of the same type to create incremental naming
    const existingServicesOfType = droppedServices.filter(s => s.id === service.id);
    const serviceCount = existingServicesOfType.length + 1;
    
    const newService: DroppedService = {
      ...service,
      name: `${service.name} ${serviceCount}`, // Add incremental number
      position,
      instanceId: `${service.id}-${Date.now()}`, // Unique instance ID
    };
    
    setDroppedServices(prev => {
      const updatedServices = [...prev, newService];
      
      // Auto-connect to the most recent service if there are existing services
      if (prev.length > 0) {
        const lastService = prev[prev.length - 1];
        const newConnection: Connection = {
          id: `${lastService.instanceId}-${newService.instanceId}-${Date.now()}`,
          sourceId: lastService.instanceId,
          targetId: newService.instanceId,
        };
        
        setConnections(prevConnections => [...prevConnections, newConnection]);
      }
      
      return updatedServices;
    });

    // Automatically open configuration panel for the newly dropped service
    setSelectedService(newService);
    setShowConfigPanel(true);
  };

  const handleServiceClick = (service: DroppedService) => {
    // Open configuration sidebar when node is clicked
    setSelectedService(service);
    setShowConfigPanel(true);
  };

  const handleDelete = (instanceId: string) => {
    setDroppedServices(prev => prev.filter(s => s.instanceId !== instanceId));
    // Also remove any connections involving this service
    setConnections(prev => prev.filter(c => c.sourceId !== instanceId && c.targetId !== instanceId));
    // Remove the configuration for this service
    setServiceConfigurations(prev => {
      const newConfigs = { ...prev };
      delete newConfigs[instanceId];
      return newConfigs;
    });
    // Clear created connections when deleting services
    setCreatedConnections([]);
  };

  const handleStartConnection = (serviceId: string) => {
    setIsConnecting(true);
    setConnectionStart(serviceId);
  };

  const handleCompleteConnection = (targetId: string) => {
    if (connectionStart && connectionStart !== targetId) {
      const newConnection: Connection = {
        id: `${connectionStart}-${targetId}-${Date.now()}`,
        sourceId: connectionStart,
        targetId: targetId,
      };
      setConnections(prev => [...prev, newConnection]);
    }
    setIsConnecting(false);
    setConnectionStart(null);
  };

  const handleCancelConnection = () => {
    setIsConnecting(false);
    setConnectionStart(null);
  };

  const handleUpdate = (instanceId: string, config: any) => {
    // Store the configuration
    setServiceConfigurations(prev => ({
      ...prev,
      [instanceId]: config
    }));
    
    // Clear any errors for this node when it's updated
    setNodeErrors(prev => prev.filter(id => id !== instanceId));
    
    setDroppedServices(prev => 
      prev.map(s => {
        if (s.instanceId === instanceId) {
          // For S3, use bucket name if display name is empty
          let displayName = config.displayName;
          if (s.id === 's3' && !displayName && config.bucketName) {
            displayName = config.bucketName;
          }
          // For DynamoDB, use table name if display name is empty
          if (s.id === 'dynamodb' && !displayName && config.tableName) {
            displayName = config.tableName;
          }

          return { ...s, name: displayName || s.name };
        }
        return s;
      })
    );
  };

  const isServiceConfigured = (service: DroppedService) => {
    const config = serviceConfigurations[service.instanceId];
    if (!config) return false;

    // Check required fields based on service type
    switch (service.id) {
      case 's3':
        return config.bucketName && config.bucketName.trim().length > 0;
      case 'ec2':
        return config.amiId && config.amiId.trim().length > 0 &&
               config.keyPairName && config.keyPairName.trim().length > 0 &&
               config.securityGroupId && config.securityGroupId.trim().length > 0 &&
               config.subnetVpc && config.subnetVpc.trim().length > 0;
      case 'rds':
        return config.dbEngine && config.dbEngine.trim().length > 0 &&
               config.dbInstanceClass && config.dbInstanceClass.trim().length > 0 &&
               config.allocatedStorage && config.allocatedStorage.trim().length > 0 &&
               config.masterUsername && config.masterUsername.trim().length > 0 &&
               config.masterPassword && config.masterPassword.trim().length > 0 &&
               config.vpcSubnetGroup && config.vpcSubnetGroup.trim().length > 0;
      case 'dynamodb':
        return config.tableName && config.tableName.trim().length > 0 &&
               config.partitionKey && config.partitionKey.trim().length > 0;

      default:
        return true;
    }
  };

  const allServicesConfigured = droppedServices.length > 0 && droppedServices.every(isServiceConfigured);
  
  const hasEC2Instance = droppedServices.some(service => service.id === 'ec2');
  
  // Determine if workflow is "live" (has EC2, is created, and code is deployed)
  const isWorkflowLive = hasEC2Instance && hasCreated && hasDeployedCode;

  const handleCreate = () => {
    // Validate all services and identify any with missing required fields
    const invalidServices = droppedServices.filter(service => !isServiceConfigured(service));
    
    if (invalidServices.length > 0) {
      // Mark invalid services with error state
      setNodeErrors(invalidServices.map(service => service.instanceId));
      console.log('Cannot create: Some services are not properly configured:', invalidServices);
      
      // Clear errors after 5 seconds
      setTimeout(() => {
        setNodeErrors([]);
      }, 5000);
      
      return; // Don't proceed with creation
    }
    
    // Clear any existing errors
    setNodeErrors([]);
    
    // Here you would implement the actual creation logic (CloudFormation template generation)
    console.log('Creating infrastructure:', droppedServices);
    console.log('Service configurations:', serviceConfigurations);
    console.log('Connections:', connections);
    
    // Start the creation animation
    setIsCreationAnimating(true);
    setAnimatingConnections([]);
    
    // If there are connections, animate them sequentially
    if (connections.length > 0) {
      // Sort connections based on the service order (first to last)
      const sortedConnections = [...connections].sort((a, b) => {
        const sourceIndexA = droppedServices.findIndex(s => s.instanceId === a.sourceId);
        const sourceIndexB = droppedServices.findIndex(s => s.instanceId === b.sourceId);
        return sourceIndexA - sourceIndexB;
      });
      
      // Animate each connection with a delay
      sortedConnections.forEach((connection, index) => {
        setTimeout(() => {
          setAnimatingConnections(prev => [...prev, connection.id]);
          
          // If this is the last connection, end the animation after a short delay
          if (index === sortedConnections.length - 1) {
            setTimeout(() => {
              setIsCreationAnimating(false);
              setAnimatingConnections([]);
              // Mark all connections as created (they'll stay orange)
              setCreatedConnections(sortedConnections.map(c => c.id));
            }, 2000); // Increased from 1000ms to 2000ms
          }
        }, index * 1500); // Increased from 800ms to 1500ms delay between each connection animation
      });
    } else {
      // If no connections, just end the animation quickly
      setTimeout(() => {
        setIsCreationAnimating(false);
      }, 1000);
    }
    
    setHasCreated(true);
  };

  const handleDeployCode = () => {
    // Here you would implement the code deployment logic
    console.log('Deploying code to EC2 instances...');
    
    setHasDeployedCode(true);
  };

  const handleGoLive = () => {
    // Here you would implement the go live logic
    console.log('Making application live...');
  };

  const handleCostMonitoring = () => {
    // Track where user came from before going to cost monitoring
    if (currentPage === 'canvas') {
      setPreviousPage('canvas');
    } else {
      setPreviousPage('workflows');
    }
    setCurrentPage('cost-monitoring');
  };

  const handleBackToHome = () => {
    // Return to the page the user came from
    setCurrentPage(previousPage);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as 'landing' | 'workflows' | 'canvas' | 'cost-monitoring' | 'logging' | 'education');
  };

  const handleGetStarted = () => {
    setCurrentPage('workflows');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleLogging = () => {
    setCurrentPage('logging');
  };

  const handleBackToCanvas = () => {
    setCurrentPage('canvas');
  };

  const handleSettings = () => {
    if (!currentWorkflowId || !workflowName) {
      return;
    }
    setIsSettingsDialogOpen(true);
  };

  const handleDeleteWorkflow = () => {
    if (!currentWorkflowId) return;

    // Remove the workflow from saved workflows
    setSavedWorkflows(prev => prev.filter(w => w.id !== currentWorkflowId));
    
    // Clear current workflow state
    setDroppedServices([]);
    setConnections([]);
    setServiceConfigurations({});
    setHasCreated(false);
    setHasDeployedCode(false);
    setCurrentWorkflowId(null);
    setWorkflowName('');
    setWorkflowDescription('');
    setCreatedConnections([]);
    
    // Navigate back to workflows page
    setCurrentPage('workflows');
  };

  const handleLogout = () => {
    // Here you would implement the actual logout logic
    console.log('Logging out...');
    
    // Reset all state
    setDroppedServices([]);
    setConnections([]);
    setServiceConfigurations({});
    setHasCreated(false);
    setHasDeployedCode(false);
    setCurrentPage('workflows');
    setCreatedConnections([]);
  };

  const handleNewWorkflow = () => {
    // Clear current workflow and start fresh, go directly to canvas
    setDroppedServices([]);
    setConnections([]);
    setServiceConfigurations({});
    setHasCreated(false);
    setHasDeployedCode(false);
    setCurrentWorkflowId(null);
    setWorkflowName('');
    setWorkflowDescription('');
    setCreatedConnections([]);
    setCurrentPage('canvas');
  };

  const handleCreateWorkflowFromDialog = (name: string, description: string) => {
    // Clear current workflow and start fresh
    setDroppedServices([]);
    setConnections([]);
    setServiceConfigurations({});
    setHasCreated(false);
    setHasDeployedCode(false);
    setCurrentWorkflowId(null);
    setWorkflowName(name);
    setWorkflowDescription(description);
    setCreatedConnections([]);
    setCurrentPage('canvas');
  };

  const handleSaveWorkflow = (name?: string, description?: string) => {
    if (droppedServices.length === 0) {
      return;
    }

    const finalName = name || workflowName || 'Untitled Workflow';
    const finalDescription = description || workflowDescription || '';

    // Calculate status based on current state
    let status: 'draft' | 'deployed' | 'live' = 'draft';
    if (hasDeployedCode && hasCreated) {
      status = 'live';
    } else if (hasCreated) {
      status = 'deployed';
    }

    // Calculate estimated cost (simple mock calculation)
    const cost = droppedServices.reduce((total, service) => {
      switch (service.id) {
        case 'ec2': return total + 50;
        case 's3': return total + 10;
        case 'rds': return total + 75;
        case 'dynamodb': return total + 25;
        default: return total + 15;
      }
    }, 0);

    const workflowData: SavedWorkflow = {
      id: currentWorkflowId || `workflow-${Date.now()}`,
      name: finalName,
      description: finalDescription,
      services: droppedServices,
      connections: connections,
      configurations: serviceConfigurations,
      status,
      lastModified: new Date().toLocaleString(),
      createdAt: currentWorkflowId ? 
        savedWorkflows.find(w => w.id === currentWorkflowId)?.createdAt || new Date().toLocaleString() : 
        new Date().toLocaleString(),
      cost,
      hasCreated,
      hasDeployedCode,
    };

    setSavedWorkflows(prev => {
      if (currentWorkflowId) {
        // Update existing workflow
        return prev.map(w => w.id === currentWorkflowId ? workflowData : w);
      } else {
        // Create new workflow
        return [...prev, workflowData];
      }
    });

    setCurrentWorkflowId(workflowData.id);
    setWorkflowName(finalName);
    setWorkflowDescription(finalDescription);
  };

  const handleOpenWorkflow = (workflowId: string) => {
    const workflow = savedWorkflows.find(w => w.id === workflowId);
    
    if (workflow) {
      // Load the workflow data
      setDroppedServices(workflow.services);
      setConnections(workflow.connections);
      setServiceConfigurations(workflow.configurations);
      setHasCreated(workflow.hasCreated);
      setHasDeployedCode(workflow.hasDeployedCode);
      setCurrentWorkflowId(workflow.id);
      setWorkflowName(workflow.name);
      setWorkflowDescription(workflow.description);
      
      // If the workflow has been created, mark all connections as created (orange)
      if (workflow.hasCreated) {
        setCreatedConnections(workflow.connections.map(c => c.id));
      } else {
        setCreatedConnections([]);
      }
      
      // Navigate to canvas
      setCurrentPage('canvas');
    }
  };

  // Render different pages based on currentPage state
  if (currentPage === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (currentPage === 'workflows') {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Navbar 
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onNewWorkflow={handleNewWorkflow}
          onBackToLanding={handleBackToLanding}
        />
        <div className="flex-1">
          <WorkflowsPage 
            workflows={savedWorkflows}
            onCreateNew={handleNewWorkflow}
            onOpenWorkflow={handleOpenWorkflow}
          />
        </div>
      </div>
    );
  }

  if (currentPage === 'cost-monitoring') {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Navbar 
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onNewWorkflow={handleNewWorkflow}
          onBackToLanding={handleBackToLanding}
        />
        <div className="flex-1">
          <CostMonitoringPage onBackToHome={handleBackToHome} services={droppedServices} />
        </div>
      </div>
    );
  }

  if (currentPage === 'logging') {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Navbar 
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onNewWorkflow={handleNewWorkflow}
          onBackToLanding={handleBackToLanding}
        />
        <div className="flex-1">
          <LoggingPage onBackToCanvas={handleBackToCanvas} />
        </div>
      </div>
    );
  }

  if (currentPage === 'education') {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Navbar 
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onNewWorkflow={handleNewWorkflow}
          onBackToLanding={handleBackToLanding}
        />
        <div className="flex-1">
          <ChatbotPage onBackToHome={handleBackToHome} />
        </div>
      </div>
    );
  }



  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-background">
        <Navbar 
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onNewWorkflow={handleNewWorkflow}
          onBackToLanding={handleBackToLanding}
        />
        <div className="flex-1 flex relative">
          {/* Floating Service Sidebar */}
          <ServiceSidebar />
          
          {/* Main Canvas Area */}
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
              isCreationAnimating={isCreationAnimating}
              createdConnections={createdConnections}
              nodeErrors={nodeErrors}
            />
            
            {/* Live Status Indicator - Top left */}
            {droppedServices.length > 0 && (
              <div className="absolute top-6 left-20 z-10">
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg border
                  ${isWorkflowLive 
                    ? 'bg-green-100 border-green-200 text-green-800' 
                    : 'bg-gray-100 border-gray-200 text-gray-600'
                  }
                `}>
                  <div className={`
                    w-2 h-2 rounded-full
                    ${isWorkflowLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}
                  `} />
                  <span className="font-medium">
                    {isWorkflowLive ? 'Live' : 'Not Live'}
                  </span>
                  {workflowName && (
                    <span className="text-xs opacity-75">• {workflowName}</span>
                  )}
                </div>
              </div>
            )}
            
            {/* Top center buttons - Better positioning */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
              {/* Settings Button - Always visible */}
              <Button
                onClick={handleSettings}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 shadow-lg hover:border-orange-300 hover:bg-orange-50"
              >
                <Settings size={18} />
                Settings
              </Button>

              {/* Cost Monitoring Button - Always visible */}
              <Button
                onClick={handleCostMonitoring}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 shadow-lg hover:border-orange-300 hover:bg-orange-50"
              >
                <DollarSign size={18} />
                Cost Monitoring
              </Button>

              {/* Save Button - Always show when there are services */}
              {droppedServices.length > 0 && (
                <Button
                  onClick={() => setIsWorkflowNamingDialogOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2 px-4 py-2 shadow-lg hover:border-orange-300 hover:bg-orange-50"
                >
                  <Save size={18} />
                  Save Workflow
                </Button>
              )}
              
              {/* Logging Button - Always show when there are services */}
              {droppedServices.length > 0 && (
                <Button
                  onClick={handleLogging}
                  variant="outline"
                  className="flex items-center gap-2 px-4 py-2 shadow-lg hover:border-orange-300 hover:bg-orange-50"
                >
                  <Activity size={18} />
                  Logging
                </Button>
              )}
            </div>
            
            {/* Action Buttons - Only show when there are services on canvas */}
            {droppedServices.length > 0 && (
              <div className="absolute top-6 right-6 flex gap-3 z-10">
                {/* Create Button - Always show when services exist */}
                <Button
                  onClick={handleCreate}
                  disabled={!allServicesConfigured}
                  className="flex items-center gap-2 px-4 py-2 shadow-lg"
                >
                  <Rocket size={18} />
                  Create
                  {!allServicesConfigured && (
                    <span className="ml-2 text-xs opacity-75">
                      (Configure all services)
                    </span>
                  )}
                </Button>
                
                {/* Deploy Code Button - Only show if EC2 exists and Create was clicked */}
                {hasEC2Instance && hasCreated && !hasDeployedCode && (
                  <Button
                    onClick={handleDeployCode}
                    className="flex items-center gap-2 px-4 py-2 shadow-lg"
                    variant="secondary"
                  >
                    <Code size={18} />
                    Deploy Code
                  </Button>
                )}

                {/* Live Button - Only show if code has been deployed */}
                {isWorkflowLive && (
                  <Button
                    onClick={handleGoLive}
                    className="flex items-center gap-2 px-4 py-2 shadow-lg bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play size={18} />
                    Go Live
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Floating Configuration Sidebar - 336px wide, 79vh height */}
          {showConfigPanel && selectedService && (
            <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-30">
              <ConfigurationSidebar
                service={selectedService}
                onClose={() => setShowConfigPanel(false)}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                configuration={selectedService ? serviceConfigurations[selectedService.instanceId] : undefined}
              />
            </div>
          )}
        </div>
        
        <SettingsDialog
          isOpen={isSettingsDialogOpen}
          onClose={() => setIsSettingsDialogOpen(false)}
          workflowName={workflowName}
          workflowId={currentWorkflowId || ''}
          onDeleteWorkflow={handleDeleteWorkflow}
        />
        
        <WorkflowCreationDialog
          isOpen={isWorkflowCreationDialogOpen}
          onClose={() => setIsWorkflowCreationDialogOpen(false)}
          onCreate={handleCreateWorkflowFromDialog}
        />
        
        <WorkflowNamingDialog
          isOpen={isWorkflowNamingDialogOpen}
          onClose={() => setIsWorkflowNamingDialogOpen(false)}
          onSave={handleSaveWorkflow}
          initialName={workflowName}
          initialDescription={workflowDescription}
        />
      </div>
    </DndProvider>
  );
}