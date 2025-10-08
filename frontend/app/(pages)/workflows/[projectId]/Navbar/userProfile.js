import { User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function UserProfile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex  bg-gray-50 p-1 mt-1 shadow-xl rounded-2xl border sm:space-x-2 w-fit ">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1 rounded-xl  cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">You</div>
          <div className="text-xs text-gray-500">you@foundry.com</div>
        </div>
      </div>
      {open && (
        <div className="absolute right-0 mt-14 w-40 rounded-xl border border-gray-100 bg-gray-50 shadow-lg py-1">
          <button
           
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
