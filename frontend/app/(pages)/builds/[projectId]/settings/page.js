"use client";

import { useState,useEffect, use } from "react";

import { Card , CardHeader, CardTitle, CardContent, CardDescription} from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select , SelectTrigger, SelectContent, SelectValue, SelectItem, SelectGroup} from '@/app/components/ui/select'
import { Button } from '@/app/components/ui/button'
import TeamMemberGrid from "@/app/components/TeamMemberGrid";
import axios from 'axios'
import {useSession} from 'next-auth/react'


import { usePathname } from "next/navigation";



export default function SettingsPage({ params }) {
  // const [projectName, setProjectName] = useState("My Foundry Workflow");
  const [environment, setEnvironment] = useState("development");
  const [description, setDescription] = useState("This is an AWS deployment made easy by Foundry.");
  const [region, setRegion] = useState("us-east-1");
  const [projectName, setProjectName ] = useState("");
  const [invite_id,setInviteId] = useState("")


  const pathname = usePathname();

  const build_id = pathname.split("/")[2];
  const [title,setTitle] = useState("")
  const [teamMembers, setTeamMembers] = useState([]);

  console.log("build id in settings page",build_id) 

  const data = useSession()

  const id = data.data?.user?.id

  const invites = (id) => { 
   
    setInviteId(id)
  }




 

  const handleSave = async () => {
    

try { 
  setProjectName(title)


  const response = await axios.post(`http://localhost:8000/builds/invite`,{invite_id: invite_id, build_id: build_id, project_name: title, description: description,
   
    owner_id: id
  },);


  alert("Settings saved! Check console for values");

} catch(err) { 

  console.log("unable to save",err)
}

  };

  return (
<div className="pt-8 pb-8">
<div className="flex flex-col items-center">
<div className="flex w-full gap-5 mt-6">
<Card className="max-w-30vw flex-1 flex-grow min-h-90 bg-gray-100 backdrop-blur-md   rounded-2xl transition-transform duration-200">
<CardHeader>
<CardTitle>Project Settings</CardTitle>
</CardHeader>
<CardContent>
<div className="flex flex-col gap-4">
  <div className="flex gap-4">
    <div className="flex flex-col w-full">
      <Label htmlFor="projectName" className="mb-1">Project Name</Label>
      <Input  id="projectName" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="build 1" maxLength = {10} />
    </div>
  </div>
  <div className="flex flex-col w-full">
    <Label htmlFor="description" className="mb-1">Description</Label>
    <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="This is an AWS deployment made easy by Foundry." className="text-top align-top py-2" />
  </div>
  <div className="flex flex-col w-full">
    <Label htmlFor="region" className="mb-1">Region</Label>
    <Input disabled id="region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="us-east-1"/>
  </div>
</div>
</CardContent>
</Card>
<Card className="max-w-30vw flex-1 flex-grow min-h-100 bg-gray-100 backdrop-blur-md rounded-2xl transition-transform duration-200">
<CardHeader>
<CardTitle>Team Access</CardTitle>
<CardDescription>Invite your team members to collaborate.</CardDescription>
</CardHeader>
<CardContent>
<TeamMemberGrid members={teamMembers} setMembers={setTeamMembers} invite_id = {invites}/>
</CardContent>
</Card>
</div>
<Button onClick={handleSave} className="mt-5 w-full max-w-70 self-center bg-orange-600 hover:bg-orange-600/80 hover:cursor-pointer">Save</Button>
</div>

</div>
);
}