'use client';
import {Server,Activity} from 'lucide-react'
export default function Switch({ selected = 'activity', onChange }) {
  const isActivity = selected === 'activity';
  const isSystem   = selected === 'system';

  const base = 'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition';
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1 ring-1 ring-gray-200">
      <button
        onClick={() => onChange('activity')}
        className={`${base} ${isActivity ? 'bg-white text-gray-900 shadow-sm border' : 'text-gray-800 hover:bg-white/60'}`}
      >
  
      <Activity className = "h-4 w-4"/>
        <span className="font-medium">Activity Logs</span>
      </button>

      <button
        onClick={() => onChange('system')}
        className={`${base} ${isSystem ? 'bg-white text-gray-900 shadow-sm border' : 'text-gray-800 hover:bg-white/60'}`}
      >

       <Server className = "h-4 w-4"/>
        <span className="font-medium">System Logs</span>
      </button>
    </div>
  );
}
