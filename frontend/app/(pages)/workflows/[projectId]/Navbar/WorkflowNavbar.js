"use client";
import { User,Cloud } from "lucide-react";
import { usePathname } from "next/navigation";
import { Monitor, DollarSign, FileText, Settings } from "lucide-react";
import {useState} from 'react'

import UserProfile from "./userProfile";
import Link from "next/link";
import Live from "../canvas/Deployment/live";

export default function WorkflowNavbar() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const projectId = pathSegments[2];
  const path = usePathname()
const[user,setUser] = useState(false)
  const tabs = [
    {
      name: "Canvas",
      icon: Monitor,
      href: `/workflows/${projectId}/canvas`,
    },
    {
      name: "Costs",
      icon: DollarSign,
      href: `/workflows/${projectId}/costs`,
    },
    {
      name: "Logs",
      icon: FileText,
      href: `/workflows/${projectId}/logs`,
    },
    {
      name: "Settings",
      icon: Settings,
      href: `/workflows/${projectId}/settings`,
    },
  ];

  return (

    <div className="relative w-full justify-center">
    <div className="flex items-center justify-between pt-5 px-4 sm:px-6 lg:px-8">
      <div className="">
        
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 shadow-sm">
          <Link href='/workflows'>
            <Cloud className="w-5 h-5 text-white" />
            </Link>
            <h1 className = "absolute  text-gray-700 left-25 text-2xl font-bold">Project Name</h1>
            <div className = "absolute left-65"> 
            <Live/>
            </div>
            
          </div>

      </div>
      
      
      <div className = "flex flex-col sm:flex-row bg-white  p-2 shadow-xl rounded-2xl border justify-center border-gray-100 sm:space-x-2 w-fit">
      {tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = pathname.startsWith(tab.href);

      return (
        <div>

        <Link
          key={tab.name}
          href={tab.href}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium
            ${
              isActive
                ? "bg-gray-100 text-gray-900 shadow"
                : "text-gray-500 hover:bg-gray-50"
            }
          `}
        >
          <Icon className="w-5 h-5" />
         
          <span>{tab.name}</span>
          
        </Link>
        </div>
      );
    })}
  
  </div>
      <UserProfile />
   
    </div>
  
  </div>




      

  


 




  );
}


