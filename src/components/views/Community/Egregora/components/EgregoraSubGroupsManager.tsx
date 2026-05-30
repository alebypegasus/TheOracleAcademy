import React, { useState } from 'react';
import { Layers, Plus, Settings } from 'lucide-react';
import { PageCard } from '../../../../ui/PageCard';

export function EgregoraSubGroupsManager({ 
  egregora 
}: { 
  egregora: any; 
}) {
  const [subgroups, setSubgroups] = useState([
    { id: 1, name: 'Câmara dos Iniciantes', type: 'public', members: 12 },
    { id: 2, name: 'Conselho Oculto', type: 'secret', members: 3 },
  ]);

  return (
    <PageCard className="p-6 border-[#312e81]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-serif text-slate-200 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Sub-Egrégoras
        </h3>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 rounded-lg text-xs font-bold uppercase transition-colors">
          <Plus className="w-4 h-4" /> Nova Sub-Egrégora
        </button>
      </div>

      <p className="text-xs text-slate-400 mb-6">
        Crie ramificações dentro desta Egrégora para focar em tópicos específicos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subgroups.map(group => (
          <div key={group.id} className="p-4 bg-black/40 border border-[#1e1b4b] rounded-xl hover:border-indigo-500/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-bold text-slate-200">{group.name}</h4>
              <button className="text-slate-500 hover:text-indigo-400"><Settings className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span className={`px-1.5 py-0.5 rounded ${group.type === 'secret' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {group.type}
              </span>
              <span>{group.members} membros</span>
            </div>
          </div>
        ))}
      </div>
    </PageCard>
  );
}
