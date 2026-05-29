import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Crown, User, MoreVertical, ShieldAlert, ArrowRightLeft } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'subadmin' | 'member';
  avatar: string;
}

interface EgregoraAdminPanelProps {
  egregoraName: string;
  currentUser: any;
  onClose: () => void;
}

export function EgregoraAdminPanel({ egregoraName, currentUser, onClose }: EgregoraAdminPanelProps) {
  // Mock de membros da Egrégora para teste visual
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: currentUser?.name || 'Alessandro Ramos', role: 'owner', avatar: currentUser?.avatar || 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: '2', name: 'Lyra Star', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Elias Thorne', role: 'subadmin', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'Aurora Sky', role: 'member', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', name: 'Kael Sun', role: 'member', avatar: 'https://i.pravatar.cc/150?u=5' },
  ]);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner': return <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"><Crown size={12}/> Titular (Dono)</span>;
      case 'admin': return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"><Shield size={12}/> Admin</span>;
      case 'subadmin': return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"><ShieldAlert size={12}/> Sub-Admin</span>;
      default: return <span className="bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"><User size={12}/> Membro</span>;
    }
  };

  const changeRole = (targetId: string, newRole: Member['role']) => {
    // Lógica para transferir titularidade (Dono)
    if (newRole === 'owner') {
      const confirmTransfer = window.confirm("ATENÇÃO: Você está transferindo a titularidade absoluta desta Egrégora. Você perderá os direitos de Dono e será rebaixado a Admin. Deseja continuar?");
      if (!confirmTransfer) return;
      
      setMembers(members.map(m => {
        if (m.id === targetId) return { ...m, role: 'owner' };
        if (m.role === 'owner') return { ...m, role: 'admin' }; // O antigo dono vira admin
        return m;
      }));
    } else {
      setMembers(members.map(m => m.id === targetId ? { ...m, role: newRole } : m));
    }
    setActiveMenuId(null);
  };

  const removeMember = (targetId: string) => {
    if (window.confirm("Deseja realmente remover este membro da egrégora?")) {
      setMembers(members.filter(m => m.id !== targetId));
    }
    setActiveMenuId(null);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#12121a] border border-white/10 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(147,51,234,0.15)] flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="text-purple-400" /> Gestão da Egrégora
            </h2>
            <p className="text-sm text-gray-400 mt-1">Gerencie papéis, transfira a coroa e administre: <span className="text-purple-300">{egregoraName}</span></p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-black/20 p-2 rounded-xl transition-colors">Fechar</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
          <div className="flex flex-col gap-3">
            {members.sort((a, b) => {
              const order = { owner: 0, admin: 1, subadmin: 2, member: 3 };
              return order[a.role] - order[b.role];
            }).map((member) => (
              <div key={member.id} className="bg-black/20 border border-white/5 p-3 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border border-white/10" />
                  <div>
                    <p className="font-medium text-white">{member.name} {member.id === '1' && <span className="text-xs text-gray-500">(Você)</span>}</p>
                    <div className="mt-1">{getRoleBadge(member.role)}</div>
                  </div>
                </div>

                {/* Dropdown de Ações */}
                {member.id !== '1' && (
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                      className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenuId === member.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                        <div className="flex flex-col">
                          {member.role !== 'admin' && (
                            <button onClick={() => changeRole(member.id, 'admin')} className="text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-purple-400 flex items-center gap-2">
                              <Shield size={14}/> Promover a Admin
                            </button>
                          )}
                          {member.role !== 'subadmin' && member.role !== 'admin' && (
                            <button onClick={() => changeRole(member.id, 'subadmin')} className="text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-blue-400 flex items-center gap-2">
                              <ShieldAlert size={14}/> Promover a Sub-Admin
                            </button>
                          )}
                          {member.role !== 'member' && (
                            <button onClick={() => changeRole(member.id, 'member')} className="text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2">
                              <User size={14}/> Rebaixar a Membro
                            </button>
                          )}
                          <div className="h-px bg-white/10 my-1"></div>
                          <button onClick={() => changeRole(member.id, 'owner')} className="text-left px-4 py-2.5 text-sm text-yellow-500 hover:bg-yellow-500/10 flex items-center gap-2">
                            <ArrowRightLeft size={14}/> Transferir Dono
                          </button>
                          <div className="h-px bg-white/10 my-1"></div>
                          <button onClick={() => removeMember(member.id)} className="text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2">
                            Remover da Egrégora
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
