"use client";
import {useCallback, useRef, useState} from "react";
import { Handle, Position,useReactFlow } from "@xyflow/react";
import { Archive,Server,Database } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

function SingleHandleNode({ data, id, count }) {
  const { getNode } = useReactFlow();
  const [status, setStatus] = useState(null);
  const wsRef = useRef(null);
  const terminal = new Set(['FAILED','FAULT','STOPPED','TIMED_OUT',"Succeeded", "Failed", "Stopped", "TimedOut"]);
  const busy = status && !terminal.has(String(status));

  const isValidConnection = useCallback(
    ({ source, target }) => {
      if (busy) return false;
      if (!source || !target) return true; 
      const src = getNode(source);
      const dst = getNode(target);
      if (!src || !dst) return true;

      if(src.type === 'EC2' && dst.type === 'EC2') return true;
      if(src.type === 'RDS' && dst.type === 'DynamoDB') return false;
      if(src.type === 'DynamoDB' && dst.type === 'RDS') return false;
      return src.type !== dst.type;
    },
    [getNode, busy]
  );

  const buildID = usePathname().split("/")[2];
  const nodeInfo = getNode(id);

  const webhook = async () => { 
    try { 
      if (wsRef.current && (wsRef.current.readyState === 0 || wsRef.current.readyState === 1)) return;
      const ws = new WebSocket(`ws://127.0.0.1:8000/canvas/ws/${buildID}`);
      ws.onmessage = (event) => { 
        let next = event.data;
        try {
          const j = JSON.parse(event.data);
          if (j && j.status) next = j.status;
        } catch {}
        setStatus(String(next));
        console.log("WebSocket message received:", event.data);
      };
      wsRef.current = ws;
    } catch(err) { 
      console.log("error",err);
    }
  };

switch (data.label) {
case 'EC2':
return (
<button onClick={() => webhook()} className="group" disabled={busy}>
  <div className={`w-10 h-10 rounded-2xl border-orange-500 shadow-sm flex items-center justify-center bg-orange-200 text-white relative transition-all duration-500 ease-in-out hover:shadow-2xl ${busy ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100 grayscale-0'}`}>
    <div className="flex justify-center items-center font-semibold transition-all duration-500 ease-in-out">
      <Server className="w-4 h-4 text-orange-500" />
    </div>
    {busy && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )}
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={true}
      isValidConnection={isValidConnection}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    />
    <Handle
      type="source"
      position={Position.Right}
      isConnectable={true}
      isValidConnection={isValidConnection}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    />
  </div>
</button>
);
case 'S3':
return (
<div className="group w-10 h-10 rounded-2xl hover:shadow-2xl border-green-500 shadow-sm flex items-center justify-center bg-green-200 text-white relative transition-all duration-500 ease-in-out">
  <div className="flex justify-center items-center font-semibold">
    <Archive className="w-4 h-4 text-green-500" />
  </div>
  <Handle
    type="target"
    position={Position.Left}
    isConnectable={true}
    isValidConnection={isValidConnection}
    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
  />
  <Handle
    type="source"
    position={Position.Right}
    isConnectable={true}
    isValidConnection={isValidConnection}
    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
  />
</div>
);
case 'RDS':
return (
<div className="group w-10 h-10 rounded-2xl hover:shadow-2xl border-purple-500 shadow-sm flex items-center justify-center bg-purple-200 text-white relative transition-all duration-500 ease-in-out">
  <div className="flex justify-center items-center font-semibold">
    <Database className="w-4 h-4 text-purple-500" />
  </div>
  <Handle
    type="target"
    position={Position.Left}
    isConnectable={true}
    isValidConnection={isValidConnection}
    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
  />
  <Handle
    type="source"
    position={Position.Right}
    isConnectable={true}
    isValidConnection={isValidConnection}
    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
  />
</div>
);
case 'DynamoDB':
return (
<div className="group flex flex-col items-center">
  <div className="w-10 h-10 rounded-2xl hover:shadow-2xl border-blue-500 shadow-sm flex items-center justify-center bg-blue-200 text-white relative transition-all duration-500 ease-in-out">
    <div className="flex justify-center items-center font-semibold">
      <Database className="w-4 h-4 text-blue-500" />
    </div>
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={true}
      isValidConnection={isValidConnection}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    />
    <Handle
      type="source"
      position={Position.Right}
      isConnectable={true}
      isValidConnection={isValidConnection}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    />
  </div>
</div>
);
default:
return null;
}
}

export default React.memo(SingleHandleNode, (prev, next) => prev.id === next.id);



