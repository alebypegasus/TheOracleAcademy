import React from 'react';
import { Lock, Unlock } from 'lucide-react';

export function SectionLock({ isPaid, className = "" }: { isPaid: boolean, className?: string }) {
  return (
    <div className={`z-20 ${className}`}>
      {isPaid ? (
        <div className="w-8 h-8 rounded-full border border-green-500/50 bg-green-500/20 flex items-center justify-center backdrop-blur-md shadow-[0_0_10px_rgba(34,197,94,0.2)]" title="Plano Premium Ativo">
          <Unlock className="w-4 h-4 text-green-400" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full border border-rose-500/50 bg-rose-500/20 flex items-center justify-center backdrop-blur-md shadow-[0_0_10px_rgba(244,63,94,0.2)]" title="Conteúdo Travado">
          <Lock className="w-4 h-4 text-rose-400" />
        </div>
      )}
    </div>
  );
}
