import React, { useState } from 'react';
import { Crown, AlertTriangle } from 'lucide-react';
import { PageCard } from '../../../../ui/PageCard';

export function EgregoraOwnershipTransfer({ 
  egregora,
  currentUser
}: { 
  egregora: any;
  currentUser: any;
}) {
  const [targetUserId, setTargetUserId] = useState('');
  
  const handleTransfer = () => {
    if (!targetUserId) return;
    if (confirm("ATENÇÃO: Você está prestes a abdicar de sua posição como Fundador. Esta ação não pode ser desfeita. Tem certeza?")) {
      alert(`Título de Fundador transferido para o ID: ${targetUserId}`);
    }
  };

  if (egregora.ownerId !== currentUser.id) return null;

  return (
    <PageCard className="p-6 border-rose-900/30 bg-rose-950/10">
      <h3 className="text-lg font-serif text-rose-400 mb-2 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        Transferência de Titularidade (Zona de Perigo)
      </h3>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        Como fundador desta Egrégora, você pode passar a propriedade para outro membro. 
        Ao fazer isso, você perderá seus direitos absolutos e se tornará um administrador comum.
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="text-[10px] text-rose-500/70 font-bold uppercase tracking-wider block mb-1">ID do Novo Fundador</label>
          <input 
            type="text" 
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="Digite o ID do membro..."
            className="w-full bg-black/40 border border-rose-900/30 rounded-xl py-2.5 px-4 text-slate-200 outline-none focus:border-rose-500/50"
          />
        </div>
        <button 
          onClick={handleTransfer}
          disabled={!targetUserId}
          className="px-6 py-2.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <Crown className="w-4 h-4" /> Transferir
        </button>
      </div>
    </PageCard>
  );
}
