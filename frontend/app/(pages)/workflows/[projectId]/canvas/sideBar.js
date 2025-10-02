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
    <div className=" bg-transparent flex items-center justify-center">
      <div className= "bg-white rounded-full">
    <div className="flex flex-col space-y-6 justify-center items-center bg-transparent pt-6  w-25">

    <div className="w-10 h-10 flex items-center justify-center bg-orange-500  text-white rounded-lg shadow">
  <Cloud className="w-8 h-8" />
</div>

   
      <div
        className="dndnode flex items-center justify-center p-4 bg-white  text-orange-500 rounded shadow "
        onDragStart={(event) => onDragStart(event, "EC2")}
        draggable
      >
        <Server />
      </div>
  
      <div
        className="dndnode flex items-center justify-center text-green-500 p-4 bg-white rounded shadow"
        onDragStart={(event) => onDragStart(event, "S3")}
        draggable
      >
        <Archive />
      </div>
  
      <div
        className="dndnode flex items-center justify-center p-4 text-purple-500 bg-white rounded shadow"
        onDragStart={(event) => onDragStart(event, "RDS")}
        draggable
      >
        <Database />
      </div>
      <div className = "pb-6">
      <div className="dndnode flex items-center justify-center p-4  text-blue-500 rounded shadow"
        onDragStart={(event) => onDragStart(event, "DynamoDB")}
        draggable>
        <Database/>
</div>
    </div>
    </div>
  </div>
  </div>
  );
};
