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

    const response = await axios.get(`http://localhost:8000/builds`, {
      params: { id: data.data?.user?.id }
    })

    console.log("repssss",response)

    const invites = await axios.get(`http://localhost:8000/builds/invitations/`, {
      params: { id: data.data?.user?.id }
    })

    const own = response?.data?.builds
    const invitedRaw = invites?.data
    const acceptedOnly = invitedRaw.filter(b => b?.invite_status === true)

    const normalizedAccepted = acceptedOnly.map(b => ({
      id: b?.id,
      project_name: b?.project_name,
      description: b?.description,
      created_at: b?.created_at,
    }))

    
    setProjects([...own, ...normalizedAccepted])
  } catch (err) {
    console.log("error", err)
  }
}

get_builds()
}, [data?.data?.user?.id])


console.log("projects",projects)
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

