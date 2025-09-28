import React from 'react'
import { ReactFlow, Background as FlowBackground, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function Canvas({ params }) {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <h1 className="absolute top-4 left-4 text-2xl font-bold z-10 bg-white/80 px-2 rounded">
        Project {params.projectId} Canvas
      </h1>
      <ReactFlow
        fitView
        style={{ width: '100%', height: '100%' }}
      >
        <FlowBackground />
        <Controls />
      </ReactFlow>
    </div>
  );
}