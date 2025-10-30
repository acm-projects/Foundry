import { Panel } from "@xyflow/react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";
import axios from 'axios'

const nameRegex = /^[a-zA-Z0-9_-]+$/;

const schema = z.object({
  name: z.string().min(1, "Required").max(255).regex(nameRegex, "Only letters, numbers, hyphens, and underscores."),
  instanceType: z.string().min(1, "Select an instance type"),
  imageID: z.enum(["Ubuntu", "Amazon Linux", "Windows"], { required_error: "Select an image" }),
});

export default function EC2PanelForm({ id, onClose, onDelete,label,repos}) {


const storageKey = `${id}`;

console.log("reps",repos)

const {setNodes,getNode} = useReactFlow();

const defaultValues =  {
  name: "web-01",
  instanceType: "t3.micro",
  imageID: "Ubuntu"
};

const {register, handleSubmit,control,formState: { errors },} = useForm({resolver: zodResolver(schema),defaultValues, mode: "onSubmit",});
//handleSubmit is the validation function, the real submit function is the one below 
const submit = (values) => {
  const label = id.slice(0,3)
  const payload = {
    label: label,
    name: values.name,
    instanceType: values.instanceType,
    imageID: values.imageID
  }
  
  console.log("EC2 Config:", payload);

  // Update node data in React Flow
  setNodes((nodes) =>
    nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, ...payload } } : node
    )
  );

  onClose();
};

useEffect(() => {
  const node = getNode(id);
  console.log("Node here:", node);
}, []); //make a better dependacy to get name 







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
<h2 className="text-sm font-semibold text-gray-900">EC2 Instance</h2>
<p className="text-xs text-gray-500">{id}</p>
<p className="text-xs text-gray-500">Compute</p>
</div>
</div>

<div className="h-px w-full bg-gray-200" />

<div className="flex-1 overflow-y-auto space-y-3 p-3 text-xs">
<div className="rounded-lg bg-gray-50 p-2">
<h3 className="font-semibold text-gray-800">Service Configuration</h3>
<p className="mt-0.5 text-gray-500">Configure your EC2 instance with required parameters.</p>
</div>

<form className="space-y-3" onSubmit={handleSubmit(submit)} noValidate>
<div>
  <label className="font-medium text-gray-800">Name <span className="text-red-500">*</span></label>
  <input
    {...register("name")}
    placeholder="web-01"
    className="w-full rounded-lg border mt-1 border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
  />
  {errors.name && (
    <p className="text-red-600 text-[10px] mt-1">{errors.name.message}</p>
  )}
</div>

<div>
  <label className="font-medium text-gray-800">Image ID <span className="text-red-500">*</span></label>
  <Controller
    control={control}
    name="imageID"
    render={({ field }) => (
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger className="w-full mt-1 rounded-lg border bg-gray-200 px-2 py-1.5 text-xs text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
          <SelectValue placeholder="Select OS" />
        </SelectTrigger>
        <SelectContent className="bg-gray-200 rounded-lg shadow-lg">
          <SelectItem value="Ubuntu">Ubuntu</SelectItem>
          <SelectItem value="Amazon Linux">Amazon Linux</SelectItem>
          <SelectItem value="Windows">Windows</SelectItem>
        </SelectContent>
      </Select>
    )}
  />
  {errors.imageID && <p className="text-red-600 text-[10px] mt-1">{errors.imageID.message}</p>}
</div>

<div>
  <label className="font-medium text-gray-800">Instance Type <span className="text-red-500">*</span></label>
  <Controller
    control={control}
    name="instanceType"
    render={({ field }) => (
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger className="w-full mt-1 rounded-lg border bg-gray-200 px-2 py-1.5 text-xs text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="max-h-48 overflow-y-auto bg-gray-200 rounded-lg shadow-lg">
          <SelectItem value="t3.micro">t3.micro</SelectItem>
          <SelectItem value="t3.small">t3.small</SelectItem>
          <SelectItem value="c7i-flex.large">c7i-flex.large</SelectItem>
          <SelectItem value="m7i-flex.large">m7i-flex.large</SelectItem>
        </SelectContent>
      </Select>
    )}
  />
  {errors.instanceType && <p className="text-red-600 text-[10px] mt-1">{errors.instanceType.message}</p>}
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
);
}

