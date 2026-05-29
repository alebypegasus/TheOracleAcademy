import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Star, HelpCircle, Layers, Book, CheckCircle, 
  ChevronRight, RefreshCw, Sparkles, Award, Zap, BookOpen 
} from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "O que o Arcano Maior 'O Louco' (The Fool) representa primordialmente?",
    options: [
      "O fim absoluto de uma jornada dolorosa e sem volta.",
      "Novos começos, pureza espiritual, potencial ilimitado e saltos de fé.",
      "Conhecimento acadêmico rigoroso e apego a estruturas estritas.",
      "Ganho financeiro inesperado através de conexões profissionais."
    ],
    answer: 1,
    explanation: "'O Louco' carrega o número 0. Ele representa a alma pura iniciando sua encarnação sem os preconceitos ou limitações do mundo real."
  },
  {
    id: 2,
    question: "Na tiragem de Runas, qual o significado principal da runa 'Fehu'?",
    options: [
      "Paralisia espiritual e estagnação de pensamentos.",
      "Guerra física e perigo iminente.",
      "Riqueza material, abundância, gado (recursos) e energia vital circulante.",
      "Segredos revelados apenas no final de um ciclo solar."
    ],
    answer: 2,
    explanation: "'Fehu' simboliza o gado na antiguidade nórdica, que representava riqueza móvel, prosperidade financeira e fluxo de energia vital."
  },
  {
    id: 3,
    question: "No baralho Lenormand (Cigano), a combinação da carta 'O Cavaleiro' + 'A Estrela' indica:",
    options: [
      "Notícias rápidas trazendo esperança, orientação clara ou sucesso em breve.",
      "Traição de um amigo próximo durante a noite de lua cheia.",
      "Perda de bens materiais por falta de planejamento.",
      "Estudos sobre simbologias ocultas que devem ser interrompidos."
    ],
    answer: 0,
    explanation: "'O Cavaleiro' traz notícias ou movimentos velozes. 'A Estrela' representa clareza, inspiração e fé. Logo, representa a chegada rápida de boas novas ou esclarecimentos."
  }
];

const FLASHCARDS = [
  { id: 1, name: "A Sacerdotisa (Tarot)", type: "Intuicão", detail: "Sabedoria silenciosa, mistérios, inconsciente e paciência." },
  { id: 2, name: "O Imperador (Tarot)", type: "Estrutura", detail: "Autoridade, estabilidade, poder paternal, proteção e leis." },
  { id: 3, name: "Ansuz (Runa)", type: "Mensagem", detail: "Sinais divinos, inspiração, sabedoria ancestral e comunicação." },
  { id: 4, name: "Uruz (Runa)", type: "Força", detail: "Vitalidade, saúde robusta, resistência física e superação." },
  { id: 5, name: "O Sol (Lenormand)", type: "Sucesso", detail: "Grande energia positiva, clareza absoluta, otimismo e vitória." },
  { id: 6, name: "A Chave (Lenormand)", type: "Abertura", detail: "Soluções práticas, destrancar caminhos, revelações importantes." },
  { id: 7, name: "A Torre (Tarot)", type: "Ruptura", detail: "Colapso de falsas crenças, libertação repentina e recomeço forçado." },
  { id: 8, name: "O Mundo (Tarot)", type: "Realização", detail: "Ciclo concluído com sucesso, integração total, celebração cósmica." },
  { id: 9, name: "Kenaz (Runa)", type: "Chama", detail: "Visão criativa, fogo do conhecimento, iluminação e paixão acadêmica." },
  { id: 10, name: "A Casa (Lenormand)", type: "Família", detail: "Estabilidade, lar seguro, vida privada confortável e proteção." }
];

const LENORMAND_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Qual carta do baralho Lenormand representa notícias velozes e a chegada de um mensageiro ou visitas?",
    options: [
      "O Cavaleiro (The Rider)",
      "A Âncora (The Anchor)",
      "O Caixão (The Coffin)",
      "A Cruz (The Cross)"
    ],
    answer: 0,
    explanation: "O Cavaleiro é a primeira carta de Lenormand. Ele rege a pressa, a velocidade, a entrega de mensagens rápidas e a chegada de novidades."
  },
  {
    id: 2,
    question: "Se a carta 'As Flores' (The Bouquet) for combinada com 'O Sol' (The Sun), qual atmosfera é revelada?",
    options: [
      "Notícias de perda de reputação e falência iminente.",
      "Imensa felicidade, cura emocional primorosa, sucesso social e presentes abençoados.",
      "A estagnação total nos estudos e traição no lar.",
      "Viagem dolorosa para regiões isoladas."
    ],
    answer: 1,
    explanation: "As Flores representam beleza, presentes e contentamento. O Sol irradia vitalidade e força vitoriosa. Combinadas, simbolizam o pico de satisfação e celebrações alegres."
  },
  {
    id: 3,
    question: "A carta mística 'O Chicote' (The Whip) carrega tradicionalmente qual vibração nas leituras de Lenormand?",
    options: [
      "Estabilidade profissional inabalável.",
      "Silêncio absoluto e isolamento meditativo.",
      "Discussões acaloradas, tensões físicas, disciplina, conflitos ou atividades repetitivas.",
      "Abertura espontânea de novos contratos comerciais estáveis."
    ],
    answer: 2,
    explanation: "O Chicote rege as forças de combate, debates acalorados, estresses, dores físicas e argumentos repetitivos."
  },
  {
    id: 4,
    question: "Quando 'A Aliança' (The Ring) aparece junto de 'A Chave' (The Key), qual segredo do éter é destrancado?",
    options: [
      "A quebra definitiva de um contrato de aluguel por ruína estrutural.",
      "A resolução bem-sucedida de um compromisso, casamento auspicioso ou a confirmação segura de uma sociedade comercial.",
      "Caminhos fechados por forças misteriosas do além.",
      "O esquecimento místico de uma dívida antiga."
    ],
    answer: 1,
    explanation: "A Aliança simboliza parcerias, uniões e contratos seguros. A Chave é o destravamento e a solução definitiva do problema. Juntas, garantem a consolidação feliz de uma proposta."
  },
  {
    id: 5,
    question: "Qual carta o místico cigano utiliza como foco para representar estabilidade a longo prazo, solidez, raízes e proteção espiritual?",
    options: [
      "A Árvore (The Tree)",
      "As Nuvens (The Clouds)",
      "A Serpente (The Snake)",
      "Os Ratos (The Mice)"
    ],
    answer: 0,
    explanation: "A Árvore rege a vitalidade física, a conexão ancestral, raízes firmes na terra e paciência para o crescimento a longo prazo."
  }
];

interface ChallengeHubProps {
  profile: any;
  setProfile: any;
  addGrimoireEntry: any;
  challenges: any;
  setChallenges: any;
}

export function ChallengeHub({ profile, setProfile, addGrimoireEntry, challenges, setChallenges }: ChallengeHubProps) {
  const [activePlayground, setActivePlayground] = useState<'quiz' | 'flashcards' | 'journal' | 'lenormand'>('quiz');

  // Quiz States
  const [quizStep, setQuizStep] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const [quizCompletedPersist, setQuizCompletedPersist] = useState(false);

  // Flashcard States
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [flashcardsDonePersist, setFlashcardsDonePersist] = useState(false);

  // Journal States
  const [journalText, setJournalText] = useState('');
  const [journalCard] = useState({ name: "Roda da Fortuna (Wheel of Fortune)", keywords: "Mudanças benéficas, destino, movemento e ciclos cósmicos" });
  const [journalCompletedPersist, setJournalCompletedPersist] = useState(false);

  // Lenormand Weekly Challenge States
  const [lenormandQuizStep, setLenormandQuizStep] = useState(0);
  const [lenormandQuizSelectedOpt, setLenormandQuizSelectedOpt] = useState<number | null>(null);
  const [lenormandQuizCorrect, setLenormandQuizCorrect] = useState(0);
  const [lenormandQuizFinished, setLenormandQuizFinished] = useState(false);
  const [lenormandQuizShowExplanation, setLenormandQuizShowExplanation] = useState(false);
  const [lenormandQuizPassed, setLenormandQuizPassed] = useState(false);

  const [interpretingSpreads, setInterpretingSpreads] = useState<boolean[]>([false, false, false]);
  const [spreadFeedbacks, setSpreadFeedbacks] = useState<string[]>(['', '', '']);
  const [spreadInputs, setSpreadInputs] = useState<string[]>(['', '', '']);
  const [evaluatingIndex, setEvaluatingIndex] = useState<number | null>(null);
  const [isEarlySubmission, setIsEarlySubmission] = useState(true);
  const [isSubmittingChallenge, setIsSubmittingChallenge] = useState(false);

  useEffect(() => {
    if (challenges) {
      setQuizCompletedPersist(!!challenges.completedQuiz);
      setReviewedCount(challenges.flashcardCount || 0);
      setFlashcardsDonePersist(!!challenges.flashcardCompleted);
      setJournalCompletedPersist(!!challenges.completedJournal);
    }
  }, [challenges]);

  // Sound/VFX triggering animations
  const [showXpCelebration, setShowXpCelebration] = useState(false);
  const [xpAnnounced, setXpAnnounced] = useState(0);

  const triggerXpAward = (amount: number) => {
    setXpAnnounced(amount);
    setShowXpCelebration(true);
    setProfile((prev: any) => ({ ...prev, xp: prev.xp + amount }));
    setTimeout(() => {
      setShowXpCelebration(false);
    }, 4000);
  };

  // 1. QUIZ LOGIC
  const handleAnswerSubmit = () => {
    if (selectedOpt === null) return;
    const correct = selectedOpt === QUIZ_QUESTIONS[quizStep].answer;
    if (correct) {
      setQuizScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setShowExplanation(false);
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      setQuizFinished(true);
      const isPerfect = quizScore + (selectedOpt === QUIZ_QUESTIONS[quizStep].answer ? 1 : 0) === QUIZ_QUESTIONS.length;
      if (isPerfect && !quizCompletedPersist) {
        setChallenges((prev: any) => ({ ...prev, completedQuiz: true }));
        setQuizCompletedPersist(true);
        triggerXpAward(150);
      }
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setSelectedOpt(null);
    setQuizScore(0);
    setQuizFinished(false);
    setShowExplanation(false);
  };

  // 2. FLASHCARD LOGIC
  const flipCard = () => {
    setFlipped(!flipped);
    if (!flipped && reviewedCount < 10) {
      const nextCount = reviewedCount + 1;
      setReviewedCount(nextCount);
      setChallenges((prev: any) => ({
        ...prev,
        flashcardCount: nextCount,
        flashcardCompleted: nextCount >= 10
      }));
      if (nextCount === 10 && !flashcardsDonePersist) {
        setFlashcardsDonePersist(true);
        triggerXpAward(75);
      }
    }
  };

  const nextFlashcard = () => {
    setFlipped(false);
    setFlashcardIdx((prev) => (prev + 1) % FLASHCARDS.length);
  };

  // 3. INTUITION JOURNAL LOGIC
  const submitJournalEntry = () => {
    if (journalText.trim().length < 30) return;
    
    addGrimoireEntry({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      question: "Interpretação e Análise Pessoal das Cartas",
      spreadType: "Meditação Diária de Estudo",
      cards: [journalCard.name],
      interpretation: `### Cartas Meditadas\n**${journalCard.name}**\n\n### Minha Interpretação Pessoal\n${journalText}`
    });

    setChallenges((prev: any) => ({ ...prev, completedJournal: true }));
    setJournalCompletedPersist(true);
    setJournalText('');
    triggerXpAward(100);
  };

  return (
    <div className="glass-panel p-8 rounded-[3rem] border border-[#1e1b4b] relative overflow-hidden bg-black/30">
      
      {/* Dynamic Celebration Overlay */}
      <AnimatePresence>
        {showXpCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-50 bg-indigo-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            >
              <Zap className="w-12 h-12 text-amber-400 fill-amber-400/30" />
            </motion.div>
            <h2 className="text-4xl font-serif font-black gold-text mb-2 animate-bounce">CONQUISTA REVELADA!</h2>
            <p className="text-slate-300 text-sm max-w-sm mb-6 leading-relaxed">
              Você integrou com sucesso a egrégora de estudos e conquistou um novo patamar de sabedoria oracular!
            </p>
            <div className="bg-white/5 border border-[#1e1b4b] px-6 py-2 rounded-2xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="text-xl font-mono font-black text-indigo-300">+{xpAnnounced} XP Concedidos</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-serif text-slate-100 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-indigo-400" />
            Laboratório de Desafios Práticos
          </h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-black">Pratique na egrégora para desbloquear recompensas reais</p>
        </div>
        
        {/* Hub Action Choosers */}
        <div className="flex bg-black/40 p-1 border border-[#1e1b4b] rounded-xl self-stretch md:self-auto overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActivePlayground('quiz')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all whitespace-nowrap
              ${activePlayground === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Quiz {quizCompletedPersist && "✓"}
          </button>
          <button 
            onClick={() => setActivePlayground('flashcards')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all whitespace-nowrap
              ${activePlayground === 'flashcards' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Layers className="w-3.5 h-3.5" /> Flashcards ({reviewedCount}/10)
          </button>
          <button 
            onClick={() => setActivePlayground('journal')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all whitespace-nowrap
              ${activePlayground === 'journal' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Book className="w-3.5 h-3.5" /> Diário {journalCompletedPersist && "✓"}
          </button>
          <button 
            onClick={() => setActivePlayground('lenormand')}
            className={`flex-1 md:flex-none px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all whitespace-nowrap
              ${activePlayground === 'lenormand' ? 'bg-indigo-600 text-white border border-indigo-400' : 'text-amber-500 hover:text-amber-300'}`}
          >
            <Award className="w-3.5 h-3.5 animate-pulse" /> Desafio Lenormand {challenges?.lenormandCompleted && "✓"}
          </button>
        </div>
      </div>

      {/* RENDER DYNAMIC MODULES */}
      <div className="min-h-[300px] flex items-center justify-center py-4">
        
        {/* INTERACTIVE QUIZ PLAYGROUND */}
        {activePlayground === 'quiz' && (
          <div className="w-full max-w-2xl space-y-6">
            {!quizFinished ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span className="font-mono font-bold">QUESTÃO {quizStep + 1} DE {QUIZ_QUESTIONS.length}</span>
                  <span className="font-black text-indigo-400 tracking-wider">RECOMPENSA: +150 XP</span>
                </div>
                
                <h4 className="text-xl font-serif text-slate-100 italic leading-snug">
                  "{QUIZ_QUESTIONS[quizStep].question}"
                </h4>

                <div className="space-y-3">
                  {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={showExplanation}
                      onClick={() => setSelectedOpt(i)}
                      className={`w-full text-left p-4 rounded-2xl text-sm transition-all border flex justify-between items-center ${
                        selectedOpt === i 
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300 font-medium' 
                          : 'bg-black/20 border-[#1e1b4b] text-slate-400 hover:bg-white/5'
                      } ${
                        showExplanation && i === QUIZ_QUESTIONS[quizStep].answer
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                          : ''
                      }`}
                    >
                      <span>{opt}</span>
                      {selectedOpt === i && !showExplanation && <div className="w-2 h-2 rounded-full bg-indigo-400" />}
                    </button>
                  ))}
                </div>

                {showExplanation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-white/[0.02] border border-[#1e1b4b] rounded-2xl text-xs text-slate-500 space-y-2 leading-relaxed"
                  >
                     <p className="font-bold text-slate-300 uppercase tracking-widest text-[9px]">Aprofundamento</p>
                     <p>{QUIZ_QUESTIONS[quizStep].explanation}</p>
                  </motion.div>
                )}

                <div className="pt-4 flex justify-end gap-3">
                  {!showExplanation ? (
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={selectedOpt === null}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-40"
                    >
                      Enviar Resposta
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                    >
                      {quizStep < QUIZ_QUESTIONS.length - 1 ? 'Próxima Questão' : 'Concluir Quiz'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 py-8">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-[#312e81] flex items-center justify-center mx-auto text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-serif text-slate-100 uppercase tracking-wider">Quiz Finalizado</h4>
                  <p className="text-sm text-slate-400">
                    Você acertou {quizScore} de {QUIZ_QUESTIONS.length} perguntas.
                  </p>
                </div>

                {quizScore === QUIZ_QUESTIONS.length ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl max-w-md mx-auto">
                    <p className="text-xs text-emerald-400 font-bold leading-normal">
                      🎉 Perfeito! Você atingiu nota máxima e manifestou +150 XP de recompensa vitalícia!
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl max-w-md mx-auto">
                    <p className="text-xs text-amber-400 leading-normal">
                      Estude as explicações e tente novamente para atingir 100% e conquistar sintonias de XP!
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <button 
                    onClick={resetQuiz}
                    className="px-6 py-3 border border-[#1e1b4b] bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refazer Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INTERACTIVE FLASHCARDS CONTAINER */}
        {activePlayground === 'flashcards' && (
          <div className="w-full max-w-sm flex flex-col items-center space-y-6">
            <div className="text-center text-xs text-slate-500">
               <p className="font-mono">REVISE 10 CARTAS PARA GANHAR XP: {reviewedCount}/10</p>
               <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">Selo: +75 XP</p>
            </div>

            {/* FLIP CARD WRAPPER */}
            <div 
              onClick={flipCard}
              className="w-64 h-96 cursor-pointer relative group/fc [perspective:1000px] select-none"
            >
              <motion.div 
                className="w-full h-full duration-550 [transform-style:preserve-3d] relative"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-black border border-indigo-500/35 rounded-3xl p-6 flex flex-col justify-between text-center [backface-visibility:hidden] shadow-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-indigo-500 font-black tracking-widest uppercase">Estudo Místico</span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{FLASHCARDS[flashcardIdx].type}</p>
                    <h4 className="text-2xl font-serif text-slate-100 italic leading-tight">
                      {FLASHCARDS[flashcardIdx].name}
                    </h4>
                  </div>

                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest pt-4 border-t border-[#1e1b4b]">
                     Clique para Virar
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full bg-indigo-900/30 border border-indigo-400 rounded-3xl p-6 flex flex-col justify-between text-center [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-indigo-300 font-black tracking-widest">Significado de Estudo</span>
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-300" />
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Atributos</h5>
                    <p className="text-base text-slate-100 leading-relaxed font-light">
                      {FLASHCARDS[flashcardIdx].detail}
                    </p>
                  </div>

                  <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Estudo Concluído ✓</p>
                </div>
              </motion.div>
            </div>

            <button 
              onClick={nextFlashcard}
              className="px-6 py-3 bg-white/5 border border-[#1e1b4b] hover:bg-white/10 text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
            >
              Próximo Card <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* INTERACTIVE JOURNAL PORTAL */}
        {activePlayground === 'journal' && (
          <div className="w-full max-w-2xl space-y-6">
            {journalCompletedPersist ? (
              <div className="text-center space-y-4 py-8 max-w-md mx-auto">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-xl font-serif text-slate-100 uppercase tracking-widest">Aura Diária Manifestada</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Você já registrou sua meditação de estudo de cartas hoje e recebeu 100 XP adicionais. Continue praticando amanhã!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Carta para Meditação Prática</h4>
                  <p className="text-lg font-serif italic text-indigo-400">{journalCard.name} ({journalCard.keywords})</p>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Sua Interpretação Pessoal (Mínimo de 30 caracteres)</label>
                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Reflita de modo sincero: de que forma a energia de mudanças de ciclos cósmicos ou movimentos da Roda se conecta à sua vida ou ao seu aprendizado prático no momento?"
                    className="w-full bg-black/30 border border-[#1e1b4b] rounded-2xl p-4 text-slate-200 outline-none focus:border-indigo-500 h-32 text-sm leading-relaxed resize-none"
                  />
                  <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                     <span>Progresso: {journalText.length} / 30 caracs</span>
                     <span className="text-indigo-400">+100 XP Recompensa</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={submitJournalEntry}
                    disabled={journalText.length < 30}
                    className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-45 flex items-center gap-2"
                  >
                     <Zap className="w-4 h-4 fill-white" /> Concluir e Gravar no Grimório
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WEEKLY LENORMAND CHALLENGE MODULE */}
        {activePlayground === 'lenormand' && (
          <div className="w-full space-y-8">
            <div className="bg-[#0b0819]/80 border border-yellow-500/20 p-6 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-serif text-amber-300 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" /> Desafio Semanal: Sintonização Lenormand
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                    Instruções da Sabedoria Cigana: Obtenha pelo menos 90% (gabarite!) no quiz do módulo e sintonize com sucesso a sua intuição interpretando os 3 spreads sorteados pela IA.
                  </p>
                </div>
                
                <div className="bg-black/40 border border-[#1e1b4b] py-3 px-5 rounded-2xl shrink-0 flex items-center gap-3">
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">Recompensa Potencial</span>
                    <span className="text-base font-mono font-black text-amber-400">+350 XP + Bonus Antecipado (150 XP)</span>
                  </div>
                </div>
              </div>

              {/* Status checklist metrics tracker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#1e1b4b]">
                <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-[#1e1b4b]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${lenormandQuizPassed ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500 border border-[#1e1b4b]'}`}>
                    {lenormandQuizPassed ? "✓" : "1"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Mini-Quiz de Oráculos</p>
                    <p className="text-[10px] text-slate-400">Score mínimo: 90% ({lenormandQuizCorrect}/5 corretas - {Math.round((lenormandQuizCorrect / 5) * 100)}%)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-[#1e1b4b]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${interpretingSpreads.filter(b => b).length === 3 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-400 border border-[#1e1b4b]'}`}>
                    {interpretingSpreads.filter(b => b).length === 3 ? "✓" : interpretingSpreads.filter(b => b).length}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Spreads de Prática Avaliados</p>
                    <p className="text-[10px] text-slate-400">{interpretingSpreads.filter(b => b).length} de 3 spreads aprovados pela IA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* If challenge is fully completed already in DB */}
            {challenges?.lenormandCompleted ? (
              <div className="text-center py-12 max-w-lg mx-auto space-y-6 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto shadow-2xl">
                  <Trophy className="w-10 h-10 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-3xl font-serif gold-text uppercase font-black">Desafio Coroado!</h4>
                  <p className="text-sm text-slate-300">
                    Você completou magistralmente este desafio e as recompensas mágicas de XP já foram agregadas à sua alma espiritual.
                  </p>
                  <p className="text-xs text-indigo-400 font-mono">* Sua conquista foi salva de forma persistente com os bônus adequados no salão de líderes.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* QUIZ COLUMN / PANEL */}
                <div className="lg:col-span-5 bg-black/40 border border-[#1e1b4b] p-5 sm:p-6 rounded-[2rem] space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" /> Etapa 1: Quiz de Lenormand
                  </h4>

                  {lenormandQuizPassed ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2 py-6">
                      <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                      <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Aprovado no Quiz (100%)!</p>
                      <p className="text-[10px] text-slate-400">Sua sintonia teórica de oráculos está validada.</p>
                    </div>
                  ) : !lenormandQuizFinished ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>QUESTÃO {lenormandQuizStep + 1} de 5</span>
                        <span>Acertos: {lenormandQuizCorrect}</span>
                      </div>
                      <p className="text-sm font-serif text-slate-100 leading-relaxed italic animate-fadeIn">
                        "{LENORMAND_QUIZ_QUESTIONS[lenormandQuizStep].question}"
                      </p>

                      <div className="space-y-2">
                        {LENORMAND_QUIZ_QUESTIONS[lenormandQuizStep].options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            disabled={lenormandQuizShowExplanation}
                            onClick={() => setLenormandQuizSelectedOpt(oIdx)}
                            className={`w-full text-left p-3 rounded-xl text-xs transition-all border flex justify-between items-center ${
                              lenormandQuizSelectedOpt === oIdx 
                                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300' 
                                : 'bg-black/20 border-[#1e1b4b] text-slate-400 hover:bg-[#120f26]/40'
                            } ${
                              lenormandQuizShowExplanation && oIdx === LENORMAND_QUIZ_QUESTIONS[lenormandQuizStep].answer
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                : ''
                            }`}
                          >
                            <span>{opt}</span>
                          </button>
                        ))}
                      </div>

                      {lenormandQuizShowExplanation && (
                        <div className="p-3 bg-white/[0.02] border border-[#1e1b4b] rounded-xl text-[11px] text-slate-400 leading-relaxed italic">
                          {LENORMAND_QUIZ_QUESTIONS[lenormandQuizStep].explanation}
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        {!lenormandQuizShowExplanation ? (
                          <button
                            disabled={lenormandQuizSelectedOpt === null}
                            onClick={() => {
                              const correct = lenormandQuizSelectedOpt === LENORMAND_QUIZ_QUESTIONS[lenormandQuizStep].answer;
                              if (correct) {
                                setLenormandQuizCorrect(prev => prev + 1);
                              }
                              setLenormandQuizShowExplanation(true);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-[10px] uppercase tracking-wider"
                          >
                            Confirmar
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setLenormandQuizSelectedOpt(null);
                              setLenormandQuizShowExplanation(false);
                              if (lenormandQuizStep < 4) {
                                setLenormandQuizStep(prev => prev + 1);
                              } else {
                                setLenormandQuizFinished(true);
                                const perfect = lenormandQuizCorrect >= 5; // requires perfect score
                                if (perfect) {
                                  setLenormandQuizPassed(true);
                                }
                              }
                            }}
                            className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-4 rounded-xl text-[10px] uppercase tracking-wider"
                          >
                            {lenormandQuizStep < 4 ? "Próxima" : "Encerrar Quiz"}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4 py-4">
                      <p className="text-xs text-slate-400">Você concluiu com pontuação de {lenormandQuizCorrect} / 5 ({Math.round((lenormandQuizCorrect/5)*100)}%)</p>
                      
                      {lenormandQuizCorrect < 5 ? (
                        <div className="space-y-3">
                          <p className="text-[11px] text-amber-500 italic">
                            A egrégora exige pelo menos 90% (gabaritar todas as 5 questões deste mini-módulo) para validar sua sabedoria acadêmica de Lenormand.
                          </p>
                          <button
                            onClick={() => {
                              setLenormandQuizStep(0);
                              setLenormandQuizSelectedOpt(null);
                              setLenormandQuizCorrect(0);
                              setLenormandQuizFinished(false);
                              setLenormandQuizShowExplanation(false);
                            }}
                            className="bg-white/5 border border-[#1e1b4b] hover:bg-white/10 text-slate-300 text-[10px] font-black uppercase tracking-wider py-2 px-4 rounded-xl transition-all"
                          >
                            Tentar Novamente
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-400 font-bold">✓ Excelente! Quiz validado!</p>
                      )}
                    </div>
                  )}
                </div>

                {/* ADVANCED SPREADS EVALUATION COLUMN */}
                <div className="lg:col-span-7 bg-black/40 border border-[#1e1b4b] p-5 sm:p-6 rounded-[2rem] space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#d97706] flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-500" /> Etapa 2: Interpretação de Combinatórias IA
                  </h4>

                  <div className="space-y-4">
                    {[
                      { idx: 0, title: "Spread #1: O Cavaleiro + O Trevo", desc: "Significado: Ação veloz trazendo sorte passageira ou pequenos lucros sob agilidade." },
                      { idx: 1, title: "Spread #2: A Casa + O Navio", desc: "Significado: Planos de mudança estrutural, transição imobiliária ou viagem de parentes." },
                      { idx: 2, title: "Spread #3: As Nuvens + O Sol", desc: "Significado: Dúvidas mentais passageiras que se dissipam sob a luz radiante da vitória." }
                    ].map((spread) => (
                      <div key={spread.idx} className={`p-4 rounded-2xl border ${interpretingSpreads[spread.idx] ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-black/20 border-[#1e1b4b]'} space-y-3`}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-200">{spread.title}</span>
                          {interpretingSpreads[spread.idx] ? (
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded cursor-default">Validado</span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">Pendente</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 italic">Estude a combinação e descreva como você conecta as duas energias:</p>

                        {!interpretingSpreads[spread.idx] ? (
                          <div className="space-y-3">
                            <textarea
                              value={spreadInputs[spread.idx]}
                              onChange={(e) => {
                                const copy = [...spreadInputs];
                                copy[spread.idx] = e.target.value;
                                setSpreadInputs(copy);
                              }}
                              placeholder="Digite sua interpretação mística subjetiva aqui (mínimo de 5 caracteres)..."
                              className="w-full bg-[#0a0712] border border-[#1e1b4b] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 h-20 resize-none leading-relaxed"
                            />
                            <div className="flex justify-end">
                              <button
                                disabled={evaluatingIndex !== null || spreadInputs[spread.idx].trim().length < 5}
                                onClick={async () => {
                                  setEvaluatingIndex(spread.idx);
                                  try {
                                    const res = await fetch('/api/challenges/lenormand-evaluate', {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'x-user-id': profile.user_id?.toString() || '1'
                                      },
                                      body: JSON.stringify({
                                        spreadIndex: spread.idx,
                                        interpretation: spreadInputs[spread.idx]
                                      })
                                    });
                                    const data = await res.json();
                                    if (data.approved) {
                                      const copyBool = [...interpretingSpreads];
                                      copyBool[spread.idx] = true;
                                      setInterpretingSpreads(copyBool);
                                    }
                                    const copyFb = [...spreadFeedbacks];
                                    copyFb[spread.idx] = data.feedback;
                                    setSpreadFeedbacks(copyFb);
                                  } catch (e) {
                                    console.error("Evaluation fail", e);
                                  } finally {
                                    setEvaluatingIndex(null);
                                  }
                                }}
                                className="px-4 py-2 bg-slate-800 border border-[#1e1b4b] text-[10px] font-black uppercase tracking-wider text-[#d97706] rounded-xl hover:bg-slate-700 hover:text-white transition-all disabled:opacity-30 inline-flex items-center gap-1.5"
                              >
                                {evaluatingIndex === spread.idx ? (
                                  <>
                                    Sintonizando com IA... <RefreshCw className="w-3" />
                                  </>
                                ) : (
                                  <>Sintonizar e Avaliar</>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : null}

                        {spreadFeedbacks[spread.idx] && (
                          <div className="p-3 bg-[#0d2218]/45 border border-emerald-500/20 rounded-xl text-[10px] text-slate-300 leading-normal italic">
                            <p className="font-bold text-emerald-400 mb-1">Feedback do Grande-Mestre Lenormand:</p>
                            {spreadFeedbacks[spread.idx]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* FINAL RECOMMENDATIONS AND SUBMIT ACTION CARD */}
                <div className="lg:col-span-12 bg-indigo-950/20 border border-[#312e81] p-6 rounded-[2rem] space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h5 className="text-sm font-bold text-slate-200">Pronto para selar o Pacto Semanal de XP?</h5>
                      <p className="text-xs text-slate-400">Só é possível resgatar o selo após completar com excelência as duas etapas.</p>
                      
                      <div className="mt-3 flex items-center gap-5">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={isEarlySubmission} 
                            onChange={(e) => setIsEarlySubmission(e.target.checked)}
                            className="w-4 h-4 rounded border-indigo-500 bg-black/60 text-indigo-500 focus:ring-0"
                          />
                          Marcar como Envio Antecedente (+150 XP de Bônus!)
                        </label>
                      </div>
                    </div>

                    <button
                      disabled={!lenormandQuizPassed || interpretingSpreads.filter(b => b).length < 3 || isSubmittingChallenge}
                      onClick={async () => {
                        setIsSubmittingChallenge(true);
                        try {
                          const res = await fetch('/api/challenges/lenormand-submit', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'x-user-id': profile.user_id?.toString() || '1'
                            },
                            body: JSON.stringify({
                              quizScore: 100,
                              isEarly: isEarlySubmission
                            })
                          });
                          const data = await res.json();
                          if (res.ok && data.success) {
                            setChallenges((prev: any) => ({
                              ...prev,
                              lenormandCompleted: true,
                              lenormandEarly: isEarlySubmission
                            }));
                            triggerXpAward(data.xpAwarded);
                          }
                        } catch (e) {
                          console.error(e);
                        } finally {
                          setIsSubmittingChallenge(false);
                        }
                      }}
                      className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-extrabold rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all disabled:opacity-20 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    >
                      {isSubmittingChallenge ? "Concluindo..." : "Concluir Desafio & Capturar XP"}
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>

      {/* Decorative style tag */}
      <style>{`
        .gold-text { background: linear-gradient(to bottom right, #fde68a, #d97706, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

    </div>
  );
}
