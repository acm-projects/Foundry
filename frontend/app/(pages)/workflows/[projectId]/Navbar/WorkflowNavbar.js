"use client";
import { User,Cloud } from "lucide-react";
import { usePathname } from "next/navigation";
import { Monitor, DollarSign, FileText, Settings } from "lucide-react";
import {useState} from 'react'
import UserProfile from "./userProfile";
import Link from "next/link";

export default function WorkflowNavbar() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const projectId = pathSegments[2];
const[user,setUser] = useState(false)
  const tabs = [
    {
      name: "Canvas",
      icon: Monitor,
      href: `/workflows/${projectId}/canvas`,
    },
    {
      name: "Costs",
      icon: DollarSign,
      href: `/workflows/${projectId}/costs`,
    },
    {
      name: "Logs",
      icon: FileText,
      href: `/workflows/${projectId}/logs`,
    },
    {
      name: "Settings",
      icon: Settings,
      href: `/workflows/${projectId}/settings`,
    },
  ];

  return (
    <div className="relative w-full flex items-center justify-center ">
      <Link href='/second_landing'>
  <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 shadow-sm">
    <Cloud className="w-5 h-5 text-white" />
  </div>
  </Link>
  <div className="flex flex-col sm:flex-row bg-white p-2 shadow-xl rounded-2xl border border-gray-100 sm:space-x-2 w-fit">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = pathname.startsWith(tab.href);

      return (
        <Link
          key={tab.name}
          href={tab.href}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium
            ${
              isActive
                ? "bg-gray-100 text-gray-900 shadow"
                : "text-gray-500 hover:bg-gray-50"
            }
          `}
        >
          <Icon className="w-5 h-5" />
          <span>{tab.name}</span>
        </Link>
      );
    })}
  </div>

  <div className="absolute right-6 top-1/2 -translate-y-1/2">
    <UserProfile />
  </div>
</div>



  );
}