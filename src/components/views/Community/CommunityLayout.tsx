import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Users, MessageCircle, Heart, Star, Compass, User, Globe, MessageSquare } from 'lucide-react';
import { Tabs, Tab } from "@heroui/react";
import { CommunityFeed } from './CommunityFeed';
import { FriendsTab } from './FriendsTab';
import { GroupsTab } from './GroupsTab';
import { DirectMessagesTab } from './DirectMessagesTab';
import { SocialSidebar } from './SocialSidebar';
import { EsotericCalendar } from './EsotericCalendar';
import { QuickProfileModal } from './QuickProfileModal';

interface CommunityLayoutProps {
  currentUser: any;
}

export function CommunityLayout({ currentUser }: CommunityLayoutProps) {
  const [activeTab, setActiveTab] = useState('feed');
  const [profileStatus, setProfileStatus] = useState('online');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const tabs = [
    { id: 'feed', title: 'Feed Cósmico', icon: <Globe size={20} /> },
    { id: 'groups', title: 'Egrégoras', icon: <Star size={20} /> },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full mx-auto h-[calc(100vh-8rem)]">
      {/* Sidebar Navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full xl:w-64 shrink-0 flex flex-col gap-4 sticky top-6 overflow-y-auto scrollbar-hide h-[calc(100vh-8rem)] pb-10"
      >
        {/* Sua Presença (Elevado ao Topo) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg group relative">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowProfileModal(true)}>
            <div className="relative">
              <img src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'} alt="Me" className="w-12 h-12 rounded-full border-2 border-purple-500/50 object-cover" />
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-slate-900 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${profileStatus === 'online' ? 'bg-green-500' : profileStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate group-hover:text-purple-300 transition-colors">{currentUser?.name || 'Buscador'}</p>
              <p className="text-xs text-purple-400 truncate">{currentUser?.authorTitle || 'Iniciado'}</p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-white/10">
            <select 
              value={profileStatus}
              onChange={(e) => setProfileStatus(e.target.value)}
              className="w-full bg-black/20 hover:bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="online">🟢 Online</option>
              <option value="away">🟡 Ausente</option>
              <option value="offline">⚪ Invisível</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <h2 className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 uppercase tracking-wider">
            Conexão Astral
          </h2>
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] border border-purple-500/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <div className={`${activeTab === tab.id ? 'text-purple-400' : 'text-gray-500'}`}>
                  {tab.icon}
                </div>
                <span className="font-medium text-sm">{tab.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Calendário Ocultista Animado */}
        <EsotericCalendar />
      </motion.div>

      {/* Main Content Area */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 min-w-0 overflow-y-auto pr-2 scrollbar-hide"
      >
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && <CommunityFeed currentUser={currentUser} />}
          {activeTab === 'groups' && <GroupsTab currentUser={currentUser} />}
          {activeTab === 'friends' && <FriendsTab currentUser={currentUser} />}
          {activeTab === 'messages' && <DirectMessagesTab currentUser={currentUser} />}
        </AnimatePresence>
      </motion.div>

      {/* Right Social Sidebar (O Círculo) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SocialSidebar currentUser={currentUser} />
      </motion.div>

      {/* Modal de Perfil Rápido */}
      <AnimatePresence>
        {showProfileModal && (
          <QuickProfileModal 
            currentUser={currentUser} 
            status={profileStatus}
            onClose={() => setShowProfileModal(false)}
            onGoToProfile={() => {
              setShowProfileModal(false);
              // Trigger global nav to profile using dispatch event as quick fix
              document.dispatchEvent(new CustomEvent('NAVIGATE_TO', { detail: 'profile' }));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
