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

import { DnDProvider, useDnD } from "./Dnd";
import { animate } from "motion";
import SideBar2 from "./Sidebar";



let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow2 = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();
const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const onDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }, []);

  useEffect(() => { 


    setNodes([{
      "data": {"label": "github"},
      "dragging": false,
      "id": "dndnode_0",
      "measured": {"width": 40, "height": 52},
      "position": {x: -114, y: 266.703125},
      "selected": false,
      "type": "github"
      },
      {
      "data": {"label": "workflow"},
      "dragging": false,
      "id": "dndnode_1",
      "measured": {"width": 40, "height": 40},
      "position": {"x": -3, "y": 266.5546875},
      "selected": false,
      "type": "workflow"
      },
      {"data"
        : 
        {"label": 'deploy'},
        "dragging"
        : 
        false,
        "id"
        : 
        "dndnode_2",
        "measured"
        : 
        {"width": 40, "height": 40},
        "position"
        : 
        {"x": 349, "y": 259.5546875},
        "selected"
        : 
        false,
        "type"
        : 
        "deploy"},
      {
      "data": {"label": "live"},
      "dragging": false,
      "id": "dndnode_3",
      "measured": {"width": 40, "height": 40},
      "position": {"x": 465.5, "y": 259.5546875},
      "selected": false,
      "type": "live"
      },
      {
      "data": {"label": "DynamoDB"},
      "dragging": false,
      "id": "dndnode_4",
      "measured": {"width": 40, "height": 40},
      "position": {"x": 172.5, "y": 382.70947265625},
      "selected": true,
      "type": "DynamoDB"
      },
      {
      "data": {"label": "RDS"},
      "dragging": false,
      "id": "dndnode_5",
      "measured": {"width": 40, "height": 40},
      "position": {"x": 172, "y": 311.0546875},
      "selected": false,
      "type": "RDS"
      },
      {
      "data": {"label": "S3"},
      "dragging": false,
      "id": "dndnode_6",
      "measured": {"width": 40, "height": 40},
      "position": {"x": 171, "y": 227.0546875},
      "selected": false,
      "type": "S3"
      },
      {
      "data": {"label": "EC2"},
      "dragging": false,
      "id": "dndnode_7",
      "measured": {"width": 40, "height": 40},
      "position": {"x": 171.5, "y": 153.6171875},
      "selected": false,
      "type": "EC2"
      }
      ]
     
    
    )

    setEdges([
      {
      "id": "xy-edge__dndnode_0-dndnode_1",
      "source": "dndnode_0",
      "target": "dndnode_1"
      },
      {
      "id": "xy-edge__dndnode_1-dndnode_6",
      "source": "dndnode_1",
      "target": "dndnode_6"
      },
      {
      "id": "xy-edge__dndnode_1-dndnode_7",
      "source": "dndnode_1",
      "target": "dndnode_7"
      },
      {
      "id": "xy-edge__dndnode_1-dndnode_5",
      "source": "dndnode_1",
      "target": "dndnode_5"
      },
      {
      "id": "xy-edge__dndnode_1-dndnode_4",
      "source": "dndnode_1",
      "target": "dndnode_4"
      },
      {
      "id": "xy-edge__dndnode_7-dndnode_2",
      "source": "dndnode_7",
      "target": "dndnode_2"
      },
      {
      "id": "xy-edge__dndnode_6-dndnode_2",
      "source": "dndnode_6",
      "target": "dndnode_2"
      },
      {
      "id": "xy-edge__dndnode_5-dndnode_2",
      "source": "dndnode_5",
      "target": "dndnode_2"
      },
      {
      "id": "xy-edge__dndnode_4-dndnode_2",
      "source": "dndnode_4",
      "target": "dndnode_2"
      },
      {
      "id": "xy-edge__dndnode_2-dndnode_3",
      "source": "dndnode_2",
      "target": "dndnode_3"
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
  
  
    
    
  console.log(edges)
console.log(nodes)


  return (
    


<div className="w-full h-[80vh] flex relative ">

  <div ref = {wrapperRef} className="flex-1">
    
    <ReactFlow
   
      style={{ width: "100%", height: "100%", }}
      nodeTypes={{ EC2: SingleHandleNode, S3: SingleHandleNode, RDS: SingleHandleNode, DynamoDB: SingleHandleNode, github: SingleHandleNode,workflow: SingleHandleNode,deploy: SingleHandleNode,live: SingleHandleNode }}
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
      proOptions={{ hideAttribution: true }}
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
        <DnDFlow2 />
      </DnDProvider>
    </ReactFlowProvider>
  );
}