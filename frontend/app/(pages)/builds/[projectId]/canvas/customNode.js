"use client";
import {useCallback} from "react";
import { Handle, Position,useReactFlow } from "@xyflow/react";
import { Archive,Server,Database } from "lucide-react";

export default function SingleHandleNode({ data, id,count }) {
  const { getNode } = useReactFlow();

  const isValidConnection = useCallback(
    ({ source, target }) => {
      if (!source || !target) return true; 
      const src = getNode(source);
      const dst = getNode(target);
      if (!src || !dst) return true;

console.log("sources",src,dst)
      if(src.type === 'EC2' && dst.type === 'EC2') return true;

      if(src.type === 'RDS' && dst.type === 'DynamoDB') return false;

      if(src.type === 'DynamoDB' && dst.type === 'RDS') return false;

      return src.type !== dst.type;

   
    },
    [getNode]
  );

  const nodeInfo = getNode(id)

  switch (data.label) {
    case 'EC2':
      return (
        <div className="group flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl border-orange-500 shadow-md flex items-center justify-center bg-orange-200 text-white relative">
            <div className="flex justify-center items-center font-semibold">
              <Server className="w-4 h-4 text-orange-500 " />
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
          {data.name ? (
            <span className="mt-1 text-[10px] text-gray-700 font-medium bg-white px-2 py-0.5 rounded shadow-sm">
              {data.name}
            </span>
          ) : (
            <span className="mt-1 text-[10px] text-gray-500 font-medium">
              EC2
            </span>
          )}
        </div>
      );
    case 'S3':
      return (
        <div className="group flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl border-green-500 shadow-md flex items-center justify-center bg-green-200 text-white relative">
            <div className="flex justify-center items-center font-semibold">
              <Archive className="w-4 h-4 text-green-500 " />
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
          {data.bucketName ? (
            <span className="mt-1 text-[10px] text-gray-700 font-medium bg-white px-2 py-0.5 rounded shadow-sm">
              {data.bucketName}
            </span>
          ) : (
            <span className="mt-1 text-[10px] text-gray-500 font-medium">
              S3
            </span>
          )}
        </div>
      );
    case 'RDS':
      return (
        <div className="group flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl border-purple-500 shadow-md flex items-center justify-center bg-purple-200 text-white relative">
            <div className="flex justify-center items-center font-semibold">
              <Database className="w-4 h-4 text-purple-500 " />
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
          {data.dbName ? (
            <span className="mt-1 text-[10px] text-gray-700 font-medium bg-white px-2 py-0.5 rounded shadow-sm">
              {data.dbName}
            </span>
          ) : (
            <span className="mt-1 text-[10px] text-gray-500 font-medium">
              RDS
            </span>
          )}
        </div>
      );
    case 'DynamoDB':
      return (
        <div className="group flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl border-blue-500 shadow-md flex items-center justify-center bg-blue-200 text-white relative">
            <div className="flex justify-center items-center font-semibold">
              <Database className="w-4 h-4 text-blue-500 " />
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
          {data.tableName ? (
            <span className="mt-1 text-[10px] text-gray-700 font-medium bg-white px-2 py-0.5 rounded shadow-sm">
              {data.tableName}
            </span>
          ) : (
            <span className="mt-1 text-[10px] text-gray-500 font-medium">
              DynamoDB
            </span>
          )}
        </div>
      );
    default:
      return null;
  }
  
}