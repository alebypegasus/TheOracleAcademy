import React, { useState } from 'react';
import { Flame, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export function StudyStreakCard() {
  const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  
  // Custom mock data for heatmap (github style style)
  // Generating last 12 weeks for a small heatmap
  const weeks = 12;
  const daysInWeek = 7;
  const heatmapData = Array.from({ length: weeks * daysInWeek }, (_, i) => {
    // Generate some random intensity (0: none, 1: low, 2: medium, 3: high)
    // Make recent days have higher probability of being filled
    const isRecent = i > (weeks - 2) * daysInWeek;
    if (isRecent) return Math.floor(Math.random() * 3) + 1; // More intense recently
    return Math.random() > 0.6 ? Math.floor(Math.random() * 4) : 0;
  });

  const getColorClass = (intensity: number) => {
    switch(intensity) {
      case 1: return 'bg-indigo-900/40 border-indigo-500/20';
      case 2: return 'bg-indigo-600/60 border-indigo-500/40';
      case 3: return 'bg-indigo-400 border-indigo-300';
      default: return 'bg-white/5 border-white/5';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-medium text-slate-200">Ofensiva de Estudo</h3>
        </div>
        
        <div className="flex items-end gap-2 mb-8 cursor-help">
          <Tooltip content="Sua ofensiva ativa atual">
            <span className="text-5xl font-serif text-slate-100">7</span>
          </Tooltip>
          <span className="text-slate-400 mb-1">Dias seguidos</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          {daysOfWeek.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              {i < 5 ? (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center gold-glow shadow-indigo-500/50">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <span className="text-xs text-slate-400">{day}</span>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          Continue assim! Mais 3 dias para desbloquear o distintivo <span className="text-indigo-300">Estudioso do Oráculo</span>.
        </p>

        <div className="pt-8 border-t border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Mapa de Consistência
            </h4>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 uppercase tracking-tighter">
              <span>Menos</span>
              <div className="flex gap-1">
                <div className={`w-2.5 h-2.5 rounded-sm border ${getColorClass(0)}`} />
                <div className={`w-2.5 h-2.5 rounded-sm border ${getColorClass(1)}`} />
                <div className={`w-2.5 h-2.5 rounded-sm border ${getColorClass(2)}`} />
                <div className={`w-2.5 h-2.5 rounded-sm border ${getColorClass(3)}`} />
              </div>
              <span>Mais</span>
            </div>
          </div>

          <div className="flex gap-4 items-end overflow-hidden pb-2 group">
            <div className="flex flex-col justify-between text-[9px] text-slate-500 font-mono h-24 mb-6">
              <span>Seg</span>
              <span>Qua</span>
              <span>Sex</span>
              <span>Dom</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-6 custom-scrollbar-horizontal pr-4">
              {Array.from({ length: weeks }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1.5 h-24">
                  {Array.from({ length: daysInWeek }).map((_, dayIndex) => {
                    const dataIndex = weekIndex * daysInWeek + dayIndex;
                    const intensity = heatmapData[dataIndex];
                    return (
                      <Tooltip key={dayIndex} content={`${intensity > 0 ? intensity + ' horas de imersão' : 'Silêncio'}`} placement="top">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: dataIndex * 0.005 }}
                          className={`w-3.5 h-3.5 rounded-sm border transition-all duration-300 hover:z-10 hover:scale-125 hover:shadow-[0_0_10px_rgba(99,102,241,0.4)] ${getColorClass(intensity)}`} 
                        />
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
               <Trophy className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-1">Próxima Recompensa</p>
              <p className="text-sm text-slate-200">Mantenha a ofensiva por mais <span className="font-bold text-white">3 dias</span> para o Arcano II.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
