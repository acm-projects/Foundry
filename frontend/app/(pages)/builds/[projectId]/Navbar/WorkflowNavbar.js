"use client";
import { Cloud } from "lucide-react";
import { usePathname } from "next/navigation";
import { Monitor, DollarSign, FileText, Settings, Check } from "lucide-react";
import { useState,useEffect } from "react";
import UserProfile from "./userProfile";
import Link from "next/link";
import axios from "axios";

export default function WorkflowNavbar() {
const pathname = usePathname();
const pathSegments = pathname.split("/");
const projectId = pathSegments[2];

const [projectName, setProjectName] = useState("untitled");
const [inputValue, setInputValue] = useState(projectName);
const [isEditing, setIsEditing] = useState(false);



useEffect(() => {
const fetchProjectName = async () => {
  try {
    const response = await axios.get("http://localhost:8000/canvas/settings", {
      params: { build_id: projectId }
    });


    // console.log("response",response)

    // backend should return { projectName: "My Project" }
    const backendName = response.data[0]?.project_name;

    if (backendName && backendName.trim().length > 0) {
      setProjectName(backendName);
      setInputValue(backendName);
    }
  } catch (err) {
    console.error("Error fetching project name:", err);
  }
};

if (projectId) {
  fetchProjectName();
}


}, []);


const saveToBackend = async (name) => {
try {
  const response = await axios.post("http://localhost:8000/canvas/settings", {
    build_id: projectId,
    projectName: name,
  });
  console.log("Saved project name response:", response.data);
} catch (err) {
  console.error("Error updating project name:", err);
}
};

const handleSave = async () => {
const newName = inputValue.trim() || "untitled";

setProjectName(newName);
setInputValue(newName);
setIsEditing(false);

await saveToBackend(newName);
};

const handleKeyDown = (e) => {
if (e.key === "Enter") {
  void handleSave();
} else if (e.key === "Escape") {
  setInputValue(projectName || "untitled");
  setIsEditing(false);
}
};

const tabs = [
{ name: "Canvas", icon: Monitor, href: `/builds/${projectId}/canvas` },
{ name: "Costs", icon: DollarSign, href: `/builds/${projectId}/costs` },
{ name: "Logs", icon: FileText, href: `/builds/${projectId}/logs` },
{ name: "Settings", icon: Settings, href: `/builds/${projectId}/settings` },
];

const TitleComponent = isEditing ? (
<div className="flex items-center gap-2">
  <input
    type="text"
    className="text-2xl font-bold p-1 border-b-2 border-orange-500 bg-transparent outline-none text-gray-700 w-full min-w-[120px]"
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onKeyDown={handleKeyDown}
    maxLength={20}
    autoFocus
  />

  <button onClick={() => void handleSave()} className="text-orange-500">
    <Check className="w-5 h-5" />
  </button>
</div>
) : (
<h1
  className="text-2xl font-bold text-gray-700 cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors w-full truncate"
  onClick={() => {
    setInputValue(projectName || "untitled");
    setIsEditing(true);
  }}
  title="Click to rename"
>
  {projectName || "untitled"}
</h1>
);

return (
<div className="relative w-full justify-center">
  <div className="flex items-center justify-between pt-5 px-4 sm:px-6 lg:px-8">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 shadow-sm">
        <Link href="/builds">
          <Cloud className="w-5 h-5 text-white" />
        </Link>
      </div>

      <div className="flex items-center max-w-xs sm:max-w-sm">
        {TitleComponent}
      </div>
    </div>

    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-5">
      <div className="flex flex-col sm:flex-row bg-white p-2 shadow-xl rounded-2xl border justify-center border-gray-100 sm:space-x-2 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium ${
                isActive
                  ? "bg-gray-100 text-gray-900 shadow"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>

    <UserProfile />
  </div>
</div>
);
}
