import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-aria-components';
import { motion } from 'motion/react';
import { 
  Home, BookOpen, Library, Layers, Trophy, FileBadge, Users,
  Eye, Book, CreditCard, ChevronDown, Sparkles, Sun, Moon, LogOut, Monitor
} from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export function Sidebar({ currentPath, themePreference, setThemePreference, colorTheme, setColorTheme, profile, onNavigate, onLogout, currentUser }: any) {
  const navGroups = [
    {
      group: 'Principal',
      items: [
        { name: 'Painel', path: '/dashboard', icon: Home },
        { name: 'Orientação do Oráculo', path: '/oracle', icon: Eye },
        { name: 'Grimório', path: '/grimoire', icon: Book },
      ]
    },
    {
      group: 'Aprendizado',
      items: [
        { name: 'Meus Cursos', path: '/courses', icon: BookOpen },
        { name: 'Biblioteca', path: '/library', icon: Library },
      ]
    },
    {
      group: 'Conquistas',
      items: [
        { name: 'Desafios', path: '/challenges', icon: Trophy },
        { name: 'Certificados', path: '/certificates', icon: FileBadge },
      ]
    },
    {
      group: 'Extras',
      items: [
        { name: 'Comunidade', path: '/community', icon: Users },
        { name: 'Diretrizes', path: '/guidelines', icon: Book },
        { name: 'Ajuda & Suporte', path: '/support', icon: Sparkles },
      ]
    }
  ];

  return (
    <aside className="w-72 hidden xl:flex flex-col border-r border-white/5 bg-[#080510]/80 backdrop-blur-xl relative z-20 shadow-2xl">
      <div className="p-6 flex items-center justify-center py-8 h-auto">
        <div className="flex items-center justify-center gap-3 w-full theme-logo-glow">
          <div className="h-24 w-24 theme-logo-image" />
          <div className="h-10 w-[140px] theme-logo-text" />
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.group}>
            <h4 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
              {group.group}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = currentPath === item.path;
                const Icon = item.icon;
                return (
                   <button
                    key={item.name}
                    onClick={() => onNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                      ${isActive ? 'theme-bg-primary-soft theme-text-primary font-medium' : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'}`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabIndicator" 
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 theme-bg-primary rounded-r-md"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className={`flex items-center justify-center p-1.5 rounded-md transition-colors ${isActive ? 'theme-text-primary' : 'text-slate-500 group-hover:theme-text-primary'}`}>
                      <Icon className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <span className="text-sm tracking-wide truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/5 flex flex-col gap-4">
        <div className="flex w-full justify-center">
          <Tabs 
            selectedKey={themePreference} 
            onSelectionChange={(key) => setThemePreference(key as string)}
            className="w-full"
          >
            <TabList className="flex w-full bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full h-10 p-1" aria-label="Theme selection">
              <Tab id="light" className="flex-1 h-full rounded-full flex justify-center items-center text-zinc-500 cursor-pointer outline-none data-[selected]:bg-white data-[selected]:dark:bg-zinc-700 data-[selected]:text-zinc-900 data-[selected]:dark:text-zinc-100 data-[selected]:shadow-sm transition-colors" title="Modo Claro">
                <Sun className="w-4 h-4" />
              </Tab>
              <Tab id="auto" className="flex-1 h-full rounded-full flex justify-center items-center text-zinc-500 cursor-pointer outline-none data-[selected]:bg-white data-[selected]:dark:bg-zinc-700 data-[selected]:text-zinc-900 data-[selected]:dark:text-zinc-100 data-[selected]:shadow-sm transition-colors" title="Modo Automático">
                <Monitor className="w-4 h-4" />
              </Tab>
              <Tab id="dark" className="flex-1 h-full rounded-full flex justify-center items-center text-zinc-500 cursor-pointer outline-none data-[selected]:bg-white data-[selected]:dark:bg-zinc-700 data-[selected]:text-zinc-900 data-[selected]:dark:text-zinc-100 data-[selected]:shadow-sm transition-colors" title="Modo Escuro">
                <Moon className="w-4 h-4" />
              </Tab>
            </TabList>
          </Tabs>
        </div>

        {/* Theme Palette Picker (HeroUI inspired) */}
        <div className="flex justify-between items-center px-1">
          {['indigo', 'purple', 'rose', 'emerald', 'cyan', 'amber', 'oracle'].map((t) => (
             <Tooltip key={t} content={`Tema ${t.charAt(0).toUpperCase() + t.slice(1)}`}>
                <button
                   onClick={() => setColorTheme(t)}
                   className={`relative w-6 h-6 rounded-full transition-transform hover:scale-110 active:scale-95 shadow-sm focus:outline-none flex items-center justify-center`}
                   style={{ 
                     backgroundColor: 
                       t === 'indigo' ? '#6366f1' : 
                       t === 'purple' ? '#8b5cf6' : 
                       t === 'rose' ? '#f43f5e' : 
                       t === 'emerald' ? '#10b981' : 
                       t === 'cyan' ? '#06b6d4' : 
                       t === 'amber' ? '#f59e0b' : '#d4af37' // oracle is gold
                   }}
                >
                  {colorTheme === t && (
                    <span className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]" />
                  )}
                </button>
             </Tooltip>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-white/5 flex flex-col gap-4 group">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('/profile')} title="Configurações de Perfil">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-indigo-400/50 transition-colors">
            <img src={currentUser?.avatar || profile.avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-200 truncate">{currentUser?.name || profile.name}</h4>
              <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              Buscador do Oráculo
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[10px] text-indigo-400 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3" /> {currentUser?.xp || profile.xp} XP
              </p>
            </div>
          </div>
        </div>

        <Tooltip content="Sair / Encerrar Sessão">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 group/logout mt-1"
          >
            <LogOut className="w-3.5 h-3.5 group-hover/logout:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-semibold uppercase tracking-widest leading-none mt-[1px]">Sair da Conta</span>
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
