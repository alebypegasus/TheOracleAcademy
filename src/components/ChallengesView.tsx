import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Shield, Award, Zap, CheckCircle2, Lock, CalendarDays, Flame, BookOpen } from 'lucide-react';
import { Book, Calendar } from 'lucide-react';
import { SectionLock } from './ui/SectionLock';

export function ChallengesView({ profile, setProfile, grimoireEntries = [], currentUser }: any) {
  const isLocked = !currentUser?.isPaid;
  const [activeTab, setActiveTab] = useState<'daily'|'weekly'|'monthly'|'content'>('daily');

  // Compute progress based on actual data
  const threeCardReadings = grimoireEntries.filter((e: any) => e.spreadType?.includes('3')).length;
  const flashcardsReviewed = profile.flashcardsReviewed || 0;

  const challenges = {
    daily: [
      { id: 1, title: 'Oráculo da Manhã', desc: 'Consulte o Oráculo e registre 1 leitura diária.', progress: threeCardReadings, total: 1, xp: 50, completed: threeCardReadings >= 1 },
      { id: 2, title: 'Praticante Kipper', desc: 'Conclua o mini-quiz Kipper do dia.', progress: 1, total: 1, xp: 100, completed: true },
      { id: 3, title: 'Memória Ancestral', desc: 'Revise 10 flashcards no deck selecionado.', progress: flashcardsReviewed, total: 10, xp: 75, completed: flashcardsReviewed >= 10 },
      { id: 11, title: 'Grimório Vivo', desc: 'Adicione uma nota sobre seus sentimentos no grimório.', progress: grimoireEntries.length > 0 ? 1 : 0, total: 1, xp: 50, completed: grimoireEntries.length > 0 }
    ],
    weekly: [
      { id: 4, title: 'Ofensiva Sete Sóis', desc: 'Mantenha sua ofensiva ininterrupta por 7 dias.', progress: 7, total: 7, xp: 500, completed: true },
      { id: 5, title: 'Leitor Persistente', desc: 'Realize e salve 5 leituras complexas (Mesa Real ou Cruz Celta).', progress: 1, total: 5, xp: 350, completed: false },
      { id: 6, title: 'Interação Arcana', desc: 'Comente em 3 postagens na comunidade.', progress: 2, total: 3, xp: 150, completed: false },
      { id: 12, title: 'Senhor dos Baralhos', desc: 'Estude pelo menos 3 horas de vídeo aulas.', progress: 1, total: 3, xp: 400, completed: false }
    ],
    monthly: [
      { id: 7, title: 'O Mago', desc: 'Alcance 5.000 de XP acumulado no mês.', progress: profile.xp || 850, total: 5000, xp: 2000, completed: false },
      { id: 8, title: 'Biblioteca Pessoal', desc: 'Publique 1 artigo longo ou obra na Biblioteca Arcana.', progress: 0, total: 1, xp: 1500, completed: false },
      { id: 9, title: 'Estudioso Fervoroso', desc: 'Finalize 1 curso completo do nível Avançado.', progress: 0, total: 1, xp: 3000, completed: false }
    ],
    content: [
      { id: 10, title: 'Dominando Arcanos Maiores', desc: 'Tire nota máxima no teste final de Arcanos Maiores.', progress: 85, total: 100, xp: 800, completed: false, isPercent: true },
      { id: 13, title: 'História do Tarot', desc: 'Assista todos os 5 vídeos da Introdução Histórica.', progress: 5, total: 5, xp: 300, completed: true },
      { id: 14, title: 'Mesa Real (Lenormand)', desc: 'Identifique os 4 cantos da Mesa Real em menos de 2 minutos no modo treino.', progress: 0, total: 1, xp: 500, completed: false },
    ]
  };

  const currentList = challenges[activeTab];

  const badges = [
    { id: 1, name: 'Buscador Novato', icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/50', unlocked: true },
    { id: 2, name: 'Leitor de Tarot', icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/50', unlocked: profile.xp >= 1000 },
    { id: 3, name: 'Guardião do Grimório', icon: Book, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/50', unlocked: grimoireEntries.length >= 10 },
    { id: 4, name: 'Mestre da Intuição', icon: Award, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/50', unlocked: threeCardReadings > 10 },
    { id: 5, name: 'Estrela Guia', icon: SparklesIcon, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/50', unlocked: false },
    { id: 6, name: 'Chama do Conhecimento', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/50', unlocked: false }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 relative w-full flex flex-col h-full">
      <SectionLock isPaid={currentUser?.isPaid} className="absolute top-8 right-4" />
      
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 pt-8">
        <div>
          <div className="flex items-center gap-3 mb-2 opacity-70">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-bold tracking-widest text-sm uppercase">Caminho da Evolução</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-100 gold-text uppercase tracking-wider mb-2">Salão dos Desafios</h2>
          <p className="text-slate-400 max-w-xl">Superação diária. Ganhe XP e libere distintivos místicos colecionáveis ao exercitar sua intuição e conhecimento.</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
           <div className="flex items-center gap-4 glass-panel px-8 py-4 rounded-3xl border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
             <Trophy className="w-8 h-8 text-amber-400" />
             <div className="flex flex-col">
               <span className="text-xs text-amber-500/80 font-bold uppercase tracking-widest">Seu Nível de Conhecimento</span>
               <span className="text-3xl font-serif font-bold text-amber-500">{profile.xp || 850} XP</span>
             </div>
           </div>
           {/* Level Progress */}
           <div className="w-full h-2 bg-black/40 rounded-full mt-2 overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400" style={{ width: '45%' }} />
           </div>
           <p className="text-[10px] text-slate-500 w-full text-right">Mais 150 XP para o Nível 4</p>
        </div>
      </div>

      <div className="relative flex-1">
        {isLocked && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[4px] flex flex-col items-center justify-center rounded-3xl border border-rose-500/10 min-h-[500px]">
             <Lock className="w-16 h-16 text-rose-400 mb-6 opacity-80" />
             <h3 className="text-3xl font-serif text-slate-200 mb-3 text-center">Salão Restrito</h3>
             <p className="text-base text-slate-400 mb-8 text-center max-w-md leading-relaxed">
               Participe de desafios sazonais, compita com a comunidade no quadro de líderes e expanda seus distintivos assinando o plano Premium.
             </p>
             <button className="px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-full text-sm uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)]">
               Tornar-se Premium
             </button>
          </div>
        )}

        <div className={`grid grid-cols-1 xl:grid-cols-12 gap-8 pb-10 ${isLocked ? 'opacity-20 pointer-events-none' : ''}`}>
          
          <div className="xl:col-span-8 flex flex-col space-y-6">
             {/* Navigation Tabs */}
             <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 glass-panel p-2 rounded-2xl border-white/5">
                {[
                  { id: 'daily', title: 'Missões Diárias', icon: Zap },
                  { id: 'weekly', title: 'Desafios Semanais', icon: CalendarDays },
                  { id: 'monthly', title: 'Jornada Mensal', icon: Calendar },
                  { id: 'content', title: 'Sobre Seus Estudos', icon: BookOpen }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center
                      ${activeTab === tab.id ? 'bg-indigo-600 shadow-md shadow-indigo-500/20 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                  >
                    <tab.icon className="w-4 h-4" /> {tab.title}
                  </button>
                ))}
             </div>

             <AnimatePresence mode="wait">
               <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
               >
                 {currentList.map((challenge, index) => (
                   <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
                 ))}
               </motion.div>
             </AnimatePresence>
          </div>

          <div className="xl:col-span-4 space-y-8">
            <div className="glass-panel p-8 rounded-[2rem] border-white/10 relative overflow-hidden bg-gradient-to-b from-indigo-900/10 to-transparent">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none" />
              
              <h3 className="text-2xl font-serif text-slate-100 mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 text-amber-400" />
                Distintivos Místicos
              </h3>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                 Sua coleção de conquistas. Certos desafios liberam selos que você pode exibir no seu perfil para a comunidade ver.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {badges.map(badge => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.id} className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all text-center
                      ${badge.unlocked ? `${badge.bg} ${badge.border} shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:scale-105 cursor-pointer` : 'bg-black/30 border-white/5 opacity-50 grayscale'}`}>
                      <Icon className={`w-10 h-10 mb-3 drop-shadow-md ${badge.unlocked ? badge.color : 'text-slate-500'}`} />
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{badge.name}</span>
                      {!badge.unlocked && <span className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded-full"><Lock className="w-3 h-3 inline pb-0.5"/> Oculto</span>}
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-amber-900/5">
              <h4 className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-2">Recompensa Secreta</h4>
              <p className="text-sm text-slate-300 mb-4">Alcance o nível 5 para destravar uma Leitura de Tarot Personalizada em Áudio feita pela IA avançada.</p>
              <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
                 <div className="bg-amber-400 h-full w-2/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge, index }: { challenge: any, index: number }) {
  const isCompleted = challenge.completed;
  const progressPercent = challenge.isPercent ? challenge.progress : Math.min(100, Math.round((challenge.progress / challenge.total) * 100));

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`glass-panel p-6 rounded-[2rem] border ${isCompleted ? 'border-emerald-500/30 bg-emerald-900/10 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'border-indigo-500/10 hover:border-indigo-500/30'} relative overflow-hidden transition-all group`}
    >
      {isCompleted && (
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none" />
      )}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3 mb-2">
            <h4 className={`text-xl font-serif ${isCompleted ? 'text-emerald-300' : 'text-slate-100'}`}>{challenge.title}</h4>
            {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          </div>
          <p className="text-sm text-slate-400 mb-5 leading-relaxed">{challenge.desc}</p>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <motion.div 
                className={`h-full relative overflow-hidden ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-indigo-400'}`} 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                 <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-[100%] animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
            <span className="text-xs font-bold text-slate-300 min-w-[3.5rem] text-right bg-white/5 px-2 py-1 rounded-md">
              {challenge.isPercent ? `${challenge.progress}%` : `${challenge.progress} / ${challenge.total}`}
            </span>
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Recompensa</span>
             <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                <Star className="w-4 h-4 fill-amber-400" /> +{challenge.xp} XP
             </div>
          </div>
          
          {isCompleted ? (
            <span className="text-xs uppercase tracking-wider text-emerald-400 mt-3 font-extrabold flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
               <CheckCircle2 className="w-3 h-3" /> Resgatado
            </span>
          ) : (
            <span className="text-xs uppercase tracking-wider text-slate-500 mt-3 font-semibold px-3 py-1">
               Em Progresso
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}

