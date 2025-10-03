"use client"
import React, { useRef, useCallback,useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import SingleHandleNode from "./custom";

import Sidebar from "./SideBar";
import { DnDProvider, useDnD } from "./Dnd";



let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();
const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const onDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }, []);

  useEffect(() => { 


    setNodes([
      { id: "dndnode_0", type: "S3", position: { x: 431.75, y: 113.75 }, data: { label: "S3" } },
      { id: "dndnode_1", type: "S3", position: { x: 673, y: 175.5 }, data: { label: "S3" } },
      { id: "dndnode_2", type: "RDS", position: { x: 747, y: 258 }, data: { label: "RDS" } },
      { id: "dndnode_3", type: "S3", position: { x: 459.5, y: 194 }, data: { label: "S3" } },
      { id: "dndnode_0", type: "S3", position: { x: 431.75, y: 113.75 }, data: { label: "S3" } },
      { id: "dndnode_1", type: "S3", position: { x: 673, y: 175.5 }, data: { label: "S3" } },
      { id: "dndnode_2", type: "RDS", position: { x: 747, y: 258 }, data: { label: "RDS" } },
      { id: "dndnode_3", type: "S3", position: { x: 459.5, y: 194 }, data: { label: "S3" } },
      { id: "dndnode_4", type: "DynamoDB", position: { x: 649.5, y: 109 }, data: { label: "DynamoDB" } },
      { id: "dndnode_5", type: "RDS", position: { x: 813.5, y: 104.5 }, data: { label: "RDS" } },
      { id: "dndnode_6", type: "EC2", position: { x: 495, y: 53.6240234375 }, data: { label: "EC2" } },
      { id: "dndnode_7", type: "DynamoDB", position: { x: 806.5, y: 158.5 }, data: { label: "DynamoDB" } },
      { id: "dndnode_0", type: "S3", position: { x: 431.75, y: 113.75 }, data: { label: "S3" } },
      { id: "dndnode_0", type: "S3", position: { x: 431.75, y: 113.75 }, data: { label: "S3" } },
    ]);
    setEdges([
      { id: "edndnode_0-dndnode_1", source: "dndnode_0", target: "dndnode_1" },
      { id: "edndnode_0-dndnode_1", source: "dndnode_0", target: "dndnode_1" },
      { id: "edndnode_1-dndnode_2", source: "dndnode_1", target: "dndnode_2" },
      { id: "edndnode_1-dndnode_2", source: "dndnode_1", target: "dndnode_2" },
      { id: "edndnode_2-dndnode_3", source: "dndnode_2", target: "dndnode_3" },
      { id: "edndnode_2-dndnode_3", source: "dndnode_2", target: "dndnode_3" },
      { id: "edndnode_3-dndnode_0", source: "dndnode_3", target: "dndnode_0" },
      { id: "edndnode_3-dndnode_0", source: "dndnode_3", target: "dndnode_0" },
      { id: "edndnode_0-dndnode_1", source: "dndnode_0", target: "dndnode_1" },
      { id: "edndnode_0-dndnode_1", source: "dndnode_0", target: "dndnode_1" },
      { id: "edndnode_1-dndnode_2", source: "dndnode_1", target: "dndnode_2" },
      { id: "edndnode_1-dndnode_2", source: "dndnode_1", target: "dndnode_2" },
      { id: "edndnode_2-dndnode_3", source: "dndnode_2", target: "dndnode_3" },
      { id: "edndnode_2-dndnode_3", source: "dndnode_2", target: "dndnode_3" },
      { id: "edndnode_3-dndnode_4", source: "dndnode_3", target: "dndnode_4" },
      { id: "edndnode_3-dndnode_4", source: "dndnode_3", target: "dndnode_4" },
      { id: "edndnode_4-dndnode_5", source: "dndnode_4", target: "dndnode_5" },
      { id: "edndnode_4-dndnode_5", source: "dndnode_4", target: "dndnode_5" },
      { id: "edndnode_5-dndnode_6", source: "dndnode_5", target: "dndnode_6" },
      { id: "edndnode_5-dndnode_6", source: "dndnode_5", target: "dndnode_6" },
      { id: "edndnode_6-dndnode_7", source: "dndnode_6", target: "dndnode_7" },
      { id: "edndnode_6-dndnode_7", source: "dndnode_6", target: "dndnode_7" },
      { id: "xy-edge__dndnode_3-dndnode_1", source: "dndnode_3", target: "dndnode_1" },
      { id: "edndnode_7-dndnode_0", source: "dndnode_7", target: "dndnode_0" },
      { id: "edndnode_7-dndnode_0", source: "dndnode_7", target: "dndnode_0" },
      { id: "edndnode_0-dndnode_0", source: "dndnode_0", target: "dndnode_0" },
      { id: "edndnode_0-dndnode_0", source: "dndnode_0", target: "dndnode_0" },
      { id: "edndnode_0-dndnode_0", source: "dndnode_0", target: "dndnode_0" },
      { id: "edndnode_0-dndnode_0", source: "dndnode_0", target: "dndnode_0" },
      { id: "edndnode_0-dndnode_1", source: "dndnode_0", target: "dndnode_1" },
      { id: "edndnode_0-dndnode_1", source: "dndnode_0", target: "dndnode_1" },
    
    ])
    
    
    },[])

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (!type) return;
  
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
  
      const newNode = {
        id: getId(),
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
              id: `e${prevLast.id}-${newNode.id}`,
              source: prevLast.id,
              target: newNode.id,
            })
          );
        }
  
        return next;
      });
    },
    [screenToFlowPosition, type, setNodes, setEdges]
  );
  
  
    
    
  

  return (
    


<div className="w-full h-[80vh] flex ">


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
    >
      
    </ReactFlow>

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