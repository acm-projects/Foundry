import { User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function UserProfile() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1 rounded-xl  cursor-pointer"
      >
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
       
      </div>
      {open && (
     <div className="absolute right-0 w-40 rounded-xl  border border-gray-100 bg-gray-50 shadow-lg py-1">
     <div className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">
       <div className="font-medium">Efrain</div>
       <div className="text-xs text-gray-500">efrain-grubs</div>
     </div>
     <button
       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
     >
       Logout
     </button>
   </div>
   
      )}
    </div>
  );
}
