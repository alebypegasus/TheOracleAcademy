import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Lock, Heart, ArrowRight, Zap } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';
import { MODULES } from './constants';

interface CoursesSagaProps {
  canAccess: (tier: string) => boolean;
  completedLessons: string[];
  favorites: string[];
  toggleFavorite: (e: React.MouseEvent, id: string) => void;
  handleNodeClick: (node: any, levelInfo: any) => void;
}

export function CoursesSaga({
  canAccess,
  completedLessons,
  favorites,
  toggleFavorite,
  handleNodeClick
}: CoursesSagaProps) {
  return (
    <motion.div 
      key="list-view"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="w-full flex flex-col flex-1 min-h-screen relative pb-20"
    >
      <div className="w-full px-4 lg:px-10 py-12 border-b border-[#1e1b4b] bg-white/[0.01]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
               <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-100 flex items-center gap-4">
                  Saga Oracular <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
               </h2>
               <p className="text-slate-400 max-w-xl text-sm md:text-base italic font-light">
                  "Onde a percepção encontra a tradição milenar. Conteúdo metodologicamente revisado por especialistas em ciências ocultas e simbólicas."
               </p>
            </div>
            <div className="flex items-center gap-3">
               <div className="px-4 py-2 rounded-xl bg-white/5 border border-[#1e1b4b] flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full theme-bg-primary shadow-[0_0_8px_rgba(var(--theme-primary-rgb),0.8)]" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300">Nível Atual: Iniciante</span>
               </div>
               <div className="px-4 py-2 rounded-xl theme-bg-primary-soft border theme-border-primary-soft flex items-center gap-2">
                  <Trophy className="w-4 h-4 theme-text-primary" />
                  <span className="text-sm font-bold text-slate-200">{completedLessons.length} XP Base</span>
               </div>
            </div>
         </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 lg:px-10 py-12 flex flex-col gap-10">
        {MODULES.map((levelBlock) => {
          const levelUnlocked = levelBlock.level === 0 || canAccess('medium');
          return (
            <div key={levelBlock.level} className={`
               relative w-full rounded-[2.5rem] overflow-hidden border transition-all duration-700 group
               ${levelUnlocked ? 'border-[#1e1b4b] bg-white/[0.01] hover:theme-border-primary-soft' : 'border-[#1e1b4b] bg-black/40 grayscale opacity-60'}
            `}>
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-transparent to-purple-950/20 transition-opacity duration-1000 group-hover:opacity-100 opacity-60" />
               
               {levelUnlocked && (
                  <div className={`absolute -top-1/2 -right-1/4 w-[600px] h-full ${levelBlock.bgGlow} opacity-[0.05] group-hover:opacity-[0.12] blur-[100px] rounded-full transition-opacity duration-1000 pointer-events-none`} />
               )}
               
               <div className="relative z-20 flex flex-col lg:flex-row p-8 lg:p-14 gap-12 lg:gap-24">
                  <div className="lg:w-1/4 flex flex-col justify-center">
                     <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] theme-text-primary mb-6 drop-shadow-[0_0_10px_rgba(var(--theme-primary-rgb),0.3)]">
                        {levelBlock.title.split('—')[0]}
                     </div>
                     <h3 className="text-3xl md:text-5xl font-serif text-slate-100 mb-8 leading-[1.1] tracking-tight">
                        {levelBlock.title.split('—')[1]}
                     </h3>
                     <div className="w-12 h-0.5 theme-bg-primary-soft mb-8" />
                     <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light italic">
                        {levelBlock.desc}
                     </p>
                     
                     {!levelUnlocked && (
                       <Tooltip content="Módulo trancado. Complete os anteriores para desbloqueá-lo.">
                          <div className="mt-10 flex items-center gap-3 text-slate-500 border border-[#1e1b4b] bg-white/5 px-6 py-4 rounded-2xl w-fit backdrop-blur-md">
                             <Lock className="w-4 h-4" /> 
                             <span className="text-[10px] uppercase tracking-widest font-bold">Arcano Bloqueado</span>
                          </div>
                       </Tooltip>
                     )}
                  </div>
  
                  <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                     {levelBlock.nodes.map((node) => {
                       const isFav = favorites.includes(node.id);
                       const requiresPlan = levelBlock.level >= 1;
                       const isPlanLocked = requiresPlan && !canAccess('medium');
                       return (
                        <motion.div 
                          layoutId={`course-card-${node.id}`}
                          key={node.id}
                          onClick={() => !isPlanLocked && handleNodeClick(node, levelBlock)}
                          className={`
                            p-8 sm:p-10 rounded-[2rem] border flex flex-col items-start gap-8 transition-all text-left relative overflow-hidden group/node
                            ${isPlanLocked ? 'cursor-default' : 'cursor-pointer'}
                            ${levelUnlocked 
                              ? 'bg-white/[0.02] hover:bg-white/[0.04] border-[#1e1b4b] hover:border-[#312e81] hover:-translate-y-2' 
                              : 'bg-transparent border-white/[0.02] cursor-not-allowed'}
                          `}
                        >
                           <div className="flex justify-between w-full relative z-10 items-start">
                             <Tooltip content={`Abrir ${node.name}`}>
                               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${node.tailwindColor} bg-opacity-10 border border-current ${node.color} shadow-2xl transition-transform duration-500 group-hover/node:rotate-6`}>
                                  {node.icon && React.createElement(node.icon, { className: `w-8 h-8 ${node.color}` })}
                               </div>
                             </Tooltip>
                             
                             {levelUnlocked && (
                               <Tooltip content={isFav ? "Remover favorito" : "Favoritar Arquétipo"}>
                                 <button 
                                   onClick={(e) => toggleFavorite(e, node.id)} 
                                   className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-all focus:outline-none hover:scale-110 active:scale-95"
                                 >
                                    <Heart className={`w-5 h-5 transition-colors duration-300 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
                                 </button>
                               </Tooltip>
                             )}
                           </div>
  
                           <div>
                              <h4 className={`font-serif text-xl mb-3 tracking-wide transition-colors ${levelUnlocked ? 'text-slate-100 group-hover/node:theme-text-primary' : 'text-slate-500'}`}>
                                 {node.name}
                              </h4>
                              <p className="text-xs text-slate-500 leading-relaxed font-light">
                                 {node.desc}
                              </p>
                           </div>
                           
                           {levelUnlocked && (
                              <div className="absolute right-8 bottom-8 w-10 h-10 rounded-full bg-white/5 border border-[#1e1b4b] flex items-center justify-center opacity-0 group-hover/node:opacity-100 group-hover/node:translate-x-0 -translate-x-4 transition-all">
                                 <ArrowRight className={`w-5 h-5 ${node.color}`} />
                              </div>
                           )}
  
                           {isPlanLocked && (
                             <div className="absolute inset-0 rounded-[2rem] flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-sm z-20 p-6 text-center">
                               <div className="w-12 h-12 rounded-full border-2 border-purple-500/60 bg-purple-900/30 flex items-center justify-center">
                                 <Zap className="w-5 h-5 text-purple-400" />
                               </div>
                               <div>
                                 <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Requer Plano</p>
                                 <h4 className="text-base font-serif font-bold text-purple-300">Ascendente</h4>
                                 <p className="text-xs text-slate-500 mt-1">R$ 49,90/mês</p>
                               </div>
                               <a
                                  href="#/subscription"
                                  onClick={e => e.stopPropagation()}
                                  className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all mt-1"
                               >
                                 Fazer Upgrade →
                               </a>
                             </div>
                           )}
                         </motion.div>
                        );
                      })}
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
    </motion.div>
  );
}
