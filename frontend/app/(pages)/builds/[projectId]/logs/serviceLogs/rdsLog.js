import {Clock} from "lucide-react";
import { Line, LineChart,CartesianGrid,XAxis,YAxis,Tooltip,Legend } from "recharts";
export default function RDSlog() { 


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
            RDS Instance
          </span>
    
        
        </div>
    
    
      
    
    
    <h1 className = "text-gray-700">how many items a DynamoDB table contains and how much total storage<br/> space they use</h1>
      <input className = "mt-4" placeholder = "table name"/> 
    <div className="rounded-xl bg-gray-100 mt-3  flex justify-between items-start gap-6">
      <div className="flex-1">
    
        <div className="list-disc space-y-1  text-gray-700">
         
        <p>TimeStamp<span> - 2025-10-08T18:00:00Z</span></p>
      <p>Total objects - 11,000</p>
      <p>Number of bytes - 5000</p>
        </div>
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