import { Inbox, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Invite_Inbox() {
const [open, setOpen] = useState(false);
const [invitations, setInvitations] = useState();
const boxRef = useRef(null);


// const [inviteId,setInviteId] = useState("")


const data = useSession()
useEffect(() => {
const onDocClick = (e) => {
if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
};
document.addEventListener("mousedown", onDocClick);
return () => document.removeEventListener("mousedown", onDocClick);

}, []);

useEffect(() => { 
    const get_invites = async () => { 

        const id = data.data?.user?.id
    
        console.log("id",id)
        try { 
    
            const response = await axios.get(`http://localhost:8000/builds/invitations/`,{params: {id: id}});
        
            console.log('response invites',response)

            setInvitations(response.data)
            
        
        }catch(err) { 
   
            console.log("error",err)
        }
    }
      
    get_invites()
},[data])

const decline = async (inviteId) => {

    try { 


        const response = await axios.post(`http://localhost:8000/builds/invitations/decline`,{id: inviteId});

        console.log('response',response)

    }catch(err) { 

        console.log("error",err)
    }
}

const accept = async (inviteId) => {
    try { 

        const accept = await axios.post(`http://localhost:8000/builds/invitations/accept`,{id: inviteId});

    }catch(err) { 

        console.log("error",err)
    }


 } 


const handleAction = (id) => {
setInvitations((prev) => prev.filter((invite) => invite.id !== id));
};

return (<div className="relative" ref={boxRef}>
    <button
    onClick={() => setOpen((v) => !v)}
    className="flex items-center gap-2 px-3 py-1 rounded-xl cursor-pointer relative"
    aria-haspopup="true"
    aria-expanded={open}
    >
    <Inbox className="h-7 w-7" />
    {invitations?.filter(invite => invite.invite_status === false).length > 0 && (
      <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full">
        {invitations.filter(invite => invite.invite_status === false).length}
      </span>
    )}
    </button>
    {open && (
    <div className="absolute -right-10 top-full mt-2 z-50  w-65 rounded-xl border border-gray-200 bg-gray-100 shadow-lg">
    <ul className="max-h-60 overflow-auto divide-y divide-gray-100">
    {invitations?.filter(invite => invite.invite_status === false).length === 0 && (
      <li className="p-3 text-sm text-gray-500">No invitations</li>
    )}
    {invitations
      ?.filter(invite => invite.invite_status === false)
      .map((invite) => (
        <li key={invite.id} className="flex items-center justify-between gap-3 p-3">
          <p className="text-sm text-gray-900">
            <span className="font-medium">{invite.project_name}</span> invited you
          </p>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-gray-200" aria-label="Decline" onClick={() => handleAction(invite.id)}>
              <X onClick={() => decline(invite.id)} className="h-5 w-5" />
            </button>
            <button className="p-1 rounded hover:bg-gray-200" aria-label="Accept" onClick={() => handleAction(invite.id)}>
              <Check onClick={() => accept(invite.id)} className="h-5 w-5" />
            </button>
          </div>
        </li>
    ))}
    </ul>
    </div>
    )}
    </div>
    
)
}

