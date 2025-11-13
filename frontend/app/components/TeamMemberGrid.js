import TeamMemberCard from "./TeamMemberCard";
import { Input } from '@/app/components/ui/input'
import {useState,useEffect} from "react"
import axios from 'axios'
import { Search} from "lucide-react";
import {useSession} from 'next-auth/react'
import { send } from "process";
import { usePathname } from "next/navigation";


export default function TeamMemberGrid({ members, setMembers,invite_id,invite_email }) {
  const data = useSession()
  const pathname = usePathname()
  const build_id = pathname.split("/")[2]

  const handleRoleChange = (index, value) => {
    const updated = [...members];
    updated[index].role = value;
    setMembers(updated);
  };

  const[input,setInput] = useState("")
  const[users,setUsers] = useState([])
  
useEffect(() => { 
const already_sent_invite =  async () => { 
try { 
  const get_invitations = await axios.get(`http://localhost:8000/builds/sent_invitations/`,{params: {id: data.data?.user?.id}});
  const existingInvitesRaw = get_invitations.data || []
  const existingInvites = existingInvitesRaw
    .filter(invite => String(invite.build_id) === String(build_id))
    .map(invite => ({
      id: invite.invite__id,
      name: invite.name || "Unknown",
      email: invite.invite_email,
      role: "read",
    }));
  setMembers(prev => {
    const seen = new Set(prev.map(m => `${m.id}`));
    const add = existingInvites.filter(i => !seen.has(`${i.id}`));
    return [...prev, ...add];
  });
}
catch(err) { 
  console.log("error:",err)
}
}
already_sent_invite()
},[data.data?.user?.id, build_id])

useEffect(() => {

  const findUsers = async () => { 
  
    try { 

      const response = await axios.get(`http://localhost:8000/canvas/users`);

      console.log("response",response)

      const send_id = (data) => {

        const allIds = data.data?.map(item => item.id);
      
        console.log("all IDs:", allIds); 
        console.log("all emails:", data.data.map(item => item.email)); 

      

      };

      const emails = response.data;
      
      console.log(emails)
      

      send_id(response)

      setUsers(emails)
      
    
  
    }catch(err) { 
    
    
    console.log("error:",err)
    
    
    }
    
    }

findUsers()



 }, [])


const addMember = () => {
  const user = users?.find(u => u.email === input);

  if (members.find(m => m.id === user?.id)) {
    setInput("");
    return;
  }

  if (user) {
    const updatedMembers = [
      ...members,
      { id: user.id, name: user.name, email: user.email, role: 'read' },
    ];

    setMembers(updatedMembers);
    setInput("");

    const memberIds = updatedMembers.map(m => m.id);
    console.log("member IDs to invite:", memberIds);

    const memberEmails = updatedMembers.map(m => m.email);
console.log("member Emails to invite:", memberEmails);
    invite_email(memberEmails);
    invite_id(memberIds);
  } else {
    alert("user not found");
 
  }

  
};

  return (
    <div className="flex flex-col gap-2">
      <div className = "flex gap-2">
      <Input placeholder="Enter a GitHub username..." value = {input} onChange = {(e) => setInput(e.target.value)}/>
      <div className = "flex justify-center items-center h-7 w-7 mt-1 rounded">
      <Search className = " h-7 w-7 text-black rounded" onClick = {() => addMember()}/>
      </div>
      </div>

      {members.map((member, index) => (
        <TeamMemberCard
          key={index}
          member={member}
          onRoleChange={(value) => handleRoleChange(index, value)}
        />
      ))}

    </div>
  );
}

