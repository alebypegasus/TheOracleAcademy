import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, PlayCircle, BookMarked, Star, Bot, Loader2, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import { Tooltip } from '../../ui/Tooltip';
import { ScrollIsland } from '../../ui/ScrollIsland';
import { WatermelonAccordion } from '../../ui/WatermelonAccordion';
import { api } from '../../../services/api';

interface LessonReaderProps {
  selectedNode: any;
  selectedLesson: any;
  currentUser: any;
  onBack: () => void;
  onComplete: (closeAfter?: boolean) => void;
  onNextLesson?: () => void;
}

export function LessonReader({
  selectedNode,
  selectedLesson,
  currentUser,
  onBack,
  onComplete,
  onNextLesson
}: LessonReaderProps) {
  const [markdownContent, setMarkdownContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(true);
  
  // Rating and Notes
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [notes, setNotes] = useState('');
  const [savedNote, setSavedNote] = useState(false);

  // Audio (TTS - ElevenLabs)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isPausedVoice, setIsPausedVoice] = useState(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState('CwhRBWXzGAHq8TQ4Fs17'); // Default Roger (Masculina)
  
  const voices = [
    { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger (Masculina)' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Feminina)' }
  ];



  // AI Chat & Exercise
  const [aiChat, setAiChat] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  useEffect(() => {
    // Flag local por closure — imune a race conditions entre renders
    let cancelled = false;

    // Para qualquer áudio em reprodução
    setAudioInstance(prev => { prev?.pause(); return null; });
    setIsPlayingVoice(false);
    setIsPausedVoice(false);
    
    // Reset states for new lesson
    setAiChat([]);
    setChatInput('');
    setExerciseCompleted(false);
    setRating(null);
    setNotes('');
    setSavedNote(false);

    const lessonTitle = selectedLesson?.title || 'esta lição';
    const nodeId = `${selectedNode?.id}-step-${selectedLesson?.id}`;
    const controller = new AbortController();

    const initAiExercise = () => {
      if (cancelled) return;
      setChatLoading(true);
      fetch('/api/ai/evaluate-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('oracle_jwt_token') || ''}`,
          'x-user-id': currentUser?.id?.toString() || ''
        },
        body: JSON.stringify({ nodeName: lessonTitle, message: '__INIT__', history: [] }),
        signal: controller.signal
      })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled) return;
        setAiChat([{ role: 'assistant', content: data?.reply || `Saudações. Reflita sobre o que você acabou de ler em "${lessonTitle}". O que mais chamou sua atenção?` }]);
      })
      .catch(err => {
        if (cancelled || err?.name === 'AbortError') return;
        setAiChat([{ role: 'assistant', content: `Saudações. Reflita sobre o que você acabou de ler em "${lessonTitle}". O que mais chamou sua atenção?` }]);
      })
      .finally(() => {
        if (!cancelled) setChatLoading(false);
      });
    };

    const fetchContent = async () => {
      if (cancelled) return;
      setLoadingContent(true);
      try {
        const data = await api.courses.getNodeContent(nodeId);
        if (cancelled) return;
        setMarkdownContent(data?.markdown_content || '');
      } catch (e: any) {
        if (cancelled || e?.name === 'AbortError') return;
        setMarkdownContent(`> ⚠️ **Erro ao carregar conteúdo:** ${e?.message || 'Tente novamente'}\n\nVerifique a conexão com o servidor e tente recarregar.`);
      } finally {
        if (!cancelled) {
          setLoadingContent(false);
          initAiExercise();
        }
      }
    };

    if (selectedLesson?.type !== 'prova') {
       fetchContent();
    } else {
       setLoadingContent(false);
       initAiExercise();
    }

    return () => {
      // Cancelar todas as operações assíncronas pendentes por closure
      cancelled = true;
      controller.abort();
    };
  }, [selectedLesson?.id]);

  const handleToggleVoice = async () => {
    if (isPlayingVoice && audioInstance) {
      if (isPausedVoice) {
        audioInstance.play();
        setIsPausedVoice(false);
      } else {
        audioInstance.pause();
        setIsPausedVoice(true);
      }
      return;
    } 

    if (isGeneratingAudio) return;

    try {
      setIsGeneratingAudio(true);
      
      const cleanText = (markdownContent || `Nesta lição, aprenderemos os mistérios e a conduta oracular.`)
        .replace(/[#*`>_\-~]/g, '')
        .trim();

      const response = await fetch(`/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('oracle_jwt_token') || ''}`,
          'x-user-id': currentUser?.id?.toString() || ''
        },
        body: JSON.stringify({
          text: cleanText,
          voiceId: selectedVoiceId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      // CORREÇÃO CRUCIAL PARA O ÁUDIO FUNCIONAR
      const rawBlob = await response.blob();
      const audioBlob = new Blob([rawBlob], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      
      audio.onended = () => {
        setIsPlayingVoice(false);
        setIsPausedVoice(false);
        setAudioInstance(null);
      };

      setAudioInstance(audio);
      audio.play();
      setIsPlayingVoice(true);
      setIsPausedVoice(false);
    } catch (err: any) {
      console.error(err);
      alert("Erro ao reproduzir voz neural: " + err.message);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setAiChat(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);
    
    try {
      const res = await fetch('/api/ai/evaluate-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('oracle_jwt_token') || ''}`,
          'x-user-id': currentUser?.id?.toString() || ''
        },
        body: JSON.stringify({ nodeName: selectedLesson.title, message: userMsg, history: aiChat })
      });
      if (res.ok) {
        const data = await res.json();
        setAiChat(prev => [...prev, { role: 'assistant', content: data.reply || 'Registrado com sucesso.' }]);
        setExerciseCompleted(true); // Desbloqueia o próximo passo após a primeira resposta
      }
    } catch (err) {
      setAiChat(prev => [...prev, { role: 'assistant', content: 'Conexão interrompida. Suas energias foram recebidas, mas a conexão falhou.' }]);
      setExerciseCompleted(true); // Desbloqueia mesmo em caso de falha de rede para não travar o usuário
    } finally {
      setChatLoading(false);
    }
  };

  const handleNextAction = () => {
    if (!exerciseCompleted) return;
    if (onNextLesson) {
      onComplete(false); // Marca no banco mas NÃO fecha o leitor
      onNextLesson(); // Navega para a próxima lição imediatamente
    } else {
      onComplete(true); // Última lição, então conclui e fecha o leitor
    }
  };

  return (
    <motion.div 
      key="reader-view"
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 30 }}
      className="fixed inset-0 z-50 bg-[#090615] overflow-y-auto custom-scrollbar"
    >
       <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#1e1b4b]/40 to-transparent pointer-events-none" />

       {/* Header */}
       <div className="w-full max-w-7xl mx-auto px-6 py-8 relative z-10 flex justify-between items-center border-b border-white/5 mb-8">
          <button onClick={onBack} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
             <div className="w-10 h-10 rounded-full bg-white/5 border border-[#1e1b4b] flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-5 h-5" />
             </div>
             <span className="font-bold uppercase tracking-widest text-xs hidden sm:inline">Voltar ao Módulo</span>
          </button>
          
          <div className="text-right">
             <div className={`text-[10px] uppercase tracking-widest font-bold ${selectedNode.color}`}>{selectedNode.name}</div>
             <h2 className="text-sm text-slate-300 font-bold">Lição {selectedLesson.id}</h2>
          </div>
       </div>

       {/* Content Grid */}
       <div className="w-full max-w-7xl mx-auto px-6 pb-48 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Esquerda: Teoria */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
               
               <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-current bg-white/5 w-fit mb-6 ${selectedNode.color}`}>
                     <span className="text-[10px] uppercase tracking-widest font-bold">{selectedLesson.type}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-serif text-slate-100 font-light leading-tight">{selectedLesson.title}</h1>
               </div>

               {selectedLesson.type !== 'prova' && (
                 <div className="w-full flex justify-between items-center bg-[#1e1b4b]/20 border border-[#312e81] p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-indigo-400" />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-slate-200">Narração IA</h4>
                          <p className="text-xs text-slate-500">Ouça o arquétipo contar esta lição</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <select 
                         value={selectedVoiceId}
                         onChange={(e) => {
                            setSelectedVoiceId(e.target.value);
                            if (audioInstance) {
                               audioInstance.pause();
                               setAudioInstance(null);
                               setIsPlayingVoice(false);
                               setIsPausedVoice(false);
                            }
                         }}
                         disabled={isPlayingVoice || isGeneratingAudio}
                         className="bg-black/40 border border-[#312e81] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 disabled:opacity-50"
                       >
                         {voices.map(v => (
                           <option key={v.id} value={v.id}>{v.name}</option>
                         ))}
                       </select>
                       <button 
                         onClick={handleToggleVoice}
                         disabled={isGeneratingAudio}
                         className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all border font-bold text-xs uppercase tracking-wider disabled:opacity-50 ${isPlayingVoice ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/20'}`}
                       >
                          {isGeneratingAudio ? (
                             <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                             <PlayCircle className={`w-4 h-4 ${isPlayingVoice && !isPausedVoice ? 'animate-pulse' : ''}`} />
                          )}
                          {isPlayingVoice && !isPausedVoice ? 'Pausar Áudio' : isPlayingVoice && isPausedVoice ? 'Retomar Áudio' : 'Iniciar Áudio'}
                       </button>
                    </div>
                 </div>
               )}

               {selectedLesson.type !== 'prova' && (
                 <div className="prose prose-invert prose-xl max-w-none text-slate-300 font-light leading-relaxed prose-headings:font-serif prose-headings:font-normal prose-a:text-indigo-400">
                   {loadingContent ? (
                      <div className="py-20 flex justify-center">
                         <Loader2 className="w-8 h-8 text-[#312e81] animate-spin" />
                      </div>
                   ) : (
                      <div className="prose prose-invert prose-xl max-w-none text-slate-300 font-light leading-relaxed prose-headings:font-serif prose-headings:font-normal prose-a:text-indigo-400">
                        <Markdown>{markdownContent}</Markdown>
                      </div>
                   )}
                 </div>
               )}
            </div>

            {/* Direita: Prática e Interação */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8 sticky top-12 self-start">
               
               {/* 1. Exercício IA */}
               <div className="bg-[#0a0a0a]/80 border border-[#312e81] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl h-[500px]">
                  <div className="p-4 border-b border-[#1e1b4b] bg-indigo-950/40 flex items-center gap-3">
                     <Bot className="w-5 h-5 text-indigo-400" />
                     <h3 className="font-bold text-xs text-slate-200 uppercase tracking-widest">Guardião (Exercício)</h3>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                    {chatLoading && aiChat.length === 0 && (
                       <div className="flex justify-center py-10">
                          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                       </div>
                    )}
                    {aiChat.map((msg, idx) => (
                       <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-4 max-w-[90%] rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-50' : 'bg-indigo-500/10 border border-[#312e81] text-indigo-50'}`}>
                             <div className="prose prose-invert prose-sm">
                                <Markdown>{msg.content}</Markdown>
                             </div>
                          </div>
                       </div>
                    ))}
                    {chatLoading && aiChat.length > 0 && (
                       <div className="flex justify-start w-full">
                          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-[#312e81] flex gap-1 items-center">
                             {[0,1,2].map(i => (
                               <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                             ))}
                          </div>
                       </div>
                    )}
                  </div>

                  <div className="p-4 bg-black/60 border-t border-[#1e1b4b]">
                     <div className="flex gap-2">
                       <input 
                          type="text" 
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && !chatLoading && handleSendChat()}
                          disabled={chatLoading}
                          placeholder={chatLoading ? "O Guardião reflete..." : "Sua resposta..."}
                          className="flex-1 bg-white/5 border border-[#1e1b4b] rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-colors"
                       />
                       <button 
                          onClick={handleSendChat} 
                          disabled={chatLoading || !chatInput.trim()} 
                          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-3 font-bold transition-all disabled:opacity-40"
                       >
                          {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar'}
                       </button>
                     </div>
                  </div>
               </div>

               {/* 2. Feedback da Lição */}
               <div className="bg-[#0a0a0a]/60 border border-[#1e1b4b] rounded-3xl p-6 flex flex-col items-center text-center">
                 <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Como foi esta lição?</h4>
                 <div className="flex gap-4">
                   <button 
                     onClick={() => setRating('up')}
                     className={`w-12 h-12 flex items-center justify-center rounded-full transition-all border ${rating === 'up' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-[#1e1b4b] text-slate-400 hover:bg-white/10 hover:text-slate-200'}`}
                   >
                     <ThumbsUp className="w-5 h-5" />
                   </button>
                   <button 
                     onClick={() => setRating('down')}
                     className={`w-12 h-12 flex items-center justify-center rounded-full transition-all border ${rating === 'down' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-white/5 border-[#1e1b4b] text-slate-400 hover:bg-white/10 hover:text-slate-200'}`}
                   >
                     <ThumbsDown className="w-5 h-5" />
                   </button>
                 </div>
               </div>

               {/* 3. Grimório Notes */}
               <div className="bg-[#0a0a0a]/60 p-6 rounded-3xl border border-[#312e81] flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                     <BookMarked className="w-4 h-4 text-emerald-400" />
                     <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Grimório Rápido</h3>
                  </div>
                  <TextareaAutosize 
                    minRows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anote seus insights espirituais aqui..."
                    className="w-full bg-black/60 border border-[#1e1b4b] rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 resize-none flex-1 mb-4 shadow-inner custom-scrollbar"
                  />
                  <button 
                     onClick={() => {
                        if (!notes.trim()) return;
                        setSavedNote(true);
                        setTimeout(() => setSavedNote(false), 3000);
                     }}
                     className={`w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${savedNote ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 border border-[#1e1b4b] hover:bg-white/10 text-slate-200'}`}
                  >
                     {savedNote ? 'Anotação Salva' : 'Salvar Insight'}
                  </button>
               </div>

               {/* 4. Ação Principal (Avançar) */}
               <div className="mt-2">
                 {exerciseCompleted ? (
                    <button 
                      onClick={handleNextAction}
                      className="w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] text-center flex justify-center items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                       <CheckCircle className="w-5 h-5" /> {onNextLesson ? 'Concluir e Próxima' : 'Concluir Módulo'}
                    </button>
                 ) : (
                    <Tooltip content="Fale com o Guardião acima para provar que absorveu o conteúdo">
                      <div className="w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all bg-white/5 border border-[#1e1b4b] text-slate-500 text-center flex justify-center items-center gap-3 cursor-not-allowed">
                         Complete o Exercício Para Avançar
                      </div>
                    </Tooltip>
                 )}
               </div>

            </div>
          </div>
       </div>

       {/* Floating Control Island */}
       <ScrollIsland showOnScroll={true} threshold={100}>
          <Tooltip content="Ouvir Narração da Lição">
             <button 
               onClick={handleToggleVoice}
               className={`flex items-center justify-center w-10 h-10 rounded-full transition-all border ${isPlayingVoice ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-[#312e81] text-slate-300 hover:bg-white/10'}`}
             >
                <PlayCircle className={`w-5 h-5 ${isPlayingVoice && !isPausedVoice ? 'animate-pulse' : ''}`} />
             </button>
          </Tooltip>

          <div className="w-[1px] h-6 bg-[#312e81]" />

          {exerciseCompleted ? (
            <button 
              onClick={handleNextAction}
              className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-gradient-to-r from-emerald-500 to-teal-400 text-black hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
               Avançar ✸
            </button>
          ) : (
            <div className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 text-slate-500">
               Exercício Pendente
            </div>
          )}
       </ScrollIsland>
    </motion.div>
  );
}
