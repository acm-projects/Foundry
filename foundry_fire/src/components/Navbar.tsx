import React from "react";
import { Button } from "./ui/button";
import {
  LogOut,
  Plus,
  Workflow,
  GraduationCap,
  Cloud,
  User,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { DraggableProfileMenu } from "./DraggableProfileMenu";
import { PageType } from "../types";

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  workflowName?: string;
}

export function Navbar({ currentPage, onNavigate, workflowName }: NavbarProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    onNavigate("landing");
  };

  return (
    <nav className="bg-background border-b border-border px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("landing")}
              className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center hover:from-orange-500 hover:to-orange-700 transition-colors"
            >
              <Cloud className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Button
              variant={currentPage === "workflows" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onNavigate("workflows")}
              className="flex items-center gap-2"
            >
              <Workflow size={16} />
              Workflows
            </Button>

            <Button
              variant={currentPage === "education" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onNavigate("education")}
              className="flex items-center gap-2"
            >
              <GraduationCap size={16} />
              Education
            </Button>
          </div>
        </div>

        {/* Right side - Profile Menu */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="flex items-center gap-2 h-auto p-2 hover:bg-orange-50 hover:border-orange-200"
            onClick={() => setIsProfileMenuOpen(true)}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium">You</div>
              <div className="text-xs text-muted-foreground">
                you@foundry.com
              </div>
            </div>
            <ChevronDown size={14} className="text-muted-foreground" />
          </Button>

          <DraggableProfileMenu
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
}
