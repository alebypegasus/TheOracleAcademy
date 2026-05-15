import React from 'react';

export function Tooltip({ children, content }: { children: React.ReactNode, content: React.ReactNode }) {
  return (
    <div className="relative group/tooltip inline-block">
      {children}
      <div className="absolute opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 bg-[#1a1133] border border-indigo-500/30 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg bottom-full left-1/2 -translate-x-1/2 mb-2 w-max shadow-xl pointer-events-none z-[100]">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1133]"></div>
      </div>
    </div>
  );
}
