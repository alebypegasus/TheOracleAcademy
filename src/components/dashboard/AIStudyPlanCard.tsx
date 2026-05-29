import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, CheckCircle2, ChevronRight, Play, Loader2, Award, BookOpen, Clock, Zap, Bell, BellOff, Flame, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { requestForToken, onMessageListener } from '../../lib/firebase';

interface Task {
  id: string;
  day: string;
  title: string;
  activity: string;
  duration: string;
  xp: number;
  completed: boolean;
  category?: string;
  notificationsEnabled?: boolean;
}

const getCategoryIcon = (cat?: string) => {
  if (cat?.toLowerCase().includes('ritual')) return <Flame className="w-3 h-3" />;
  if (cat?.toLowerCase().includes('meditation')) return <Sparkles className="w-3 h-3" />;
  if (cat?.toLowerCase().includes('study')) return <BookOpen className="w-3 h-3" />;
  return <Brain className="w-3 h-3" />;
};

const getCategoryColorClass = (cat?: string) => {
  if (cat?.toLowerCase().includes('ritual')) return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
  if (cat?.toLowerCase().includes('meditation')) return 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/25';
  if (cat?.toLowerCase().includes('study')) return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
  return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
};

interface Flashcard {
  id: string;
  name: string;
  type: string;
  detail: string;
}

interface StudyPlanResponse {
  tasks: Task[];
  flashcards?: Flashcard[];
}

interface AIStudyPlanCardProps {
  currentUser: any;
  profile: any;
  setProfile: any;
}

export function AIStudyPlanCard({ currentUser, profile, setProfile }: AIStudyPlanCardProps) {
  const [plan, setPlan] = useState<StudyPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [togglingNotificationId, setTogglingNotificationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Configuration form states
  const [showConfig, setShowConfig] = useState(false);
  const [tarotProgress, setTarotProgress] = useState('Intermediário (Fazendo tiragens simples)');
  const [weakness, setWeakness] = useState('Conexão e fluxo narrativo entre múltiplas cartas no mesmo spread');
  const [goal, setGoal] = useState('Dominar a interpretação simbólica profunda (mastering symbolic interpretation)');

  // Flashcards navigation states
  const [currentFcIdx, setCurrentFcIdx] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);

  // Load current study plan on mount
  useEffect(() => {
    if (!currentUser) return;
    fetch('/api/study-plan', {
      headers: { 'x-user-id': currentUser.id.toString() }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.plan) {
          setPlan(data.plan);
        }
      })
      .catch(err => {
        console.error("Error fetching study plan:", err);
      });
  }, [currentUser]);

  // Handle study plan generation
  const handleGeneratePlan = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/study-plan/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id.toString()
        },
        body: JSON.stringify({
          tarotProgress,
          weakness,
          goal
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPlan(data.plan);
        setShowConfig(false);
        setCurrentFcIdx(0);
        setFcFlipped(false);
      } else {
        setError(data.error || "Erro ao invocar sabedorias de estudo");
      }
    } catch (err) {
      console.error(err);
      setError("Falha na sintonia do éter cósmico.");
    } finally {
      setLoading(false);
    }
  };

  // Handle task completion toggle
  const handleCompleteTask = async (taskId: string) => {
    if (!currentUser || completingTaskId) return;
    setCompletingTaskId(taskId);
    try {
      const res = await fetch('/api/study-plan/complete-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id.toString()
        },
        body: JSON.stringify({ taskId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPlan(data.plan);
        // Mutate local state for instant XP feedback
        if (data.xpAwarded) {
          setProfile((prev: any) => ({
            ...prev,
            xp: (prev.xp || 100) + data.xpAwarded
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompletingTaskId(null);
    }
  };

  useEffect(() => {
    onMessageListener().then(payload => {
      console.log('Mensagem das estrelas (FCM):', payload);
      const anyPayload = payload as any;
      if (Notification.permission === 'granted' && anyPayload.notification) {
        new Notification(anyPayload.notification.title, {
          body: anyPayload.notification.body
        });
      }
    }).catch(err => console.error('Erro FCM Message:', err));
  }, []);

  const handleToggleNotification = async (taskId: string, enabled: boolean) => {
    if (!currentUser) return;
    setTogglingNotificationId(taskId);
    try {
      if (enabled) {
         try {
           const token = await requestForToken();
           if (token) {
             console.log("FCM Token retrieved for Task:", taskId);
             // Optionally send token to your server POST
           }
         } catch(e) {
           console.error("FCM permission denied", e);
         }
      }

      const res = await fetch('/api/study-plan/toggle-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id.toString()
        },
        body: JSON.stringify({ taskId, enabled })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPlan(data.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingNotificationId(null);
    }
  };

  let streakData: any[] = [];
  let totalXP = 0;
  let earnedXP = 0;
  if (plan) {
    streakData = plan.tasks.map(t => ({
      name: t.day.substring(0,3),
      xp: t.completed ? t.xp : 0,
      total: t.xp
    }));
    totalXP = plan.tasks.reduce((sum, t) => sum + (t.xp || 0), 0);
    earnedXP = plan.tasks.filter(t => t.completed).reduce((sum, t) => sum + (t.xp || 0), 0);
  }

  const generatedFlashcards = plan?.flashcards || [];

  return (
    <div id="ai-study-plan-tracker" className="h-full w-full p-6 sm:p-8 relative overflow-hidden group flex flex-col">
      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-5 blur-[60px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full scale-110 pointer-events-none group-hover:scale-125 transition-all duration-700" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] uppercase tracking-wider font-extrabold text-indigo-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Sintonizado por Inteligência Artificial
          </div>
          <h2 className="text-2xl font-serif text-slate-100">Portal de Cronograma IA</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Cronogramas, rotinas e flashcards calibrados pelo Mestre Oracular com base no seu progresso em Tarot, fraquezas e metas.
          </p>
        </div>

        {plan && !showConfig && (
          <button
            onClick={() => setShowConfig(true)}
            className="px-5 py-2.5 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold hover:bg-indigo-500/25 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            Personalizar & Recalibrar
          </button>
        )}
      </div>

      {error && (
        <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl mb-4 italic">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-12 flex flex-col items-center justify-center text-center text-slate-400"
          >
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-serif text-lg text-indigo-300 animate-pulse tracking-wide">Sintonizando aspectos celestiais de aprendizado...</p>
            <p className="text-xs text-slate-500 mt-1">Consultando o oráculo artificial para fabricar suas tarefas e flashcards ideais.</p>
          </motion.div>
        ) : showConfig || (!plan && showConfig) ? (
          <motion.div
            key="config-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/60 p-6 rounded-2.5xl border border-[#312e81] space-y-5"
          >
            <h3 className="text-lg font-serif text-slate-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Parâmetros de Personalização Cósmica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Progresso Atual no Tarot</label>
                <select 
                  value={tarotProgress} 
                  onChange={(e) => setTarotProgress(e.target.value)}
                  className="w-full bg-black/50 border border-[#1e1b4b] rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                >
                  <option value="Iniciante total (Conhecendo os Arcanos)">Iniciante total (Conhecendo os Arcanos)</option>
                  <option value="Intermediário (Fazendo tiragens simples)">Intermediário (Fazendo tiragens simples)</option>
                  <option value="Aposentado do Material (Especialista buscando alta complexidade)">Classe Avançada (Metas de maestria e ocultismo)</option>
                </select>
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Meta / Objetivo místico</label>
                <input 
                  type="text" 
                  value={goal} 
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Ex: Dominar interpretações simbólicas em mandala celestial"
                  className="w-full bg-black/50 border border-[#1e1b4b] rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Área de Dificuldade ou Fraqueza</label>
                <input 
                  type="text" 
                  value={weakness} 
                  onChange={(e) => setWeakness(e.target.value)}
                  placeholder="Ex: Conexão e fluxo narrativo entre múltiplas cartas no mesmo spread"
                  className="w-full bg-black/50 border border-[#1e1b4b] rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <p className="text-[9px] text-indigo-400 italic">* Sua fraqueza será utilizada para modelar tarefas e fabricar flashcards específicos que expandam sua mente espiritual.</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleGeneratePlan}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Alinhar e Gerar Plano com IA
              </button>
              {plan && (
                <button
                  onClick={() => setShowConfig(false)}
                  className="py-3 px-5 bg-white/5 border border-[#1e1b4b] text-slate-400 font-bold hover:bg-white/10 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Voltar
                </button>
              )}
            </div>
          </motion.div>
        ) : !plan ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-10 text-center flex flex-col items-center justify-center border border-dashed border-[#1e1b4b] rounded-2.5xl bg-white/[0.01]"
          >
            <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-[#312e81] flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="font-serif text-slate-200 text-lg">Sem Cronograma Ativo</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">
              Você ainda não gerou seu plano de estudos personalizado. Nosso assessor místico sintoniza seu progresso do Tarot e gera tarefas em bento-box e flashcards de revisão automática.
            </p>
            <button
              onClick={() => setShowConfig(true)}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 animate-pulse" /> Personalizar & Traçar Caminho místico
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="plan-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Streak Graph */}
            <div className="bg-[#0d091a]/60 border border-[#1e1b4b] rounded-2.5xl p-5 md:p-6 mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Milestone Semanal</h3>
                  <p className="text-xs text-slate-400">Progresso de XP místico desta semana</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-400">{earnedXP}<span className="text-sm text-slate-500 font-medium">/{totalXP} XP</span></div>
                </div>
              </div>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={streakData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis hide domain={[0, 'dataMax']} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0d091a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="xp" radius={[4, 4, 4, 4]}>
                      {
                        streakData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.xp > 0 ? '#6366f1' : '#1e1b4b'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tasks Section / Bento Box */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 mb-3 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" /> Atividades Recomendadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plan.tasks.map((task, idx) => (
                  <div
                    key={task.id || idx}
                    className={`border rounded-2.5xl p-5 flex flex-col justify-between transition-all relative overflow-hidden bg-[#0d091a]/40 ${task.completed ? 'border-emerald-500/30' : 'border-[#1e1b4b] hover:border-[#1e1b4b]'}`}
                  >
                    {task.completed && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 col-span-1 rounded-bl-full border-b border-l border-emerald-500/20 pointer-events-none flex items-center justify-center pl-4 pb-4">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1 rounded-full">
                            {task.day}
                          </span>
                          {task.category && (
                            <span className={`text-[9px] font-bold flex items-center gap-1 uppercase tracking-wider px-2.5 py-1 rounded-full border ${getCategoryColorClass(task.category)}`}>
                              {getCategoryIcon(task.category)} {task.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {togglingNotificationId === task.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                          ) : (
                            <button 
                              onClick={() => handleToggleNotification(task.id, !task.notificationsEnabled)}
                              className={`p-1.5 rounded-full transition-all border ${task.notificationsEnabled ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-white/5 text-slate-500 border-[#1e1b4b] hover:bg-white/10'}`}
                              title="Notificações diárias"
                            >
                              {task.notificationsEnabled ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                            </button>
                          )}
                          <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{task.duration}</span>
                          </div>
                        </div>
                      </div>

                      <h4 className={`text-base font-bold text-slate-200 mt-1 lines-clamp-1 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                        {task.title}
                      </h4>

                      <p className={`text-xs text-slate-400 mt-2 leading-relaxed font-light ${task.completed ? 'text-slate-500 lines-clamp-2' : ''}`}>
                        {task.activity}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#1e1b4b] flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-amber-400 uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" /> +{task.xp} XP
                      </span>

                      {task.completed ? (
                        <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                          Sintonizado
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={completingTaskId === task.id}
                          className="py-1.5 px-3 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/35 border border-[#1e1b4b] rounded-xl transition-all text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-1"
                        >
                          {completingTaskId === task.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              Concluir <Play className="w-2.5 h-2.5 fill-current grayscale opacity-80" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamically Generated Flashcards Section */}
            {generatedFlashcards.length > 0 && (
              <div className="bg-indigo-950/20 border border-[#1e1b4b] p-6 rounded-[2.5rem] mt-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-serif text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" /> Deck Inteligente de Flashcards IA
                    </h3>
                    <p className="text-[11px] text-slate-400">Cartas conceituais geradas para focar no seu objetivo: "{goal}"</p>
                  </div>
                  
                  <span className="text-xs font-mono font-bold text-slate-500 bg-white/5 px-2.5 py-1 rounded-lg border border-[#1e1b4b]">
                    {currentFcIdx + 1} / {generatedFlashcards.length}
                  </span>
                </div>

                {/* Flip Card Container */}
                <div className="perspective-1000 w-full max-w-lg mx-auto h-[220px]">
                  <div 
                    onClick={() => setFcFlipped(!fcFlipped)}
                    className={`relative w-full h-full cursor-pointer duration-500 transform-style-3d ${fcFlipped ? 'rotate-y-180' : ''}`}
                  >
                    {/* Front Face */}
                    <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-[#312e81] px-2 py-0.5 rounded">
                          {generatedFlashcards[currentFcIdx].type}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Clique para revelar</span>
                      </div>
                      
                      <div className="text-center py-4">
                        <p className="text-xl font-serif text-slate-100 italic">
                          "{generatedFlashcards[currentFcIdx].name}"
                        </p>
                      </div>

                      <div className="flex justify-center text-[10px] font-bold text-slate-400 animate-pulse">
                        Sinal Divino IA
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-[#121024] to-[#0a0711] border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Sintonia Resolvida
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Clique para ocultar</span>
                      </div>

                      <div className="py-2 text-center">
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                          {generatedFlashcards[currentFcIdx].detail}
                        </p>
                      </div>

                      <div className="flex justify-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                        Clique para Voltar à Carta
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flashcards Navigation Actions */}
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    disabled={currentFcIdx === 0}
                    onClick={() => {
                      setCurrentFcIdx(prev => prev - 1);
                      setFcFlipped(false);
                    }}
                    className="px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg bg-white/5 border border-[#2e2a5f] text-slate-400 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    Anterior
                  </button>
                  <button
                    disabled={currentFcIdx === generatedFlashcards.length - 1}
                    onClick={() => {
                      setCurrentFcIdx(prev => prev + 1);
                      setFcFlipped(false);
                    }}
                    className="px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg bg-indigo-600 border border-indigo-500 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
            
            {/* Legend / Tip */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-[#1e1b4b] pt-4">
              <span>* Complete as rotinas sugeridas para consolidar o conhecimento hermético e evoluir os graus da sua egrégora.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
