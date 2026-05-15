import React, { useState } from 'react';
import { Search, Flame, Bell, Sparkles } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { motion, AnimatePresence } from 'motion/react';

export function Header({ searchQuery, setSearchQuery, profile }: any) {
  const [notifications, setNotifications] = useState([{ id: 1, text: 'Novo baralho místico desbloqueado!' }, { id: 2, text: 'Lembrete de leitura diária.' }]);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex flex-col md:flex-row md:items-end w-full justify-between gap-6 relative z-50">
      <div>
        <h2 className="text-3xl font-serif font-medium text-slate-100 flex items-center gap-2">
          Bem-vindo de volta, {profile.name?.split(' ')[0] || 'Usuário'} <Sparkles className="w-6 h-6 text-indigo-400" />
        </h2>
        <p className="text-slate-400 mt-2">Continue sua jornada de conhecimento.</p>
      </div>
      
      <div className="flex items-center flex-wrap gap-4">
        {/* Search Bar */}
        <div className="glass-panel px-4 py-2 rounded-xl flex items-center">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Buscar na plataforma..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-32 focus:w-48 transition-all duration-300"
          />
        </div>


        <div className="relative">
          <Tooltip content="Notificações">
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className="glass-panel w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors group relative"
            >
              <Bell className={`w-6 h-6 ${showNotifications ? 'text-indigo-300' : 'text-indigo-400'} group-hover:scale-110 transition-transform`} />
              {notifications.length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#090514]"></span>}
            </button>
          </Tooltip>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-4 w-64 glass-panel border border-indigo-500/20 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-white/5 bg-white/[0.02]">
                  <h4 className="text-sm font-medium text-slate-200">Notificações</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className="p-3 border-b border-white/5 text-sm text-slate-400 hover:bg-white/[0.02] cursor-pointer">
                        {n.text}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border-b border-white/5 text-sm text-slate-500 text-center">Nenhuma nova notificação.</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
