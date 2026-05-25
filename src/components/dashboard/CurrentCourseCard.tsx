import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, ChevronRight, Lock, ChevronDown, User, Star, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { SectionLock } from '../ui/SectionLock';

export function CurrentCourseCard({ searchQuery, currentUser, onNavigate }: { searchQuery: string, currentUser: any, onNavigate?: (path: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const allCourses = [
    { 
      title: 'O Caminho do Oráculo', 
      desc: 'Desbloqueie a sabedoria antiga e insights modernos e desenvolva sua intuição através de símbolos arquetípicos e leituras aprofundadas.', 
      img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800', 
      progress: 65, 
      total: 12, 
      level: 'Intermediário', 
      duration: '5h 30m', 
      rating: '4.9', 
      nextLesson: 'Módulo 3: O Significado Místico das Espadas',
      instructor: { name: 'Mestre Lucius', role: 'Especialista em Misticismo Clássico', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
      modules: [
        { id: 1, title: 'Introdução aos Arcanos', duration: '45m', completed: true },
        { id: 2, title: 'Simbolismo das Copas e Ouros', duration: '1h 10m', completed: true },
        { id: 3, title: 'O Significado Místico das Espadas', duration: '55m', completed: false, current: true },
        { id: 4, title: 'Visão Intuitiva Prática', duration: '2h 40m', completed: false },
      ],
      reviews: [
        { id: 1, author: 'Helena S.', text: 'Transformou minha forma de ver as cartas. Altamente recomendado!', stars: 5 },
        { id: 2, author: 'Ricardo M.', text: 'Conteúdo aprofundado, mas o Módulo 2 é um pouco complexo para iniciantes.', stars: 4 }
      ]
    },
    // Keep other mock courses simpler as they are filtered out usually or use the same structure
  ];

  const filteredCourses = allCourses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.desc.toLowerCase().includes(searchQuery.toLowerCase()));

  if (filteredCourses.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center min-h-[300px] relative">
        <SectionLock isPaid={currentUser?.isPaid} className="absolute top-4 right-4" />
        <Info className="w-12 h-12 text-slate-500 mb-4 opacity-50" />
        <h3 className="text-xl font-serif text-slate-300">Nenhum curso corresponde à sua busca.</h3>
        <p className="text-slate-500 text-sm mt-2">Tente uma palavra-chave diferente.</p>
      </div>
    );
  }

  const course = filteredCourses[0];
  const isLocked = !currentUser?.isPaid;

  return (
    <div className="glass-panel p-1 rounded-2xl relative overflow-hidden group border border-indigo-500/20 hover:border-indigo-500/40 transition-colors shadow-2xl shadow-indigo-900/10">
      <SectionLock isPaid={currentUser?.isPaid} className="absolute top-4 right-4" />
      <div className="absolute inset-0 theme-bg-gradient opacity-60 z-0 pointer-events-none" />
      
      {isLocked && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-2xl">
          <Lock className="w-12 h-12 text-rose-400 mb-4 opacity-80" />
          <h3 className="text-2xl font-serif text-slate-200 mb-2 drop-shadow-md">Conteúdo Premium</h3>
          <p className="text-sm text-slate-400 mb-6 text-center max-w-sm">Dê um passo além na sua jornada espiritual. Faça o upgrade para acessar este e outros cursos exclusivos de maestria.</p>
          <button 
            onClick={() => { if(onNavigate) onNavigate('/subscription'); else window.location.hash = '#/subscription'; }}
            className="px-8 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-slate-900 font-bold rounded-full text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform">
            Destravar Sabedoria
          </button>
        </div>
      )}

      <div className={`relative z-10 flex flex-col md:flex-row gap-0 md:gap-8 ${isLocked ? 'opacity-30 pointer-events-none' : ''}`}>
        
        {/* Imagem de Destaque com Design Integrado */}
        <div className="w-full md:w-[280px] lg:w-[340px] h-48 md:h-auto min-h-[320px] overflow-hidden relative flex-shrink-0 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0c0816] md:from-transparent via-transparent to-[#0c0816]/80 z-10" />
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2)_0%,transparent_70%)]"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <img 
            src={course.img} 
            className="w-full h-full object-cover mix-blend-luminosity opacity-70 group-hover:scale-105 group-hover:opacity-90 group-hover:mix-blend-normal transition-all duration-700"
            alt={course.title}
          />
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <span className="bg-black/60 backdrop-blur-md border border-white/10 text-slate-200 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              {course.level}
            </span>
          </div>
        </div>

        {/* Conteúdo Detalhado */}
        <div className="flex-1 w-full p-6 md:p-8 md:pl-0 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Continuar Jornada
            </p>
            {filteredCourses.length > 1 && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mr-12 md:mr-24 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                Res 1 de {filteredCourses.length}
              </span>
            )}
          </div>
          
          <h3 className="text-3xl md:text-4xl font-serif text-slate-100 mb-3 tracking-wide">{course.title}</h3>
          
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-4 opacity-80">
            <span className="flex items-center gap-1"><span className="text-amber-500">★</span> {course.rating}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>{course.duration} de curso</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>{course.total} Lições</span>
          </div>

          <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-2xl">{course.desc}</p>
          
          <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-6">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Próxima Lição</p>
            <p className="text-sm text-indigo-200 font-medium">{course.nextLesson}</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 bg-indigo-950/20 p-5 rounded-xl border border-indigo-500/10">
            <Tooltip content={`${course.progress}% de ${course.total} lições concluídas`}>
              <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0 cursor-help">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <motion.circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke="currentColor" 
                    className="text-indigo-400"
                    strokeWidth="6" 
                    strokeLinecap="round"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * (course.progress / 100)) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-slate-100">{course.progress}%</span>
                </div>
              </div>
            </Tooltip>
            
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-2 font-medium">
                <span className="text-slate-300">Progresso Geral</span>
                <span className="text-indigo-300">{Math.round((course.progress / 100) * course.total)} / {course.total} Concluídas</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => onNavigate?.('/courses')}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold tracking-wide uppercase text-xs transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2">
              Continuar Aprendendo <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors border border-transparent hover:border-white/10 rounded-xl hover:bg-white/5 flex items-center gap-2"
            >
              Exibir Detalhes <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden mt-8"
              >
                <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Modulos */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-indigo-400" />
                      Módulos do Curso
                    </h4>
                    <div className="space-y-3">
                      {course.modules?.map((mod, i) => (
                        <div key={mod.id} className={`p-4 rounded-xl border ${mod.current ? 'border-indigo-500/50 bg-indigo-900/20' : 'border-white/5 bg-black/20'} flex items-center gap-4 transition-colors hover:bg-white/5`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${mod.completed ? 'bg-indigo-500/20 text-indigo-400' : mod.current ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/5 text-slate-500'}`}>
                            {mod.completed ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                          </div>
                          <div className="flex-1">
                            <h5 className={`text-sm font-medium ${mod.current ? 'text-indigo-200' : 'text-slate-300'}`}>{mod.title}</h5>
                            <p className="text-xs text-slate-500">{mod.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Instructor */}
                    {course.instructor && (
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-2">
                          <User className="w-4 h-4 text-indigo-400" />
                          Instrutor
                        </h4>
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/20">
                          <img src={course.instructor.avatar} alt={course.instructor.name} className="w-12 h-12 rounded-full border border-indigo-500/30 object-cover" />
                          <div>
                            <h5 className="text-sm font-medium text-slate-200">{course.instructor.name}</h5>
                            <p className="text-xs text-slate-400">{course.instructor.role}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Avaliações */}
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        Avaliações
                      </h4>
                      <div className="space-y-3">
                        {course.reviews?.map((review) => (
                          <div key={review.id} className="p-4 rounded-xl border border-white/5 bg-black/20">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-xs font-bold text-slate-300">{review.author}</span>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.stars ? 'text-amber-500 fill-amber-500' : 'text-slate-700'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-slate-400 italic">"{review.text}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
