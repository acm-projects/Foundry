import React from 'react'
import {Clock} from "lucide-react";

export default function InfraLog() {


return (<div> 

<div className=" flex justify-center flex-col pt-4 ">

<div className = 'flex justify-center'> 
<div className=" w-7/8 p-6 border border-gray-200 rounded-lg 
transition-all duration-200 
hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 ">
<div className="flex items-start justify-between">

<div className="flex items-start gap-3 w-7/8">
    
    


    <div className="w-7/8">

    <div className="flex flex-wrap items-center gap-2">
        
        
    

        <span className="text-base font-semibold text-gray-900">
        EC2 Instance
        </span>

    </div>


  

    <div className="mt-4 rounded-xl bg-gray-100  w-7/8 ">
        <p className="mb-2 font-semibold text-gray-800">Changes:</p>
        <div className="list-disc space-y-1  text-gray-700">
        <p>Instance Type: t3.micro → t3.small</p>
        <p>Security Group: default → web-sg-001</p>
        <p>Key Pair: dev-key → prod-key</p>
        </div>
       


    </div>
    </div>
    </div>
</div>


</div>
</div>
</div>



</div>)
}