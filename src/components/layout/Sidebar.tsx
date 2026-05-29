import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, BookOpen, Library, Layers, Trophy, FileBadge, Users,
  Eye, Book, Sparkles, Sun, Moon, LogOut, Monitor, ShoppingBag, X, ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/Tooltip';

export function Sidebar({ currentPath, themePreference, setThemePreference, colorTheme, setColorTheme, profile, onNavigate, onLogout, currentUser, className, onMobileClose }: any) {
  const [isExpanded, setIsExpanded] = useState(false);

  const navGroups = [
    {
      group: 'Principal',
      items: [
        { name: 'Painel', path: '/dashboard', icon: Home },
        { name: 'Comunidade', path: '/community', icon: Users },
        { name: 'Meus Cursos', path: '/courses', icon: BookOpen },
        { name: 'Grimório', path: '/grimoire', icon: Book },
      ]
    },
    {
      group: 'Ferramentas',
      items: [
        { name: 'Desafios', path: '/challenges', icon: Trophy },
        { name: 'Orientação do Oráculo', path: '/oracle', icon: Eye },
        { name: 'Mercado Místico', path: '/library', icon: ShoppingBag },
      ]
    },
    {
      group: 'Suporte',
      items: [
        { name: 'Diretrizes', path: '/guidelines', icon: Book },
        { name: 'Ajuda & Suporte', path: '/support', icon: Sparkles },
        ...(currentUser?.role === 'admin' ? [{ name: 'Administração', path: '/admin', icon: ShieldAlert }] : [])
      ]
    }
  ];

  return (
    <motion.aside
      className={cn(
        "flex flex-col h-full bg-white/50 dark:bg-black/40 backdrop-blur-3xl border-r border-slate-200/50 dark:border-[#1e1b4b] relative z-50",
        className
      )}
      initial={false}
      animate={{ width: isExpanded ? 280 : 80 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-center h-24 border-b border-slate-200/50 dark:border-[#1e1b4b] relative">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div 
              key="expanded-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 w-full px-6 theme-logo-glow"
            >
              <div className="h-12 w-12 theme-logo-image" />
              <div className="h-6 w-[120px] theme-logo-text" />
            </motion.div>
          ) : (
            <motion.div 
              key="collapsed-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="theme-logo-glow"
            >
              <div className="h-10 w-10 theme-logo-image" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {onMobileClose && (
          <button onClick={onMobileClose} className="xl:hidden absolute right-4 p-2 rounded-full bg-white/10 text-slate-500 hover:text-white z-20">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto hide-scrollbar py-4 px-3 space-y-6">
        {navGroups.map((group, groupIdx) => (
          <div key={group.group} className="flex flex-col gap-1">
            <AnimatePresence>
              {isExpanded && (
                <motion.h4 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1"
                >
                  {group.group}
                </motion.h4>
              )}
            </AnimatePresence>

            {group.items.map((item) => {
              const isActive = currentPath === item.path;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.name}
                  onClick={() => onNavigate(item.path)}
                  className={cn(
                    "relative flex items-center h-12 w-full rounded-2xl transition-all duration-300 group overflow-hidden",
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-indigo-500/10 border border-[#312e81] rounded-2xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <div className="w-[56px] h-full flex items-center justify-center flex-shrink-0 z-10">
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-medium whitespace-nowrap z-10 text-left flex-1"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200/50 dark:border-[#1e1b4b] p-3 flex flex-col gap-3">
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-center gap-2 p-1 bg-slate-200/50 dark:bg-black/50 rounded-xl"
            >
              {[
                { id: 'light', icon: Sun },
                { id: 'auto', icon: Monitor },
                { id: 'dark', icon: Moon }
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setThemePreference(theme.id)}
                  className={cn(
                    "p-2 rounded-lg transition-colors flex-1 flex justify-center",
                    themePreference === theme.id ? "bg-white dark:bg-white/10 text-indigo-500 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  )}
                >
                  <theme.icon className="w-4 h-4" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => onNavigate('/profile')}
          className="flex items-center w-full rounded-2xl hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors p-2"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-300 dark:border-[#1e1b4b] flex-shrink-0">
            <img src={currentUser?.avatar || profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 ml-3 text-left overflow-hidden"
              >
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {currentUser?.name || profile.name}
                </div>
                <div className="text-xs text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {currentUser?.xp || profile.xp} XP
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {isExpanded ? (
            <motion.button 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onClick={onLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Sair</span>
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onLogout}
              className="flex items-center justify-center w-full h-12 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
