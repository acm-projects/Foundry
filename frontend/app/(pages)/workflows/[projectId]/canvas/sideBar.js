"use client"
import React from 'react';
import { useDnD } from './DnDContext';
import { Server, Database, Archive, Cloud } from 'lucide-react';

export default function SideBar() {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="bg-transparent mt-25 flex items-center absolute ml-9 justify-center">
      <div className="bg-white rounded-xl p-3">
        <div className="flex flex-col space-y-3 justify-center items-center bg-transparent">

          <div className="flex flex-col items-center">
            <div
              className="dndnode flex items-center justify-center p-2 bg-white text-orange-500 rounded shadow w-10 h-10"
              onDragStart={(event) => onDragStart(event, "EC2")}
              draggable
            >
              <Server className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-700 mt-1">EC2</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className="dndnode flex items-center justify-center text-green-500 p-2 bg-white rounded shadow w-10 h-10"
              onDragStart={(event) => onDragStart(event, "S3")}
              draggable
            >
              <Archive className="w-5 h-5" />
            </div>
            <h1 className="text-xs font-bold text-gray-700 mt-1">S3</h1>
          </div>

          <div className="flex flex-col items-center">
            <div
              className="dndnode flex items-center justify-center p-2 text-purple-500 bg-white rounded shadow w-10 h-10"
              onDragStart={(event) => onDragStart(event, "RDS")}
              draggable
            >
              <Database className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-700 mt-1">RDS</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className="dndnode flex items-center justify-center p-2 text-blue-500 rounded shadow w-10 h-10"
              onDragStart={(event) => onDragStart(event, "DynamoDB")}
              draggable
            >
              <Database className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-700 mt-1">Dynamo</span>
          </div>

        </div>
      </div>
    </div>
  );
};


