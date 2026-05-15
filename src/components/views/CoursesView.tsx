import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Star, Crown, Lock, Feather, Flame, Sparkles, Droplets, Wind, Infinity, CircleDot, Eye, ChevronLeft, Check, Trophy, Calendar, PlayCircle, BookMarked, Shield, ArrowRight } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

const MODULES = [
  {
    level: 0,
    title: 'Módulo 0 — Fundamentos',
    desc: 'Obrigatório antes de qualquer oráculo. Evita prática superficial e confusão simbólica. Aprenda a base.',
    unlocked: true,
    bgGlow: 'bg-amber-500',
    nodes: [
      { id: 'fund-espirito', name: 'Natureza da Espiritualidade', desc: 'Espiritualidade, religião e ocultismo', icon: Crown, color: 'text-amber-400', tailwindColor: 'bg-amber-500' },
      { id: 'fund-magia', name: 'Estrutura da Magia', desc: 'Visão histórica, antropológica e correntes', icon: Sparkles, color: 'text-purple-400', tailwindColor: 'bg-purple-500' },
      { id: 'fund-altares', name: 'Altares e Consagração', desc: 'Como montar, consagrar ritualística e proteção', icon: Flame, color: 'text-rose-400', tailwindColor: 'bg-rose-500' },
    ]
  },
  {
    level: 1,
    title: 'Nível 1 — Oráculos Intuitivos',
    desc: 'Pouca estrutura, foco em percepção. Onde se aprende que intuição não é fantasia.',
    unlocked: true,
    bgGlow: 'bg-orange-500',
    nodes: [
      { id: 'leitura-velas', name: 'Leitura de Velas e Fumaça', desc: 'Piromancia, queima ritual, padrões', icon: Flame, color: 'text-orange-400', tailwindColor: 'bg-orange-500' },
      { id: 'leitura-agua', name: 'Água e Sombras', desc: 'Hidromancia, reflexos, visões', icon: Droplets, color: 'text-cyan-400', tailwindColor: 'bg-cyan-500' },
      { id: 'leitura-sorteios', name: 'Acaso e Pêndulo', desc: 'Dados, bibliomancia, radiestesia', icon: CircleDot, color: 'text-emerald-400', tailwindColor: 'bg-emerald-500' },
    ]
  },
  {
    level: 2,
    title: 'Nível 2 — Oráculos Simbólicos',
    desc: 'Sistemas leves e estruturados. Entra a disciplina interpretativa.',
    unlocked: false,
    bgGlow: 'bg-indigo-500',
    nodes: [
      { id: 'lenormand-kipper', name: 'Lenormand e Kipper', desc: 'Cartas objetivas e narrativa social', icon: BookOpen, color: 'text-indigo-400', tailwindColor: 'bg-indigo-500' },
      { id: 'runas-ogham', name: 'Runas e Ogham', desc: 'Sistemas nórdicos e celtas, alfabetos mágicos', icon: Feather, color: 'text-sky-400', tailwindColor: 'bg-sky-500' },
      { id: 'sibilla', name: 'Sibilla Italiana', desc: 'Narrativa emocional e prática de leitura', icon: Eye, color: 'text-pink-400', tailwindColor: 'bg-pink-500' },
    ]
  },
  {
    level: 3,
    title: 'Nível 3 — Oráculos Interpretativos',
    desc: 'Maior complexidade simbólica. Exigem interpretação profunda e associação.',
    unlocked: false,
    bgGlow: 'bg-purple-500',
    nodes: [
      { id: 'tarot', name: 'Tarot Clássico', desc: 'Sistema simbólico, arquétipos, numerologia', icon: Star, color: 'text-purple-400', tailwindColor: 'bg-purple-500' },
      { id: 'cafeomancia', name: 'Cafeomancia e Quiromancia', desc: 'Leitura de borras e linhas das mãos', icon: Droplets, color: 'text-amber-500', tailwindColor: 'bg-amber-600' },
      { id: 'oniromancia', name: 'Oniromancia e Geomancia', desc: 'Sonhos e 16 figuras astrológicas na terra', icon: Sparkles, color: 'text-blue-400', tailwindColor: 'bg-blue-500' },
    ]
  },
  {
    level: 4,
    title: 'Nível 4 — Sistemas Estruturados',
    desc: 'Sistemas avançados baseados em estrutura matemática, filosófica ou cosmológica.',
    unlocked: false,
    bgGlow: 'bg-emerald-500',
    nodes: [
      { id: 'iching', name: 'I Ching', desc: '64 hexagramas, filosofia taoísta profunda', icon: Infinity, color: 'text-emerald-500', tailwindColor: 'bg-emerald-600' },
      { id: 'astrologias', name: 'Astrologias', desc: 'Ocidental, Chinesa, Védica (esforço de cálculo)', icon: Star, color: 'text-cyan-500', tailwindColor: 'bg-cyan-600' },
      { id: 'numerologia', name: 'Numerologia e Qi Men', desc: 'Estrutura matemática e estratégia chinesa', icon: BookOpen, color: 'text-indigo-500', tailwindColor: 'bg-indigo-600' },
    ]
  },
  {
    level: 5,
    title: 'Nível 5 — Oráculos Tradicionais',
    desc: 'Sistemas iniciáticos ligados a culturas religiosas específicas.',
    unlocked: false,
    bgGlow: 'bg-rose-500',
    nodes: [
      { id: 'ifa', name: 'Ifá e Búzios', desc: 'Sistema yorubá (Odus) e derivações oraculares', icon: Wind, color: 'text-orange-500', tailwindColor: 'bg-orange-600' },
      { id: 'obi', name: 'Obi e Diloggún', desc: 'Consulta simples à tradição viva', icon: Flame, color: 'text-rose-500', tailwindColor: 'bg-rose-600' },
      { id: 'prashna', name: 'Prashna Astrológico', desc: 'Astrologia horária e contextos religiosos antigos', icon: Eye, color: 'text-purple-500', tailwindColor: 'bg-purple-600' },
    ]
  },
  {
    level: 6,
    title: 'Nível 6 — Esotéricos e Rituais',
    desc: 'Oráculos mestres que envolvem alta magia, entidades ou alteração de consciência.',
    unlocked: false,
    bgGlow: 'bg-red-500',
    nodes: [
      { id: 'cabala', name: 'Oráculos Cabalísticos', desc: 'Árvore da Vida, geometria divina', icon: Crown, color: 'text-yellow-500', tailwindColor: 'bg-yellow-500' },
      { id: 'enochiano', name: 'Goécia e Enochiano', desc: 'Evocação, sistema mágico complexo', icon: Eye, color: 'text-red-500', tailwindColor: 'bg-red-600' },
      { id: 'hermetismo', name: 'Hermetismo e Necromancia', desc: 'Visões alteradas, rituais e ancestralidade', icon: Sparkles, color: 'text-indigo-400', tailwindColor: 'bg-indigo-500' },
    ]
  }
];

const INNER_PATH = [
  { id: 1, type: 'lição', title: 'Teoria e Fundamentos', isCompleted: true, locked: false },
  { id: 2, type: 'lição', title: 'Prática Guiada', isCompleted: true, locked: false },
  { id: 3, type: 'lição', title: 'Erros Comuns', isCompleted: false, locked: false, isCurrent: true },
  { id: 4, type: 'lição', title: 'Visão Crítica', isCompleted: false, locked: true },
  { id: 5, type: 'desafio', title: 'Exercícios Práticos', isCompleted: false, locked: true },
  { id: 6, type: 'prova', title: 'Prova Final (Nível)', isCompleted: false, locked: true },
];

export function CoursesView() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [savedNote, setSavedNote] = useState(false);

  const handleNodeClick = (node: any, levelInfo: any) => {
    if (!levelInfo.unlocked) return;
    setSelectedNode({ ...node, levelTitle: levelInfo.title });
  };
  
  const handleStartLesson = (step: any) => {
    if (step.locked) return;
    setSelectedLesson(step);
    setRating(0);
    setNotes('');
    setSavedNote(false);
  };
  
  const handleSaveNotes = () => {
     if (!notes.trim()) return;
     setSavedNote(true);
     // Simulate saving to DB/Grimoire...
     setTimeout(() => {
        setSavedNote(false);
        setNotes('');
     }, 3000);
  };

  if (selectedLesson) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center overflow-y-auto"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col min-h-screen relative">
          
          <div className="flex justify-between items-center py-4 px-6 border-b border-white/10 sticky top-0 bg-black/40 backdrop-blur-xl z-30">
            <button onClick={() => setSelectedLesson(null)} className="text-slate-400 hover:text-white flex items-center pr-4 border-r border-white/10 transition-colors group">
               <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors mr-3">
                 <ChevronLeft className="w-4 h-4" />
               </div>
               <span className="hidden sm:inline font-bold uppercase tracking-widest text-xs">Menu do Módulo</span>
            </button>
            <div className="text-right">
               <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{selectedNode.name}</div>
               <h2 className="text-sm text-slate-200 font-bold">{selectedLesson.title}</h2>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row flex-1 p-4 lg:p-10 gap-10">
             <div className="flex-1 flex flex-col gap-10 max-w-4xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="flex flex-col gap-4">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 w-fit">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">{selectedLesson.type}</span>
                   </div>
                   <h1 className="text-4xl md:text-5xl font-serif text-slate-100">{selectedLesson.title}</h1>
                   <p className="text-lg text-slate-400 leading-relaxed font-light">
                     Nesta sessão, você aprenderá as bases teóricas e as armadilhas comuns associadas a esta prática.
                     A preparação mental e a intencionalidade formam a estrutura central do seu sucesso.
                   </p>
                </div>

                {/* Video / Content Area */}
                <div className="w-full aspect-video bg-black/40 rounded-[2rem] border border-white/10 overflow-hidden relative group shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 z-10" />
                   
                   {/* Decorative Mesh in video area */}
                   <div className={`absolute inset-0 opacity-20 blur-[80px] ${selectedNode.bgGlow || 'bg-indigo-500'} rounded-full scale-150 mix-blend-screen transition-all duration-700 group-hover:opacity-40`} />
                   
                   <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                     <button className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20 group-hover:border-white/40 group-hover:scale-110 shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                        <PlayCircle className="w-12 h-12 ml-2" />
                     </button>
                     <p className="mt-6 font-bold uppercase tracking-widest text-xs text-white/70 tracking-[0.2em]">Assistir à Aula</p>
                   </div>
                </div>
                
                {/* Interaction Section */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
                   {/* Rating */}
                   <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01] md:col-span-2 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 mb-4">
                         <Star className="w-5 h-5 text-amber-400" />
                      </div>
                      <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Como foi a experiência?</h3>
                      <div className="flex gap-2">
                         {[1, 2, 3, 4, 5].map((star) => (
                           <button 
                             key={star}
                             onMouseEnter={() => setHoverRating(star)}
                             onMouseLeave={() => setHoverRating(0)}
                             onClick={() => setRating(star)}
                             className="focus:outline-none transition-transform hover:scale-125"
                           >
                              <Star className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'text-slate-700'}`} />
                           </button>
                         ))}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-6 uppercase tracking-widest leading-relaxed">
                        Sua avaliação orienta a expansão da biblioteca oracular.
                      </p>
                   </div>
                   
                   {/* Grimoire Note */}
                   <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01] flex flex-col md:col-span-3">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <BookMarked className="w-4 h-4 text-emerald-400" />
                         </div>
                         <div>
                            <h3 className="text-sm font-bold text-slate-200">Anotações do Grimório</h3>
                            <p className="text-xs text-slate-500">Insights privados desta sessão</p>
                         </div>
                      </div>
                      <TextareaAutosize 
                        minRows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="O que os arquétipos revelaram a você hoje? O que deve ser memorizado?"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none flex-1 mb-6 shadow-inner"
                      />
                      <button 
                         onClick={handleSaveNotes} disabled={savedNote || !notes.trim()}
                         className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${savedNote ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200'}`}
                      >
                         {savedNote ? 'Trancafiado no Grimório' : 'Anexar Conhecimento'}
                      </button>
                   </div>
                </div>
             </div>
             
             {/* Dynamic Sidebar Modules Map */}
             <div className="w-full lg:w-96 shrink-0 flex flex-col gap-3">
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 mb-2">
                   <h3 className="text-xl font-serif text-slate-200 mb-2">Trilha do Módulo</h3>
                   <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-1/3 h-full rounded-full" />
                   </div>
                   <p className="text-xs text-slate-500 mt-3 text-right">33% Concluído</p>
                </div>
                
                {INNER_PATH.map((step, index) => {
                   const isCurrent = selectedLesson.id === step.id;
                   
                   let IconToRender = BookOpen;
                   if (step.isCompleted) IconToRender = Check;
                   else if (step.locked) IconToRender = Lock;
                   else if (step.type === 'desafio') IconToRender = Calendar;
                   else if (step.type === 'prova') IconToRender = Trophy;
                   
                   return (
                     <button 
                       key={step.id}
                       onClick={() => handleStartLesson(step)}
                       disabled={step.locked}
                       className={`
                         flex items-center gap-5 p-5 rounded-3xl w-full text-left transition-all border relative overflow-hidden group
                         ${isCurrent ? 'bg-indigo-950/20 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5'}
                         ${step.locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                       `}
                     >
                        {isCurrent && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                        )}
                        
                        <div className="text-lg font-serif text-slate-600 font-light w-6 text-center">
                           0{index + 1}
                        </div>

                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-white/10 transition-transform group-hover:scale-105
                          ${step.isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                          ${isCurrent && !step.isCompleted ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' : ''}
                          ${!isCurrent && !step.isCompleted ? 'bg-white/5 text-slate-500' : ''}
                        `}>
                           <IconToRender className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                           <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">{step.type}</div>
                           <div className={`text-base font-medium ${isCurrent ? 'text-indigo-100' : 'text-slate-300'}`}>{step.title}</div>
                        </div>
                     </button>
                   );
                })}
             </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (selectedNode) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
        className="w-full flex-1 flex flex-col h-full relative z-20 min-h-screen"
      >
         <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 px-6 md:px-12 flex justify-between items-center">
            <button onClick={() => setSelectedNode(null)} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
               <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
               </div>
               <span className="font-bold uppercase tracking-widest text-xs hidden sm:inline">Voltar à Saga</span>
            </button>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full text-xs">
                  <Crown className="w-4 h-4" /> 450 XP
               </div>
            </div>
         </div>

         <div className="w-full relative py-16 px-4 flex justify-center border-b border-white/5 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
              <div className={`w-[800px] h-[800px] ${selectedNode.tailwindColor} opacity-[0.07] blur-[100px] rounded-full`} />
            </div>
            
            <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
               <div className={`w-24 h-24 rounded-[2rem] ${selectedNode.tailwindColor} bg-opacity-10 flex items-center justify-center border border-current ${selectedNode.color} mb-8 backdrop-blur-xl rotate-3 shadow-2xl`}>
                 <div className="-rotate-3">
                    {selectedNode.icon && React.createElement(selectedNode.icon, { className: "w-10 h-10" })}
                 </div>
               </div>
               <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{selectedNode.levelTitle}</div>
               <h2 className="text-5xl md:text-6xl font-serif text-white mb-6 tracking-tight">{selectedNode.name}</h2>
               <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl leading-relaxed">{selectedNode.desc}</p>
            </div>
         </div>

         <div className="flex-1 w-full max-w-5xl mx-auto py-16 px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {INNER_PATH.map((step, index) => {
                  const isCompleted = step.isCompleted;
                  const isCurrent = step.isCurrent;
                  const isLocked = step.locked;
                  
                  let ringColor = 'border-slate-800 bg-black/40';
                  let iconColor = 'text-slate-600';
                  
                  if (isCompleted) {
                     ringColor = 'border-emerald-500/30 bg-emerald-500/5';
                     iconColor = 'text-emerald-400';
                  } else if (isCurrent) {
                     ringColor = `border-current ${selectedNode.color} bg-white/5`;
                     iconColor = selectedNode.color;
                  } else if (step.type === 'desafio') {
                     ringColor = 'border-amber-500/20 bg-amber-500/5';
                     iconColor = !isLocked ? 'text-amber-500' : 'text-slate-600';
                  } else if (step.type === 'prova') {
                     ringColor = 'border-rose-500/20 bg-rose-500/5';
                     iconColor = !isLocked ? 'text-rose-500' : 'text-slate-600';
                  }

                  let IconToRender = BookOpen;
                  if (isCompleted) IconToRender = Check;
                  else if (isLocked) IconToRender = Lock;
                  else if (step.type === 'desafio') IconToRender = Calendar;
                  else if (step.type === 'prova') IconToRender = Trophy;

                  return (
                     <div 
                        key={step.id} 
                        onClick={() => !isLocked && handleStartLesson(step)}
                        className={`relative w-full rounded-3xl border p-8 flex flex-col justify-between min-h-[220px] transition-all group overflow-hidden
                           ${ringColor}
                           ${isLocked ? 'opacity-60 grayscale-[50%]' : 'cursor-pointer hover:-translate-y-1 hover:shadow-xl'}
                           ${isCurrent ? 'shadow-[0_10px_40px_rgba(0,0,0,0.5)]' : ''}
                        `}
                     >
                        {isCurrent && (
                          <div className={`absolute top-0 left-0 w-full h-1 ${selectedNode.tailwindColor}`} />
                        )}

                        <div className="flex justify-between items-start mb-8 relative z-10">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 bg-[#0a0a0a] shadow-inner ${iconColor}`}>
                              <IconToRender className="w-6 h-6" />
                           </div>
                           <div className="text-4xl font-serif text-white/5 font-bold">
                              0{index + 1}
                           </div>
                        </div>
                        
                        <div className="relative z-10">
                           <div className="flex items-center gap-3 mb-2">
                              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{step.type}</span>
                              {isCurrent && (
                                 <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm bg-current ${selectedNode.color} bg-opacity-20`}>Sua Jornada</span>
                              )}
                           </div>
                           <h3 className={`text-2xl font-serif ${isLocked ? 'text-slate-500' : 'text-slate-200'}`}>{step.title}</h3>
                        </div>

                        {!isLocked && (
                           <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                              <ArrowRight className="w-4 h-4 text-white" />
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col flex-1 min-h-screen relative pb-20">
      
      {/* Refined Mystic Header */}
      <div className="w-full px-4 lg:px-10 py-12 border-b border-white/5 bg-white/[0.01]">
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
               <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300">Nível Atual: Iniciante</span>
               </div>
               <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-indigo-200">12 / 48</span>
               </div>
            </div>
         </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 lg:px-10 py-12 flex flex-col gap-10">
        {MODULES.map((levelBlock) => (
          <div key={levelBlock.level} className={`
             relative w-full rounded-[2.5rem] overflow-hidden border transition-all duration-700 group
             ${levelBlock.unlocked ? 'border-white/10 bg-white/[0.01] hover:border-indigo-500/30' : 'border-white/5 bg-black/40 grayscale opacity-60'}
          `}>
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-transparent to-purple-950/20 transition-opacity duration-1000 group-hover:opacity-100 opacity-60" />
             
             {/* Dynamic Level Glow */}
             {levelBlock.unlocked && (
                <div className={`absolute -top-1/2 -right-1/4 w-[600px] h-full ${levelBlock.bgGlow} opacity-[0.05] group-hover:opacity-[0.12] blur-[100px] rounded-full transition-opacity duration-1000 pointer-events-none`} />
             )}
             
             <div className="relative z-20 flex flex-col lg:flex-row p-8 lg:p-14 gap-12 lg:gap-24">
                
                {/* Level Title Part */}
                <div className="lg:w-1/4 flex flex-col justify-center">
                   <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-indigo-500/80 mb-6 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                      {levelBlock.title.split('—')[0]}
                   </div>
                   <h3 className="text-3xl md:text-5xl font-serif text-slate-100 mb-8 leading-[1.1] tracking-tight">
                      {levelBlock.title.split('—')[1]}
                   </h3>
                   <div className="w-12 h-0.5 bg-indigo-500/30 mb-8" />
                   <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light italic">
                      {levelBlock.desc}
                   </p>
                   
                   {!levelBlock.unlocked && (
                     <div className="mt-10 flex items-center gap-3 text-slate-500 border border-white/5 bg-white/5 px-6 py-4 rounded-2xl w-fit backdrop-blur-md">
                        <Lock className="w-4 h-4" /> 
                        <span className="text-[10px] uppercase tracking-widest font-bold">Arcano Bloqueado</span>
                     </div>
                   )}
                </div>

                {/* Nodes Grid */}
                <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                   {levelBlock.nodes.map((node) => (
                      <button 
                        key={node.id}
                        onClick={() => handleNodeClick(node, levelBlock)}
                        disabled={!levelBlock.unlocked}
                        className={`
                          p-8 sm:p-10 rounded-[2rem] border flex flex-col items-start gap-8 transition-all text-left relative overflow-hidden group/node
                          ${levelBlock.unlocked 
                            ? 'bg-white/[0.02] hover:bg-indigo-600/10 border-white/5 hover:border-indigo-500/40 hover:-translate-y-2' 
                            : 'bg-transparent border-white/[0.02] cursor-not-allowed'}
                        `}
                      >
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${node.tailwindColor} bg-opacity-10 border border-current ${node.color} shadow-2xl transition-transform duration-500 group-hover/node:rotate-6`}>
                            {node.icon && React.createElement(node.icon, { className: `w-8 h-8 ${node.color}` })}
                         </div>
                         <div>
                            <h4 className={`font-serif text-xl mb-3 tracking-wide ${levelBlock.unlocked ? 'text-slate-100' : 'text-slate-500'}`}>
                               {node.name}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-light">
                               {node.desc}
                            </p>
                         </div>
                         
                         {levelBlock.unlocked && (
                            <div className="absolute right-8 bottom-8 opacity-0 group-hover/node:opacity-100 group-hover/node:translate-x-2 transition-all">
                               <ArrowRight className={`w-6 h-6 ${node.color}`} />
                            </div>
                         )}
                      </button>
                   ))}
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
