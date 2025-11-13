'use client';
import { Rocket, RefreshCw, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/app/api";
import Live from "./live";
import { validateDeployData } from "./formatDeployData";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import axios from 'axios'
function Deploy({ deployClicked, deploymentState, buildId, stackName, onDeploymentSuccess }) {
  const [status, setStatus] = useState(false)
  const [live, setLive] = useState(true)
  const session = useSession()



  // deploymentState can be: 'never' | 'deployed' | 'needs-update'
  const isDeployed = deploymentState === 'deployed'
  const needsUpdate = deploymentState === 'needs-update'

  const handleDeploy = async () => {


  try { 

const response = await axios.post("http://localhost:8000/canvas/deployments",{build_id:buildId}) //this is assuming deployment was sucessful

console.log("response",response)
  }
  catch(err){
    console.log("error",err)
  }




    // Get the React Flow JSON with node data from parent
    const reactJson = deployClicked()
    
    console.log("Deploying with data:", JSON.stringify(reactJson, null, 2))
    
    // Validate that all nodes have required configuration
    const errors = validateDeployData(reactJson)
    if (errors.length > 0) {
      alert(`Please configure all resources:\n${errors.join('\n')}`)
      return
    }

    // Validate buildId exists
    if (!buildId) {
      alert('Error: No build ID found. Please refresh the page or create a new build.')
      return
    }

    // Get owner_id from session
    const owner_id = session.data?.user?.id
    if (!owner_id) {
      alert('Error: No user ID found. Please sign in again.')
      return
    }
    
    try {
      setStatus(true)
      
      // For new deployments, use POST /canvas/deploy with buildId, canvas, owner_id, and region
      // For updates, still use the update endpoint
      const endpoint = needsUpdate ? '/canvas/deploy/update' : '/canvas/deploy'
      const actionText = needsUpdate ? 'update' : 'deploy'
      
      // Validate stack_name exists for updates
      if (needsUpdate && !stackName) {
        alert('Cannot update: No stack name found. Please deploy first or clear canvas and redeploy.')
        setStatus(false)
        return
      }
      
      console.log(`Sending POST to ${endpoint}...`)
      console.log("needsUpdate:", needsUpdate)
      console.log("buildId:", buildId, typeof buildId)
      console.log("owner_id:", owner_id, typeof owner_id)
      console.log("stackName:", stackName, typeof stackName)
      
      
      const requestBody = needsUpdate 
        ? { canvas: reactJson, build_id: buildId, stack_name: stackName, auto_execute: true }
        : { 
            buildId: buildId,  // Integer from URL params
            canvas: reactJson,  // Canvas object with nodes, edges, viewport
            owner_id: parseInt(owner_id, 10),  // Integer user ID
            region: "us-east-1"  // Default region - could be made configurable
          }
      
      console.log("Request body:", JSON.stringify(requestBody, null, 2))
      
      const response = await api.post(endpoint, requestBody)
      console.log(`${actionText} response:`, response.data)
      console.log("Full response object:", response)
      console.log("Response data keys:", Object.keys(response.data))
      
      setLive(true)
      alert(`${needsUpdate ? 'Update' : 'Deployment'} successful!`)
      
      const responseBuildId = response.data.buildId
      const responseStackName = response.data.stackName
      console.log("Extracted responseBuildId:", responseBuildId, typeof responseBuildId)
      console.log("Extracted responseStackName:", responseStackName, typeof responseStackName)
      
      if (!responseBuildId && !needsUpdate) {
        console.warn("⚠️ WARNING: Backend did not return buildId! This will prevent updates from working.")
        alert("Warning: Deployment succeeded but no buildId was returned. Updates may not work.")
      }
      
      if (!responseStackName && !needsUpdate) {
        console.warn(" WARNING: Backend did not return stackName! This will prevent updates from working.")
        alert("Warning: Deployment succeeded but no stackName was returned. Updates may not work.")
      }
      
      onDeploymentSuccess(reactJson, responseBuildId, responseStackName)
      
    } catch (error) {
      console.error("Deployment error details:", error)
      
      // Extract detailed error information
      let errorMessage = `${needsUpdate ? 'Update' : 'Deployment'} failed.\n\n`
      
      if (error.response) {
        // Server responded with error status
        errorMessage += `Status: ${error.response.status}\n`
        
        // Log the full error detail for debugging
        console.error("Full error response:", JSON.stringify(error.response.data, null, 2))
        
        // Check if it's a FastAPI validation error (422)
        if (error.response.status === 422 && error.response.data.detail) {
          errorMessage += `Validation errors:\n`
          const details = Array.isArray(error.response.data.detail) 
            ? error.response.data.detail 
            : [error.response.data.detail]
          details.forEach(err => {
            errorMessage += `  - ${err.loc ? err.loc.join('.') : 'unknown'}: ${err.msg || JSON.stringify(err)}\n`
          })
        } else {
          errorMessage += `Message: ${JSON.stringify(error.response.data, null, 2)}`
        }
        
        console.error("Response data:", error.response.data)
        console.error("Response status:", error.response.status)
        console.error("Response headers:", error.response.headers)
      } else if (error.request) {
        // Request made but no response
        errorMessage += "No response received from server"
        console.error("Request:", error.request)
      } else {
        // Error in setting up request
        errorMessage += error.message
      }
      
      alert(errorMessage)
    } finally {
      setStatus(false)
    }
  }



  // Determine button styling based on state
  let buttonClass = "flex items-center gap-2 rounded-lg px-3 py-3 text-white shadow-md font-semibold text-sm transition-colors "
  let buttonText = "Deploy"
  let ButtonIcon = Rocket

  if (status) {
    buttonClass += "bg-gray-400 cursor-not-allowed"
    buttonText = needsUpdate ? "Updating..." : "Deploying..."
  } else if (isDeployed) {
    buttonClass += "bg-green-600 hover:bg-green-700 cursor-default"
    buttonText = "Deployed"
    ButtonIcon = CheckCircle
  } else if (needsUpdate) {
    buttonClass += "bg-orange-600 hover:bg-orange-700"
    buttonText = "Update"
    ButtonIcon = RefreshCw
  } else {
    buttonClass += "bg-black hover:bg-gray-800"
    buttonText = "Deploy"
  }

  return (
    <div className="h-10 flex justify-between items-center">
      <button
        onClick={handleDeploy}
        disabled={status || isDeployed}
        className={buttonClass}
      >
        <ButtonIcon className="w-4 h-4" />
        <span>{buttonText}</span>
      </button>
    </div>
  );
}


export default Deploy