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


    setProjects(response.data)  
  }catch(err) { 
  
  
    console.log("error",err)
  }
  
}


get_builds()



},[data])


  return (
    <>
      {projects.map((proj) => {
  const formattedDate = new Date(proj.created_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Link  href={`/builds/${proj.build_id}/canvas`}>
    <WorkflowCard
      key={proj.id}
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