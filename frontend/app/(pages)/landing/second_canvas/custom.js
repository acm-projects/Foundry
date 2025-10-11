"use client";
import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Archive,Server,Database } from "lucide-react";
export default function SingleHandleNode({ data }) {


switch(data.label) { 


    case "EC2":
        return (
            <div className="w-10 h-10 rounded-2xl hover:shadow-2xl border-orange-500 shadow-sm flex items-center justify-center bg-orange-200 text-white">
                <div className = " flex justify-center items-center font-semibold">
            <Server className="w-4 h-4 text-orange-500 "/>
            </div>
           
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
    case "S3":
        return (
            <div className="w-10 h-10 rounded-2xl  hover:shadow-2xl border-green-500 shadow-sm flex items-center justify-center bg-green-200 text-white">
                <div className = "flex justify-center items-center font-semibold">
           <Archive className="w-4 h-4 text-green-500 "/>
            </div>
           
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
    case "RDS": 
    return (
        <div className="w-10 h-10 rounded-2xl  hover:shadow-2xl border-purple-500 shadow-sm flex items-center justify-center bg-purple-200 text-white">
            <div className = "flex justify-center items-center font-semibold">
        <Database className="w-4 h-4 text-purple-500 "/>
        </div>
       
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
    case "DynamoDB": 
    return (
        <div className="w-10 h-10 rounded-2xl  hover:shadow-2xl border-blue-500 shadow-sm flex items-center justify-center bg-blue-200 text-white">
            <div className = "flex justify-center items-center font-semibold">
        <Database className="w-4 h-4 text-blue-500 "/>
        </div>
       
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
    default:
        break;
}




  
}