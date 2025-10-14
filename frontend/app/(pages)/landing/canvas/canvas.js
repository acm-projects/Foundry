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
import { animate } from "motion";



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

setNodes( [
  {
    data: { label: 'EC2' },
    dragging: false,
    id: 'dndnode_0',
    measured: { width: 40, height: 40 },
    position: { x: -283.2451171875, y: 97 },
    selected: false,
    type: 'EC2'
  },
  {
    data: { label: 'RDS' },
    dragging: false,
    id: 'dndnode_1',
    measured: { width: 40, height: 40 },
    position: { x: -133.2646484375, y: 9.5 },
    selected: false,
    type: 'RDS'
  },
  {
    data: { label: 'S3' },
    dragging: false,
    id: 'dndnode_2',
    measured: { width: 40, height: 40 },
    position: { x: -125.2646484375, y: 162 },
    selected: false,
    type: 'S3'
  },
  {
    data: { label: 'DynamoDB' },
    dragging: false,
    id: 'dndnode_3',
    measured: { width: 40, height: 40 },
    position: { x: 45.7353515625, y: 92.5 },
    selected: false,
    type: 'DynamoDB'
  },
  {
    data: { label: 'EC2' },
    dragging: false,
    id: 'dndnode_4',
    measured: { width: 40, height: 40 },
    position: { x: -62.2646484375, y: 196 },
    selected: true,
    type: 'EC2'
  }
]);

setEdges([
  {
    animated: true,
    id: 'xy-edge__dndnode_0-dndnode_1',
    source: 'dndnode_0',
    style: { strokeWidth: 2, opacity: 0.9 },
    target: 'dndnode_1'
  },
  {
    animated: true,
    id: 'xy-edge__dndnode_0-dndnode_2',
    source: 'dndnode_0',
    style: { strokeWidth: 2, opacity: 0.9 },
    target: 'dndnode_2'
  },
  {
    animated: true,
    id: 'xy-edge__dndnode_0-dndnode_3',
    source: 'dndnode_0',
    style: { strokeWidth: 2, opacity: 0.9 },
    target: 'dndnode_3'
  },
  {
    animated: true,
    id: 'xy-edge__dndnode_4-dndnode_3',
    source: 'dndnode_4',
    style: { strokeWidth: 2, opacity: 0.9 },
    target: 'dndnode_3'
  }
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
  
  
        return next;
      });
    },
    [screenToFlowPosition, type, setNodes, setEdges]
  );
  
  const wrapperRef = React.useRef(null);
  React.useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
  
    const onWheel = (e) => {
      
      window.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: 'auto' });
      e.preventDefault();
    };
  
    
    el.addEventListener('wheel', onWheel, { capture: true, passive: false });
    return () => el.removeEventListener('wheel', onWheel, { capture: true });
  }, []);
  
    
    
  console.log(nodes)
  console.log(edges)

  return (
    


<div className="w-[100vh] h-[80vh] flex ">


  <div className="shrink-0 ">
  

  </div>
  <div ref = {wrapperRef} className="flex-1">
    <ReactFlow
    proOptions={{ hideAttribution: true }}
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
      minZoom={2}
      maxZoom={2}
      defaultEdgeOptions={{
        animated: true,
        style: { strokeWidth: 2, opacity: 0.9 }
        
      }}
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