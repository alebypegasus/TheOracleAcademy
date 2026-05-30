import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Shield, Users, Plus, Settings } from 'lucide-react';
import { Card } from '@heroui/react';
import { EgregoraRootView } from './Egregora/EgregoraRootView';
import { EgregoraCreateWizard } from './Egregora/components/EgregoraCreateWizard';

interface GroupsTabProps {
  currentUser: any;
}

export function GroupsTab({ currentUser }: GroupsTabProps) {
  const [groups, setGroups] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeEgregora, setActiveEgregora] = useState<any | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'x-user-id': String(currentUser?.id || '1') };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/community/groups', { headers });
      const data = await res.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setGroups([]);
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

  const handleCreateGroup = async (groupData: any) => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-user-id': String(currentUser?.id || '1')
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/community/groups', {
        method: 'POST',
        headers,
        body: JSON.stringify(groupData)
      });
      if (!res.ok) {
        const err = await res.json();
        console.error('Erro ao criar egrégora:', err);
        return;
      }
      const created = await res.json();
      setGroups(prev => [created, ...prev]);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (activeEgregora) {
    return <EgregoraRootView egregora={activeEgregora} currentUser={currentUser} onBack={() => setActiveEgregora(null)} />;
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
                    onClick={(e) => { e.stopPropagation(); setActiveEgregora(group); }}
                    className="absolute top-3 right-3 backdrop-blur-md bg-warning/20 border border-warning/50 hover:bg-warning/40 text-warning px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-colors z-10"
                  >
                    <Settings size={12}/> Gerir
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
        <EgregoraCreateWizard 
          currentUser={currentUser}
          onClose={() => setIsOpen(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
}
