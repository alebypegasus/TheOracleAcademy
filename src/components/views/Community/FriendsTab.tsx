import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Search, MessageCircle, UserPlus, Circle } from 'lucide-react';
import { Card } from '@heroui/react';

interface FriendsTabProps {
  currentUser: any;
}

export function FriendsTab({ currentUser }: FriendsTabProps) {
  const [friends, setFriends] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  // Fallback Data if backend not yet fully populated
  const dummyFriends = [
    { id: 2, name: 'Serena Moon', authorTitle: 'Sacerdotisa', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', status: 'online' },
    { id: 3, name: 'Elias Thorne', authorTitle: 'Mestre Ascenso', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150', status: 'offline' },
    { id: 4, name: 'Lyra Star', authorTitle: 'Iniciado', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150', status: 'online' }
  ];

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await fetch('/api/community/friends', {
        headers: { 'Authorization': `Bearer fake-jwt`, 'x-user-id': currentUser?.id || '1' }
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setFriends(data);
      } else {
        setFriends(dummyFriends);
      }
    } catch (e) {
      setFriends(dummyFriends);
    }
  };

  const filtered = friends.filter(f => (f?.name || '').toLowerCase().includes((search || '').toLowerCase()));

  return (
    <div className="p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-purple-400" /> Seu Círculo
          </h2>
          <p className="text-gray-400 mt-1">Busque novos praticantes ou envie mensagens aos seus aliados.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input 
            placeholder="Buscar buscador..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 w-full md:w-64 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500/50 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((friend, idx) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all shadow-md overflow-hidden">
              <div className="p-4 flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={friend.avatar} alt={friend.name} className={`w-12 h-12 rounded-full object-cover border-2 ${friend.status === 'online' ? 'border-green-500' : 'border-gray-500'}`} />
                    <Circle size={12} className={`absolute bottom-0 right-0 rounded-full fill-current ${friend.status === 'online' ? 'text-green-500' : 'text-gray-500'} border-2 border-zinc-900`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{friend.name}</h3>
                    <p className="text-xs text-purple-400">{friend.authorTitle}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 hover:text-white transition-colors p-2 rounded-xl">
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
