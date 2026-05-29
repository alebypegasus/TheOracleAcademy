import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Check, Lock, Calendar, Bot, ChevronLeft, ArrowRight, Shield } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';
import { INNER_PATH } from './constants';

interface ModuleRoadmapProps {
  selectedNode: any;
  completedLessons: string[];
  handleStartLesson: (step: any, isStepLocked: boolean) => void;
  onBack: () => void;
}

export function ModuleRoadmap({
  selectedNode,
  completedLessons,
  handleStartLesson,
  onBack
}: ModuleRoadmapProps) {
  
  const completedCount = INNER_PATH.filter(step => completedLessons.includes(`${selectedNode.id}-step-${step.id}`)).length;
  const progressPercent = Math.round((completedCount / INNER_PATH.length) * 100);

  return (
    <motion.div 
      key="roadmap-view"
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex flex-col items-center overflow-y-auto"
    >
       <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-[#1e1b4b] py-4 px-6 md:px-12 w-full flex justify-between items-center shadow-2xl">
          <button onClick={onBack} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
             <div className="w-10 h-10 rounded-full border border-[#1e1b4b] flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-5 h-5" />
             </div>
             <span className="font-bold uppercase tracking-widest text-xs hidden sm:inline">Voltar à Saga</span>
          </button>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 font-bold text-slate-200 bg-white/5 border border-[#1e1b4b] px-4 py-2 rounded-full text-xs">
                Progresso: {progressPercent}%
             </div>
          </div>
       </div>

       <div className="w-full relative py-16 px-4 flex justify-center border-b border-[#1e1b4b] overflow-hidden shrink-0">
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
            <div className={`w-[800px] h-[800px] ${selectedNode.tailwindColor} opacity-[0.05] blur-[100px] rounded-full`} />
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
             <motion.div layoutId={`course-card-${selectedNode.id}`} className={`w-24 h-24 rounded-[2rem] ${selectedNode.tailwindColor} bg-opacity-10 flex items-center justify-center border border-current ${selectedNode.color} mb-8 backdrop-blur-xl rotate-3 shadow-2xl`}>
               <div className="-rotate-3">
                  {selectedNode.icon && React.createElement(selectedNode.icon, { className: "w-10 h-10" })}
               </div>
             </motion.div>
             <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{selectedNode.levelTitle}</div>
             <h2 className="text-5xl md:text-6xl font-serif text-white mb-6 tracking-tight">{selectedNode.name}</h2>
             <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl leading-relaxed">{selectedNode.desc}</p>
          </div>
       </div>

       <div className="flex-1 w-full max-w-3xl mx-auto py-16 px-4 md:px-8 relative">
          
          <div className="flex flex-col gap-12 relative z-10">
             {INNER_PATH.map((step, index) => {
                const stepId = `${selectedNode.id}-step-${step.id}`;
                const isCompleted = completedLessons.includes(stepId);
                const isLocked = index > 0 && !completedLessons.includes(`${selectedNode.id}-step-${INNER_PATH[index - 1].id}`);
                const isNext = !isCompleted && !isLocked;
                
                let ringColor = 'border-[#1e1b4b] bg-black/40';
                let iconColor = 'text-slate-600';
                
                if (isCompleted) {
                   ringColor = 'border-emerald-500/30 bg-emerald-500/5';
                   iconColor = 'text-emerald-400';
                } else if (isNext) {
                   ringColor = `border-current ${selectedNode.color} bg-white/5`;
                   iconColor = selectedNode.color;
                }
                
                let IconToRender = BookOpen;
                if (isCompleted) IconToRender = Check;
                else if (isLocked) IconToRender = Lock;
                else if (step.type === 'desafio') IconToRender = Calendar;
                else if (step.type === 'prova') IconToRender = Bot;

                return (
                   <motion.div 
                      key={step.id} 
                      onClick={() => !isLocked && handleStartLesson(step, isLocked)}
                      className={`relative w-full rounded-3xl border p-8 flex flex-col sm:flex-row items-center sm:justify-between gap-6 transition-all group overflow-hidden
                         ${ringColor}
                         ${isLocked ? 'opacity-60 grayscale-[50%]' : 'cursor-pointer hover:-translate-y-1 hover:shadow-xl'}
                         ${isNext ? 'shadow-[0_10px_40px_rgba(0,0,0,0.3)]' : ''}
                      `}
                   >
                      {isNext && (
                        <div className={`absolute top-0 left-0 w-1 h-full ${selectedNode.tailwindColor}`} />
                      )}

                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-[#1e1b4b] bg-[#0a0a0a] shrink-0 shadow-inner ${iconColor}`}>
                            <IconToRender className="w-6 h-6" />
                         </div>
                         <div className="text-left">
                            <div className="flex items-center gap-3 mb-1">
                               <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{step.type}</span>
                               {isNext && (
                                  <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm bg-current ${selectedNode.color} bg-opacity-20`}>Próximo</span>
                               )}
                            </div>
                            <h3 className={`text-xl font-serif ${isLocked ? 'text-slate-500' : 'text-slate-200'}`}>{step.title}</h3>
                         </div>
                      </div>

                      <div className="flex items-center gap-4">
                         <div className="text-3xl font-serif text-white/5 font-bold">
                            {selectedNode.level}.{step.id}
                         </div>
                         {!isLocked && (
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-[#1e1b4b] flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                               <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                         )}
                      </div>
                   </motion.div>
                );
             })}
          </div>
       </div>
    </motion.div>
  );
}
