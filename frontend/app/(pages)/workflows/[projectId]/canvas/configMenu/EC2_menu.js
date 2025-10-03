import {Panel} from '@xyflow/react'
import { Settings } from 'lucide-react'
import {useState,useEffect} from "react"
import { UserInput } from '../functions/UserServiceInput'


export default function EC2_menu({ id }) { 

  const[amiId,setAmiId] = useState("")
  const[keyPair,setKeyPair] = useState("")
  const[instanceType,setInstanceType] = useState("")
  const[securityGroup,setSecurityGroup] = useState("")
  const[subnetVPC,setSubnetVPC] = useState("")

  const storageKey = `${id}`;


  useEffect(() => {
 
      const local = localStorage.getItem(storageKey);

      


   
   
      const saved = JSON.parse(local) || {};
      setAmiId(saved.amiId || "");
      setKeyPair(saved.keyPair || "");
      setInstanceType(saved.instanceType || "");
      setSecurityGroup(saved.securityGroup || "");
      setSubnetVPC(saved.subnetVPC || "");
  
  }, [storageKey]);




  const save = () => {
    const payload = { amiId, keyPair, instanceType, securityGroup, subnetVPC };
    if(amiId.length != 0 && keyPair.length != 0  && instanceType.length != 0 && securityGroup.length != 0 && subnetVPC.length != 0 ) { 
      localStorage.setItem(storageKey, JSON.stringify(payload));
      
UserInput(storageKey,payload)

          return;
    
    }
     alert("please fill in all fields")
     localStorage.setItem(storageKey, JSON.stringify(payload));
   
   return;
  };

  

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
        <h2 className="text-sm font-semibold text-gray-900">EC2 Instance</h2>
        <p className="text-xs text-gray-500">{id}</p>
        <p className="text-xs text-gray-500">Compute</p>
    
      </div>
      
    </div>

    <div className="h-px w-full bg-gray-200" />

    <div className="flex-1 overflow-y-auto space-y-3 p-3 text-xs">
      <div className="rounded-lg bg-gray-50 p-2">
        <h3 className="font-semibold text-gray-800">Service Configuration</h3>
        <p className="mt-0.5 text-gray-500">Configure your EC2 with required parameters.</p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800">Required Fields</h4>
        <p className="text-gray-500">Fields with * required</p>
      </div>

      <form className="space-y-2">

          <span className="font-medium text-gray-800">AMI ID *</span>
          <input value = {amiId} onChange = {(e) =>{ setAmiId(e.target.value) }}  placeholder="ami-012..." className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
   


          <span className="font-medium text-gray-800">Instance Type</span>
          <div className="relative mt-1">
            <select value = {instanceType} onChange = {(e) => setInstanceType(e.target.value)}className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 pr-6 text-xs text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" defaultValue="">
              <option value="" disabled>Select type</option>
              <option>t2.micro</option>
              <option>t3.small</option>
              <option>m5.large</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>
     

          <span className="font-medium text-gray-800">Key Pair *</span>
          <input value = {keyPair} onChange = {(e) => setKeyPair(e.target.value)} placeholder="my-key-pair" className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
  

   
          <span className="font-medium text-gray-800">Security Group *</span>
          <input value = {securityGroup} onChange = {(e) => setSecurityGroup(e.target.value)} placeholder="sg-012..." className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
 

       
          <span className="font-medium text-gray-800">Subnet/VPC *</span>
          <input value = {subnetVPC} onChange = {(e) => setSubnetVPC(e.target.value)} placeholder="subnet-012..." className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" />
   
      </form>
    </div>

    <div className="h-px w-full " />

    <div className="sticky rounded-lg bottom-0 flex items-center justify-between gap-2 p-2 bg-white border-t border-gray-200">
      <button className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700">
        
        Delete
      </button>
      <div className="flex items-center gap-2">
        <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Close</button>
        <button onClick={save}
  className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-orange-700">Save</button>
      </div>
    </div>
  </aside>
</Panel>

    )
}