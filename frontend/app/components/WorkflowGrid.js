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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <Card className="group flex flex-col justify-center items-center flex-1 min-w-88 max-w-88 flex-grow min-h-60 bg-grey-100 shadow-none border-dashed border-2 rounded-2xl  hover:cursor-pointer  border-gray-300  bg-gray-100 delay-50 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300">
        <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-center text-black">Create New Workflow</CardTitle>
        <CardDescription className="text-center">Start building your AWS infrastructure with drag-and-drop services</CardDescription>
        </CardContent>
      </Card>
      {dummyProjects.map((proj) => (
        <WorkflowCard
          key={proj.id}
          title={proj.title}
          description={proj.description}
          status={proj.status}
          lastModified={proj.lastModified}
        />
      ))}
    </div>
  );
}