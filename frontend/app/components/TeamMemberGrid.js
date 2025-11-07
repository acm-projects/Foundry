import TeamMemberCard from "./TeamMemberCard";
import { Input } from '@/app/components/ui/input'
import {useState,useEffect} from "react"
import axios from 'axios'
import { Search} from "lucide-react";


export default function TeamMemberGrid({ members, setMembers }) {
  const handleRoleChange = (index, value) => {
    const updated = [...members];
    updated[index].role = value;
    setMembers(updated);
  };

  const[input,setInput] = useState("")
  const[users,setUsers] = useState([])


useEffect(() => {

  const findUsers = async () => { 

    try { 

      const response = await axios.get(`http://localhost:8000/canvas/users`)


      console.log("response",response)

      setUsers(response.data)
      
    
    
    
    }catch(err) { 
    
    
    console.log("error:",err)
    
    
    }
    
    }



findUsers()



 }, [])


 console.log("users in database",users)

 const addMember = () => {  //this changes things visually gotta add scripts to change in db
    const user = users?.find(u => u === input);


    if(members.find(m => m.name === user)){setInput("") 
      return;}

    
    if (user) {
      setMembers([...members, { name: user, role: 'read',}]);
      setInput("");
    } else {
      alert("user not found");
    }






 }

 console.log("members:",members)  



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