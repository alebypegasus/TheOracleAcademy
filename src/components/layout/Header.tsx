import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, X, BookOpen, MessageSquare, BookMarked, Award, ArrowRight, Heart, Flame } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const SEARCHABLE_COURSES = [
  { id: 'fund-espirito', name: 'Natureza da Espiritualidade', desc: 'Espiritualidade, religião e ocultismo', level: 'Módulo 0 — Fundamentos' },
  { id: 'fund-magia', name: 'Estrutura da Magia', desc: 'Visão histórica, antropológica e correntes', level: 'Módulo 0 — Fundamentos' },
  { id: 'fund-altares', name: 'Altares e Consagração', desc: 'Como montar, consagrar ritualística e proteção', level: 'Módulo 0 — Fundamentos' },
  { id: 'leitura-velas', name: 'Leitura de Velas e Fumaça', desc: 'Piromancia, queima ritual, padrões', level: 'Nível 1 — Oráculos Intuitivos' },
  { id: 'leitura-agua', name: 'Água e Sombras', desc: 'Hidromancia, reflexos, visões', level: 'Nível 1 — Oráculos Intuitivos' },
  { id: 'leitura-sorteios', name: 'Acaso e Pêndulo', desc: 'Dados, bibliomancia, radiestesia', level: 'Nível 1 — Oráculos Intuitivos' },
  { id: 'lenormand-kipper', name: 'Lenormand e Kipper', desc: 'Cartas objetivas e narrativa social', level: 'Nível 2 — Oráculos Simbólicos' },
  { id: 'runas-ogham', name: 'Runas e Ogham', desc: 'Sistemas nórdicos e celtas, alfabetos mágicos', level: 'Nível 2 — Oráculos Simbólicos' },
  { id: 'sibilla', name: 'Sibilla Italiana', desc: 'Narrativa emocional e prática de leitura', level: 'Nível 2 — Oráculos Simbólicos' },
  { id: 'tarot', name: 'Tarot Clássico', desc: 'Sistema simbólico, arquétipos, numerologia', level: 'Nível 3 — Oráculos Interpretativos' },
  { id: 'cafeomancia', name: 'Cafeomancia e Quiromancia', desc: 'Leitura de borras e linhas das mãos', level: 'Nível 3 — Oráculos Interpretativos' },
  { id: 'oniromancia', name: 'Oniromancia e Geomancia', desc: 'Sonhos e 16 figuras astrológicas na terra', level: 'Nível 3 — Oráculos Interpretativos' }
];

export function Header({ searchQuery, setSearchQuery, profile, currentUser }: any) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [localSearchInput, setLocalSearchInput] = useState('');
  
  // Real-time search results
  const [searchResults, setSearchResults] = useState<{ posts: any[]; items: any[]; courses: any[] }>({
    posts: [],
    items: [],
    courses: []
  });
  const [isSearching, setIsSearching] = useState(false);

  // Fetch notifications
  const loadNotifications = () => {
    if (!currentUser) return;
    fetch('/api/notifications', {
      headers: {
        'x-user-id': currentUser.id.toString()
      }
    })
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    })
    .catch(err => console.error("Erro ao resgatar sinais celestes:", err));
  };

  useEffect(() => {
    loadNotifications();
    // Poll notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Handle marking notifications as read
  const handleMarkReadAll = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: {
          'x-user-id': currentUser.id.toString()
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (e) {
      console.error("Erro ao sintonizar lidas:", e);
    }
  };

  // Handle Search Input in Header or modal
  useEffect(() => {
    if (!localSearchInput.trim()) {
      setSearchResults({ posts: [], items: [], courses: [] });
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(() => {
      // 1. Search Local Courses
      const query = localSearchInput.toLowerCase();
      const matchedCourses = SEARCHABLE_COURSES.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.desc.toLowerCase().includes(query) ||
        c.level.toLowerCase().includes(query)
      );

      // 2. Fetch community posts & marketplace items from backend
      fetch(`/api/search?q=${encodeURIComponent(localSearchInput)}`)
      .then(r => r.json())
      .then(data => {
        setSearchResults({
          courses: matchedCourses,
          posts: data.posts || [],
          items: data.items || []
        });
      })
      .catch(err => console.error(err))
      .finally(() => setIsSearching(false));
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [localSearchInput]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleResultClick = (destination: string) => {
    setShowSearchModal(false);
    navigate(destination);
  };

  return (
    <header className="flex flex-col md:flex-row md:items-end w-full justify-between gap-6 relative z-50">
      <div>
        <h2 className="text-3xl font-serif font-medium text-slate-100 flex items-center gap-2">
          Bem-vindo de volta, {profile.name?.split(' ')[0] || 'Usuário'} <Sparkles className="w-6 h-6 text-indigo-400" />
        </h2>
        <p className="text-slate-400 mt-2">Continue sua jornada de conhecimento místico.</p>
      </div>
      
      <div className="flex items-center flex-wrap gap-4">
        {/* Search Input click opens the cosmic search modal */}
        <div 
          onClick={() => setShowSearchModal(true)}
          className="glass-panel px-4 py-3 rounded-xl flex items-center cursor-pointer hover:bg-white/5 border border-indigo-500/10 hover:border-indigo-400/35 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.05)] w-full md:w-auto"
        >
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <span className="text-sm text-slate-400 font-sans w-48 text-left truncate">
            Buscar na plataforma...
          </span>
          <span className="ml-auto text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-mono hidden md:inline">
            BUSCAR
          </span>
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <Tooltip content="Notificações">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadCount > 0) {
                  handleMarkReadAll();
                }
              }} 
              className="glass-panel w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white/5 border border-indigo-500/10 hover:border-indigo-400/35 transition-colors group relative"
            >
              <Bell className={`w-5 h-5 ${showNotifications ? 'text-indigo-300' : 'text-indigo-400'} group-hover:scale-110 transition-transform`} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#090514] animate-pulse"></span>
              )}
            </button>
          </Tooltip>

          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Click outside backdrop for notification close */}
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 12, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-3 w-80 glass-panel border border-indigo-500/20 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[460px] flex flex-col"
                >
                  <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">Sinais do Éter</h4>
                      <p className="text-[10px] text-slate-500">Notificações e Sintonias</p>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkReadAll} 
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono underline hover:no-underline transition-colors cursor-pointer"
                      >
                        Limpar Silencioso
                      </button>
                    )}
                  </div>
                  
                  <div className="overflow-y-auto divide-y divide-white/5 scrollbar-thin">
                    {notifications.length > 0 ? (
                      notifications.map(n => {
                        let Icon = Sparkles;
                        let iconBg = 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
                        if (n.type === 'like') {
                          Icon = Heart;
                          iconBg = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                        } else if (n.type === 'certificate') {
                          Icon = Award;
                          iconBg = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                        } else if (n.type === 'challenge') {
                          Icon = Flame;
                          iconBg = 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
                        }

                        return (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              if (n.type === 'like') handleResultClick('/community');
                              else if (n.type === 'certificate') handleResultClick('/certificates');
                              else if (n.type === 'challenge') handleResultClick('/challenges');
                            }}
                            className={`p-4 flex gap-3 hover:bg-white/[0.03] transition-colors cursor-pointer ${!n.isRead ? 'bg-indigo-500/[0.02]' : ''}`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <p className={`text-xs leading-relaxed ${!n.isRead ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                                {n.text}
                              </p>
                              <span className="text-[9px] text-slate-500 font-mono">
                                {n.createdAt ? new Date(n.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Vibração Ativa'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center space-y-2">
                        <Sparkles className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                        <p className="text-xs text-slate-500">Seu éter está limpo e sintonizado. Nenhuma nova transmissão.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* GLOBAL COSMIC SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {showSearchModal && (
          <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 px-4 md:px-6">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowSearchModal(false)}
              className="fixed inset-0 bg-[#06040bc0] backdrop-blur-md" 
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.96, opacity: 0, y: -20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.96, opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl bg-[#090615] border border-indigo-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.15)] flex flex-col max-h-[80vh]"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none -mr-40 -mt-40" />
              
              {/* Search Bar Header */}
              <div className="p-5 border-b border-indigo-500/15 flex items-center justify-between gap-4 bg-white/[0.01]">
                <div className="flex items-center flex-1 gap-3">
                  <Search className="w-5 h-5 text-indigo-400 shrink-0" />
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Busque por ensinamentos, cursos, grimoires ou sábios..."
                    value={localSearchInput}
                    onChange={(e) => setLocalSearchInput(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 font-serif text-lg py-1"
                  />
                </div>
                {localSearchInput && (
                  <button onClick={() => setLocalSearchInput('')} className="p-1 hover:bg-white/5 rounded-lg text-slate-500 hover:text-slate-300">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => setShowSearchModal(false)}
                  className="px-3 py-1.5 border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Fechar
                </button>
              </div>

              {/* Scrollable Results Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin">
                {isSearching ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="font-mono text-xs text-indigo-400 tracking-widest uppercase">Decodificando as estrelas no céu místico...</p>
                  </div>
                ) : localSearchInput.trim() ? (
                  /* Results Present */
                  searchResults.courses.length === 0 && searchResults.posts.length === 0 && searchResults.items.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
                      <h4 className="text-base font-serif text-slate-400">Nenhum rastro encontrado</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">Tente utilizar outras palavras-chave ou confie em sua intuição para explorar as guias laterais.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* CATEGORY 1: COURSES */}
                      {searchResults.courses.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-[#a855f7] mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Cursos e Oráculos ({searchResults.courses.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {searchResults.courses.map(course => (
                              <div 
                                key={course.id}
                                onClick={() => handleResultClick('/courses')}
                                className="glass-panel p-4 rounded-xl border border-white/5 hover:border-[#a855f7]/30 hover:bg-[#a855f7]/5 cursor-pointer transition-all duration-300 group flex items-start justify-between"
                              >
                                <div>
                                  <h5 className="font-serif font-medium text-slate-200 text-sm group-hover:text-slate-100 transition-colors">{course.name}</h5>
                                  <p className="text-xs text-slate-400 mt-1">{course.desc}</p>
                                  <span className="text-[10px] text-[#a855f7] mt-2 inline-block font-mono bg-[#a855f7]/10 px-2 py-0.5 rounded border border-[#a855f7]/20">
                                    {course.level}
                                  </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#a855f7] group-hover:translate-x-1 transition-all shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CATEGORY 2: THE COMMUNITY POSTS */}
                      {searchResults.posts.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Comunidade da Egrégora ({searchResults.posts.length})
                          </h4>
                          <div className="space-y-3">
                            {searchResults.posts.map(post => {
                              const briefContent = post.content.length > 140 ? post.content.substring(0, 140) + "..." : post.content;
                              return (
                                <div 
                                  key={post.id}
                                  onClick={() => handleResultClick('/community')}
                                  className="glass-panel p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 cursor-pointer transition-all duration-300 group flex items-center justify-between gap-4"
                                >
                                  <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <div className="w-5 h-5 rounded-full overflow-hidden border border-white/10 bg-slate-800">
                                        <img src={post.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'} className="w-full h-full object-cover" alt="" />
                                      </div>
                                      <span className="text-[11px] font-medium text-slate-300">{post.authorName}</span>
                                      <span className="text-[9px] text-slate-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">Coven: {post.coven}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{briefContent}</p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* CATEGORY 3: THE LIBRARY / MARKETPLACE ITEMS */}
                      {searchResults.items.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 flex items-center gap-2">
                            <BookMarked className="w-4 h-4" /> Biblioteca e Grimórios ({searchResults.items.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {searchResults.items.map(item => (
                              <div 
                                key={item.id}
                                onClick={() => handleResultClick('/library')}
                                className="glass-panel p-4 rounded-xl border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 cursor-pointer transition-all duration-300 group flex items-center justify-between gap-4"
                              >
                                <div className="flex gap-3">
                                  <div className="w-10 h-14 rounded bg-slate-800 shrink-0 overflow-hidden border border-white/10 flex items-center justify-center">
                                    <img src={item.coverImage || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=150'} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div>
                                    <h5 className="font-serif font-medium text-slate-200 text-sm group-hover:text-slate-100 transition-colors line-clamp-1">{item.title}</h5>
                                    {item.subtitle && <p className="text-[10px] text-slate-400 line-clamp-1">{item.subtitle}</p>}
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <span className="text-[9px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono">
                                        R$ {item.price.toFixed(2)}
                                      </span>
                                      <span className="text-[9px] text-slate-500 font-sans">vendedor: {item.author}</span>
                                    </div>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  /* Initial Empty / Helpful Search State */
                  <div className="py-8 space-y-6">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Atalhos Sugeridos</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button onClick={() => handleResultClick('/courses')} className="glass-panel p-3 rounded-xl border border-white/5 hover:bg-indigo-500/5 hover:border-indigo-500/20 text-xs text-slate-300 text-left transition-all">
                          <BookOpen className="w-4 h-4 text-[#a855f7] mb-1.5" />
                          <span className="font-medium inline-block mb-0.5">Explorar Cursos</span>
                          <p className="text-[10px] text-slate-500">Aprender oráculos</p>
                        </button>
                        <button onClick={() => handleResultClick('/community')} className="glass-panel p-3 rounded-xl border border-white/5 hover:bg-indigo-500/5 hover:border-indigo-500/20 text-xs text-slate-300 text-left transition-all">
                          <MessageSquare className="w-4 h-4 text-indigo-400 mb-1.5" />
                          <span className="font-medium inline-block mb-0.5">Comunidade</span>
                          <p className="text-[10px] text-slate-500">Trocas místicas</p>
                        </button>
                        <button onClick={() => handleResultClick('/library')} className="glass-panel p-3 rounded-xl border border-white/5 hover:bg-indigo-500/5 hover:border-indigo-500/20 text-xs text-slate-300 text-left transition-all">
                          <BookMarked className="w-4 h-4 text-amber-500 mb-1.5" />
                          <span className="font-medium inline-block mb-0.5">Biblioteca</span>
                          <p className="text-[10px] text-slate-500">Grimórios e lojinha</p>
                        </button>
                        <button onClick={() => handleResultClick('/oracle')} className="glass-panel p-3 rounded-xl border border-white/5 hover:bg-indigo-500/5 hover:border-indigo-500/20 text-xs text-slate-300 text-left transition-all">
                          <Sparkles className="w-4 h-4 text-rose-400 mb-1.5" />
                          <span className="font-medium inline-block mb-0.5">Leitura IA</span>
                          <p className="text-[10px] text-slate-500">Consultar oráculo</p>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/[0.01] rounded-2xl p-4 border border-white/5 flex items-center justify-between text-xs text-slate-400 gap-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
                        <span>Sua jornada de aprendizado do éter é atualizada dinamicamente.</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-300">Oracle Academy ✨</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
