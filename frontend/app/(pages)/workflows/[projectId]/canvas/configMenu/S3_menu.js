import {Panel} from '@xyflow/react'
import { Settings } from 'lucide-react'
import {useState,useEffect} from 'react'
import { UserInput } from '../Deployment/UserServiceInput'
export default function S3_menu({id,onClose,onDelete}) { 

const[region,setRegion] = useState("")
const[bucketName,setBucketName] = useState("")
const[displayName,setDisplayName] = useState("")
const storageKey = `${id}`;
useEffect(() => {
    const local = localStorage.getItem(storageKey);
    const saved = JSON.parse(local) || {};
    setRegion(saved.region || "");
    setBucketName(saved.bucketName || "");
    setDisplayName(saved.displayName || "")
},[storageKey])


const save = () => {
  const payload = { region, bucketName, displayName};


if(region.length != 0 && bucketName.length != 0 && displayName.length != 0) { 
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
  style={{ top: '15%', transform: 'translateY(-50%)' }}
>
  <aside className="fixed right-4  z-50 w-[min(92vw,210px)] md:w-[min(90vw,220px)] max-h-[75vh] flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg">
    <div className="flex items-start gap-2 p-3">
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-orange-100">
       <Settings className = "text-orange-500"/>
      </div>
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-gray-900">S3</h2>
        <p className="text-xs text-gray-500">{id}</p>
        <p className="text-xs text-gray-500">Compute</p>
      </div>
    
    </div>

    <div className="h-px w-full bg-gray-200" />

    <div className="flex-1 overflow-y-auto space-y-3 p-3 text-xs">
      <div className="rounded-lg bg-gray-50 p-2">
        <h3 className="font-semibold text-gray-800">Service Configuration</h3>
        <p className="mt-0.5 text-gray-500">Configure your S3 Bucket 1 instance with the required parameters.</p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800">Required Fields</h4>
        <p className="text-gray-500">Fields with * required</p>
      </div>

      <form className="space-y-2">
 
          <span className="font-medium text-gray-800">Bucket name</span>
          <input value = {bucketName} onChange = {(e) => setBucketName(e.target.value)} placeholder="my-s3-bucket" className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
       


          <span className="font-medium text-gray-800">Region</span>
          <div className="relative mt-1">
            <select value = {region} onChange = {(e) => setRegion(e.target.value)} className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 pr-6 text-xs text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" defaultValue="">
              <option value="" disabled>Select type</option>
              <option>us-east-1</option>
              <option>us-west-2</option>
              <option>eu-west-1</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>


      
          <span className="font-medium text-gray-800">Display name</span>
          <input value = {displayName} onChange = {(e) => setDisplayName(e.target.value)} type="text" placeholder="my S3 bucket" className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
 

       
      </form>
    </div>

    <div className="h-px w-full " />

    <div className="sticky rounded-lg bottom-0 flex items-center justify-between gap-2 p-2 bg-white border-t border-gray-200">
      <button onClick = {() => {onDelete(storageKey)
        onClose(storageKey)}
      } className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700">
        
        Delete
      </button>
      <div className="flex items-center gap-2">
        <button onClick = {onClose} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Close</button>
        <button  onClick = {save} className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-orange-700">Save</button>
      </div>
    </div>
  </aside>
</Panel>

    )
}