import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { LogOut, User, X } from 'lucide-react';

interface DraggableProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function DraggableProfileMenu({ isOpen, onClose, onLogout }: DraggableProfileMenuProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      // Position the menu near the top-right corner initially
      const rect = menuRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth - rect.width - 20,
        y: 80
      });
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && menuRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Constrain to viewport
      const rect = menuRef.current.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20" 
        onClick={onClose}
      />
      
      {/* Draggable Menu */}
      <div
        ref={menuRef}
        className="fixed z-50 w-64 bg-white rounded-lg shadow-xl border border-border"
        style={{
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* Draggable Header */}
        <div 
          className="flex items-center justify-between p-3 bg-orange-50 rounded-t-lg border-b border-orange-200 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <span className="font-medium text-orange-900">Profile Menu</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-100"
          >
            <X size={14} />
          </Button>
        </div>

        {/* Menu Content */}
        <div className="p-3">
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div>
                <div className="font-medium">You</div>
                <div className="text-sm text-muted-foreground">you@foundry.com</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}