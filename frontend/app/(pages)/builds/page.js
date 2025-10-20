"use client";
import {React,useState} from 'react'
import { GitBranch, Plus,Cloud } from "lucide-react";
import Link from 'next/link';
import UserProfile from './[projectId]/Navbar/userProfile';
import WorkflowGrid from '@/app/components/WorkflowGrid';
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardTitle} from '@/app/components/ui/card'

export default function Builds({id}) { 
const[user,setUser] = useState(false)

return (
  <div className="bg-gray-100 relative min-h-screen">
  <div className="flex items-center justify-between pt-5 px-4 sm:px-6 lg:px-8">
    <div className="pl-0">
      <Link href='/builds'>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 shadow-sm">
          <Cloud className="w-5 h-5 text-white" />
        </div>
      </Link>
    </div>
    <Input placeholder="Search" className = "min-w-xl flex ml-10 flex-col sm:flex-row bg-gray-50 p-2 shadow-l rounded-2xl border border-gray-200 sm:space-x-2 w-fit"/>
    <UserProfile />
  </div>
  <main className="flex items-center justify-center mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 pt-5 pb-16">
    <div className="flex flex-col gap-6 sm:gap-8 items-start justify-between">
      <div className="mt-6 sm:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <Link href='/builds/${id}/canvas'>
          <Card className="group flex flex-col justify-center items-center flex-1 min-w-88 max-w-88 flex-grow min-h-60 bg-grey-100 shadow-none border-dashed border-2 rounded-2xl  hover:cursor-pointer  border-gray-300  bg-gray-100 delay-50 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300">
            <CardContent className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-center text-black">Create New Build</CardTitle>
              <CardDescription className="text-center">Start building your AWS infrastructure with drag-and-drop services</CardDescription>
            </CardContent>
          </Card>
        </Link>
          <WorkflowGrid/>
        </div>
      </div>
    </div>

    
  </main>
</div>

)
}
