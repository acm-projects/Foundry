"use client"
import React from 'react';
import { useDnD } from './DnDContext';
import { Server,Database,Archive,Cloud } from 'lucide-react';

export default function SideBar ()  {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className=" bg-transparent mt-20 flex items-center justify-center">
    <div className= "bg-white rounded-full">
      <div className="flex flex-col space-y-6 justify-center items-center bg-transparent pt-6  w-25">
  
        <div className="relative w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-lg shadow group">
          <Cloud className="w-8 h-8" />
        
        </div>
  
        <div
          className="relative dndnode flex items-center justify-center p-4 bg-white text-orange-500 rounded shadow group"
          onDragStart={(event) => onDragStart(event, "EC2")}
          draggable
        >
          <Server />
          <span className="absolute duration-500 top-0 right-0 translate-x-full -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">EC2</span>
        </div>
  
        <div
          className="relative dndnode flex items-center justify-center text-green-500 p-4 bg-white rounded shadow group"
          onDragStart={(event) => onDragStart(event, "S3")}
          draggable
        >
          <Archive />
          <span className="absolute top-0 right-0 duration-500 translate-x-full -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">S3</span>
        </div>
  
        <div
          className="relative dndnode flex items-center justify-center p-4 text-purple-500 bg-white rounded shadow group"
          onDragStart={(event) => onDragStart(event, "RDS")}
          draggable
        >
          <Database />
          <span className="absolute top-0  duration-500 right-0 translate-x-full -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">RDS</span>
        </div>
        <div className="pb-6">
          <div
            className="relative dndnode flex items-center justify-center p-4 text-blue-500 rounded shadow group"
            onDragStart={(event) => onDragStart(event, "DynamoDB")}
            draggable
          >
            <Database/>
            <span className="absolute top-0 right-0 duration-300 translate-x-full -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">DynamoDB</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};
