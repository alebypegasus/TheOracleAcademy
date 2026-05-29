import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Shield, Users, Plus, Settings } from 'lucide-react';
import { Card } from '@heroui/react';
import { EgregoraAdminPanel } from './EgregoraAdminPanel';
import { EgregoraDetailView } from './EgregoraDetailView';

interface GroupsTabProps {
  currentUser: any;
}

export function GroupsTab({ currentUser }: GroupsTabProps) {
  const [groups, setGroups] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [adminPanelGroup, setAdminPanelGroup] = useState<any | null>(null);
  const [activeEgregora, setActiveEgregora] = useState<any | null>(null);
  
  const [newGroup, setNewGroup] = useState({ name: '', desc: '', isPrivate: false });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/community/groups', {
        headers: { 'Authorization': `Bearer fake-jwt`, 'x-user-id': currentUser?.id || '1' }
      });
      const data = await res.json();
      setGroups(Array.isArray(data) && data.length > 0 ? data : getMockGroups());
    } catch (e) {
      console.error(e);
      setGroups(getMockGroups());
    }
  };

  const getMockGroups = () => [
    {
      id: 'g1',
      name: 'Alquimistas da Lua Negra',
      description: 'Estudos avançados sobre as marés lunares e magia de evocação noturna.',
      members_count: 142,
      cover_image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800',
      owner_id: '1'
    },
    {
      id: 'g2',
      name: 'Sociedade de Thoth',
      description: 'Pesquisadores de Hermetismo, Kabbalah e Geometria Sagrada.',
      members_count: 89,
      cover_image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800',
      owner_id: '2'
    },
    {
      id: 'g3',
      name: 'Roda de Hécate',
      description: 'Práticas de bruxaria tradicional, ritos de passagem e feitiçaria ligada à encruzilhada.',
      members_count: 350,
      cover_image: 'https://images.unsplash.com/photo-1505506874110-6a7a6c9924cb?q=80&w=800',
      owner_id: '3'
    }
  ];

  const handleCreateGroup = async (onClose: () => void) => {
    try {
      const res = await fetch('/api/community/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer fake-jwt`, 'x-user-id': currentUser?.id || '1' },
        body: JSON.stringify({ name: newGroup.name, description: newGroup.desc, isPrivate: newGroup.isPrivate })
      });
      const created = await res.json();
      setGroups([created, ...groups]);
      onClose();
      setNewGroup({ name: '', desc: '', isPrivate: false });
    } catch (e) {
      console.error(e);
    }
  };

  if (activeEgregora) {
    return <EgregoraDetailView group={activeEgregora} currentUser={currentUser} onBack={() => setActiveEgregora(null)} />;
  }

  return (
    <div className="p-2 pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="text-yellow-400" /> Suas Egrégoras
          </h2>
          <p className="text-gray-400 mt-1">Círculos fechados de estudo e práticas avançadas.</p>
        </div>
        <button 
          className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-transform hover:scale-105"
          onClick={() => setIsOpen(true)}
        >
          <Plus size={18} /> Fundar Egrégora
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, idx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setActiveEgregora(group)}
          >
            <Card className="bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer overflow-hidden group h-full flex flex-col">
              <div 
                className="h-32 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${group.cover_image || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800'})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                {group.owner_id === currentUser?.id && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setAdminPanelGroup(group); }}
                    className="absolute top-3 right-3 backdrop-blur-md bg-warning/20 border border-warning/50 hover:bg-warning/40 text-warning px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-colors z-10"
                  >
                    <Settings size={12}/> Gerir Membros
                  </button>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{group.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">{group.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    <img src="https://i.pravatar.cc/150?u=1" className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" />
                    <img src="https://i.pravatar.cc/150?u=2" className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" />
                    <img src="https://i.pravatar.cc/150?u=3" className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" />
                  </div>
                  <span className="text-xs text-purple-300 flex items-center gap-1"><Users size={14}/> {group.members_count} Membros</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-4">Fundar Nova Egrégora</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400">Nome do Círculo</label>
                <input 
                  placeholder="Ex: Alquimistas da Lua Negra" 
                  value={newGroup.name}
                  onChange={(e: any) => setNewGroup({...newGroup, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500/50 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400">Propósito (Descrição)</label>
                <textarea 
                  placeholder="Qual o objetivo desta egrégora?" 
                  value={newGroup.desc}
                  onChange={(e: any) => setNewGroup({...newGroup, desc: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500/50 outline-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-300">Tornar Egrégora Privada?</span>
                <button 
                  onClick={() => setNewGroup({...newGroup, isPrivate: !newGroup.isPrivate})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${newGroup.isPrivate ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${newGroup.isPrivate ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-xl" onClick={() => setIsOpen(false)}>Cancelar</button>
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors" onClick={() => handleCreateGroup(() => setIsOpen(false))}>Consagrar</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {adminPanelGroup && (
        <EgregoraAdminPanel 
          egregoraName={adminPanelGroup.name}
          currentUser={currentUser}
          onClose={() => setAdminPanelGroup(null)}
        />
      )}
    </div>
  );
}
