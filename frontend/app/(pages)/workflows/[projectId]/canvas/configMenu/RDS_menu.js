
import {Panel} from '@xyflow/react'
import { Settings } from 'lucide-react'

export default function RDS_menu() { 

    return (
    
<Panel
  position="top-right"
  style={{ top: '15%', transform: 'translateY(-50%)' }}
>
  <aside className="fixed right-4  z-50 w-[min(92vw,210px)] md:w-[min(90vw,220px)] max-h-[60vh] flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg">
    <div className="flex items-start gap-2 p-3">
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-orange-100">
       <Settings className = "text-orange-500"/>
      </div>
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-gray-900">RDS</h2>
        <p className="text-xs text-gray-500">Compute</p>
      </div>
      <button aria-label="Close" className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700">✕</button>
    </div>

    <div className="h-px w-full bg-gray-200" />

    <div className="flex-1 overflow-y-auto space-y-3 p-3 text-xs">
      <div className="rounded-lg bg-gray-50 p-2">
        <h3 className="font-semibold text-gray-800">Service Configuration</h3>
        <p className="mt-0.5 text-gray-500">Configure your RDS instance with the required parameters.</p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800">Required Fields</h4>
        <p className="text-gray-500">Fields with * required</p>
      </div>

      <form className="space-y-2">
        
          <span className="font-medium text-gray-800">Database engine <span className = 'text-red-500'>*</span></span>
          <select className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 pr-6 text-xs text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" defaultValue="">
              <option value="" disabled>Select type</option>
              <option>Postgre SQL</option>
         

              </select>
          
          
     
     <span className="font-medium text-gray-800">DB instance class</span>
     <select className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 pr-6 text-xs text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" defaultValue="">
              <option value="" disabled>Select type</option>
              <option>db.t3.micro</option>
              <option>db.t3.small</option>
              <option>db.m5.large</option>

              </select>
          

          <span className="font-medium text-gray-800">Storage (GB)</span>
          <input type="text" placeholder="number..." className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
  
<span className="font-medium text-gray-800">Master Username</span>
<input type="text" placeholder="admin" className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />

<span className="font-medium text-gray-800">Master Password</span>
<input type="text" placeholder="password" className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />

<span className="font-medium text-gray-800">VPC subnet group</span>
<input type="text" placeholder="default-subnet-group" className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />


        
      </form>
    </div>

    <div className="h-px w-full " />

    <div className="sticky rounded-lg bottom-0 flex items-center justify-between gap-2 p-2 bg-white border-t border-gray-200">
      <button className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700">
        
        Delete
      </button>
      <div className="flex items-center gap-2">
        <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Close</button>
        <button className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-orange-700">Save</button>
      </div>
    </div>
  </aside>
</Panel>

    )
}