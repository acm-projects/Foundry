"use client";
import { User,Cloud } from "lucide-react";
import { usePathname } from "next/navigation";
import { Monitor, DollarSign, FileText, Settings } from "lucide-react";
import {useState, useEffect, useCallback} from 'react' // Import necessary hooks

import UserProfile from "./userProfile";
import Link from "next/link";
import Live from "../canvas/Deployment/live";



export default function WorkflowNavbar() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const projectId = pathSegments[2];
  const path = usePathname()
const[user,setUser] = useState(false)

const projectName = ""
const [inputValue, setInputValue] = useState(projectName.length === 0 ? "untitled" : projectName);  
const [isEditing, setIsEditing] = useState(false)

  const tabs = [
    // ... (tabs array remains the same)
    { name: "Canvas", icon: Monitor, href: `/builds/${projectId}/canvas`, },
    { name: "Costs", icon: DollarSign, href: `/builds/${projectId}/costs`, },
    { name: "Logs", icon: FileText, href: `/builds/${projectId}/logs`, },
    { name: "Settings", icon: Settings, href: `/builds/${projectId}/settings`, },
  ];

  // --- Title Rendering Logic ---
  const TitleComponent = isEditing ? (
    // Render Input field when editing
    <input
      type="text"
      className="text-2xl font-bold p-1 border-b-2 border-orange-500 bg-transparent outline-none text-gray-700 w-full min-w-[120px]"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleSave} // Save when focus is lost
      onKeyDown={handleKeyDown}
      maxLength={20}
      autoFocus // Focus automatically when it appears
    />
  ) : (
    // Render static H1 when not editing
    <h1 
      className="text-2xl font-bold text-gray-700 cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors w-full truncate"
      onClick={() => setIsEditing(true)}
      title="Click to rename"
    >
      {projectName.length === 0 ? "untitled" : projectName}
    </h1>
  );
  // -----------------------------


  return (
    <div className="relative w-full justify-center">
      <div className="flex items-center justify-between pt-5 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4"> 
          
          {/* Logo/Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 shadow-sm mr-3">
              <Link href='/builds'>
                <Cloud className="w-5 h-5 text-white" />
              </Link>
          </div>

          {/* Dynamic Title Component */}
          <div className="flex items-center max-w-xs sm:max-w-sm">
            {TitleComponent}
          </div>

          {/* Live Status */}
          <div className="pt-1">
            <Live/>
          </div>
            
        </div>
        
        {/* Navigation Tabs */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-5">
          <div className="flex flex-col sm:flex-row bg-white p-2 shadow-xl rounded-2xl border justify-center border-gray-100 sm:space-x-2 w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname.startsWith(tab.href);

              return (
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
              );
            })}
          </div>
        </div>
       
        
        <UserProfile />
      </div>
    </div>
  );
}