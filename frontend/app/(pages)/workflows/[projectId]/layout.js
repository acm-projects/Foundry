import AppNavbar from "../../../components/WorkflowNavbar";
import React from 'react';

export default function WorkflowsLayout({ children, params }){
  const { projectId } = params;

  return(
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <AppNavbar projectId={projectId} />
      <main className="flex-1 w-full max-w-7xl mt-4">
        {children}
      </main>
    </div>
  );
}