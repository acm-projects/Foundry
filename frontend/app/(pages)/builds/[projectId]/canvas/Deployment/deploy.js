'use client';
import { Rocket } from "lucide-react";
import { useState } from "react";
import api from "@/app/api";
import Live from "./live";
import { validateDeployData } from "./formatDeployData";

function Deploy({deployClicked}) {

const[status,setStatus] = useState(false)
const[live,setLive] = useState(true)

  const handleDeploy = async () => {
    // Get the React Flow JSON with node data from parent
    const reactJson = deployClicked()
    
    console.log("Deploying with data:", JSON.stringify(reactJson, null, 2))
    
    // Validate that all nodes have required configuration
    const errors = validateDeployData(reactJson)
    if (errors.length > 0) {
      alert(`Please configure all resources:\n${errors.join('\n')}`)
      return
    }
    
    try {
      setStatus(true)
      const response = await api.post('/canvas/deploy', reactJson)
      console.log("Deploy response:", response)
      setLive(true)
    } catch (error) {
      console.error("Deployment error:", error)
      alert("Deployment failed. Check console for details.")
      setStatus(false)
    }
  }



  return (
    <div className=" h-10 flex justify-between items-center">

  <button
    onClick={handleDeploy}
    disabled={status}
    className={`flex items-center gap-2 rounded-lg px-3 py-3 text-white shadow-md
      ${!status ? "bg-black" : "bg-gray-300"}
      disabled:cursor-not-allowed disabled:opacity-50`}
  >
    <Rocket />
    <span className="font-semibold text-sm">{status ? "Deploying..." : "Deploy"}</span>

  </button>
</div>

  );
}


export default Deploy