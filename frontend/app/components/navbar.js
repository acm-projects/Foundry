
import { Cloud, GitBranch, GraduationCap, User, X, LogOut } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function NavBar() {
  const [button, setButton] = useState(true);
  const [user, setUser] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-6 py-3 border-b border-gray-200">
      <div className="flex items-center space-x-6">
        <div className="w-8 h-8 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center">
          <Cloud className="text-white w-5 h-5" />
        </div>
<Link href = "/workflows">
        <button
          onClick={() => { setButton(true); }}
          className={`flex hover:bg-gray-200 items-center space-x-2 px-3 py-1 rounded-md text-black font-medium ${button ? "bg-gray-200" : ""}`}
        >
          <GitBranch className="w-4 h-4" />
          <span className="text-sm font-bold">Workflows</span>
        </button>
        </Link>
<Link href = "/education">
        <button
          onClick={() => setButton(false)}
          className={`rounded flex hover:bg-gray-200 items-center space-x-2 px-3 py-1 hover:text-black ${button == false ? "bg-gray-200" : ""}`}
        >
          <GraduationCap className="w-4 h-4" />
          <span className="text-sm font-bold">Education</span>
        </button>
        </Link>
      </div>

      <button
        onClick={() => setUser(v => !v)}
        className="hover:bg-orange-300 rounded hover:text-white transition-colors duration-300 delay-50 p-3"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
            Y
          </div>
          <span className="text-sm text-gray-700">you@foundry.com</span>
          <span> </span>
        </div>
      </button>

    
      {user ? (
        <>
     
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40"
            onClick={() => setUser(false)}
          />

          
          <div
            className="fixed z-50 right-6 top-[72px] w-[360px] rounded-2xl shadow-2xl bg-white border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
    
            <div className="flex items-center justify-between px-4 py-3 rounded-t-2xl bg-orange-50 border-b border-orange-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-orange-900">Profile Menu</span>
              </div>
              <button
                aria-label="Close"
                onClick={() => setUser(false)}
                className="p-1 rounded hover:bg-orange-100"
              >
                <X className="w-5 h-5 text-orange-700" />
              </button>
            </div>

            
            <div className="p-4">
            
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">You</div>
                  <div className="text-sm text-gray-500">you@foundry.com</div>
                </div>
              </div>

          
              <button
                className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-700 px-1 py-2"
                
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      ) : null}
    </nav>
  );
}



