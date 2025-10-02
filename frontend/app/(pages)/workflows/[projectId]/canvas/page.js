"use client"
import React, { useRef, useCallback,useEffect } from "react";
import EC2_menu from "./configMenu/EC2_menu";
import DynamoDB_menu from "./configMenu/Dynamo_menu";
import S3_menu from "./configMenu/S3_menu";
import RDS_menu from "./configMenu/RDS_menu";

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
import SingleHandleNode from "./customNode";

import Sidebar from "./sideBar";
import { DnDProvider, useDnD } from "./DnDContext";





let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  //memory part of the nodes instead local storage api call from backend later
  useEffect(() => { 

    if(nodes.length === 0 && edges.length === 0) return; 

    localStorage.setItem("nodes", JSON.stringify(nodes)); 

    localStorage.setItem("edges", JSON.stringify(edges));

  },[nodes,edges])

  //retrieve nodes memory

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
    {/* config menu will go here need logic tho */}
<S3_menu />
  </div>
  <Controls position = "bottom-right"/>
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


