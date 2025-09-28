"use client";
import {Clock, Activity } from "lucide-react";


import axios from "axios";
import {useState,useEffect} from "react"

export default function ActivityLogging({params}) {
  
    const[empty,setEmpty] = useState(false)



    useEffect(() => { 

        //load user logs
    
    })
  return (

<div>



{empty ?  
 <div className="p-6">


   
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Activity Logging</h1>
      </div>
      <p className="text-gray-500 mb-8">
        Track all changes and activities across your workflows
      </p>

    
      <div className=" rounded-xl p-16 flex flex-col items-center justify-center text-center text-gray-500">
        <Activity className="w-15 h-15 mb-3" />
        <p className=" text-black font-bold">No activity has happened</p>
        <p className="text-sm mt-1">
          Activities will appear here as team members create, edit, and manage workflows
        </p>
      </div>
    </div> :  
    
  

    <div className=" flex justify-center flex-col pt-8 ">
  
    <div className=" pl-25 ">
     
      <div className="mb-6 flex items-center gap-x-6">
    
 

 
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Activity Logging
            </h1>
            <p className="text-sm text-gray-500">
              Track all changes and activities across your workflows
            </p>
          </div>
        </div>
      </div>
    </div>

{/* make .map function here */}

   <div className = 'flex justify-center'> 
    <div className=" w-7/8 p-6 border border-gray-200 rounded-lg 
    transition-all duration-200 
    hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 ">
      <div className="flex items-start justify-between">
    
        <div className="flex items-start gap-3 w-7/8">
         
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-gray-700">
            SC
          </div>

 
          <div className="w-7/8">
      
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold text-gray-900">
                Sarah Chen
              </span>
             
            
              <span className="text-gray-400">•</span>
              <span className="text-base font-semibold text-gray-900">
                EC2 Instance
              </span>

              <div className=" pl-3/4 ml-4 flex flex-shrink-0 items-center gap-1 text-sm text-gray-400">
          <Clock className="h-4 w-4 ml-auto" />
          5m ago
        </div>
            </div>

        
            <p className="mt-1 text-gray-600">
              Updated security group settings and instance type configuration
            </p>

        
            <p className="mt-2 text-sm text-gray-600">
              in{" "}
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                E-commerce Platform
             </span>
            </p>

<div className = ''>
   
            <div className="mt-4 rounded-xl bg-gray-100 p-4 w-7/8 ">
              <p className="mb-2 font-semibold text-gray-800">Changes:</p>
              <ul className="list-disc space-y-1 pl-5 text-gray-700">
                <li>Instance Type: t3.micro → t3.small</li>
                <li>Security Group: default → web-sg-001</li>
                <li>Key Pair: dev-key → prod-key</li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Service:</span>{" "}
                <span className="tracking-wider">EC2&nbsp;Web&nbsp;Server&nbsp;1</span>
              </p>
      
            </div>
          </div>
          </div>
          </div>
        </div>

        
     
      </div>
    </div>
  </div>
}
    </div>
  );
}
