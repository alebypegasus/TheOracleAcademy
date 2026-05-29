import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Phone, Video, MessageCircle, MoreVertical, Search, Hexagon, ChevronDown } from 'lucide-react';
import { CallModal } from './CallModal';
import { DMModal } from './DMModal';
import { QuickProfileModal } from './QuickProfileModal';

interface SocialSidebarProps {
  currentUser: any;
}

// Mock de amigos baseados no Círculo
const mockFriends = [
  { id: 1, name: 'Lyra Star', status: 'online', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', title: 'Oraculista' },
  { id: 2, name: 'Elias Thorne', status: 'online', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', title: 'Mago Natural' },
  { id: 3, name: 'Serena Moon', status: 'away', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', title: 'Astróloga' },
  { id: 4, name: 'Kael Sun', status: 'offline', avatar: 'https://i.pravatar.cc/150?u=a04258', title: 'Buscador' },
  { id: 5, name: 'Aurora Sky', status: 'online', avatar: 'https://i.pravatar.cc/150?u=a042', title: 'Taróloga' },
];

export function SocialSidebar({ currentUser }: SocialSidebarProps) {
  const [accordionState, setAccordionState] = useState({
    online: true,
    away: true,
    offline: false
  });

  const [activeCall, setActiveCall] = useState<{ contact: any, type: 'voice'|'video' } | null>(null);
  const [activeDM, setActiveDM] = useState<any | null>(null);
  const [activeProfile, setActiveProfile] = useState<any | null>(null);

  const toggleAccordion = (section: keyof typeof accordionState) => {
    setAccordionState(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const onlines = mockFriends.filter(f => f.status === 'online');
  const aways = mockFriends.filter(f => f.status === 'away');
  const offlines = mockFriends.filter(f => f.status === 'offline');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
      case 'away': return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full xl:w-80 shrink-0 flex flex-col gap-4 sticky top-6 h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide pb-10">
      
      {activeCall && (
        <CallModal 
          contactName={activeCall.contact.name}
          contactAvatar={activeCall.contact.avatar}
          type={activeCall.type}
          onClose={() => setActiveCall(null)} 
        />
      )}

      {activeDM && <DMModal contact={activeDM} onClose={() => setActiveDM(null)} />}
      
      {activeProfile && (
        <QuickProfileModal 
          currentUser={{ ...activeProfile, authorTitle: activeProfile.title }} 
          status={activeProfile.status} 
          onClose={() => setActiveProfile(null)} 
          onGoToProfile={() => {
            document.dispatchEvent(new CustomEvent('NAVIGATE_TO', { detail: 'profile' }));
            setActiveProfile(null);
          }} 
        />
      )}

      <div className="bg-[#12121a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            O Círculo
            <span className="bg-purple-500/20 text-purple-400 text-xs py-0.5 px-2 rounded-full border border-purple-500/30">
              {mockFriends.length}
            </span>
          </h2>
          <button className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 transition-colors">
            <Search size={16} />
          </button>
        </div>

        {/* Categoria Online */}
        <div className="mb-2">
          <button onClick={() => toggleAccordion('online')} className="flex items-center justify-between w-full py-2 px-1 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <span>Online — {onlines.length}</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${accordionState.online ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {accordionState.online && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex flex-col gap-1 mt-1">
                  {onlines.map(friend => (
                    <FriendRow key={friend.id} friend={friend} getStatusColor={getStatusColor} setActiveCall={setActiveCall} setActiveDM={setActiveDM} setActiveProfile={setActiveProfile} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categoria Ausentes */}
        <div className="mb-2">
          <button onClick={() => toggleAccordion('away')} className="flex items-center justify-between w-full py-2 px-1 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <span>Ausentes — {aways.length}</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${accordionState.away ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {accordionState.away && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex flex-col gap-1 mt-1">
                  {aways.map(friend => (
                    <FriendRow key={friend.id} friend={friend} getStatusColor={getStatusColor} setActiveCall={setActiveCall} setActiveDM={setActiveDM} setActiveProfile={setActiveProfile} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categoria Offline */}
        <div className="mb-2">
          <button onClick={() => toggleAccordion('offline')} className="flex items-center justify-between w-full py-2 px-1 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <span>Offline — {offlines.length}</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${accordionState.offline ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {accordionState.offline && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex flex-col gap-1 mt-1 opacity-60">
                  {offlines.map(friend => (
                    <FriendRow key={friend.id} friend={friend} getStatusColor={getStatusColor} setActiveCall={setActiveCall} setActiveDM={setActiveDM} setActiveProfile={setActiveProfile} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// Subcomponente de Row com Watermelon Voice Chat Disclosure
function FriendRow({ friend, getStatusColor, setActiveCall, setActiveDM, setActiveProfile }: any) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group flex flex-col bg-transparent hover:bg-white/5 rounded-xl transition-all duration-200">
      <div className="flex items-center gap-3 p-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        
        {/* Avatar Watermelon Style - Ao clicar na foto abre o perfil */}
        <div className="relative shrink-0" onClick={(e) => { e.stopPropagation(); setActiveProfile(friend); }}>
          <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full border border-white/10 object-cover" />
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#12121a] ${getStatusColor(friend.status)}`}></div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white">{friend.name}</p>
          <p className="text-xs text-purple-400 truncate">{friend.title}</p>
        </div>
      </div>

      {/* Voice Chat Disclosure (Abre ao clicar) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1">
              <div className="bg-black/40 border border-white/5 rounded-lg p-3 flex flex-col gap-3">
                <p className="text-xs text-gray-400 text-center">Iniciando conexão astral...</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setActiveCall({ contact: friend, type: 'video' })} className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-white/10 rounded-lg transition-all" title="Chamada de Vídeo">
                    <Video size={14} />
                  </button>
                  <button onClick={() => setActiveCall({ contact: friend, type: 'voice' })} className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-white/10 rounded-lg transition-all" title="Chamada de Voz">
                    <Phone size={14} />
                  </button>
                  <button onClick={() => setActiveDM(friend)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all" title="Mensagem">
                    <MessageCircle size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Modais de Chat e Perfil */}
    </div>
  );
}
