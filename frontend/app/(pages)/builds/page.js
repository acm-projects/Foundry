"use client";
import {React,useEffect,useState, useMemo} from 'react'
import { GitBranch, Plus,Cloud } from "lucide-react";
import Link from 'next/link';
import UserProfile from './[projectId]/Navbar/userProfile';
import WorkflowGrid from '@/app/components/WorkflowGrid';
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardTitle} from '@/app/components/ui/card'
import {nanoid} from 'nanoid';
import { set } from 'zod';
import Invite_Inbox from './[projectId]/Navbar/inbox';
import axios from 'axios'
import { useSession } from 'next-auth/react';

// dummy data for now, or use state to hold fetched data
const dummyProjects = [
    { id: '1', title: "Dummy AWS Project", description: "Foundry is so cool.", status: "live", lastModified: "10/04/2025" },
    { id: '2', title: "Data Pipeline Alpha", description: "ETL pipeline test deployment.", status: "inactive", lastModified: "09/28/2025" },
    { id: '3', title: "Frontend Build", description: "Deployment failed during CI/CD run.", status: "failed", lastModified: "09/30/2025" },
    { id: '4', title: "Inventory System", description: "Backend for new inventory tracker.", status: "live", lastModified: "11/01/2025" },
];

export default function Builds() { 

const [searchTerm, setSearchTerm] = useState('');
const [projects, setProjects] = useState(dummyProjects); // state to hold project data (replace with api call results later)


const data = useSession()

const filteredProjects = useMemo(() => {
    if (!searchTerm) {
        return projects;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return projects.filter(project => 
        project.title.toLowerCase().includes(lowerCaseSearch) ||
        project.description.toLowerCase().includes(lowerCaseSearch)
    );
}, [searchTerm, projects]); 


useEffect(() => {
  
const get_builds = async () => { 
  try { 

    // const response = await axios.get(`http://localhost:8000/builds`,{params: {id: data.data?.user?.id}});
    // setProjects(response.data.projects); // Use this line when connected to the backend

    console.log("Fetching builds...")
  }catch(err) { 
    console.log("error fetching builds:",err)
  }
  
}

get_builds()

},[data])

const newBuild = async () => { 
  try { 
    const response = await axios.get(`http://localhost:8000/builds/new`,{params: {id: data.data?.user?.id}});
    console.log("response",response.data?.message)

    if(response.status == 200){ 
      window.location.href = `/builds/${response.data?.message}/canvas`
    } 
  }catch(err) { 
    console.log("error",err)
  }
}

return (
  <div className="bg-gray-100 relative min-h-screen">
  <div className="flex items-center justify-between  pt-5 px-4 sm:px-6 lg:px-8">
    <div className="pl-0">
      <Link href='/builds'>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 shadow-sm">
          <Cloud className="w-5 h-5 text-white" />
        </div>
      </Link>
    </div>
    
    <Input 
        placeholder="Search projects by title or description..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className = "min-w-xl flex ml-10 flex-col sm:flex-row bg-gray-50 p-2 shadow-l rounded-2xl border border-gray-200 w-full max-w-lg" // Adjusted classes for better responsiveness
    />
    <UserProfile />
  </div>
  <main className="flex items-center justify-center mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 pt-8 pb-8">
    <div className="flex flex-col gap-6 sm:gap-8 items-start justify-between">
      <div className="mt-6 sm:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        <button onClick={() => newBuild()}>
          <Card className="group flex flex-col justify-center items-center flex-1 min-w-88 max-w-88 flex-grow min-h-60 bg-grey-100 shadow-none border-dashed border-2 rounded-2xl  hover:cursor-pointer  border-gray-300  bg-gray-100 delay-50 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300">
            <CardContent className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-center text-black">Create New Build</CardTitle>
              <CardDescription className="text-center">Start building your AWS infrastructure with drag-and-drop services</CardDescription>
            </CardContent>
          </Card>
          </button>
  
          <WorkflowGrid projects={filteredProjects}/>
          
        </div>
      </div>
      {filteredProjects.length === 0 && searchTerm !== '' && (
          <p className="text-center w-full text-lg text-gray-500 mt-10">No projects found matching "{searchTerm}".</p>
      )}
    </div>

    
  </main>
</div>

)
}