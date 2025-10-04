"use client";
import {Clock, Activity } from "lucide-react";
import Switch from "./logSwitch";
import LogPanel from "./logPanel";
import axios from "axios";
import {useState,useEffect} from "react"

export default function ActivityLogging({params}) {
  
    const[empty,setEmpty] = useState(false)
    const [selected, setSelected] = useState('activity');

//improve empty logic kinda messed up
    useEffect(() => { 

        
    
    })
  return (

<div>

<div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Activity Logging</h1>
      </div>
      <p className="text-gray-500 mb-4">
        Track all changes and activities across your workflows
      </p>
<Switch selected={selected} onChange={setSelected}/>


{!empty  ? 
selected == 'activity' ? <LogPanel/> : <LogPanel/>
 
 
  :  
 <div className="p-6">
 <div className=" rounded-xl p-16 flex flex-col items-center justify-center text-center text-gray-500">
   <Activity className="w-15 h-15 mb-3" />
   <p className=" text-black font-bold">No activity has happened</p>
   <p className="text-sm mt-1">
     Activities will appear here as team members create, edit, and manage workflows
   </p>
 </div>
</div>


  
}





    </div>
  );
}
