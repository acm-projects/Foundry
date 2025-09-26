import React from 'react'
import { GitBranch, Plus } from "lucide-react";
import NavBar from '../../components/navbar'
import Link from 'next/link';
export default function Workflows() { 



    return (<div className="min-h-screen bg-gray-50"> 
    <NavBar/>
      <main className="mx-auto max-w-6xl px-6 pt-8 pb-16">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">My Workflows</h1>
          </div>

          <p className="mt-2 text-gray-500">
            Manage and monitor your AWS infrastructure workflows
          </p>
      </div>
    <Link href = "/pages/canvas">
        <button 
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white 
                     bg-gradient-to-r from-orange-500 to-orange-600 shadow 
                     hover:from-orange-600 hover:to-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Workflow</span>
        </button>
        </Link>
      </div>

<Link href = "/pages/canvas">
      <div className="mt-8">
  <div
    className="w-[400px] h-[220px] rounded-2xl border-2 border-dashed border-orange-300 
               bg-white/80 flex flex-col items-center justify-center text-center px-10
               hover:border-orange-500 hover:bg-orange-50 hover:shadow-md
               transition-all duration-500"
  >

    <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-orange-500 to-orange-600 
                    flex items-center justify-center mb-4">
      <Plus className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" />
    </div>

    <div className="text-lg font-semibold text-gray-900 transition-colors duration-500 group-hover:text-orange-600">
      Create New Workflow
    </div>

    <p className="mt-2 text-gray-500 max-w-xs transition-colors duration-500 group-hover:text-orange-700">
      Start building your AWS infrastructure with drag-and-drop services
    </p>
  </div>
</div>
</Link>

    </main>


    

    </div>)
}