import { Panel } from "@xyflow/react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { useEffect,useState } from "react";
import axios from 'axios'
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import CircleLoader from "./Bars/load_bar";

export default function EC2PanelForm({ id, onClose, onDelete,label}) {

const storageKey = `${id}`;
const token = useSession()
const [repos,setRepos] = useState([])
const nameRegex = /^[a-zA-Z0-9_-]+$/;
const { data: session, status } = useSession(); 
const buildId = usePathname().split("/")[2];
const savedKey = `ec2_saved_${id}`
const [saved,setSaved] = useState(() => typeof window !== "undefined" && localStorage.getItem(savedKey) === "1")

const schema = z.object({
  name: z.string().min(1, "Required").max(255).regex(nameRegex, "Only letters, numbers, hyphens, and underscores."),
  instanceType: z.string().min(1, "Select an instance type"),
  imageId: z.enum(["Ubuntu", "Amazon Linux", "Windows"], { required_error: "Select an image" }),
  repos: z.string().optional().default("")
});

useEffect(() => { 
  const getRepos = async () => { 
    if (status === "loading" || !session || !session.user?.login) {
      setRepos([]);
      return;
    }
    const githubLogin = session.user.login;
    try { 
      const response = await axios.get("http://127.0.0.1:8000/canvas",{headers: {Authorization: `Bearer ${githubLogin}`}});
      setRepos(response.data)
    }catch(err) { 
      setRepos([]);
    }
  }
  getRepos()
    },[session, status]) 

const {setNodes,getNode} = useReactFlow();
const existingNode = getNode(id);
const existingData = existingNode?.data || {};

const defaultValues =  {
  name: existingData.name || "web-01",
  instanceType: existingData.instanceType || "t3.micro",
  imageId: existingData.imageId || "Ubuntu",
  repos: ""
};

const {register, handleSubmit,control,formState: { errors },} = useForm({resolver: zodResolver(schema),defaultValues, mode: "onSubmit",});
const submit = (values) => {
  const label = id.split(':')[0]
  const payload = {
    label: label,
    name: values.name,
    instanceType: values.instanceType,
    imageId: values.imageId
  }
  setNodes((nodes) =>
    nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, ...payload } } : node
    )
  );
  const githubLogin = session?.user?.login; 
  if (!githubLogin) {
    return; 
  }
  const repoIdentifier = values.repos; 
  const parts = (repoIdentifier || "").split('/');
  const repoName = parts[0]; 
  const owner = parts[1]; 

  const sendWebhookRequest = async () => { 
    try { 
      await axios.post('https://overslack-stonily-allegra.ngrok-free.dev/github/add_webhook', {
        owner: owner,
        repo: repoName,
        build_id: buildId,
      });
    }
    catch(err) { 
      console.log("[EC2_CONFIG] Error creating webhook or connecting to API:", err.message)
    }
  };
  
  const sendBuildsRequest = async () => {
      try { 
          await axios.post('http://127.0.0.1:8000/canvas/builds',{
              repo: repoIdentifier, 
              tag: buildId
          });
      }
      catch(err) { 
      }
  };

  const handleSubmission = async () => {
    if (repoIdentifier) {
      await sendWebhookRequest(); 
    }
    // await sendBuildsRequest(); 
  }
    handleSubmission();
  // if (!saved) {
  //   setSaved(true)
  //   if (typeof window !== "undefined") localStorage.setItem(savedKey,"1")
  // }
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

<span className="font-medium text-gray-800">repositories</span>
<Controller
control={control}
name="repos"
render={({ field }) => (
  <Select value={field.value} onValueChange={field.onChange}>
   <SelectTrigger disabled={false} className="w-full rounded-lg border bg-gray-200 px-2 py-1.5 text-xs text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">

      <SelectValue placeholder="Select repository" />
    </SelectTrigger>
    <SelectContent className="max-h-28 overflow-y-auto bg-gray-200 rounded-lg shadow-lg">
      {repos?.map((repo) => (
        <SelectItem key={repo.id} value={`${repo.name}/${repo.owner}`}>{repo.name}</SelectItem>
      ))}
    </SelectContent>
  </Select>
)}
/>

<div>
  <label className="font-medium text-gray-800">Image ID <span className="text-red-500">*</span></label>
  <Controller
    control={control}
    name="imageId"
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
  {errors.imageId && <p className="text-red-600 text-[10px] mt-1">{errors.imageId.message}</p>}
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
