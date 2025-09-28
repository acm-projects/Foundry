"use client";

import { usePathname } from "next/navigation";
import { LineChart, Monitor, DollarSign, FileText } from "lucide-react";
import Link from "next/link";

export default function WorkflowNavbar() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const projectId = pathSegments[2];

  const tabs = [
    {
      name: "Canvas",
      icon: Monitor,
      href: `/workflows/${projectId}/canvas`,
    },
    {
      name: "Dashboard",
      icon: LineChart,
      href: `/workflows/${projectId}/dashboard`,
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
  ];

  return (
    <div className="flex flex-col sm:flex-row bg-white p-2 shadow-xl rounded-2xl border border-gray-100 sm:space-x-2">
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
  );
}