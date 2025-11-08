import WorkflowCard from "@/app/components/WorkflowCard";
import { Card , CardHeader, CardTitle, CardDescription, CardContent} from '@/app/components/ui/card'
import { Plus } from "lucide-react";
import { useEffect, useState} from "react"; 
import { useSession } from "next-auth/react"; 
import axios from "axios"
import Link from "next/link";
export default function WorkflowGrid() {

  const data = useSession()
  const[projects,setProjects] = useState([])


useEffect(() => {
  
const get_builds = async () => { 
  try { 
    const response = await axios.get(`http://localhost:8000/builds`,{params: {id: data.data?.user?.id}});


    console.log("backend response",response)

    // Backend now returns { builds: [...] } instead of array directly
    if (response.data && Array.isArray(response.data.builds)) {
      setProjects(response.data.builds)
    } else {
      console.warn("Unexpected response format:", response.data)
      setProjects([])
    }
  }catch(err) { 
  
  
    console.log("error",err)
    setProjects([])
  }
  
}


get_builds()



},[data])


  return (
    <>
      {Array.isArray(projects) && projects.map((proj) => {
  const formattedDate = new Date(proj.created_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Link  href={`/builds/${proj.id}/canvas`} key={proj.id}>
    <WorkflowCard
      title={proj.project_name || "Untitled"}
      description={proj.description}
      status={proj.status || "inactive"}
      created_at={formattedDate}
    />

</Link>
  );
})}

    </>

  );
}