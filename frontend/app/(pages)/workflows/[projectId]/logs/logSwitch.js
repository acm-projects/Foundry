'use client';

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
  
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h4l2-7 4 14 2-7h4"/>
        </svg>
        <span className="font-medium">Activity Logs</span>
      </button>

      <button
        onClick={() => onChange('system')}
        className={`${base} ${isSystem ? 'bg-white text-gray-900 shadow-sm border' : 'text-gray-800 hover:bg-white/60'}`}
      >

        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="6" rx="2"/>
          <rect x="3" y="14" width="18" height="6" rx="2"/>
          <path d="M7 8h.01M7 18h.01"/>
        </svg>
        <span className="font-medium">System Logs</span>
      </button>
    </div>
  );
}
