import {Clock} from "lucide-react";
export default function EC2log() { 


    return (<div> 

<div className=" flex justify-center flex-col pt-4 ">
  
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
                grubby
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


   
            <div className="mt-4 rounded-xl bg-gray-100 p-4 w-7/8 ">
              <p className="mb-2 font-semibold text-gray-800">Changes:</p>
              <ul className="list-disc space-y-1 pl-5 text-gray-700">
                <li>Instance Type: t3.micro → t3.small</li>
                <li>Security Group: default → web-sg-001</li>
                <li>Key Pair: dev-key → prod-key</li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Service:</span>{" "}
                <span className="tracking-wider">EC2</span>
              </p>
      
    
          </div>
          </div>
          </div>
        </div>


      </div>
    </div>
  </div>



    </div>)
}