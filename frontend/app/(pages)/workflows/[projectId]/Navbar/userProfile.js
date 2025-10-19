import { User } from "lucide-react";
import { useState } from "react";
import { useSession,signOut } from "next-auth/react";
import Link from "next/link";


export default function UserProfile() {
  const [open, setOpen] = useState(false);

  const data = useSession();

  const logOut = async () => await signOut({callbackUrl: "http://localhost:3000/"})

console.log(data)

  console.log("username",data.data?.user?.login)
  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1 rounded-xl  cursor-pointer"
      >

          <img className = "rounded-full h-10 w-10" src = {data.data?.user?.image}/>
        
       
      </div>
      {open && (
     <div className="absolute right-0 w-40 rounded-xl z-10  border border-gray-100 bg-gray-50 shadow-lg py-1">
     <div className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">
       <div className="font-medium">{data.data?.user?.name}</div>
       <div className="text-xs text-gray-500">{data.data?.user?.login}</div>
     </div>
     <button onClick = {() => logOut()
  }
     
       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
     >
       Logout
     </button>
   </div>
   
      )}
    </div>
  );
}
