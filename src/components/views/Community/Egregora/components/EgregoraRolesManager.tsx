import React, { useState } from 'react';
import { Shield, Crown, User, AlertOctagon } from 'lucide-react';
import { PageCard } from '../../../../ui/PageCard';

export function EgregoraRolesManager({ 
  egregora, 
  currentUser,
  onUpdateRoles
}: { 
  egregora: any; 
  currentUser: any;
  onUpdateRoles?: (updatedEgregora: any) => void;
}) {
  // Mock member list
  const [members, setMembers] = useState([
    { id: currentUser.id, name: currentUser.name || 'Você', role: 'owner' },
    { id: 2, name: 'Mago Astuto', role: 'admin' },
    { id: 3, name: 'Iniciado Jovem', role: 'member' },
  ]);

  const handlePromote = (memberId: number, newRole: string) => {
    setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    // In a real app, we would call onUpdateRoles here
  };

  const handleRemove = (memberId: number) => {
    if (confirm("Deseja realmente expulsar este membro do Santuário?")) {
      setMembers(members.filter(m => m.id !== memberId));
    }
  };

  return (
    <PageCard className="p-6 border-[#312e81]">
      <h3 className="text-lg font-serif text-slate-200 mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-indigo-400" />
        Gerenciamento de Cargos e Membros
      </h3>

      <div className="space-y-4">
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between p-4 bg-black/40 border border-[#1e1b4b] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">{member.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                  {member.role === 'owner' && <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1"><Crown className="w-3 h-3" /> Fundador</span>}
                  {member.role === 'admin' && <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1"><Shield className="w-3 h-3" /> Admin</span>}
                  {member.role === 'member' && <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-500/20 text-slate-400 border border-slate-500/30">Membro</span>}
                </div>
              </div>
            </div>

            {member.id !== currentUser.id && (
              <div className="flex items-center gap-2">
                <select 
                  value={member.role}
                  onChange={(e) => handlePromote(member.id, e.target.value)}
                  className="bg-black/40 border border-[#1e1b4b] rounded-lg py-1.5 px-3 text-xs text-slate-300 outline-none"
                >
                  <option value="member">Membro</option>
                  <option value="admin">Administrador</option>
                </select>
                <button 
                  onClick={() => handleRemove(member.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Expulsar"
                >
                  <AlertOctagon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </PageCard>
  );
}
