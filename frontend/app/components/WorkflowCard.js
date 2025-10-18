
import { Card , CardHeader, CardTitle, CardDescription, CardContent} from '@/app/components/ui/card'
import DeploymentStatus from "@/app/components/DeploymentStatus";

export default function WorkflowCard({title, description, status, lastModified}){

  return (
    <div>
      <Card className="group flex flex-col justify-between flex-1 min-w-88 max-w-88 flex-grow min-h-60 
  bg-gray-100 backdrop-blur-md shadow-lg rounded-2xl
  transition duration-200 hover:scale-[1.02] hover:cursor-pointer">
        <CardHeader className="gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="transition-colors truncate pr-2">
              {title}
            </CardTitle>
            <DeploymentStatus status={status}/>
          </div>

          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between max-w-7xl mx-auto">
            <p className="text-neutral-500 text-left">Last Modified:</p>
            <p className=" text-neutral-500 text-right">{lastModified}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}