import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, MessageSquare } from 'lucide-react';
import { EgregoraHeader } from './components/EgregoraHeader';
import { EgregoraChatFeed } from './components/EgregoraChatFeed';
import { EgregoraRolesManager } from './components/EgregoraRolesManager';
import { EgregoraSubGroupsManager } from './components/EgregoraSubGroupsManager';
import { EgregoraOwnershipTransfer } from './components/EgregoraOwnershipTransfer';

export function EgregoraRootView({ 
  egregora, 
  currentUser, 
  onBack 
}: { 
  egregora: any; 
  currentUser: any; 
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'feed' | 'manage'>('feed');

  const isAdmin = egregora.ownerId === currentUser.id || (egregora.admins && egregora.admins.includes(currentUser.id));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <EgregoraHeader 
        egregora={egregora} 
        currentUser={currentUser} 
        onBack={onBack} 
        onManage={isAdmin ? () => setActiveTab('manage') : undefined}
      />

      {isAdmin && (
        <div className="flex items-center gap-2 mb-6 border-b border-[#1e1b4b] pb-4">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'feed' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Templo (Feed)
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'manage' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" /> Gerenciar Egrégora
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'feed' ? (
          <motion.div 
            key="feed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <EgregoraChatFeed egregora={egregora} currentUser={currentUser} />
          </motion.div>
        ) : (
          <motion.div 
            key="manage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <EgregoraRolesManager egregora={egregora} currentUser={currentUser} />
            <EgregoraSubGroupsManager egregora={egregora} />
            <EgregoraOwnershipTransfer egregora={egregora} currentUser={currentUser} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
