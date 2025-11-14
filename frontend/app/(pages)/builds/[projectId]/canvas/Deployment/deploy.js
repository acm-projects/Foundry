'use client';
import { Rocket, RefreshCw, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/app/api";
import Live from "./live";
import { validateDeployData } from "./formatDeployData";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import axios from 'axios'
import DeploymentModal from './DeploymentModal';

function Deploy({ deployClicked, deploymentState, buildId, stackName, onDeploymentSuccess }) {
  const [status, setStatus] = useState(false)
  const [live, setLive] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStackName, setCurrentStackName] = useState(stackName)
  const [keyPairs, setKeyPairs] = useState(null)
  const session = useSession()



  // deploymentState can be: 'never' | 'deployed' | 'needs-update'
  const isDeployed = deploymentState === 'deployed'
  const needsUpdate = deploymentState === 'needs-update'

  const handleDeploy = async () => {
    // Open modal immediately
    setIsModalOpen(true);

    // Get the React Flow JSON with node data from parent
    const reactJson = deployClicked()
    
    console.log("Deploying with data:", JSON.stringify(reactJson, null, 2))
    
    // Validate that all nodes have required configuration
    const errors = validateDeployData(reactJson)
    if (errors.length > 0) {
      alert(`Please configure all resources:\n${errors.join('\n')}`)
      setIsModalOpen(false)
      return
    }

    // Validate buildId exists
    if (!buildId) {
      alert('Error: No build ID found. Please refresh the page or create a new build.')
      setIsModalOpen(false)
      return
    }

    // Get owner_id from session
    const owner_id = session.data?.user?.id
    if (!owner_id) {
      alert('Error: No user ID found. Please sign in again.')
      setIsModalOpen(false)
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
      
      const requestBody = needsUpdate 
        ? { canvas: reactJson, build_id: buildId, stack_name: stackName, auto_execute: true }
        : { 
            buildId: buildId,
            canvas: reactJson,
            owner_id: parseInt(owner_id, 10),
            region: "us-east-1"
          }
      
      const response = await api.post(endpoint, requestBody)
      
      setLive(true)
      
      const responseBuildId = response.data.buildId
      const responseStackName = response.data.stackName
      const responseKeyPairs = response.data.keyPairs || null
      
      // Store stack name and key pairs for modal
      if (responseStackName) {
        setCurrentStackName(responseStackName)
      }
      if (responseKeyPairs) {
        setKeyPairs(responseKeyPairs)
      }
      
      onDeploymentSuccess(reactJson, responseBuildId, responseStackName)
      
    } catch (error) {
      console.error("Deployment error:", error)
      
      let errorMessage = `${needsUpdate ? 'Update' : 'Deployment'} failed.\n\n`
      
      if (error.response) {
        errorMessage += `Status: ${error.response.status}\n`
        
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
      } else if (error.request) {
        errorMessage += "No response received from server"
      } else {
        errorMessage += error.message
      }
      
      alert(errorMessage)
      setIsModalOpen(false)
    } finally {
      setStatus(false)
    }
  }

  // Handle modal reopen when clicking deploy button while deployment in progress
  const handleButtonClick = () => {
    if (status && currentStackName) {
      // If deployment in progress, reopen modal
      setIsModalOpen(true)
    } else {
      // Otherwise start new deployment
      handleDeploy()
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
    buttonClass += "bg-green-600 hover:bg-green-700 cursor-pointer"
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
    <>
      <div className="h-10 flex justify-between items-center">
        <button
          onClick={handleButtonClick}
          disabled={isDeployed}
          className={buttonClass}
        >
          <ButtonIcon className="w-4 h-4" />
          <span>{buttonText}</span>
        </button>
      </div>

      <DeploymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stackName={currentStackName}
        keyPairs={keyPairs}
      />
    </>
  );
}


export default Deploy