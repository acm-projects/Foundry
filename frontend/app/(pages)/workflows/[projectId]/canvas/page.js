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
import Deploy from "./buttons/deploy";
import Live from "./buttons/live";
import Sidebar from "./sideBar";
import { DnDProvider, useDnD } from "./DnDContext";
import Deploy from './Deployment/deploy'
import Live from "./Deployment/live";
import {useState} from "react"
import SaveWorkflowDialog from "@/app/components/SaveWorkflowModal";

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const[ec2,setEc2] = useState(false);
  const[s3,setS3] = useState(false);
  const[rds,setRDS] = useState(false);
  const[dynamo,setDynamo] = useState(false)
const[configID,setConfigID] = useState(null);

const[configs,setConfigs] = useState({}) // 6 77777777777777



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

    localStorage.setItem("nodes", JSON.stringify(nodes)); 

    localStorage.setItem("edges", JSON.stringify(edges));

  },[nodes,edges])

 

  useEffect(() => { 

    const storedNodes = JSON.parse(localStorage.getItem("nodes"));
    const storedEdges = JSON.parse(localStorage.getItem("edges"));

    if (storedNodes) { 
      setNodes(storedNodes);
    }

    if (storedEdges) { 
      setEdges(storedEdges);
    }



  },[])

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const onDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }, []);

  

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (!type) return;
  
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
  
      const newNode = {
        id: nanoid(),
        type,
        position,
        data: { label: `${type}` },
      };

  
      setNodes((nds) => {
        const prevLast = nds[nds.length - 1];  
       const next = nds.concat(newNode);
      
       
   
        if (prevLast) {
          setEdges((eds) =>
            eds.concat({
              id: `e${nanoid()}`,
              source: prevLast.id,
              target: newNode.id,
              animated: true,
            
              style: { stroke: 'orange',opacity: 0.5 ,strokeWidth: 2 },
           
              animated: true,
              style: {  strokeWidth: 2,opacity: .8 }
              
            })
          );
        }

       
    switch(newNode.type) {
    case "EC2":
      setEc2(true);
      setS3(false);
    setRDS(false);
    setDynamo(false);
     setConfigID(newNode.id);
              break;
    case "S3":
      setEc2(false);
      setS3(true);
      setRDS(false);
      setDynamo(false);
      setConfigID(newNode.id);
            
          break;
    case "RDS":
      setEc2(true);
      setS3(false);
      setRDS(true);
      setDynamo(false);
      setConfigID(newNode.id);
            
         break;
   case "DynamoDB":  
     setEc2(false);
     setS3(false);
     setRDS(false);
     setDynamo(true);
    setConfigID(newNode.id);
          break;}
     
  
        return next;
      });
    },
    [screenToFlowPosition, type, setNodes, setEdges]
  );

  useEffect(() => { 

localStorage.getItem("amiID")


  },[configID])


  
    
  



 
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
 //it only deletes node visual not from memory soooo like someone fix this 
const deleteNode = (id) => {
  setNodes((nds) => nds.filter((n) => n.id !== id));
 
 

};

  
  return (
    


<div className="w-full h-[80vh] flex relative">


  <div className="absolute top-4  right-4 z-10 w-full">
    <Deploy nodes={nodes} />
  </div>
  <div className="shrink-0 ">
  
    <Sidebar />
  </div>

  <div className="flex-1">
    <ReactFlow
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
    >
    
    </ReactFlow>
   
    {console.log("share",nodes)}
{ ec2  && configID? <EC2_menu onDelete = {deleteNode} id={configID} onClose = {closeEc2}/>  : null}
{ s3  && configID? <S3_menu onDelete = {deleteNode} id={configID} onClose = {closeS3}  /> : null}
{ rds  && configID? <RDS_menu onDelete = {deleteNode} id={configID} onClose = {closeRDS}   /> : null}
{ dynamo  && configID? <DynamoDB_menu onDelete = {deleteNode} id={configID} onClose = {closeDynamo}   /> : null}
 

  </div>

  <Controls position="bottom-right" />
</div>


      
    
  );
};

export default function CanvasPage() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
      <SaveWorkflowDialog/>
    </ReactFlowProvider>
  );
}


