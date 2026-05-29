import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Hash, Volume2, Shield, Users, Settings, ChevronLeft, ChevronRight, Search, Bell, Pin, MessageSquare, Star, BookOpen, Flame } from 'lucide-react';
import { CommunityFeed } from './CommunityFeed';

interface EgregoraDetailViewProps {
  group: any;
  currentUser: any;
  onBack: () => void;
}

const mockCategories: any[] = [
  {
    id: 'c1',
    name: 'TEMPLO INTERNO',
    channels: [
      { id: 'ch1', name: 'comunicados-oficiais', type: 'text', icon: <Shield size={16}/>, unread: 0 },
      { id: 'ch2', name: 'regras-e-iniciação', type: 'text', icon: <BookOpen size={16}/>, unread: 0 },
      { id: 'ch3', name: 'boas-vindas', type: 'text', icon: <Star size={16}/>, unread: 3 },
    ]
  },
  {
    id: 'c2',
    name: 'ESTUDOS MÍSTICOS',
    channels: [
      { id: 'ch4', name: 'alta-magia', type: 'text', icon: <Hash size={16}/>, unread: 12 },
      { id: 'ch5', name: 'goetia-prática', type: 'text', icon: <Hash size={16}/>, unread: 0 },
      { id: 'ch6', name: 'tarot-oráculos', type: 'text', icon: <Hash size={16}/>, unread: 5 },
      { id: 'ch7', name: 'hermetismo', type: 'text', icon: <Hash size={16}/>, unread: 0 },
    ]
  },
  {
    id: 'c3',
    name: 'CÍRCULOS DE PRÁTICA',
    channels: [
      { id: 'v1', name: 'Templo de Meditação', type: 'voice', icon: <Volume2 size={16}/>, users: ['User1', 'User2'] },
      { id: 'v2', name: 'Roda de Cura', type: 'voice', icon: <Volume2 size={16}/>, users: [] },
      { id: 'v3', name: 'Evocação em Grupo', type: 'voice', icon: <Flame size={16} className="text-red-400"/>, users: ['Buscador', 'Master'] },
    ]
  }
];

export function EgregoraDetailView({ group, currentUser, onBack }: EgregoraDetailViewProps) {
  const [activeChannel, setActiveChannel] = useState('ch4');

  return (
    <div className="flex flex-col h-full bg-[#050505] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
      {/* Banner / Header Principal da Egrégora */}
      <div 
        className="h-32 shrink-0 bg-cover bg-center relative flex items-end p-4"
        style={{ backgroundImage: `url(${group.cover_image || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="bg-black/50 hover:bg-white/10 border border-white/20 p-2 rounded-xl text-white backdrop-blur-md transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-md">{group.name}</h1>
              <p className="text-xs text-gray-300 flex items-center gap-2">
                <Users size={12}/> {group.members_count || 142} Membros Iniciados
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 hidden md:flex">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar grimórios..." 
                  className="bg-black/40 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 w-48 transition-all"
                />
             </div>
             <button className="bg-black/50 hover:bg-white/10 border border-white/20 p-2 rounded-xl text-gray-300 transition-colors"><Bell size={18} /></button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar: Sub-Egrégoras (Channels) */}
        <div className="w-64 shrink-0 bg-[#0a0a0f] border-r border-white/10 overflow-y-auto scrollbar-hide py-4 px-2 hidden lg:block">
          
          <div className="px-2 mb-6">
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 italic">"{group.description || 'Neste círculo sagrado, nos reunimos para partilhar a luz secreta da sabedoria antiga.'}"</p>
          </div>

          <div className="space-y-6">
            {mockCategories.map((cat) => (
              <div key={cat.id}>
                <h3 className="px-2 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <ChevronRight size={12} className="text-gray-600"/> {cat.name}
                </h3>
                <div className="space-y-0.5">
                  {cat.channels.map(ch => (
                    <button
                      key={ch.id}
                      onClick={() => ch.type === 'text' && setActiveChannel(ch.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors group
                        ${activeChannel === ch.id ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
                      `}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`${activeChannel === ch.id ? 'text-purple-400' : 'text-gray-500'} shrink-0`}>
                          {ch.icon}
                        </span>
                        <span className="truncate">{ch.name}</span>
                      </div>

                      {ch.unread > 0 && (
                        <span className="bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0">
                          {ch.unread}
                        </span>
                      )}

                      {ch.type === 'voice' && ch.users && ch.users.length > 0 && (
                        <span className="text-[10px] text-gray-500 font-bold px-1.5 rounded bg-white/5 border border-white/10 shrink-0">
                          {ch.users.length} lendo
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Admin Block (Mock) */}
          {group.owner_id === currentUser?.id && (
            <div className="mt-8 px-2 pt-4 border-t border-white/5">
              <button className="w-full flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Settings size={14}/> Gerenciar Egrégora
              </button>
            </div>
          )}

        </div>

        {/* Main Content: Channel Feed */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#050505]">
          {/* Channel Header */}
          <div className="h-14 shrink-0 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0f]/50 backdrop-blur-md">
             <div className="flex items-center gap-3">
                <Hash className="text-gray-500" size={20}/>
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {mockCategories.flatMap(c => c.channels).find(c => c.id === activeChannel)?.name || 'alta-magia'}
                </h2>
             </div>
             <div className="flex items-center gap-4 text-gray-400">
                <button className="hover:text-white transition-colors" title="Mensagens Fixadas"><Pin size={18}/></button>
                <button className="hover:text-white transition-colors" title="Membros Online"><Users size={18}/></button>
             </div>
          </div>

          {/* Feed Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
              {/* Reaproveitamos o CommunityFeed mas passando o canal específico se houver backend, por agora usamos o visual rico dele */}
              <CommunityFeed currentUser={currentUser} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
