"use client"
import React, { useRef, useCallback,useEffect, use } from "react";
import EC2_menu from "./configMenu/EC2_menu";
import DynamoDB_menu from "./configMenu/Dynamo_menu";
import S3_menu from "./configMenu/S3_menu";
import RDS_menu from "./configMenu/RDS_menu";
import { nanoid } from "nanoid";
import { ReactFlow,ReactFlowProvider, addEdge, useNodesState,useEdgesState,Controls,useReactFlow,Background} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import SingleHandleNode from "./customNode";
import Sidebar from "./sideBar";
import { DnDProvider, useDnD } from "./DnDContext";
import { useSession } from "next-auth/react";
import Deploy from './Deployment/deploy'
import { useParams } from "next/navigation";

import {useState} from "react"
import axios from "axios";
import { set } from "zod";


const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, getNodes, getEdges, getViewport } = useReactFlow();
  const [type] = useDnD();
  const params = useParams();
  const session = useSession();

  const[ec2,setEc2] = useState(false);
  const[s3,setS3] = useState(false);
  const[rds,setRDS] = useState(false);
  const[dynamo,setDynamo] = useState(false)
const[configID,setConfigID] = useState(null);

const[configs,setConfigs] = useState({}) //this is for updating config menu fields btw

  // Deployment state tracking
  // 'never' = never deployed
  // 'deployed' = successfully deployed and no changes since
  // 'needs-update' = deployed but changes detected
  const [deploymentState, setDeploymentState] = useState('never')
  const [lastDeployedSnapshot, setLastDeployedSnapshot] = useState(null)
  // Get buildId from URL params - this is the single source of truth
  const buildId = params.projectId ? parseInt(params.projectId, 10) : null
  const [stackName, setStackName] = useState(null) // Track the stack_name from deployment

const onNodeClick = useCallback((event, node) => {
  
  setConfigID(node.id);
  switch(node.type) {
    case "EC2":
        setEc2(true);
        setS3(false);
        setRDS(false);
        setDynamo(false);
        break;
    case "S3":
      setEc2(false);
      setS3(true);
      setRDS(false);
      setDynamo(false);
      
        break;
    case "RDS":
      setEc2(false);
      setS3(false);
      setRDS(true);
      setDynamo(false);
      
        break;
    case "DynamoDB":  
         setEc2(false);
        setS3(false);
        setRDS(false);
        setDynamo(true);
        console.log("dynamo true",node.type)

        break;}
 }, 
  []);

  useEffect(() => { 

    if(nodes.length === 0 && edges.length === 0) return; 

   //store nodes and edges in db

    // Check if canvas has changed since last deployment
    if (deploymentState === 'deployed' && lastDeployedSnapshot) {
      const hasChanges = detectCanvasChanges()
      if (hasChanges) {
        setDeploymentState('needs-update')
      }
    }

  },[nodes, edges, deploymentState, lastDeployedSnapshot])

  useEffect(() => { 

    //logic to get existing canvas from backend

    if (!buildId) {
      console.warn("No buildId available, skipping localStorage load");
      return;
    }

    console.log("Loading deployment state for build:", buildId);

    // Load deployment state - USE BUILD-SPECIFIC KEYS
    const storedDeploymentState = localStorage.getItem(`deploymentState_${buildId}`)
    const storedSnapshot = localStorage.getItem(`lastDeployedSnapshot_${buildId}`)
    const storedStackName = localStorage.getItem(`stackName_${buildId}`)
    
    if (storedDeploymentState) {
      console.log("Loaded deployment state:", storedDeploymentState);
      setDeploymentState(storedDeploymentState)
    } else {
      console.log("No stored deployment state, defaulting to 'never'");
    }
    
    if (storedSnapshot) {
      setLastDeployedSnapshot(storedSnapshot)
    }

    // buildId is now from URL params, not localStorage
    
    if (storedStackName) {
      setStackName(storedStackName)
    }

  },[buildId])

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const onDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (!type) return;
  
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
  
      const newNode = {
        id: `${type}:${nanoid()}`,
        type,
        position,
        data: { label: `${type}` },
     
      };
      setNodes((nds) => {
        const prevLast = nds[nds.length - 1];  
       const next = nds.concat(newNode);
        return next;
      });
    },
    [screenToFlowPosition, type, setNodes, setEdges]
  );

function closeEc2() { 
    setEc2(false)
  }
function closeS3() { 
  setS3(false)
}
function closeDynamo() {
  setDynamo(false)
}
function closeRDS() {
  setRDS(false)
}
 
const deleteNode = (id) => {
  setNodes((nds) => nds.filter((n) => n.id !== id));
};

// Function to create a snapshot of current canvas state for comparison
const createCanvasSnapshot = (reactJson) => {
  return JSON.stringify({
    nodes: reactJson.nodes.map(n => ({
      id: n.id,
      type: n.type,
      data: n.data,
      position: n.position
    })),
    edges: reactJson.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target
    }))
  })
}

// Function to detect if canvas has changed since last deployment
const detectCanvasChanges = () => {
  if (!lastDeployedSnapshot) return false
  
  const currentSnapshot = createCanvasSnapshot({
    nodes: getNodes(),
    edges: getEdges()
  })
  
  return currentSnapshot !== lastDeployedSnapshot
}

// Called when deployment succeeds
const handleDeploymentSuccess = (deployedData, responseBuildId, responseStackName) => {
 
  console.log("Deployment successful - saving snapshot")
  console.log("Build ID from URL:", buildId)
  console.log("Build ID from response:", responseBuildId, typeof responseBuildId)
  console.log("Stack Name from response:", responseStackName, typeof responseStackName)
  console.log("deployedData keys:", Object.keys(deployedData))
  
  const snapshot = createCanvasSnapshot(deployedData)
  setLastDeployedSnapshot(snapshot)
  setDeploymentState('deployed')
  
  // buildId is now from URL params, not response
  // Just verify they match
  if (responseBuildId && responseBuildId !== buildId) {
    console.warn(`Build ID mismatch! URL: ${buildId}, Response: ${responseBuildId}`)
  }
  
  // Store stack_name if provided
  if (responseStackName) {
    console.log("Setting stack_name state to:", responseStackName)
    setStackName(responseStackName)
    // Use build-specific localStorage key
    localStorage.setItem(`stackName_${buildId}`, responseStackName)
    console.log("stack_name saved to state and localStorage:", localStorage.getItem(`stackName_${buildId}`))
  } else {
    console.warn("⚠️ responseStackName is null or undefined - cannot store stack_name")
  }
  
  // Also save to localStorage for persistence across page reloads
  // USE BUILD-SPECIFIC KEYS
  localStorage.setItem(`lastDeployedSnapshot_${buildId}`, snapshot)
  localStorage.setItem(`deploymentState_${buildId}`, 'deployed')

  //going to save deployment state to db
  
  console.log(`Deployment state saved for build ${buildId}`)
}

// Clear entire canvas and reset state
const handleClearCanvas = () => {
  const confirmClear = window.confirm(
    " Clear Canvas?\n\nThis will:\n• Remove all nodes and edges\n• Reset deployment state\n• Clear localStorage\n\nThis action cannot be undone."
  )
  
  if (confirmClear) {
    // Clear React Flow state
    setNodes([])
    setEdges([])
    
    // Clear deployment state
    setDeploymentState('never')
    setLastDeployedSnapshot(null)
    // buildId comes from URL, don't clear it
    setStackName(null)
    
    // Clear localStorage - USE BUILD-SPECIFIC KEYS
    localStorage.removeItem(`nodes_${buildId}`)
    localStorage.removeItem(`edges_${buildId}`)
    localStorage.removeItem(`deploymentState_${buildId}`)
    localStorage.removeItem(`lastDeployedSnapshot_${buildId}`)
    // Don't remove buildId - it's from URL
    localStorage.removeItem(`stackName_${buildId}`)
    
    console.log(`Canvas cleared successfully for build ${buildId}`)
  }
}

const deployClicked = () => {
  console.log("=== DEPLOY CLICKED - DEBUG INFO ===")
  
  const rawNodes = getNodes()
  const rawEdges = getEdges()
  const rawViewport = getViewport()
  
  console.log("Raw nodes from React Flow:", rawNodes)
  console.log("Raw edges from React Flow:", rawEdges)
  console.log("Number of nodes:", rawNodes.length)
  console.log("Number of edges:", rawEdges.length)
  
  const reactJSON = {
    nodes: rawNodes,
    edges: rawEdges,
    viewport: rawViewport,
  }
  
  // Clean up nodes - remove React Flow internal fields and old imageID
  reactJSON.nodes = reactJSON.nodes.map(node => {
    console.log(`Processing node: ${node.id}, type: ${node.type}`, node.data)
    
    const cleanData = { ...node.data }
    
    // Remove old imageID field if exists (keep only imageId)
    if (cleanData.imageID) {
      console.log(`  Removing old imageID from node ${node.id}`)
      delete cleanData.imageID
    }
    
    // Remove React Flow internal fields
    const { measured, selected, dragging, ...cleanNode } = node
    
    return {
      ...cleanNode,
      data: cleanData
    }
  })
  
  // Clean up edges - remove React Flow styling/animation
  reactJSON.edges = reactJSON.edges.map(edge => {
    const { animated, style, ...cleanEdge } = edge
    return cleanEdge
  })
  
  console.log("=== CLEANED DATA TO SEND ===")
  console.log("Cleaned nodes:", reactJSON.nodes)
  console.log("Cleaned edges:", reactJSON.edges)
  console.log("============================")
  
  return reactJSON
}



 //logic to get existing canvas from backend




  return (

    <div className = "flex flex-col">
  <div className="w-full h-[80vh] flex relative">
    <div className="shrink-0">
      <div className = "ml-9">

      </div>
      <div className = "flex h-full items-center ml-8">
      <Sidebar  />
      </div>
    </div>
    <div className="flex-1 ">
      <ReactFlow
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 2, opacity: 0.9 }
        }}


      style={{ width: "100%", height: "100%" }}
    
      nodeTypes={{ EC2: SingleHandleNode, S3: SingleHandleNode, RDS: SingleHandleNode, DynamoDB: SingleHandleNode }}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      fitView
      onNodeClick={onNodeClick}
      proOptions={{ hideAttribution: true }}

    >
    </ReactFlow>
   
    {ec2 && configID ? <EC2_menu  onDelete={deleteNode} id={configID} onClose={closeEc2} label={nodes.find(n => n.id === configID)?.data?.label} /> : null}
    {s3 && configID ? <S3_menu onDelete={deleteNode} id={configID} onClose={closeS3} /> : null}
    {rds && configID ? <RDS_menu onDelete={deleteNode} id={configID} onClose={closeRDS} /> : null}
    {dynamo && configID ? <DynamoDB_menu onDelete={deleteNode} id={configID} onClose={closeDynamo} /> : null}
    </div>



  <Controls position="bottom-right" />

   
</div>
<div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-50 flex gap-2">
  <Deploy 
    deployClicked={deployClicked} 
    deploymentState={deploymentState}
    buildId={buildId}
    stackName={stackName}
    onDeploymentSuccess={handleDeploymentSuccess}
  />
  <button
    onClick={handleClearCanvas}
    className="flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors"
    title="Clear entire canvas and reset deployment state"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
    <span className="font-semibold text-sm">Clear Canvas</span>
  </button>
</div>
</div>
    
  );
};

export default function CanvasPage() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
    </ReactFlowProvider>
  );
}


