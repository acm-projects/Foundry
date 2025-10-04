"use client";
import {React,useState} from 'react'
import { GitBranch, Plus,User, X, LogOut } from "lucide-react";
import NavBar from '../../components/navbar'
import Link from 'next/link';
export default function Workflows({id}) { 


const[user,setUser] = useState(false)
    return (<div className="min-h-screen bg-gray-100"> 
 
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
      <button
        onClick={() => setUser(v => !v)}
        className=" rounded-xl shadow-md  border  delay-50 p-3 transition-all duration-200 
    hover:shadow-lg hover:-translate-y-1 hover:border-gray-300"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
            Y
          </div>
          <span className="text-sm text-gray-700">you@foundry.com</span>
          <span> </span>
        </div>
      </button>
 
      </div>

<Link href = {`workflows/${id}/canvas`}>
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
{user ? (
        <>
     
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40"
            onClick={() => setUser(false)}
          />

          
          <div
            className="fixed z-50 right-6 top-[72px] w-[360px] rounded-2xl shadow-2xl bg-gray-100 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
    
            <div className="flex items-center justify-between px-4 py-3 rounded-t-2xl bg-gray-100 border ">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-orange-900">Profile Menu</span>
              </div>
              <button
                aria-label="Close"
                onClick={() => setUser(false)}
                className="p-1 rounded    delay-50  transition-all duration-200 
    hover:shadow-lg hover:-translate-y-1 hover:border-gray-300"
              >
                <X className="w-5 h-5 text-orange-700 " />
              </button>
            </div>

            
            <div className="p-4">
            
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">You</div>
                  <div className="text-sm text-gray-500">you@foundry.com</div>
                </div>
              </div>

          
              <button
                className="mt-4 flex items-center gap-2 text-red-600 border rounded-xl   delay-50 p-3 transition-all duration-200 
    hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 px-2 py-2"
                
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button> 
            </div>
          </div>
        </>
      ) : null}

    </main>


    

    </div>)
}