import {Panel} from '@xyflow/react'
import { Settings } from 'lucide-react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReactFlow } from "@xyflow/react";

const nameRegex = /^[a-z0-9-]+$/;

const schema = z.object({
  bucketName: z.string().min(3, "Minimum 3 characters").max(63, "Maximum 63 characters").regex(nameRegex, "Only lowercase letters, numbers, and hyphens.")
});

export default function S3_menu({id,onClose,onDelete}) { 

const storageKey = `${id}`;
const {setNodes} = useReactFlow();

const defaultValues = {bucketName: "my-app-bucket"}

const {register, handleSubmit, formState: { errors }} = useForm({
  resolver: zodResolver(schema),
  defaultValues, 
  mode: "onSubmit"
});

const submit = (values) => {
  const label = id.slice(0,2)
  const payload = {
    label: label,
    bucketName: values.bucketName
  }

  console.log("S3 Config:", payload);

  // Update node data in React Flow
  setNodes((nodes) =>
    nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, ...payload } } : node
    )
  );

  onClose();
};
  


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

<form className="space-y-2" onSubmit={handleSubmit(submit)} noValidate>
<div>
  <label className="font-medium text-gray-800">Bucket Name <span className="text-red-500">*</span></label>
  <input
    {...register("bucketName")}
    placeholder="my-app-bucket"
    className="w-full rounded-lg border mt-1 border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
  />
  {errors.bucketName && (
    <p className="text-red-600 text-[10px] mt-1">{errors.bucketName.message}</p>
  )}
  <p className="text-gray-500 text-[10px] mt-1">Must be globally unique (3-63 chars, lowercase, numbers, hyphens)</p>
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
<button onClick={() => handleSubmit(submit)()} className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-orange-700">Save</button>
</div>
</div>
</aside>
</Panel>
    


    )
}


