import {Panel} from '@xyflow/react'
import { Settings } from 'lucide-react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReactFlow } from "@xyflow/react";
import { useState, useEffect } from 'react';
import axios from 'axios'
import { usePathname } from 'next/navigation';

const nameRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

const schema = z.object({
  bucketName: z.string()
    .min(3, "Minimum 3 characters")
    .max(63, "Maximum 63 characters")
    .regex(nameRegex, "Must start and end with letter/number. Only lowercase letters, numbers, and hyphens.")
    .refine(val => !val.includes('..'), "Cannot contain consecutive periods")
    .refine(val => !val.startsWith('-'), "Cannot start with hyphen")
    .refine(val => !val.endsWith('-'), "Cannot end with hyphen")
});

export default function S3_menu({id,onClose,onDelete}) { 

const storageKey = `${id}`;
const {setNodes, getNode} = useReactFlow();

const existingNode = getNode(id);
const existingData = existingNode?.data || {};

const [isConfigSaved, setIsConfigSaved] = useState(existingData.isConfigSaved || false);
const [selectedFile, setSelectedFile] = useState(null);

const build_id = usePathname().split("/")[2];

const defaultValues = {bucketName: existingData.bucketName || "my-app-bucket"}

const {register, handleSubmit, formState: { errors }, getValues} = useForm({
  resolver: zodResolver(schema),
  defaultValues, 
  mode: "onSubmit"
});




const submit = (values) => {
  const label = id.split(':')[0]
  const payload = {
    label: label,
    bucketName: values.bucketName,
    isConfigSaved: true, 
  }

  console.log("S3 Config:", payload);

  setNodes((nodes) =>
    nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, ...payload } } : node
    )
  );

  setIsConfigSaved(true);
};

const uploadRepositories = async () => {
  if (selectedFile) {

  console.log("selected",selectedFile)
    try  { 
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("bucket_name", getValues("bucketName"));
      formData.append("node_id", id);

      
const response = await axios.post("http://localhost:8000/canvas/s3/upload", formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

console.log("response",response)

onClose(storageKey);
    }
    catch(err) {
      console.log("error",err)
    }
    
   

   

  
  } else {
    alert("Please select a file to upload.");
  }
};

const handlePrimaryAction = (values) => {
  if (!isConfigSaved) {
    handleSubmit(submit)(values);
    onClose(storageKey);
  } else {
    uploadRepositories();
  }
};

useEffect(() => {
  setIsConfigSaved(existingData.isConfigSaved || false);
}, [existingData.isConfigSaved]);


const isBucketNameDisabled = isConfigSaved;
const fileInputContainerClassName = `w-full rounded-lg border mt-1 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${
  !isConfigSaved
    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
    : 'border-gray-200 bg-white'
}`;

const bucketInputClassName = `w-full rounded-lg border mt-1 border-gray-200 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 ${
  isBucketNameDisabled 
    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
    : 'bg-white'
}`;


    return (

      <Panel
position="top-right"
style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }}
>
<aside className=" w-75 z-50 flex h-120 flex-col rounded-lg border border-gray-200 bg-white shadow-lg">
<div className="flex items-start gap-2 p-3">
<div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-orange-100">
<Settings className="text-orange-500" />
</div>
<div className="flex-1">
<h2 className="text-sm font-semibold text-gray-900">S3 bucket</h2>
<p className="text-xs text-gray-500">{id}</p>
<p className="text-xs text-gray-500">Compute</p>
</div>
</div>

<div className="h-px w-full bg-gray-200" />

<div className="flex-1 overflow-y-auto space-y-3 p-3 text-xs">
<div className="rounded-lg bg-gray-50 p-2">
<h3 className="font-semibold text-gray-800">Service Configuration</h3>
<p className="mt-0.5 text-gray-500">Configure your S3 bucket with a unique name.</p>
</div>

<form className="space-y-2" onSubmit={(e) => { e.preventDefault(); handlePrimaryAction(getValues()); }} noValidate>
<div>
  <label className="font-medium text-gray-800">Bucket Name <span className="text-red-500">*</span></label>
  <input
    {...register("bucketName")}
    placeholder="my-app-bucket"
    disabled={isBucketNameDisabled}
    className={bucketInputClassName}
  />
  {errors.bucketName && (
    <p className="text-red-600 text-[10px]">{errors.bucketName.message}</p>
  )}
</div>
   <label className="font-medium text-gray-800">File</label>
   <div className={fileInputContainerClassName}>
  <input type ="file"
    onChange={(e) => setSelectedFile(e.target.files[0])}
    disabled={!isConfigSaved}
    className="w-full text-xs text-gray-800 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
  />
  </div>
 
 

</form>
</div>

<div className="h-px w-full " />

<div className="sticky rounded-lg flex items-center justify-between gap-2 p-2 bg-white border-t border-gray-200">
<button onClick={() => {onDelete(storageKey);
onClose(storageKey);
}}
className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
>
Delete
</button>
<div className="flex items-center gap-2">
<button onClick={onClose} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Close</button>
<button 
  onClick={() => handlePrimaryAction(getValues())} 
  className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-orange-700"
>
{isConfigSaved ? "Upload file" : "Save"}
</button>
</div>
</div>
</aside>
</Panel>
    


    )
}




