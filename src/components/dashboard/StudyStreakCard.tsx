import React from 'react';
import { motion } from 'motion/react';
import { Flame, CheckCircle2, Sparkles, Trophy, Zap, Calendar, ArrowRight } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export function StudyStreakCard() {
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  
  // Custom mock data for heatmap
  const weeks = 12;
  const daysInWeek = 7;
  const heatmapData = Array.from({ length: weeks * daysInWeek }, (_, i) => {
    // Generate some random intensity (0: none, 1: low, 2: medium, 3: high)
    const isRecent = i > (weeks - 2) * daysInWeek;
    if (isRecent) return Math.floor(Math.random() * 3) + 1; 
    return Math.random() > 0.6 ? Math.floor(Math.random() * 4) : 0;
  });

  const getIntensityColors = (intensity: number) => {
    switch(intensity) {
      case 1: return 'bg-indigo-500/20 border-indigo-500/30';
      case 2: return 'bg-indigo-500/40 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]';
      case 3: return 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] border-indigo-400';
      default: return 'bg-white/5 border-white/5';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <div className="h-full w-full p-8 relative overflow-hidden group flex flex-col">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/5 rounded-full blur-[60px] -ml-24 -mb-24 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 premium-icon-container flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.15, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Flame className="w-7 h-7 text-orange-400 fill-orange-400/20 icon-glow" strokeWidth={1.5} />
                </motion.div>
              </div>
              <div>
                <h3 className="text-xl font-serif text-slate-100 flex items-center gap-2">
                  Ofensiva de Estudo
                </h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Conexão Diária</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-1">
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-serif font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                  7
                </motion.span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Dias</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-4 mb-10">
            {daysOfWeek.map((day, i) => {
              const isToday = i === 5; // Simulating Friday
              const isPast = i < 5;
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border ${
                      isPast 
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                      : isToday 
                        ? 'bg-white/5 border-indigo-500/50 text-indigo-300 animate-pulse'
                        : 'bg-black/20 border-white/5 text-slate-600'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Zap className={`w-5 h-5 ${isToday ? 'opacity-100' : 'opacity-20'}`} />
                    )}
                  </motion.div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-indigo-400' : 'text-slate-500'}`}>{day}</span>
                </div>
              );
            })}
          </div>
          
          <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Sparkles className="w-12 h-12 text-indigo-400" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed relative z-10">
              Sua aura brilha intensamente! Mantenha a frequência por mais <span className="text-indigo-400 font-bold">3 dias</span> para expandir seu <span className="text-indigo-400">Grimório</span>.
            </p>
          </div>

          <div className="pt-8 border-t border-white/5 space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Mapa de Consistência
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Visualização de Fluxo Energético</p>
              </div>
              <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Vazio</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((int) => (
                    <div key={int} className={`w-3 h-3 rounded-[3px] border ${getIntensityColors(int)} shadow-none`} />
                  ))}
                </div>
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Pico</span>
              </div>
            </div>

            <div className="flex gap-6 items-start overflow-hidden group/map">
              <div className="flex flex-col justify-between text-[10px] text-slate-600 font-black h-28 mb-8 uppercase tracking-widest py-1">
                <span>Seg</span>
                <span>Qua</span>
                <span>Sex</span>
                <span>Dom</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-8 custom-scrollbar-horizontal pr-4 hide-scrollbar">
                {Array.from({ length: weeks }).map((_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-2 h-28">
                    {Array.from({ length: daysInWeek }).map((_, dayIndex) => {
                      const dataIndex = weekIndex * daysInWeek + dayIndex;
                      const intensity = heatmapData[dataIndex];
                      return (
                        <Tooltip key={dayIndex} content={`${intensity > 0 ? intensity + ' horas de imersão' : 'Silêncio Astral'}`} placement="top">
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                              delay: dataIndex * 0.003 
                            }}
                            whileHover={{ 
                              scale: 1.4,
                              zIndex: 20,
                              transition: { duration: 0.2 }
                            }}
                            className={`w-4 h-4 rounded-md border transition-all duration-300 cursor-pointer ${getIntensityColors(intensity)}`} 
                          />
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            <motion.div 
              whileHover={{ x: 5 }}
              className="bg-gradient-to-r from-indigo-500/10 to-transparent border border-indigo-500/20 p-5 rounded-[2rem] flex items-center gap-5 group/promo cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 group-hover/promo:bg-indigo-500/30 transition-all shadow-xl">
                 <Trophy className="w-6 h-6 text-indigo-300 drop-shadow-[0_0_10px_rgba(165,180,252,0.5)]" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.25em] mb-1">Próxima Ascensão</p>
                <p className="text-sm text-slate-300">Conquiste o <span className="font-bold text-white italic">Arcano II</span> em 3 dias.</p>
              </div>
              <ArrowRight className="w-5 h-5 text-indigo-500/50 group-hover/promo:text-indigo-400 transition-all group-hover/promo:translate-x-1" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
