
import {Panel} from '@xyflow/react'
import { Settings } from 'lucide-react'
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useReactFlow } from "@xyflow/react"

const schema = z.object({
  dbName: z.string().min(1, "Required").max(63, "Maximum 63 characters"),
  engine: z.enum(["postgres", "mysql"], { required_error: "Select an engine" }),
  masterUsername: z.string().min(1, "Required").max(16, "Maximum 16 characters"),
  masterUserPassword: z.string().min(8, "Minimum 8 characters").max(128, "Maximum 128 characters")
})

export default function RDS_menu({id,onClose,onDelete}) { 

  const storageKey = `${id}`;
  const {setNodes, getNode} = useReactFlow();

  // Get existing node data if available
  const existingNode = getNode(id);
  const existingData = existingNode?.data || {};

  const defaultValues = {
    dbName: existingData.dbName || "mydatabase",
    engine: existingData.engine || "postgres",
    masterUsername: existingData.masterUsername || "dbadmin",
    masterUserPassword: existingData.masterUserPassword || ""
  }

  const {register, handleSubmit, control, formState: { errors }} = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit"
  });

  const submit = (values) => {
    // Extract the type from the node ID (e.g., "RDS:abc123" -> "RDS")
    const label = id.split(':')[0]
    const payload = {
      label: label,
      dbName: values.dbName,
      engine: values.engine,
      masterUsername: values.masterUsername,
      masterUserPassword: values.masterUserPassword
    }

    console.log("RDS Config:", payload);

    // Update node data in React Flow
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...payload } } : node
      )
    );

    onClose();
  }
 


    return (
    
<Panel
  position="top-right"
  style={{
    top: "50%",
    right: "10px",     
    transform: "translateY(-50%)",
  }}
>
  <aside className=" w-75 z-50 h-120 flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg">
    <div className="flex items-start gap-2 p-3">
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-orange-100">
       <Settings className = "text-orange-500"/>
      </div>
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-gray-900">RDS</h2>
        <p className="text-xs text-gray-500">{id}</p>
        <p className="text-xs text-gray-500">Compute</p>
      </div>
      
    </div>

    <div className="h-px w-full bg-gray-200" />

    <div className="flex-1 overflow-y-auto space-y-3 p-3 text-xs">
      <div className="rounded-lg bg-gray-50 p-2">
        <h3 className="font-semibold text-gray-800">Service Configuration</h3>
        <p className="mt-0.5 text-gray-500">Configure your RDS database with required parameters.</p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit(submit)} noValidate>
        <div>
          <label className="font-medium text-gray-800">Database Name <span className='text-red-500'>*</span></label>
          <input 
            {...register("dbName")} 
            placeholder="mydatabase" 
            className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" 
          />
          {errors.dbName && <p className="text-red-600 text-[10px] mt-1">{errors.dbName.message}</p>}
        </div>

        <div>
          <label className="font-medium text-gray-800">Database Engine <span className='text-red-500'>*</span></label>
          <Controller
            control={control}
            name="engine"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full mt-1 rounded-lg border bg-gray-200 px-2 py-1.5 text-xs text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                  <SelectValue placeholder="Select engine" />
                </SelectTrigger>
                <SelectContent className="bg-gray-200 rounded-lg shadow-lg">
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.engine && <p className="text-red-600 text-[10px] mt-1">{errors.engine.message}</p>}
        </div>

        <div>
          <label className="font-medium text-gray-800">Master Username <span className='text-red-500'>*</span></label>
          <input 
            {...register("masterUsername")} 
            placeholder="dbadmin" 
            className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" 
          />
          {errors.masterUsername && <p className="text-red-600 text-[10px] mt-1">{errors.masterUsername.message}</p>}
          <p className="text-gray-500 text-[10px] mt-1">Do not use "admin" (reserved word)</p>
        </div>

        <div>
          <label className="font-medium text-gray-800">Master Password <span className='text-red-500'>*</span></label>
          <input 
            {...register("masterUserPassword")} 
            type="password"
            placeholder="Enter secure password" 
            className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" 
          />
          {errors.masterUserPassword && <p className="text-red-600 text-[10px] mt-1">{errors.masterUserPassword.message}</p>}
          <p className="text-gray-500 text-[10px] mt-1">Must be 8-128 characters</p>
        </div>
      </form>
    </div>

    <div className="h-px w-full " />

    <div className="sticky rounded-lg flex items-center justify-between gap-2 p-2 bg-white border-t border-gray-200">
      <button onClick = {() => {onDelete(storageKey)
        onClose(storageKey)
      }} className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700">
        Delete
      </button>
      <div className="flex items-center gap-2">
        <button onClick = {onClose} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Close</button>
        <button onClick={() => handleSubmit(submit)()} className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-orange-700">Save</button>
      </div>
    </div>
  </aside>
</Panel>

    )
}