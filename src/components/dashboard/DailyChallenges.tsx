import React from 'react';
import { BookOpen, Star, Layers, Sparkles, Circle, Lock } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { SectionLock } from '../ui/SectionLock';

export function DailyChallenges({ onNavigate, profile, grimoireEntries, currentUser, challenges: dbChallenges }: { onNavigate: (path: string) => void, profile: any, grimoireEntries: any[], currentUser: any, challenges: any }) {
  const isLocked = !currentUser?.isPaid;

  const threeCardReadings = grimoireEntries?.filter((e: any) => e.spreadType?.includes('3')).length || 0;
  const quizDoneStatus = dbChallenges?.completedQuiz || false;
  const dynamicFlashcardCount = dbChallenges?.flashcardCount || 0;
  const journalCompletedStatus = dbChallenges?.completedJournal || false;

  const challenges = [
    { title: 'Leitura de 3 Cartas', desc: 'Realize e estude uma tiragem mística de 3 cartas.', progress: `${threeCardReadings >= 1 ? 1 : 0} / 1`, xp: 50, icon: BookOpen },
    { title: 'Quiz Místico Perfeito', desc: 'Acerte todas as questões do quiz de Tarot & Runas.', progress: `${quizDoneStatus ? 1 : 0} / 1`, xp: 150, icon: Star },
    { title: 'Revisar 10 Flashcards', desc: 'Pratique sintonização no deck de flashcards místico.', progress: `${Math.min(10, dynamicFlashcardCount)} / 10`, xp: 75, icon: Layers },
    { title: 'Diário de Intuição', desc: 'Grave sua interpretação mística pessoal no Grimório.', progress: `${journalCompletedStatus ? 1 : 0} / 1`, xp: 100, icon: Sparkles }
  ];

  return (
    <div className="h-full w-full p-6 flex flex-col relative overflow-hidden">
      {isLocked && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-2xl p-6 text-center">
          <Lock className="w-10 h-10 text-rose-400 mb-3 opacity-80" />
          <h3 className="text-lg font-serif text-slate-200 mb-1">Missões Diárias</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-[200px]">Acompanhe seu progresso e ganhe recompensas com o Premium.</p>
          <button className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-full text-xs uppercase tracking-wider">
            Assinar Plano
          </button>
        </div>
      )}

      <div className={`flex flex-col h-full ${isLocked ? 'opacity-30 pointer-events-none' : ''}`}>
        <div className="flex justify-between items-center mb-6 w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-medium text-slate-200">Desafios Diários</h3>
            </div>
            <SectionLock isPaid={currentUser?.isPaid} />
          </div>
          <button onClick={() => onNavigate('/challenges')} className="text-xs text-slate-400 hover:text-indigo-400 transition-colors">Ver Todos</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 flex-1">
          {challenges.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="flex flex-col gap-5 bg-white/[0.03] border border-white/[0.05] p-6 rounded-2xl hover:bg-white/[0.06] transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Status</p>
                    <p className="text-lg font-mono text-slate-200 font-bold leading-none">{c.progress}</p>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-slate-100 mb-2">{c.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <Tooltip content={`Ganhe ${c.xp} XP`}>
                    <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2 cursor-help transition-colors hover:bg-indigo-500/20">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-bold text-indigo-300 tracking-wide">{c.xp} XP</span>
                    </div>
                  </Tooltip>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-600 hover:text-indigo-400 transition-colors">
                    <Circle className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-500">
          <Circle className="w-3 h-3" />
          <p>Novos desafios em <span className="font-mono text-slate-400">10:24:18</span></p>
        </div>
      </div>
    </div>
  );
}
