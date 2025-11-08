import {Panel} from '@xyflow/react'
import { Settings } from 'lucide-react'
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useReactFlow } from "@xyflow/react"

const schema = z.object({
  tableName: z.string().min(3, "Minimum 3 characters").max(255, "Maximum 255 characters"),
  partitionKey: z.string().min(1, "Required"),
  partitionKeyType: z.enum(["S", "N"], { required_error: "Select a type" }),
  sortKey: z.string().optional().or(z.literal("")),
  sortKeyType: z.enum(["S", "N"]).optional()
})

export default function DynamoDB_menu({id,onClose,onDelete}) { 

  const {setNodes, getNode} = useReactFlow();

  // Get existing node data if available
  const existingNode = getNode(id);
  const existingData = existingNode?.data || {};

  const defaultValues = {
    tableName: existingData.tableName || "my-table",
    partitionKey: existingData.partitionKey || "id",
    partitionKeyType: existingData.partitionKeyType || "S",
    sortKey: existingData.sortKey || "",
    sortKeyType: existingData.sortKeyType || "S"
  }

  const {register, handleSubmit, control, formState: { errors }} = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit"
  });

  const submit = (values) => {
    try {
      // Extract the type from the node ID (e.g., "DynamoDB:abc123" -> "DynamoDB")
      const label = id.split(':')[0]
      const payload = {
        label: label,
        tableName: values.tableName,
        partitionKey: values.partitionKey,
        partitionKeyType: values.partitionKeyType,
        sortKey: values.sortKey || "",
        sortKeyType: values.sortKey ? values.sortKeyType : "S"
      }

      // Force React Flow to re-render by creating a completely new node object
      setNodes((nodes) => {
        const updatedNodes = nodes.map((node) => {
          if (node.id === id) {
            // Create completely new node object to force React Flow re-render
            const updatedNode = { 
              id: node.id,
              type: node.type,
              position: { ...node.position },
              data: { ...payload },  // Fresh data object
              // Don't copy over measured, selected, etc. - let React Flow recalculate
            }
            return updatedNode
          }
          return node
        })
        
        return updatedNodes
      });

      // Use setTimeout to ensure state update completes before closing
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error("ERROR in DynamoDB submit:", error)
      alert(`Error saving DynamoDB config: ${error.message}`)
    }
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

        <h2 className="text-sm font-semibold text-gray-900">DynamoDB </h2>


   
        <p className="text-xs text-gray-500">{id}</p>
        <p className="text-xs text-gray-500">Compute</p>
      </div>
    
    </div>

    <div className="h-px w-full bg-gray-200" />

    <div className="flex-1 overflow-y-auto space-y-3 p-3 text-xs">
      <div className="rounded-lg bg-gray-50 p-2">
        <h3 className="font-semibold text-gray-800">Service Configuration</h3>
        <p className="mt-0.5 text-gray-500">Configure your DynamoDB table with keys and types.</p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit(submit)} noValidate>
        <div>
          <label className="font-medium text-gray-800">Table Name <span className='text-red-500'>*</span></label>
          <input 
            {...register("tableName")} 
            placeholder="my-table" 
            className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" 
          />
          {errors.tableName && <p className="text-red-600 text-[10px] mt-1">{errors.tableName.message}</p>}
        </div>

        <div>
          <label className="font-medium text-gray-800">Partition Key <span className='text-red-500'>*</span></label>
          <input 
            {...register("partitionKey")} 
            placeholder="id" 
            className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" 
          />
          {errors.partitionKey && <p className="text-red-600 text-[10px] mt-1">{errors.partitionKey.message}</p>}
        </div>

        <div>
          <label className="font-medium text-gray-800">Partition Key Type <span className='text-red-500'>*</span></label>
          <Controller
            control={control}
            name="partitionKeyType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full mt-1 rounded-lg border bg-gray-200 px-2 py-1.5 text-xs text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-200 rounded-lg shadow-lg">
                  <SelectItem value="S">String (S)</SelectItem>
                  <SelectItem value="N">Number (N)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.partitionKeyType && <p className="text-red-600 text-[10px] mt-1">{errors.partitionKeyType.message}</p>}
        </div>

        <div>
          <label className="font-medium text-gray-800">Sort Key (optional)</label>
          <input 
            {...register("sortKey")} 
            placeholder="timestamp" 
            className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20" 
          />
        </div>

        <div>
          <label className="font-medium text-gray-800">Sort Key Type</label>
          <Controller
            control={control}
            name="sortKeyType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full mt-1 rounded-lg border bg-gray-200 px-2 py-1.5 text-xs text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-200 rounded-lg shadow-lg">
                  <SelectItem value="S">String (S)</SelectItem>
                  <SelectItem value="N">Number (N)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </form>
    </div>

    <div className="h-px w-full " />

    <div className="sticky rounded-lg flex items-center justify-between gap-2 p-2 bg-white border-t border-gray-200">
      <button 
        type="button"
        onClick = {() => {
          onDelete(id)
          onClose()
        }} 
        className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700">
        Delete
      </button>
      <div className="flex items-center gap-2">
        <button 
          type="button"
          onClick={onClose} 
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
          Close
        </button>
        <button 
          type="button" 
          onClick={() => {
            handleSubmit(
              (data) => submit(data),
              (errors) => {
                alert("Please fix form errors:\n" + Object.entries(errors).map(([key, val]) => `${key}: ${val.message}`).join("\n"))
              }
            )()
          }}
          className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-orange-700">
          Save
        </button>
      </div>
    </div>
  </aside>
</Panel>

    )
}