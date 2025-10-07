"use client"
import AppNavbar from "../../../components/WorkflowNavbar";
import React from 'react';
import { usePathname } from "next/navigation";
import {useState} from 'react'


export default function WorkflowsLayout({ children, params }){
  const { projectId } = params;

  const path = usePathname();

  if(path.includes("canvas")) { 

    return (
      <div className="bg-gray-100  flex flex-col items-center p-4 min-h-screen bg-[radial-gradient(circle,rgba(0,0,0,0.3)_1px,transparent_1px)] [background-size:32px_32px]">
       
        <AppNavbar projectId={projectId} />
       
        <main className="flex-1 w-full h-full mt-4">
          {children}
        </main>
      </div>
    );
  }

  return(
    <div className="bg-gray-100 flex flex-col items-center p-4 min-h-screen ">
      <AppNavbar projectId={projectId} />
      <main className="flex-1 w-full max-w-7xl mt-4">
        {children}
      </main>
    </div>
  );
}