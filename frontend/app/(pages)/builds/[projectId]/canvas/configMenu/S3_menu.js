import {Panel} from '@xyflow/react'
import { Settings } from 'lucide-react'
import { UserInput } from '../Deployment/UserServiceInput'
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


const nameRegex = /^[a-z0-9-]+$/;

const schema = z.object({BucketName: z.string().min(1, "Required").max(255).regex(nameRegex, "Only lowercase letters, numbers, and hyphens."),
Environment: z.string().min(1, "Select an environment"),
NoncurrentExpireDays: z.coerce.number().int().min(1, "Required").max(255),
});



export default function S3_menu({id,onClose,onDelete}) { 


const storageKey = `${id}`;

const defaultValues =  {BucketName: "my-app-bucket",Environment: "dev", NoncurrentExpireDays: 30}

const {register, handleSubmit,control,formState: { errors },} = useForm({resolver: zodResolver(schema),defaultValues, mode: "onSubmit",});
//handleSubmit is the validation function, the real submit function is the one below 
const submit = (values) => {
//where actual submit logic goes

const label = id.slice(0,2)
const betterFormatting = {
  label: label,
  BucketName: values.BucketName,
  Environment: values.Environment,
  NoncurrentExpireDays: values.NoncurrentExpireDays,
  
}

console.log("better", betterFormatting);



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
<p className="mt-0.5 text-gray-500">Configure your S3 Bucket 1 instance with the required parameters.</p>
</div>

<form className="space-y-2" onSubmit={handleSubmit(submit)} noValidate>
<span className="font-medium text-gray-800">BucketName</span>
<input
  {...register("BucketName")}
  placeholder="web-01..."
  className="w-full rounded-lg border mt-1 border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
/>
{errors.BucketName && (
  <p className="text-red-600 text-[10px]  -mt-1">{errors.BucketName.message}</p>
)}


<span className="font-medium text-gray-800">Environment</span>
<div className="relative mt-1">
<Controller
  control={control}
  name="Environment"
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange}>
      <SelectTrigger className="w-full rounded-lg border bg-gray-200 px-2 py-1.5 text-xs text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent className="max-h-28 overflow-y-auto bg-gray-200 rounded-lg shadow-lg">
        <SelectItem value="dev">dev</SelectItem>
        <SelectItem value="staging">staging</SelectItem>
        <SelectItem value="prod">prod</SelectItem>
      </SelectContent>
    </Select>
  )}
/>
</div>
{errors.Environment && <p className="text-red-600 text-[10px]  -mt-1">{errors.Environment.message}</p>}



<span className="font-medium text-gray-800">NoncurrentExpireDays</span>
<input
{...register("NoncurrentExpireDays")}
placeholder="30"
type="number" pattern="\d*"

className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
/>
{errors.NoncurrentExpireDays && <p className="text-red-600 text-[10px]  -mt-1">{errors.NoncurrentExpireDays.message}</p>}


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


