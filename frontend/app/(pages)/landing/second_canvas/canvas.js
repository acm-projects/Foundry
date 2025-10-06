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


    setNodes([
      {
        id: "EfE9356CMdRPnIOpUi7FS",
        type: "DynamoDB",
        position: { x: -137, y: 93 },
        data: { label: "DynamoDB" }
      },
      {
        id: "CmVDz_2yUvDMrw-0CEqSY",
        type: "EC2",
        position: { x: -27, y: 156 },
        data: { label: "EC2" }
      },
      {
        id: "_fbjgqo_zp5psBgCljVoT",
        type: "S3",
        position: { x: 103.5, y: 117.5 },
        data: { label: "S3" }
      },
      {
        id: "C9X71Dvx41RKs4W3wnsus",
        type: "S3",
        position: { x: 215.5, y: 234.5 },
        data: { label: "S3" }
      },
      {
        id: "dHBi-OTCmjFlzH7G3MvwB",
        type: "RDS",
        position: { x: 65.5, y: 271 },
        data: { label: "RDS" }
      }
    ]
    )
      
    setEdges([
      {
        id: "epw92DEIDW3DKaFO0C9Rkt",
        source: "EfE9356CMdRPnIOpUi7FS",
        target: "CmVDz_2yUvDMrw-0CEqSY",
        style: { strokeWidth: 2, opacity: 0.8 },
        animated: true
      },
      {
        id: "ess83VX5uiAdfxUrvM5w1Y",
        source: "EfE9356CMdRPnIOpUi7FS",
        target: "CmVDz_2yUvDMrw-0CEqSY",
        style: { strokeWidth: 2, opacity: 0.8 },
        animated: true
      },
      {
        id: "emzK7IgkaOItvSJveSj9dS",
        source: "CmVDz_2yUvDMrw-0CEqSY",
        target: "_fbjgqo_zp5psBgCljVoT",
        style: { strokeWidth: 2, opacity: 0.8 },
        animated: true
      },
      {
        id: "e_q3IOrTdiAs26NHOQouu9",
        source: "CmVDz_2yUvDMrw-0CEqSY",
        target: "_fbjgqo_zp5psBgCljVoT",
        style: { strokeWidth: 2, opacity: 0.8 },
        animated: true
      },
      {
        id: "ejDaXV01Cx0z2yCwkg4aKV",
        source: "_fbjgqo_zp5psBgCljVoT",
        target: "C9X71Dvx41RKs4W3wnsus",
        style: { strokeWidth: 2, opacity: 0.8 },
        animated: true
      },
      {
        id: "eOY92F8EzvttslxKKyDtsr",
        source: "_fbjgqo_zp5psBgCljVoT",
        target: "C9X71Dvx41RKs4W3wnsus",
        style: { strokeWidth: 2, opacity: 0.8 },
        animated: true
      },
      {
        id: "enqmyDpdh7dHjVPMyF4G1y",
        source: "C9X71Dvx41RKs4W3wnsus",
        target: "dHBi-OTCmjFlzH7G3MvwB",
        style: { strokeWidth: 2, opacity: 0.8 },
        animated: true
      },
      {
        id: "eZR-ZQ6A2c_LJUTQ4RUaQ7",
        source: "C9X71Dvx41RKs4W3wnsus",
        target: "dHBi-OTCmjFlzH7G3MvwB",
        style: { strokeWidth: 2, opacity: 0.8 },
        animated: true
      }
    ]
    
    
    )
    
    
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
              animated: true
              
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