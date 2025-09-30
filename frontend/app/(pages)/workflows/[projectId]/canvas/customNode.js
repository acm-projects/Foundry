"use client";
import React from "react";
import { Handle, Position } from "@xyflow/react";

export default function SingleHandleNode({ data }) {
  return (
    <div className="rounded-md border bg-white px-3 py-2 shadow-sm">
      {data.label}


      <Handle
        type="target"
        position={Position.Left}
        isConnectable={true}    
      />

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={true}    
      />
    </div>
  );
}

