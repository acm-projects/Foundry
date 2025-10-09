import {Clock} from "lucide-react";
import { Line, LineChart,CartesianGrid,XAxis,YAxis,Tooltip,Legend } from "recharts";
export default function EC2log() { 

return (<div> 

  <div>

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


    <p className="mt-1 text-gray-600">
      Updated security group settings and instance type configuration
    </p>


    <p className="mt-2 text-sm text-gray-600">
    in{" "}
    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
      E-commerce Platform
  </span>
  </p>

  
<div className="mt-4 rounded-xl bg-gray-100 p-4 flex justify-between items-start gap-6">
  <div className="flex-1">
    <ul className="list-disc space-y-1 pl-5 text-gray-700">
      <li>TimeStamp<span>: 2025-10-08T18:00:00Z</span></li>
      <li>Average: 37.45</li>
      <li>minimum: 28.67<span> maximum: 46.42</span></li>
      <li>period: 5min</li>
    </ul>
  </div>


</div>


   
   </div>   
   <div className="mt-15">
    <LineChart  width={300} height={200} data={[
      { name: 'a', pv: 120, uv: 200 },
      { name: 'b', pv: 250, uv: 300 },
    ]}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="pv" stroke="#8884d8" />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
  </div>    
          </div>
          </div>
        </div>


      </div>
    </div>
  </div>



    </div>)
}