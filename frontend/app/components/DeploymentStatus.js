import { Item } from '@/app/components/ui/item'

export default function DeploymentStatus({status}){
  let styles="";
  let label="";
  let dotColor="";

  switch (status) {
    case "live":
      styles="bg-green-100 text-green-700 border border-green-300";
      dotColor = "bg-green-500";
      label = "Live";
      break;
      case "inactive":
        styles = "bg-gray-100 text-gray-700 border border-gray-300";
        dotColor = "bg-gray-500";
        label = "Inactive";
        break;
      case "failed":
        styles = "bg-red-100 text-red-700 border border-red-300";
        dotColor = "bg-red-500";
        label = "Failed";
        break;
    }

    return(
      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg w-fit ${styles}`}>
        <span className={`w-2 h-2 rounded-full ${dotColor}`}/>
        <span className="text-sm font-medium">{label}</span>
      </div>
    );
}