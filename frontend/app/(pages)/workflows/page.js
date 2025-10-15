"use client";
import {React,useState} from 'react'
import { GitBranch, Plus,Cloud } from "lucide-react";
import Link from 'next/link';
import UserProfile from './[projectId]/Navbar/userProfile';
import WorkflowGrid from '@/app/components/WorkflowGrid';
import { Input } from '@/app/components/ui/input'

export default function Workflows({id}) { 
const[user,setUser] = useState(false)

return (
  <div className="bg-gray-100 relative min-h-screen">
  <div className="flex items-center justify-between pt-5 px-4 sm:px-6 lg:px-8">
    <div className="pl-0">
      <Link href='/workflows'>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 shadow-sm">
          <Cloud className="w-5 h-5 text-white" />
        </div>
      </Link>
    </div>
    <Input placeholder="Search" className = "min-w-xl flex ml-10 flex-col sm:flex-row bg-white p-2 shadow-l rounded-2xl border border-gray-200 sm:space-x-2 w-fit"/>
    <UserProfile />
  </div>
  <main className="flex items-center justify-center mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 pt-5 pb-16">
    <div className="flex flex-col gap-6 sm:gap-8 items-start justify-between">
      <div className="mt-6 sm:mt-8">
        <WorkflowGrid/>
      </div>
    </div>

    
  </main>
</div>

)
}
