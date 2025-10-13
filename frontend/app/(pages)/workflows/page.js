"use client";
import {React,useState} from 'react'
import { GitBranch, Plus } from "lucide-react";
import NavBar from '../../components/navbar'
import Link from 'next/link';
import UserProfile from './[projectId]/Navbar/userProfile';
import WorkflowGrid from '@/app/components/WorkflowGrid';

export default function Workflows({id}) { 
const[user,setUser] = useState(false)

return (
  <div className=" bg-gray-100 relative">
  <div className="absolute right-10 top-12 -translate-y-1/2">
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
       
        <WorkflowGrid/>
      </div>
      
    </Link>
  
  </main>

</div>

)
}
