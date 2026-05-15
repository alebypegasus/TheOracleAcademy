import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Star, Shield, Award, Zap, CheckCircle2, 
  Lock, CalendarDays, Flame, BookOpen, MapPin, 
  Globe, ChevronRight, Crown 
} from 'lucide-react';
import { Book, Calendar } from 'lucide-react';
import { SectionLock } from './ui/SectionLock';

const STATE_RANKING = [
  { id: 1, name: 'Sacerdotisa Luna', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', xp: 12450, state: 'São Paulo' },
  { id: 2, name: 'Mago das Sombras', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', xp: 11200, state: 'São Paulo' },
  { id: 3, name: 'Oráculo Verde', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', xp: 9800, state: 'São Paulo' },
  { id: 4, name: 'Guardião Solar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', xp: 8500, state: 'São Paulo' },
  { id: 5, name: 'Buscador de Luz', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80', xp: 7200, state: 'São Paulo' },
];

const NATIONAL_RANKING = [
  { id: 1, name: 'Sacerdotisa Luna', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', xp: 12450, state: 'SP' },
  { id: 2, name: 'Grimório Etéreo', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80', xp: 12100, state: 'RJ' },
  { id: 3, name: 'Mestre Lenormand', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80', xp: 11950, state: 'MG' },
  { id: 4, name: 'Astra Veritatis', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80', xp: 11500, state: 'RS' },
  { id: 5, name: 'Mago das Sombras', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', xp: 11200, state: 'SP' },
];

export function ChallengesView({ profile, setProfile, grimoireEntries = [], currentUser }: any) {
  const isLocked = !currentUser?.isPaid;
  const [activeTab, setActiveTab] = useState<'daily'|'weekly'|'monthly'|'content'>('daily');
  const [rankingTab, setRankingTab] = useState<'state' | 'national'>('state');

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

  const currentRanking = rankingTab === 'state' ? STATE_RANKING : NATIONAL_RANKING;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 relative w-full flex flex-col h-full bg-transparent">
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
               <span className="text-xs text-amber-500/80 font-bold uppercase tracking-widest">Nível de Conhecimento</span>
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
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[4px] flex flex-col items-center justify-center rounded-3xl border border-rose-500/10 min-h-[600px] text-center px-6">
             <Lock className="w-16 h-16 text-rose-400 mb-6 opacity-80" />
             <h3 className="text-3xl font-serif text-slate-200 mb-3">Salão Restrito</h3>
             <p className="text-base text-slate-400 mb-8 max-w-md leading-relaxed">
               Participe de desafios sazonais, compita com a comunidade no quadro de líderes nacional e expanda seus distintivos assinando o plano Premium.
             </p>
             <button className="px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-full text-sm uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)]">
               Tornar-se Premium
             </button>
          </div>
        )}

        <div className={`grid grid-cols-1 xl:grid-cols-12 gap-10 pb-10 ${isLocked ? 'opacity-20 pointer-events-none' : ''}`}>
          
          <div className="xl:col-span-8 flex flex-col space-y-8">
             {/* Navigation Tabs */}
             <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 glass-panel p-2 rounded-[1.5rem] border-white/5">
                {[
                  { id: 'daily', title: 'Missões Diárias', icon: Zap },
                  { id: 'weekly', title: 'Desafios Semanais', icon: CalendarDays },
                  { id: 'monthly', title: 'Jornada Mensal', icon: Calendar },
                  { id: 'content', title: 'Sobre Seus Estudos', icon: BookOpen }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[11px] uppercase tracking-widest font-black whitespace-nowrap transition-all flex-1 justify-center
                      ${activeTab === tab.id ? 'bg-indigo-600 shadow-md shadow-indigo-500/20 text-white border-none' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200 border-none'}`}
                  >
                    <tab.icon className="w-4 h-4" /> {tab.title}
                  </button>
                ))}
             </div>

             <AnimatePresence mode="wait">
               <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
               >
                 {currentList.map((challenge, index) => (
                   <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
                 ))}
               </motion.div>
             </AnimatePresence>

             {/* Leaderboard Section */}
             <div className="mt-12">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 px-2">
                 <div>
                   <h3 className="text-2xl font-serif text-slate-100 flex items-center gap-3">
                     <Crown className="w-6 h-6 text-amber-500" />
                     Quadro de Líderes
                   </h3>
                   <p className="text-slate-500 text-xs mt-1">Os oráculos mais ativos da nossa egrégora.</p>
                 </div>
                 
                 <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                   <button 
                    onClick={() => setRankingTab('state')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${rankingTab === 'state' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     <MapPin className="w-3.5 h-3.5" /> Estadual
                   </button>
                   <button 
                    onClick={() => setRankingTab('national')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${rankingTab === 'national' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     <Globe className="w-3.5 h-3.5" /> Nacional
                   </button>
                 </div>
               </div>

               <div className="glass-panel overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 shadow-2xl">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="bg-white/5">
                         <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Posição</th>
                         <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Iniciado</th>
                         <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{rankingTab === 'state' ? 'Estado' : 'Região'}</th>
                         <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Frequência/XP</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                       <AnimatePresence mode="popLayout">
                         {currentRanking.map((user, idx) => (
                           <motion.tr 
                             key={user.id}
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: idx * 0.05 }}
                             className={`group transition-all hover:bg-white/[0.02] ${idx === 0 ? 'bg-amber-500/5' : ''}`}
                           >
                             <td className="px-8 py-6">
                               <div className="flex items-center gap-3">
                                 {idx < 3 ? (
                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-black text-lg ${
                                     idx === 0 ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                                     idx === 1 ? 'bg-slate-400/20 text-slate-400' :
                                     'bg-orange-800/20 text-orange-800'
                                   }`}>
                                     {idx + 1}
                                   </div>
                                 ) : (
                                   <span className="w-8 text-center text-slate-600 font-mono font-bold">{idx + 1}</span>
                                 )}
                               </div>
                             </td>
                             <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover:border-indigo-500/50 transition-colors shadow-lg">
                                   <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                                 </div>
                                 <div>
                                   <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{user.name}</p>
                                   <div className="flex items-center gap-1.5 mt-1">
                                      <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{idx === 0 ? 'Conexão Forte' : 'Ativo'}</span>
                                   </div>
                                 </div>
                               </div>
                             </td>
                             <td className="px-8 py-6">
                               <span className="text-xs font-mono font-black text-slate-400 opacity-60 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                 {user.state}
                               </span>
                             </td>
                             <td className="px-8 py-6 text-right">
                               <div className="flex flex-col items-end">
                                 <span className="text-base font-serif font-bold text-indigo-400 group-hover:scale-110 transition-transform origin-right">{user.xp.toLocaleString()} XP</span>
                               </div>
                             </td>
                           </motion.tr>
                         ))}
                       </AnimatePresence>
                     </tbody>
                   </table>
                 </div>
                 
                 {/* Current User Row - Stickened */}
                 <div className="p-6 bg-gradient-to-r from-indigo-900/40 via-indigo-900/20 to-transparent border-t border-indigo-500/30">
                    <div className="flex items-center justify-between px-2">
                       <div className="flex items-center gap-6">
                          <span className="text-indigo-400 font-black font-mono">#42</span>
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden">
                                <img src={profile.avatar} alt="Seu Perfil" className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-indigo-300">Você (Sua Aura)</p>
                                <p className="text-[10px] text-indigo-500/70 font-black uppercase tracking-widest mt-0.5">Mantenha a frequência para subir</p>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-serif font-black text-indigo-300">{profile.xp || 850} XP</p>
                          <p className="text-[9px] text-indigo-500/60 uppercase tracking-[0.2em] mt-1 font-black">Escalonando Planos</p>
                       </div>
                    </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="xl:col-span-4 space-y-8">
            <div className="glass-panel p-8 rounded-[3rem] border-white/10 relative overflow-hidden bg-gradient-to-b from-indigo-900/10 to-transparent shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none" />
              
              <h3 className="text-2xl font-serif text-slate-100 mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 text-amber-400" />
                Distintivos
              </h3>
              <p className="text-sm text-slate-400 mb-10 leading-relaxed font-light">
                 Sua coleção de conquistas. Certos desafios liberam selos que você pode exibir no seu perfil para a egrégora ver.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {badges.map(badge => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.id} className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all text-center group/badge
                      ${badge.unlocked ? `${badge.bg} ${badge.border} shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] hover:scale-105 cursor-pointer` : 'bg-black/30 border-white/5 opacity-50 grayscale hover:opacity-70'}`}>
                      <Icon className={`w-12 h-12 mb-4 drop-shadow-2xl transition-transform group-hover/badge:scale-110 ${badge.unlocked ? badge.color : 'text-slate-500'}`} />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{badge.name}</span>
                      {!badge.unlocked && (
                        <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-white/5 mt-2">
                           <Lock className="w-2.5 h-2.5 text-slate-500"/>
                           <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Oculto</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="glass-panel p-8 rounded-[3rem] border border-amber-500/20 bg-amber-900/5 group">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-amber-400 font-black uppercase tracking-[0.2em] text-[10px]">Recompensa Secreta</h4>
                 <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">Alcance o <span className="text-amber-400 font-bold">Nível 5</span> para destravar uma Leitura de Tarot Personalizada em Áudio feita pela IA avançada.</p>
              <div className="relative pt-4">
                 <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div 
                      className="bg-gradient-to-r from-amber-600 to-amber-400 h-full relative" 
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                    >
                       <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[100%] animate-[shimmer_3s_infinite]" />
                    </motion.div>
                 </div>
                 <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>45% do Caminho</span>
                    <span className="text-amber-500">Nível 3</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .gold-text { background: linear-gradient(to bottom right, #fde68a, #d97706, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
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
      className={`glass-panel p-8 rounded-[2.5rem] border ${isCompleted ? 'border-emerald-500/30 bg-emerald-900/10 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.3)]' : 'border-white/10 hover:border-indigo-500/40'} relative overflow-hidden transition-all group cursor-default`}
    >
      {isCompleted && (
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
      )}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'}`}>
               <CheckCircle2 className={`w-6 h-6 transition-all ${isCompleted ? 'opacity-100 scale-110' : 'opacity-40 scale-100'}`} />
            </div>
            <div>
               <h4 className={`text-2xl font-serif ${isCompleted ? 'text-emerald-300' : 'text-slate-100 italic transition-all group-hover:not-italic'}`}>{challenge.title}</h4>
               <p className="text-sm text-slate-500 mt-1 font-light leading-relaxed">{challenge.desc}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-6">
            <div className="flex-1 h-3 bg-black/60 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <motion.div 
                className={`h-full relative overflow-hidden ${isCompleted ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-indigo-600/80 to-indigo-400/80 group-hover:from-indigo-600 group-hover:to-indigo-400'}`} 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, ease: 'circOut' }}
              >
                 <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] -translate-x-[100%] animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
            <span className="text-[11px] font-black text-slate-300 font-mono tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              {challenge.isPercent ? `${challenge.progress}%` : `${challenge.progress} / ${challenge.total}`}
            </span>
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10 space-y-4">
          <div className="flex flex-col items-end">
             <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black mb-2 px-1">Recompensa Arcana</span>
             <div className="group/xp flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black shadow-[0_15px_25px_-10px_rgba(245,158,11,0.2)] transition-all hover:scale-110 cursor-pointer">
                <Star className="w-5 h-5 fill-amber-500 group-hover/xp:rotate-180 transition-transform duration-700" /> 
                <span className="text-lg">+{challenge.xp} XP</span>
             </div>
          </div>
          
          {isCompleted ? (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-black flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
               <Award className="w-3.5 h-3.5" /> Manifestado
            </motion.div>
          ) : (
            <button className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black px-4 py-2 rounded-xl border border-white/5 bg-black/40 hover:bg-indigo-600/20 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
               Trabalhar Aura
            </button>
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

