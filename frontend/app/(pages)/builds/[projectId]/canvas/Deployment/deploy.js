'use client';
import { Rocket, RefreshCw, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/app/api";
import Live from "./live";
import { validateDeployData } from "./formatDeployData";

function Deploy({ deployClicked, deploymentState, buildId, stackName, onDeploymentSuccess }) {
  const [status, setStatus] = useState(false)
  const [live, setLive] = useState(true)

  // deploymentState can be: 'never' | 'deployed' | 'needs-update'
  const isDeployed = deploymentState === 'deployed'
  const needsUpdate = deploymentState === 'needs-update'

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
      
      // Choose endpoint based on deployment state
      const endpoint = needsUpdate ? '/canvas/deploy/update' : '/canvas/deploy'
      const actionText = needsUpdate ? 'update' : 'deploy'
      
      // Validate build_id exists for updates
      if (needsUpdate && !buildId) {
        alert('Cannot update: No build ID found. Please deploy first or clear canvas and redeploy.')
        setStatus(false)
        return
      }
      
      // Validate stack_name exists for updates
      if (needsUpdate && !stackName) {
        alert('Cannot update: No stack name found. Please deploy first or clear canvas and redeploy.')
        setStatus(false)
        return
      }
      
      console.log(`Sending POST to ${endpoint}...`)
      console.log("needsUpdate:", needsUpdate)
      console.log("buildId:", buildId, typeof buildId)
      console.log("stackName:", stackName, typeof stackName)
      
      // Backend expects data wrapped in "canvas" field
      // For updates, also include build_id and stack_name
      // auto_execute: true tells backend to automatically execute the deployment
      const requestBody = needsUpdate 
        ? { canvas: reactJson, build_id: buildId, stack_name: stackName, auto_execute: true }
        : { canvas: reactJson, auto_execute: true }
      
      console.log("Request body:", JSON.stringify(requestBody, null, 2))
      
      const response = await api.post(endpoint, requestBody)
      console.log(`${actionText} response:`, response.data)
      console.log("Full response object:", response)
      console.log("Response data keys:", Object.keys(response.data))
      console.log("build_id in response?", 'build_id' in response.data)
      console.log("response.data.build_id:", response.data.build_id)
      console.log("stack_name in response?", 'stack_name' in response.data)
      console.log("response.data.stack_name:", response.data.stack_name)
      
      setLive(true)
      alert(`${needsUpdate ? 'Update' : 'Deployment'} successful!`)
      
      // Notify parent that deployment succeeded, pass build_id and stack_name from response
      const responseBuildId = response.data.build_id
      const responseStackName = response.data.stack_name
      console.log("Extracted responseBuildId:", responseBuildId, typeof responseBuildId)
      console.log("Extracted responseStackName:", responseStackName, typeof responseStackName)
      
      if (!responseBuildId && !needsUpdate) {
        console.warn("⚠️ WARNING: Backend did not return build_id! This will prevent updates from working.")
        alert("Warning: Deployment succeeded but no build_id was returned. Updates may not work.")
      }
      
      if (!responseStackName && !needsUpdate) {
        console.warn("⚠️ WARNING: Backend did not return stack_name! This will prevent updates from working.")
        alert("Warning: Deployment succeeded but no stack_name was returned. Updates may not work.")
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