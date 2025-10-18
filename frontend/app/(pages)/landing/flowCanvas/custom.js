"use client";
import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Archive,Server,Database,Github, MousePointer2,Rocket,Globe } from "lucide-react";

export default function SingleHandleNode({ data }) {


switch(data.label) { 


    case "EC2":
        return (
            <div className="flex flex-col items-center">
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
         
          </div>
        );
    case "S3":
        return (
            <div className="flex flex-col items-center">
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
                
             </div>
        );
    case "RDS": 
    return (
        <div className="flex flex-col items-center">
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
             
         </div>
    );
    case "DynamoDB": 
    return (
        <div className="flex flex-col items-center">
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
           
         </div>
    
    );
    case "github":
    return (
        <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-2xl hover:shadow-2xl bg-white shadow-sm flex items-center justify-center text-black">
          <div className="flex justify-center items-center font-semibold">
            <Github className = "w-6 h-6" />
          </div>
  
          <Handle type="target" position={Position.Left} isConnectable={true} />
          <Handle type="source" position={Position.Right} isConnectable={true} />
        </div>
  
        
      </div>
      
    
    );
    case "workflow":
        return (
            <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl hover:shadow-2xl bg-white shadow-sm flex items-center justify-center text-black relative">
              <div className="flex justify-center items-center font-semibold">
                <MousePointer2 className = "w-6 h-6" />
              </div>
          
              <Handle type="target" position={Position.Left} isConnectable={true} />
              <Handle type="source" position={Position.Right} isConnectable={true} />
            </div>
          
            <p className="absolute text-[8px] font-semibold mt-10 text-center w-20 truncate">
      
            </p>
          </div>
          )
          case "deploy":
            return (
                <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl hover:shadow-2xl bg-white shadow-sm flex items-center justify-center text-black relative">
                  <div className="flex justify-center items-center font-semibold">
                    <Rocket className = "w-6 h-6"/>
                  </div>
              
                  <Handle type="target" position={Position.Left} isConnectable={true} />
                  <Handle type="source" position={Position.Right} isConnectable={true} />
                </div>
              
              
              </div>
            )
            case "live":
            return (
                <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl hover:shadow-2xl bg-white shadow-sm flex items-center justify-center text-black relative">
                  <div className="flex justify-center items-center font-semibold">
                    <Globe className = "w-6 h-6"/>
                   
                  </div>
              
                  <Handle type="target" position={Position.Left} isConnectable={true} />
                  <Handle type="source" position={Position.Right} isConnectable={true} />
                </div>
              
              
              </div>)

    default:
        break;
}


  
}