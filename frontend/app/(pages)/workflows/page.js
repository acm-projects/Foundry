"use client";
import {React,useState} from 'react'
import { GitBranch, Plus } from "lucide-react";
import NavBar from '../../components/navbar'
import Link from 'next/link';
import UserProfile from './[projectId]/Navbar/userProfile';

export default function Workflows({id}) { 
const[user,setUser] = useState(false)

return (
  <div className="min-h-screen bg-gray-100 relative">
  <div className="absolute top-6 right-6">
    <UserProfile />
  </div>

  <main className="mx-auto max-w-6xl px-6 pt-8 pb-16">
    <div className="flex flex-col gap-8 items-start justify-between">
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
    </div>

    <Link href={`workflows/${id}/canvas`}>
      <div className="mt-8">
        <div
          className="w-[400px] h-[220px] rounded-2xl border-2 border-dashed border-gray-300 
            bg-gray-100 flex flex-col items-center justify-center text-center px-10
            delay-50 p-3 transition-all duration-200 
            hover:shadow-lg hover:-translate-y-1 hover:border-gray-300"
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
</div>

)
}
