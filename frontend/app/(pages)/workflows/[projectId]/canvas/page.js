import React from 'react'
import { ReactFlow, Background as FlowBackground, Controls } from '@xyflow/react';
import { Sheet } from '../../../../components/ui/sheet';
import '@xyflow/react/dist/style.css';

export default function Canvas({ params }) {
 

  return (

    <div className = "h-screen w-full flex justify-center">
    <div className="h-6/7 w-7/7">
      <ReactFlow
       
        fitView
        className="border rounded"
      >
        <FlowBackground />
        <Controls />
      </ReactFlow>
    </div>
    <div>
      <Sheet>

      </Sheet>
    </div>
    </div>
  );
}
