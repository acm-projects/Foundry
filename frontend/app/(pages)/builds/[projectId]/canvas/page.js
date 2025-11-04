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

import {useState} from "react"
import axios from "axios";
import { set } from "zod";


const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, getNodes, getEdges, getViewport } = useReactFlow();
  const [type] = useDnD();

  const[ec2,setEc2] = useState(false);
  const[s3,setS3] = useState(false);
  const[rds,setRDS] = useState(false);
  const[dynamo,setDynamo] = useState(false)
const[configID,setConfigID] = useState(null);

const[configs,setConfigs] = useState({}) //this is for updating config menu fields btw

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
      setEc2(true);
      setS3(false);
      setRDS(true);
      setDynamo(false);
      
        break;
    case "DynamoDB":  
         setEc2(false);
        setS3(false);
        setRDS(false);
        setDynamo(true);
        break;}
 }, 
  []);

  useEffect(() => { 

    if(nodes.length === 0 && edges.length === 0) return; 

   //store nodes and edges in db

  },[nodes,edges])

  useEffect(() => { 

    //logic to get existing canvas from backend

  },[])

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

const deployClicked = () => {
  const reactJSON = {
    nodes: getNodes(),
    edges: getEdges(),
    viewport: getViewport(),
  }
  
  console.log("Deploy clicked - React Flow JSON:", reactJSON)
  
  // The node data is already populated from the config menus
  // Each node should have a data property with the configuration
  // Example: { id: "EC2:abc123", type: "EC2", data: { label: "EC2", name: "web-01", imageID: "Ubuntu", instanceType: "t3.micro" } }
  
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
      {console.log("object", onNodeClick.node)}
    </ReactFlow>
   
    {console.log("nodes data:", nodes)}
    {ec2 && configID ? <EC2_menu repos={repos} onDelete={deleteNode} id={configID} onClose={closeEc2} label={nodes.find(n => n.id === configID)?.data?.label} /> : null}
    {s3 && configID ? <S3_menu onDelete={deleteNode} id={configID} onClose={closeS3} /> : null}
    {rds && configID ? <RDS_menu onDelete={deleteNode} id={configID} onClose={closeRDS} /> : null}
    {dynamo && configID ? <DynamoDB_menu onDelete={deleteNode} id={configID} onClose={closeDynamo} /> : null}
    </div>



  <Controls position="bottom-right" />

   
</div>
<div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-50">
  <Deploy deployClicked={deployClicked} />
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


