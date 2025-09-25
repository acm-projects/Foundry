import { useState, useCallback } from 'react';
import { DroppedService, Connection, SavedWorkflow, ServiceConfig, PageType } from '../types';

export const useAppState = () => {
  // Core application state
  const [droppedServices, setDroppedServices] = useState<DroppedService[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedService, setSelectedService] = useState<DroppedService | null>(null);
  const [serviceConfigurations, setServiceConfigurations] = useState<Record<string, ServiceConfig>>({});
  
  // Navigation state
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [previousPage, setPreviousPage] = useState<'workflows' | 'canvas'>('workflows');
  
  // Workflow state
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  
  // UI state
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [nodeErrors, setNodeErrors] = useState<string[]>([]);
  
  // Dialog states
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isWorkflowCreationDialogOpen, setIsWorkflowCreationDialogOpen] = useState(false);
  const [isWorkflowNamingDialogOpen, setIsWorkflowNamingDialogOpen] = useState(false);
  
  // Animation states
  const [hasCreated, setHasCreated] = useState(false);
  const [hasDeployedCode, setHasDeployedCode] = useState(false);
  const [animatingConnections, setAnimatingConnections] = useState<string[]>([]);
  const [isCreationAnimating, setIsCreationAnimating] = useState(false);
  const [createdConnections, setCreatedConnections] = useState<string[]>([]);

  // Service management functions
  const addService = useCallback((service: any, position: { x: number; y: number }) => {
    const existingServicesOfType = droppedServices.filter(s => s.id === service.id);
    const instanceId = `${service.id}-${Date.now()}-${existingServicesOfType.length}`;
    
    const newService: DroppedService = {
      id: service.id,
      name: service.name,
      type: service.type,
      position,
      instanceId
    };
    
    setDroppedServices(prev => [...prev, newService]);
  }, [droppedServices]);

  const removeService = useCallback((instanceId: string) => {
    setDroppedServices(prev => prev.filter(s => s.instanceId !== instanceId));
    setConnections(prev => prev.filter(c => 
      c.sourceId !== instanceId && c.targetId !== instanceId
    ));
    delete serviceConfigurations[instanceId];
    setServiceConfigurations({...serviceConfigurations});
  }, [serviceConfigurations]);

  const updateServicePosition = useCallback((instanceId: string, position: { x: number; y: number }) => {
    setDroppedServices(prev => prev.map(service =>
      service.instanceId === instanceId ? { ...service, position } : service
    ));
  }, []);

  const updateServiceConfig = useCallback((instanceId: string, config: ServiceConfig) => {
    setServiceConfigurations(prev => ({
      ...prev,
      [instanceId]: { ...prev[instanceId], ...config }
    }));
  }, []);

  // Connection management
  const addConnection = useCallback((sourceId: string, targetId: string) => {
    const connectionId = `${sourceId}-${targetId}`;
    if (!connections.find(c => c.id === connectionId)) {
      setConnections(prev => [...prev, { id: connectionId, sourceId, targetId }]);
    }
  }, [connections]);

  const removeConnection = useCallback((connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
  }, []);

  // Workflow management
  const saveWorkflow = useCallback(() => {
    if (!workflowName.trim()) return;
    
    const workflow: SavedWorkflow = {
      id: currentWorkflowId || `workflow-${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      services: droppedServices,
      connections: connections,
      configurations: serviceConfigurations,
      status: 'draft',
      lastModified: new Date().toISOString(),
      createdAt: currentWorkflowId ? 
        savedWorkflows.find(w => w.id === currentWorkflowId)?.createdAt || new Date().toISOString() :
        new Date().toISOString(),
      cost: droppedServices.length * 50,
      hasCreated,
      hasDeployedCode
    };

    setSavedWorkflows(prev => {
      const existing = prev.findIndex(w => w.id === workflow.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = workflow;
        return updated;
      }
      return [...prev, workflow];
    });
    
    setCurrentWorkflowId(workflow.id);
  }, [
    workflowName, workflowDescription, droppedServices, connections, 
    serviceConfigurations, currentWorkflowId, savedWorkflows, hasCreated, hasDeployedCode
  ]);

  const loadWorkflow = useCallback((workflowId: string) => {
    const workflow = savedWorkflows.find(w => w.id === workflowId);
    if (workflow) {
      setCurrentWorkflowId(workflow.id);
      setWorkflowName(workflow.name);
      setWorkflowDescription(workflow.description);
      setDroppedServices(workflow.services);
      setConnections(workflow.connections);
      setServiceConfigurations(workflow.configurations);
      setHasCreated(workflow.hasCreated);
      setHasDeployedCode(workflow.hasDeployedCode);
      setCurrentPage('canvas');
    }
  }, [savedWorkflows]);

  const deleteWorkflow = useCallback((workflowId: string) => {
    setSavedWorkflows(prev => prev.filter(w => w.id !== workflowId));
    if (currentWorkflowId === workflowId) {
      setCurrentWorkflowId(null);
      setWorkflowName('');
      setWorkflowDescription('');
      setDroppedServices([]);
      setConnections([]);
      setServiceConfigurations({});
      setHasCreated(false);
      setHasDeployedCode(false);
    }
  }, [currentWorkflowId]);

  // Reset functions
  const resetCanvas = useCallback(() => {
    setDroppedServices([]);
    setConnections([]);
    setServiceConfigurations({});
    setSelectedService(null);
    setNodeErrors([]);
    setAnimatingConnections([]);
    setCreatedConnections([]);
  }, []);

  const resetWorkflow = useCallback(() => {
    setCurrentWorkflowId(null);
    setWorkflowName('');
    setWorkflowDescription('');
    setHasCreated(false);
    setHasDeployedCode(false);
    resetCanvas();
  }, [resetCanvas]);

  return {
    // State
    droppedServices,
    connections,
    selectedService,
    serviceConfigurations,
    currentPage,
    previousPage,
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

    // Setters
    setSelectedService,
    setCurrentPage,
    setPreviousPage,
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
    resetWorkflow
  };
};