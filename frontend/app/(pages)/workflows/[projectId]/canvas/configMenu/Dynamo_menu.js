
import {Panel} from '@xyflow/react'
import { Settings } from 'lucide-react'
import {useState,useEffect} from "react"
import { UserInput } from '../Deployment/UserServiceInput'
export default function DynamoDB_menu({id,onClose,onDelete}) { 

  const[tableName,setTableName] = useState("")
  const[partitionKey,setPartitionKey] = useState("")
  const[sortKey,setSortKey] = useState("")
  const[billingMode,setBillingMode] = useState("")

  const storageKey = `${id}`;

  useEffect(() => {
      const local = localStorage.getItem(storageKey);
   
      const saved = JSON.parse(local) || {};
      setTableName(saved.tableName || "");
      setPartitionKey(saved.partitionKey || "");
      setSortKey(saved.sortKey || "");
      setBillingMode(saved.billingMode || "");
  }
  , [storageKey]);
  const save = () => {
    const payload = { tableName, partitionKey, sortKey, billingMode };


if(tableName.length != 0 && partitionKey.length != 0 && sortKey.length != 0 && billingMode.length != 0) { 
  localStorage.setItem(storageKey, JSON.stringify(payload));
UserInput(storageKey,payload)
onClose()
return;
}

alert("fill missing input fields")
return;

  }
 
    return (

<Panel
  position="top-right"
  style={{ top: '10%', transform: 'translateY(-50%)' }}
>
  <aside className="fixed right-4 w-75 z-50 h-120 flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg">
    <div className="flex items-start gap-2 p-3">


      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-orange-100">
       <Settings className = "text-orange-500"/>
       </div>
     
      
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-gray-900">DynamoDB</h2>
        
   
        <p className="text-xs text-gray-500">{id}</p>
        <p className="text-xs text-gray-500">Compute</p>
      </div>
    
    </div>

    <div className="h-px w-full bg-gray-200" />

    <div className="flex-1 overflow-y-auto space-y-3 p-3 text-xs">
      <div className="rounded-lg bg-gray-50 p-2">
        <h3 className="font-semibold text-gray-800">Service Configuration</h3>
        <p className="mt-0.5 text-gray-500">Configure your DynamoDB Table instance with the required parameters.</p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800">Required Fields</h4>
        <p className="text-gray-500">Fields with * required</p>
      </div>

      <form className="space-y-2">
        
          <span className="font-medium text-gray-800">Table name <span className = 'text-red-500'>*</span></span>
          <input value = {tableName} onChange = {(e) => setTableName(e.target.value) } placeholder="my-dynamoDB-table..." className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
     <span className="font-medium text-gray-800">Partition key</span>
          <div className="relative mt-1">
          <input value = {partitionKey} onChange = {(e) => setPartitionKey(e.target.value)} placeholder="id" className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
          </div>

          <span className="font-medium text-gray-800">Sort key (optional)</span>
          <input value = {sortKey} onChange = {(e) => setSortKey(e.target.value)} placeholder="timestamp" className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
  
<span className="font-medium text-gray-800">Billing Mode</span>
<select value = {billingMode} onChange = {(e) => setBillingMode(e.target.value)} className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 pr-6 text-xs text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" defaultValue="">
              <option value="" disabled>Select type</option>
              <option>Pay per request</option>
              <option >Provisioned</option>

              </select>
      </form>
    </div>

    <div className="h-px w-full " />

    <div className="sticky rounded-lg bottom-0 flex items-center justify-between gap-2 p-2 bg-white border-t border-gray-200">
      <button onClick = {() => {onDelete(storageKey)
        onClose(storageKey)
      }} className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700">
        
        Delete
      </button>
      <div className="flex items-center gap-2">
        <button onClick = {onClose} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Close</button>
        <button onClick = {save} className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-orange-700">Save</button>
      </div>
    </div>
  </aside>
</Panel>

    )
}