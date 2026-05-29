import React from 'react';
import { Lock, Zap, Crown } from 'lucide-react';
import { usePlan, PlanLevel } from '../hooks/usePlan';

const PLAN_LABELS: Record<string, string> = {
  medium: 'Ascendente',
  master: 'Mestre Supremo'
};

const PLAN_PRICES: Record<string, string> = {
  medium: 'R$ 49,90/mês',
  master: 'R$ 109,90/mês'
};

const PLAN_ICONS: Record<string, React.FC<any>> = {
  medium: Zap,
  master: Crown
};

interface PlanGateProps {
  requiredPlan: PlanLevel;
  featureName?: string;
  children: React.ReactNode;
  compact?: boolean;
  currentUser?: any; // pass the currentUser prop for prop-drilling apps
}

export function PlanGate({ requiredPlan, featureName, children, compact = false, currentUser }: PlanGateProps) {
  const { canAccess } = usePlan(currentUser);

  if (canAccess(requiredPlan)) {
    return <>{children}</>;
  }

  const label = PLAN_LABELS[requiredPlan] || requiredPlan;
  const price = PLAN_PRICES[requiredPlan] || '';
  const Icon = PLAN_ICONS[requiredPlan] || Lock;
  const color = requiredPlan === 'master' ? 'amber' : 'purple';

  if (compact) {
    return (
      <div className="relative inline-flex items-center gap-1">
        <span className="opacity-40 pointer-events-none select-none">{children}</span>
        <span
          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center
            ${color === 'amber' ? 'bg-amber-500' : 'bg-purple-600'}`}
          title={`Requer Plano ${label}`}
        >
          <Lock className="w-2.5 h-2.5 text-white" />
        </span>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Blurred content behind */}
      <div className="opacity-20 pointer-events-none select-none blur-sm">
        {children}
      </div>

      {/* Lock overlay */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center
        bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-sm rounded-2xl`}>
        
        <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center
          ${color === 'amber' 
            ? 'border-amber-500/60 bg-amber-900/30' 
            : 'border-purple-500/60 bg-purple-900/30'}`}>
          <Icon className={`w-6 h-6 ${color === 'amber' ? 'text-amber-400' : 'text-purple-400'}`} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">
            {featureName ? `"${featureName}"` : 'Este recurso'} requer
          </p>
          <h4 className={`text-lg font-serif font-bold mb-1
            ${color === 'amber' ? 'text-amber-300' : 'text-purple-300'}`}>
            Plano {label}
          </h4>
          {price && (
            <p className="text-xs text-slate-400">{price}</p>
          )}
        </div>

        <button
          onClick={() => document.dispatchEvent(new CustomEvent('OPEN_SUBSCRIPTION_MODAL'))}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all
            ${color === 'amber'
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-amber-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]'
            }`}
        >
          Fazer Upgrade →
        </button>
      </div>
    </div>
  );
}
