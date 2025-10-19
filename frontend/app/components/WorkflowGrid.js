import WorkflowCard from "@/app/components/WorkflowCard";
import { Card , CardHeader, CardTitle, CardDescription, CardContent} from '@/app/components/ui/card'
import { Plus } from "lucide-react";

export default function WorkflowGrid() {
  const dummyProjects = [
    {
      id: 1,
      title: "Dummy AWS Project",
      description: "Foundry is so cool. This will be replaced by a real project when connected to backend.",
      status: "live",
      lastModified: "10/04/2025",
    },
    {
      id: 2,
      title: "Data Pipeline Alpha",
      description: "ETL pipeline test deployment.",
      status: "inactive",
      lastModified: "09/28/2025",
    },
    {
      id: 3,
      title: "Frontend Build",
      description: "Deployment failed during CI/CD run.",
      status: "failed",
      lastModified: "09/30/2025",
    },
  ];
//
  return (
    <>
      {dummyProjects.map((proj) => (
        <WorkflowCard
          key={proj.id}
          title={proj.title}
          description={proj.description}
          status={proj.status}
          lastModified={proj.lastModified}
        />
      ))}
    </>

  );
}