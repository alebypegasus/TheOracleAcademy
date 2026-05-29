import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Save, Book, Loader2, Play, ThumbsUp, ThumbsDown, 
  Lock, BookOpen, Brain, Compass, HelpCircle, Trophy, RefreshCw, Crown 
} from 'lucide-react';
import Markdown from 'react-markdown';
import { SectionLock } from './ui/SectionLock';
import { usePlan } from '../hooks/usePlan';

export function OracleReader({ profile, setProfile, addGrimoireEntry, currentUser }: any) {
  const [activeMode, setActiveMode] = useState<'normal' | 'study'>('study');
  
  // Normal Mode States
  const [question, setQuestion] = useState('');
  const [spreadType, setSpreadType] = useState('Tarot (3-Card)');
  
  // Study Mode States
  const [selectedOracle, setSelectedOracle] = useState('Tarot');
  const [studyGoal, setStudyGoal] = useState('Memorizar Arcanos Maiores e Menores');
  const [studyQuestion, setStudyQuestion] = useState('');
  const [studySpread, setStudySpread] = useState('Conselho da Tríade (3 Cartas - Teoria, Prática e Revelação)');
  const [customGoal, setCustomGoal] = useState('');
  const [showCustomGoal, setShowCustomGoal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const { canAccess } = usePlan(currentUser);
  const isLocked = !canAccess('master');

  const handleAskNormal = async () => {
    if (!question.trim() || isLocked) return;
    setLoading(true);
    setReading(null);
    setFeedback(null);

    try {
      const response = await fetch('/api/oracle/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question, spreadType })
      });
      
      const result = await response.json();
      
      setReading({
        cards: result.cards || [],
        meanings: Array(result.cards?.length || 0).fill("Significado arquetípico geral."),
        interpretation: result.interpretation || "",
        studyNote: "Foque na simbologia desta tiragem para complementar seu entendimento acadêmico."
      });

      // Award XP
      setProfile((prev: any) => ({ ...prev, xp: prev.xp + 50 }));

      // Add to grimoire
      addGrimoireEntry({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        question,
        spreadType: `Tiragem Geral (${spreadType})`,
        cards: result.cards || [],
        interpretation: result.interpretation || ""
      });

    } catch (error) {
      console.error(error);
      alert("A visão do Oráculo está turva no momento. Por favor tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStudySpread = async () => {
    if (isLocked) return;
    setLoading(true);
    setReading(null);
    setFeedback(null);

    const targetLearningFocus = showCustomGoal ? customGoal : studyGoal;
    const finalQuestion = studyQuestion.trim() || "Como posso progredir em meus estudos de " + selectedOracle + "?";

    try {
      const response = await fetch('/api/oracle/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: finalQuestion,
          oracle: selectedOracle,
          spreadType: studySpread,
          learningFocus: targetLearningFocus
        })
      });

      if (!response.ok) {
        throw new Error("Falha astral");
      }

      const result = await response.json();
      setReading(result);

      // Award XP for learning spread
      const xpValue = result.xpGained || 100;
      setProfile((prev: any) => ({ ...prev, xp: prev.xp + xpValue }));

      // Add detailed entry into journal/grimoire
      addGrimoireEntry({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        question: finalQuestion,
        spreadType: `Tiragem de Estudos (${selectedOracle} - ${studySpread})`,
        cards: result.cards || [],
        interpretation: `### Foco de Aprendizagem\n**${targetLearningFocus}**\n\n### Interpretação do Oráculo\n${result.interpretation}\n\n### Lição Mística & Estudo Dirigido\n${result.studyNote || "Estude com atenção esta combinação de arquétipos."}`
      });

    } catch (error) {
      console.error("Estudo Oracle Error:", error);
      alert("As constelações estão desalinhadas. Recorrendo a saberes locais...");
      // Fallback
      setReading({
        cards: ["O Mago", "A Sacerdotisa"],
        meanings: [
          "Início de jornada, domínio das ferramentas divinas, foco ativo.",
          "Estudo de mistérios, silêncio, paciência e intuição introspectiva."
        ],
        interpretation: "### Visão de Aprendizagem Local\n\nPara o seu foco de estudos (**" + targetLearningFocus + "**), o Portal aponta que você já possui todas as ferramentas para decifrar estes mistérios (representado por **O Mago**), mas precisa silenciar mais sua mente (representado por **A Sacerdotisa**) para ouvir as verdades ocultas por trás de cada carta.",
        studyNote: "Tente escrever à mão livre em um caderno físico a história ou a conversa que estas duas cartas teriam se fossem seres de carne e osso."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 relative">
      <SectionLock isPaid={canAccess('master')} className="absolute top-8 right-4" />
      
      <div className="mb-10 text-center pt-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-500" />
          <p className="text-[11px] text-indigo-400 font-black uppercase tracking-[0.3em]">Comunhão de Saberes</p>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-indigo-500" />
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-slate-100 gold-text tracking-wider uppercase mb-3">
          Círculo do Oráculo
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
          Consulte as forças astrais e receba orientações personalizadas de progresso diretamente conectadas ao seu aprendizado.
        </p>
      </div>

      {/* Mode Selectors */}
      <div className="flex bg-black/40 border border-[#1e1b4b] p-1 rounded-2xl max-w-md mx-auto mb-10">
        <button
          onClick={() => { setActiveMode('study'); setReading(null); }}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2
            ${activeMode === 'study' ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Brain className="w-4 h-4" /> Estudo das Cartas
        </button>
        <button
          onClick={() => { setActiveMode('normal'); setReading(null); }}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2
            ${activeMode === 'normal' ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Compass className="w-4 h-4" /> Consulta Geral
        </button>
      </div>

      <div className="glass-panel p-8 rounded-[2.5rem] border-[#1e1b4b] mb-8 relative overflow-hidden group">
        {isLocked && (
          <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-[3px] flex flex-col items-center justify-center rounded-[2.5rem] p-6 text-center">
            <Lock className="w-14 h-14 text-rose-400 mb-4 opacity-80" />
            <h3 className="text-2xl font-serif text-slate-200 mb-2">Oráculo Conectado Restrito</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-xs leading-relaxed">Destrave os geradores de tiragens integrados por IA avançada e amplie seus estudos hoje mesmo.</p>
            <button className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-black rounded-full text-xs uppercase tracking-widest shadow-lg shadow-amber-500/25 hover:scale-105 transition-transform">
              Assinar Plano Premium
            </button>
          </div>
        )}

        <div className={`${isLocked ? 'opacity-20 pointer-events-none' : ''} space-y-6`}>
          {activeMode === 'study' ? (
            /* STUDY MODE FORM */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Escolha o Oráculo de Estudo</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Tarot', 'Runas', 'Lenormand'].map((orc) => (
                      <button
                        key={orc}
                        onClick={() => setSelectedOracle(orc)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedOracle === orc 
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                          : 'bg-black/30 border-[#1e1b4b] text-slate-400 hover:text-white hover:border-[#1e1b4b]'
                        }`}
                      >
                        {orc === 'Tarot' ? '🔮 Tarot' : orc === 'Runas' ? 'ᛗ Runas' : '🃏 Lenormand'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Estrutura de Tiragem</label>
                  <select 
                    value={studySpread}
                    onChange={(e) => setSpreadType(e.target.value)}
                    className="w-full bg-black/45 border border-[#1e1b4b] rounded-xl px-4 py-3.5 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
                  >
                    <option>Portal do Aprendizado (1 Carta - Foco Absoluto)</option>
                    <option>Caminho da Compreensão (3 Cartas - Passado/Presente/Futuro do Saber)</option>
                    <option>Conselho da Tríade (3 Cartas - Teoria, Prática e Revelação)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Seu Foco de Aprendizagem</label>
                {!showCustomGoal ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    {[
                      'Memorizar Arcanos Maiores e Menores',
                      'Interpretar Correlações Amorosas',
                      'Estudo dos Símbolos Ocultos e Elementos',
                      'Praticar Leituras de Saúde e Bem-Estar'
                    ].map((goalOption) => (
                      <button
                        key={goalOption}
                        onClick={() => setStudyGoal(goalOption)}
                        className={`px-4 py-3 rounded-xl text-left text-xs transition-all border ${
                          studyGoal === goalOption 
                          ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300' 
                          : 'bg-black/20 border-[#1e1b4b] text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        {goalOption}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowCustomGoal(true)}
                      className="px-4 py-3 rounded-xl text-left text-xs bg-black/20 border border-dashed border-[#1e1b4b] text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-all"
                    >
                      + Outro Foco de Estudo Personalizado...
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder="Escreva sua meta de aprendizado (ex: Aprender as runas de proteção)"
                      className="flex-1 bg-black/40 border border-[#1e1b4b] rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
                    />
                    <button 
                      onClick={() => { setShowCustomGoal(false); setCustomGoal(''); }}
                      className="text-xs text-slate-500 hover:text-slate-300 px-3 py-1"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Digite sua Dúvida ou Questão Mística (Opcional)</label>
                <input 
                  type="text"
                  value={studyQuestion}
                  onChange={(e) => setStudyQuestion(e.target.value)}
                  placeholder="Ex: Como lidar com bloqueios de criatividade sob a ótica da egrégora?"
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500/50 transition-colors text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateStudySpread}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-shadow hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}><Sparkles className="w-4 h-4" /></motion.div>}
                  Gerar Tiragem Educativa
                </motion.button>
              </div>
            </div>
          ) : (
            /* NORMAL MODE FORM */
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Sua Pergunta Cósmica</label>
                <textarea 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Que sabedoria as cartas devem revelar hoje?"
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl px-4 py-3.5 text-slate-200 outline-none focus:border-indigo-500/50 transition-colors resize-none h-28 text-sm"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <label className="block text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Layout</label>
                  <select 
                    value={spreadType}
                    onChange={(e) => setSpreadType(e.target.value)}
                    className="w-full bg-black/40 border border-[#1e1b4b] rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
                  >
                    <option>Tarot (1 Carta)</option>
                    <option>Tarot (3 Cartas Passado/Presente/Futuro)</option>
                    <option>Lenormand (Tiragem de 3 Cartas)</option>
                    <option>Oráculo (Conselho Diário)</option>
                  </select>
                </div>

                <div className="self-end w-full sm:w-auto pt-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAskNormal}
                    disabled={loading || !question.trim()}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-shadow hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}><Sparkles className="w-4 h-4" /></motion.div>}
                    Consultar Oráculo
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center py-16"
          >
            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-6" />
            <motion.h4 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-lg font-serif text-indigo-300 italic mb-2"
            >
              "Conectando com a egrégora cósmica..."
            </motion.h4>
            <p className="text-xs text-slate-500 max-w-xs uppercase tracking-widest">
              Sintonizando as vibrações das cartas e de seu progresso pessoal...
            </p>
          </motion.div>
        )}

        {reading && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden space-y-8"
          >
            {/* XP Badge */}
            <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-1">
               <span className="bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-amber-500/20 shadow-lg">
                 🚀 +100 XP Concedido
               </span>
               <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Salvo no Grimório</span>
            </div>

            <div>
              <h3 className="text-lg font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Arquétipos Revelados
              </h3>
              
              <div className="flex flex-wrap gap-6 justify-center pt-2">
                {reading.cards?.map((card: string, i: number) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    className="w-44 h-72 bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-black/60 border border-[#312e81] rounded-2xl flex flex-col justify-between p-5 text-center shadow-xl cursor-help relative overflow-hidden group/card"
                  >
                    <div className="absolute inset-0 bg-indigo-500/[0.03] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                    
                    {/* Header decorative card outline */}
                    <div className="border border-[#1e1b4b] flex-1 rounded-xl p-3 flex flex-col justify-between relative z-10">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-indigo-500/60 font-bold">ARC#0{i+1}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      </div>
                      
                      <p className="font-serif text-lg text-slate-200 mt-2 tracking-wide block italic group-hover/card:text-indigo-300 transition-colors leading-tight">
                        {card}
                      </p>
                      
                      <div className="pt-2">
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest group-hover/card:text-slate-400 transition-colors">Significado</p>
                        <p className="text-[10px] text-slate-400 line-clamp-3 leading-snug font-light mt-1 text-center">
                          {reading.meanings?.[i] || "Um arquétipo de imensa força interpretativa e reflexos internos."}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1e1b4b] pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left & Middle Column: Deep Interpretation */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  Conselho e Interpretação
                </h3>
                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm">
                   <Markdown>{reading.interpretation}</Markdown>
                </div>
              </div>

              {/* Right Column: Dynamic Study Notes / Task Recommendation */}
              <div className="space-y-4 lg:bg-white/[0.01] lg:border border-[#1e1b4b] p-6 rounded-3xl lg:shadow-inner self-start">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Brain className="w-5 h-5" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-200">Exercício Educativo</h4>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  A inteligência integrativa calculou este exercício místico específico para acelerar a memorização desta tiragem:
                </p>
                
                <div className="p-4 bg-indigo-500/5 border border-[#1e1b4b] rounded-2xl">
                  <p className="text-xs text-indigo-300 leading-relaxed italic">
                    {reading.studyNote || "Após ler a interpretação, reserve 5 minutos para mentalizar os arquétipos e anote em seu caderno."}
                  </p>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    Ganho Estimado: +100 XP
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-[#1e1b4b] pt-6 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">A leitura foi relevante?</span>
                <button 
                  onClick={() => setFeedback('up')} 
                  className={`p-2 rounded-full transition-colors ${feedback === 'up' ? 'bg-indigo-500/30 text-indigo-300' : 'hover:bg-white/5 text-slate-400'}`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setFeedback('down')} 
                  className={`p-2 rounded-full transition-colors ${feedback === 'down' ? 'bg-indigo-500/30 text-indigo-300' : 'hover:bg-white/5 text-slate-400'}`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-indigo-400 flex items-center gap-2 font-bold uppercase tracking-wider">
                <Save className="w-4 h-4 text-indigo-400 animate-pulse" /> Salvo com louvor em seu Grimório
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
