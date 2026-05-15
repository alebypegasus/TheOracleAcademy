import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, MessageSquare, Heart, Share2, Plus, 
  Sparkles, Moon, Star, Image as ImageIcon, Video, 
  Compass, Shield, X, MoreHorizontal, CheckCircle2, 
  Navigation, Award, Book, Globe, Instagram, Send, Lock,
  ChevronRight, Bookmark, MapPin, Zap
} from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

// Expanded mock data to support the rich profile modal
const INITIAL_COVENS = [
  { id: 1, name: 'Tarot Avançado', members: 1205, description: 'Estudos profundos de arcanos e tiragens.', joined: true, image: 'https://images.unsplash.com/photo-1633519895058-20d04fd2e78d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Público' },
  { id: 2, name: 'Ocultismo Prático', members: 840, description: 'Tradições seculares, rituais e alta magia.', joined: false, image: 'https://images.unsplash.com/photo-1510064295325-1e391b1a45ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Privado' },
  { id: 3, name: 'Astrologia Kármica', members: 2310, description: 'Revolução solar, mapa astral zodiacal e karmas.', joined: true, image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Público' },
  { id: 4, name: 'Magia Natural & Ervas', members: 4500, description: 'Conexão com a natureza, chás e feitiços simples.', joined: false, image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Público' },
];

const ENRICHED_USER_DATA: Record<string, any> = {
  'Elias Thorne': {
    bio: 'Tecendo fios entre o visível e o invisível. Especialista em Astrologia Kármica, tarologia rítmica e alquimia de ervas brasileiras.',
    grau: 'Grau IX - Mestre Ascenso',
    level: 24,
    stats: { ecos: 152, aura: '2.4k', ritos: 48 },
    location: 'Santuário de Cristal',
    socials: { ig: '@elias_oculto', web: 'elias-thorne.grimoire' },
    services: [
      { title: 'Leitura do Oráculo Estelar', price: 'R$ 380', desc: 'Uma imersão completa no seu destino para o próximo ciclo lunar.' },
      { title: 'Consultoria de Alquimia Pessoal', price: 'R$ 220', desc: 'Fórmulas personalizadas para equilíbrio energético.' }
    ],
    creds: [
      { title: 'Arcano Maior em Tarologia', source: 'The Oracle Academy', year: '2025' },
      { title: 'Hermetismo Aplicado', source: 'Instituto Hermes', year: '2024' }
    ]
  },
  'Serena Moon': {
    bio: 'Sacerdotisa da Lua e guardiã das ervas sagradas. Busco a harmonia através dos ciclos naturais e rituais de consagração.',
    grau: 'Grau VII - Sacerdotisa',
    level: 19,
    stats: { ecos: 89, aura: '1.2k', ritos: 32 },
    location: 'Vale das Sombras Brancas',
    socials: { ig: '@serena_moon_magic', web: 'serena.ritual' },
    services: [
      { title: 'Consagração de Amuletos', price: 'R$ 150', desc: 'Proteção e intenção para seus objetos de poder.' },
      { title: 'Ritual de Limpeza Lunar', price: 'R$ 200', desc: 'Desconexão de energias densas via meditação guiada.' }
    ],
    creds: [
      { title: 'Mestra das Ervas', source: 'Gaia Wisdom', year: '2023' }
    ]
  },
  'Marcus Vane': {
    bio: 'Explorador da geometria sagrada e das leis herméticas. O universo é mental, e o Todo é mente.',
    grau: 'Grau V - Hermetista',
    level: 12,
    stats: { ecos: 56, aura: '850', ritos: 15 },
    location: 'Laboratório Alquímico',
    socials: { ig: '@marcus_v_hermes', web: 'vane.geometry' },
    services: [
      { title: 'Análise de Geometria Pessoal', price: 'R$ 300', desc: 'Descubra os padrões matemáticos da sua existência.' }
    ],
    creds: [
      { title: 'Iniciação à Teurgia', source: 'Ordem de Thoth', year: '2024' }
    ]
  }
};

const INITIAL_POSTS = [
  {
    id: 1,
    authorName: 'Elias Thorne',
    authorTitle: 'Mestre Ascenso',
    status: 'online',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    coven: 'Astrologia Kármica',
    content: 'Tentei combinar o significado de Fehu com os trânsitos de Vênus para uma leitura financeira. Os resultados foram impressionantes! A chave está em focar na expansão e não na falta.',
    images: ['https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    likes: 243,
    comments: 42,
    time: 'Há 2 horas',
    tags: ['Astrologia', 'Prosperidade']
  },
  {
    id: 2,
    authorName: 'Serena Moon',
    authorTitle: 'Sacerdotisa',
    status: 'away',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    coven: 'Magia Natural & Ervas',
    content: 'Hoje o rito será sobre Intuição e Clareza. Acendam uma vela de lavanda e segurem sua pedra da lua. A vibração está propícia para revelações oníricas.',
    images: [],
    likes: 89,
    comments: 12,
    time: 'Há 5 horas',
    tags: ['Ritual', 'Lua']
  },
  {
    id: 3,
    authorName: 'Marcus Vane',
    authorTitle: 'Hermetista',
    status: 'offline',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    coven: 'Ocultismo Prático',
    content: 'A geometria sagrada não é apenas estética; é a planta baixa da realidade. Estudem o Cubo de Metatron e como ele governa a estrutura atômica.',
    images: [],
    likes: 56,
    comments: 8,
    time: 'Há 1 dia',
    tags: ['Geometria', 'Teoria']
  }
];

export function CommunityView({ currentUser }: { currentUser: any }) {
  const [activeTab, setActiveTab] = useState<'feed' | 'explorar' | 'notificacoes'>('feed');
  const [activeCoven, setActiveCoven] = useState<number | null>(null);
  const [covens, setCovens] = useState(INITIAL_COVENS);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatingCoven, setIsCreatingCoven] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null);

  // Filter logic
  const filteredPosts = useMemo(() => {
    if (activeCoven) {
      const covenName = covens.find(c => c.id === activeCoven)?.name;
      return posts.filter(p => p.coven === covenName);
    }
    return posts;
  }, [activeCoven, posts, covens]);

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) return;
    
    const newPost = {
      id: Date.now(),
      authorName: currentUser?.name || 'Iniciado',
      authorTitle: 'Busca-Caminhos',
      status: 'online',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      coven: activeCoven ? covens.find(c => c.id === activeCoven)?.name || 'Eter' : 'Eter',
      content: newPostContent,
      images: [],
      likes: 0,
      comments: 0,
      time: 'Agora',
      tags: ['Geral']
    };
    
    setPosts([newPost, ...posts]);
    setIsCreatingPost(false);
    setNewPostContent('');
  };

  const toggleCoven = (id: number) => {
    setCovens(covens.map(c => c.id === id ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c));
  };

  const openProfile = (user: any) => {
    // Merge basic post user info with enriched data
    const enriched = ENRICHED_USER_DATA[user.authorName] || {
      bio: 'Um buscador silencioso no Santuário.',
      grau: 'Grau I - Iniciado',
      level: 1,
      stats: { ecos: 0, aura: '0', ritos: 0 },
      location: 'Desconhecido',
      socials: {},
      services: [],
      creds: []
    };
    setSelectedUserProfile({ ...user, ...enriched });
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8 px-4 lg:px-8 relative min-h-screen font-sans">
      {/* Mystical Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden blur-[120px] opacity-20 z-0">
        <div className="absolute top-[5%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/40 mix-blend-screen animate-pulse" />
        <div className="absolute top-[45%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-purple-600/30 mix-blend-screen" />
        <div className="absolute bottom-[10%] left-[25%] w-[30vw] h-[30vw] rounded-full bg-amber-600/20 mix-blend-screen" />
      </div>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="hidden xl:block xl:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-[2rem] border border-white/5 sticky top-8 shadow-2xl bg-black/20">
            <h2 className="text-xl font-serif text-slate-100 mb-6 px-2 tracking-wide">O Santuário</h2>
            <nav className="space-y-1">
              {[
                { id: 'feed', label: 'Feed Akáshico', icon: Compass },
                { id: 'explorar', label: 'Explorar Covens', icon: Users },
                { id: 'notificacoes', label: 'Ecos de Aura', icon: Sparkles }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setActiveCoven(null); }}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group ${activeTab === item.id && !activeCoven ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}
                >
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id && !activeCoven ? 'text-indigo-400' : ''}`} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-12 px-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Suas Egrégoras
                </h3>
                <button onClick={() => setIsCreatingCoven(true)} className="p-1 hover:bg-white/5 rounded-full text-slate-400 transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                {covens.filter(c => c.joined).map((group) => (
                  <button 
                    key={group.id} 
                    onClick={() => { setActiveCoven(group.id); setActiveTab('feed'); }}
                    className={`flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-all w-full group/btn p-2.5 rounded-2xl ${activeCoven === group.id ? 'bg-indigo-500/10 text-slate-100 border border-indigo-500/20' : 'hover:bg-white/5 border border-transparent'}`}
                  >
                    <img src={group.image} alt="" className="w-8 h-8 rounded-xl object-cover border border-white/10 group-hover/btn:border-indigo-400/50 transition-colors" />
                    <span className="text-sm font-medium truncate">{group.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-6 space-y-8">
          
          {/* Header Mobile / Search */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pt-4">
            <h1 className="text-3xl font-serif text-slate-100 gold-text">Comunidade</h1>
            <div className="relative w-full md:w-80">
              <input type="text" placeholder="Visionar mentes e covens..." className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'explorar' ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {covens.map(c => (
                <div key={c.id} className="glass-panel overflow-hidden rounded-[2rem] border border-white/5 hover:border-indigo-500/30 transition-all group relative flex flex-col bg-black/20">
                  <div className="h-32 w-full relative overflow-hidden">
                    <img src={c.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  <div className="p-6 relative -mt-10 flex flex-col flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-[#0e0c1b] border-2 border-indigo-500/30 p-1 mb-4 shadow-2xl overflow-hidden">
                      <img src={c.image} alt="" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <h4 className="text-xl font-serif text-slate-100">{c.name}</h4>
                    <p className="text-xs text-indigo-400/80 mb-4 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.members.toLocaleString()} membros</p>
                    <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed italic">"{c.description}"</p>
                    <button 
                      onClick={() => toggleCoven(c.id)}
                      className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${c.joined ? 'bg-white/5 text-slate-400 border border-white/10' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500'}`}
                    >
                      {c.joined ? 'Sair do Coven' : 'Juntar-se à Ordem'}
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Composer */}
              <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-black/40 shadow-xl">
                <div className="flex items-start gap-4">
                  <img src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} alt="" className="w-12 h-12 rounded-full border border-indigo-500/20 object-cover" />
                  <div className="flex-1">
                    <TextareaAutosize 
                      minRows={isCreatingPost ? 3 : 1}
                      onFocus={() => setIsCreatingPost(true)}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Transcenda o silêncio. Qual sua revelação hoje?"
                      className="w-full bg-transparent text-slate-100 text-lg outline-none resize-none placeholder:text-slate-600 py-2"
                    />
                    <AnimatePresence>
                      {isCreatingPost && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 mt-2 border-t border-white/5 flex justify-between items-center overflow-hidden">
                          <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all"><ImageIcon className="w-5 h-5" /></button>
                            <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all"><Star className="w-5 h-5" /></button>
                          </div>
                          <div className="flex items-center gap-4">
                            <button onClick={() => { setIsCreatingPost(false); setNewPostContent(''); }} className="text-sm font-bold text-slate-500 hover:text-slate-300">Cancelar</button>
                            <button 
                              onClick={handlePostSubmit}
                              disabled={!newPostContent.trim()}
                              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
                            >
                              Transmitir
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Feed List */}
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {filteredPosts.map((post) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={post.id}
                      className="glass-panel rounded-[2rem] border border-white/5 bg-black/20 overflow-hidden shadow-xl"
                    >
                      <div className="p-6 sm:p-8">
                        {/* Post Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <button onClick={() => openProfile(post)} className="relative group shrink-0 outline-none">
                              <img src={post.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-indigo-500/20 group-hover:border-indigo-400 transition-all shadow-lg" />
                              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0a0a0a] ${post.status === 'online' ? 'bg-emerald-500' : post.status === 'away' ? 'bg-amber-500' : 'bg-slate-600'}`} />
                            </button>
                            <div>
                              <button onClick={() => openProfile(post)} className="text-lg font-serif text-slate-100 hover:text-indigo-300 transition-colors text-left outline-none block">
                                {post.authorName}
                              </button>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400/80">{post.authorTitle}</span>
                                <span className="text-slate-600 text-[10px]">•</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{post.time}</span>
                                <span className="text-slate-600 text-[10px]">•</span>
                                <span className="text-[10px] text-emerald-400/80 font-black tracking-widest hover:underline cursor-pointer">{post.coven}</span>
                              </div>
                            </div>
                          </div>
                          <button className="p-2 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-full transition-all"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>

                        {/* Post Body */}
                        <div className="space-y-6">
                          <p className="text-[16px] text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>
                          {post.images.length > 0 && (
                            <div className="rounded-3xl overflow-hidden border border-white/5 bg-black/20">
                              <img src={post.images[0]} alt="" className="w-full max-h-[500px] object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-1 pr-6 border-r border-white/5">
                            <button className="flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-all p-2 group">
                              <Heart className="w-5 h-5 group-hover:scale-110" />
                              <span className="text-sm font-bold">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-all p-2 group">
                              <MessageSquare className="w-5 h-5 group-hover:scale-110" />
                              <span className="text-sm font-bold">{post.comments}</span>
                            </button>
                         </div>
                         <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-300 transition-all p-2 px-4 hover:bg-white/5 rounded-xl group font-black text-[10px] uppercase tracking-widest">
                            <Share2 className="w-4 h-4" /> Propagar
                         </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Right Widgets Column */}
        <div className="hidden xl:block xl:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-black/40 sticky top-8 space-y-8 shadow-2xl">
            <section>
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Arcanos em Foco
              </h3>
              <div className="space-y-5">
                {[
                  { tag: 'TAROT', title: 'O Arcano da Semana: A Estrela', views: '1.4k' },
                  { tag: 'ASTROS', title: 'Vênus entra em Peixes: Época de Amor', views: '850' },
                  { tag: 'RITOS', title: 'Consagração de Pentáculos', views: '2.1k' }
                ].map((item, i) => (
                  <button key={i} className="group w-full text-left">
                    <span className="text-[9px] font-black text-indigo-400 group-hover:text-amber-400 transition-colors tracking-widest">{item.tag}</span>
                    <h4 className="text-[15px] font-medium text-slate-200 mt-1 leading-tight group-hover:translate-x-1 transition-transform">{item.title}</h4>
                    <span className="text-[10px] text-slate-500 mt-1 block">{item.views} ecos gravados</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="h-px bg-white/5 w-full" />

            <section className="bg-gradient-to-br from-indigo-900/40 to-[#0e0c1b] p-5 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Moon className="w-12 h-12" /></div>
              <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-4">Astrum Hoje</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                <div>
                  <div className="text-sm font-bold text-white">Lua Cheia em Virgem</div>
                  <div className="text-[10px] text-indigo-200/60 uppercase font-black tracking-widest">Foco e Purificação</div>
                </div>
              </div>
              <button className="w-full py-2.5 mt-5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-indigo-500/20">Manifestar Detalhes</button>
            </section>
          </div>
        </div>
      </div>

      {/* MODALS AREA */}
      <AnimatePresence>
        {/* Create Coven Modal */}
        {isCreatingCoven && createPortal(
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setIsCreatingCoven(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-panel w-full max-w-lg rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl bg-[#0e0c1b] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-2xl font-serif text-slate-100 tracking-wide gold-text">Fundir Nova Egrégora</h3>
                <button onClick={() => setIsCreatingCoven(false)} className="text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Identidade do Coven</label>
                  <input type="text" placeholder="Ex: Círculo de Hécate" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-100 outline-none focus:border-indigo-500/50 transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Manifesto / Propósito</label>
                  <textarea rows={3} placeholder="Escreva sobre as intenções deste grupo..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-100 outline-none focus:border-indigo-500/50 transition-all resize-none font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-indigo-500/50 bg-indigo-500/10 text-indigo-300">
                    <Users className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-widest">Público</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-white/5 bg-white/5 text-slate-500">
                    <Lock className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-widest">Privado</span>
                  </button>
                </div>
              </div>
              <div className="p-8 border-t border-white/5 bg-black/40 flex justify-end items-center gap-6">
                <button onClick={() => setIsCreatingCoven(false)} className="text-sm font-bold text-slate-500 hover:text-slate-300">Abortar</button>
                <button onClick={() => setIsCreatingCoven(false)} className="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all">Consagrar Coven</button>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}

        {/* USER PROFILE MODAL - FIXED AND ENRICHED */}
        {selectedUserProfile && createPortal(
          <motion.div 
            key="profile-modal-root"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-0 md:p-6 bg-black/95 backdrop-blur-3xl"
            onClick={() => setSelectedUserProfile(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="glass-panel w-full max-w-5xl max-h-[92vh] rounded-none md:rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)] bg-[#0b0a1a] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Profile Header Bar */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 z-30 backdrop-blur-2xl">
                 <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedUserProfile.status === 'online' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]' : selectedUserProfile.status === 'away' ? 'bg-amber-500' : 'bg-slate-500'}`} />
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Arcano de Identidade</h3>
                 </div>
                 <button onClick={() => setSelectedUserProfile(null)} className="text-slate-500 hover:text-white bg-white/5 p-2 rounded-full transition-all group">
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                 </button>
              </div>

              {/* Profile Content Scrollable */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                  {/* Big Avatar */}
                  <div className="relative shrink-0">
                    <div className="absolute inset-[-10px] bg-indigo-600/20 blur-3xl rounded-full" />
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-indigo-500/20 shadow-2xl overflow-hidden relative z-10 transition-transform duration-700 hover:scale-105">
                       <img src={selectedUserProfile.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
                       <div className="bg-indigo-600 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl border border-white/10 whitespace-nowrap">
                          Nível {selectedUserProfile.level}
                       </div>
                    </div>
                  </div>

                  {/* Top Stats & Bio */}
                  <div className="flex-1 text-center md:text-left space-y-6">
                    <div>
                      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <h2 className="text-4xl md:text-6xl font-serif text-slate-100 gold-text underline decoration-indigo-500/20 decoration-4 underline-offset-8">{selectedUserProfile.authorName}</h2>
                        <span className="px-5 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{selectedUserProfile.authorTitle}</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500 text-sm font-medium italic opacity-80">
                         <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {selectedUserProfile.location}</div>
                         <div className="w-1 h-1 rounded-full bg-slate-700" />
                         <div className="text-emerald-400/80">{selectedUserProfile.grau}</div>
                      </div>
                    </div>

                    <p className="text-slate-400 text-xl leading-relaxed max-w-3xl font-light italic">
                      "{selectedUserProfile.bio}"
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                       {selectedUserProfile.socials.ig && (
                         <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-all">
                            <Instagram className="w-4 h-4 text-pink-500" /> {selectedUserProfile.socials.ig}
                         </button>
                       )}
                       {selectedUserProfile.socials.web && (
                         <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-all">
                            <Globe className="w-4 h-4 text-sky-400" /> {selectedUserProfile.socials.web}
                         </button>
                       )}
                       <button className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all group">
                          Conectar Egrégora <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                  </div>
                </div>

                {/* Detailed Sections Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20 pt-16 border-t border-white/5">
                  
                  {/* LEFT WIDGETS */}
                  <div className="lg:col-span-4 space-y-12">
                    {/* Activity Stats */}
                    <section>
                      <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                         <Zap className="w-4 h-4 text-amber-500" /> Atividade no Éter
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { val: selectedUserProfile.stats.ecos, label: 'Ecos' },
                          { val: selectedUserProfile.stats.aura, label: 'Aura' },
                          { val: selectedUserProfile.stats.ritos, label: 'Ritos' }
                        ].map((s, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-5 text-center group hover:bg-indigo-500/5 transition-all">
                            <div className="text-2xl font-serif text-white mb-0.5 group-hover:scale-110 transition-transform">{s.val}</div>
                            <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Credentials */}
                    <section>
                      <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                         <Award className="w-4 h-4 text-emerald-400" /> Credenciais Místicas
                      </h3>
                      <div className="space-y-4">
                        {selectedUserProfile.creds.map((c: any, i: number) => (
                           <div key={i} className="glass-panel p-5 rounded-3xl border border-white/5 flex gap-4 items-start bg-white/[0.01]">
                              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                                 <Shield className="w-6 h-6 text-indigo-400/60" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-slate-200">{c.title}</h4>
                                 <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{c.source} • {c.year}</p>
                                 <div className="mt-2 text-[9px] font-black text-emerald-400/80 uppercase tracking-widest flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Verificado
                                 </div>
                              </div>
                           </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* RIGHT SERVICES & CONTENT */}
                  <div className="lg:col-span-8 space-y-12">
                     <section>
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                           <Sparkles className="w-4 h-4 text-indigo-400" /> Ritos & Consultas Disponíveis
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {selectedUserProfile.services.map((s: any, i: number) => (
                              <div key={i} className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] group hover:border-indigo-500/30 transition-all flex flex-col">
                                 <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-lg font-serif text-slate-100 group-hover:text-indigo-300 transition-colors leading-tight">{s.title}</h4>
                                    <span className="text-indigo-400 font-black text-sm whitespace-nowrap ml-4">{s.price}</span>
                                 </div>
                                 <p className="text-sm text-slate-400 mb-8 leading-relaxed italic flex-1">"{s.desc}"</p>
                                 <button className="w-full py-3.5 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">Consagrar Entrega</button>
                              </div>
                           ))}
                           {selectedUserProfile.services.length === 0 && (
                             <div className="col-span-2 text-center py-10 bg-white/5 rounded-3xl border border-dashed border-white/10 text-slate-500 text-sm italic">
                               Nenhum serviço manifestado ainda.
                             </div>
                           )}
                        </div>
                     </section>

                     <section>
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                           <Book className="w-4 h-4 text-rose-400" /> Tomos & Grimórios Publicados
                        </h3>
                        <div className="flex flex-wrap gap-6">
                           {[
                             'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
                             'https://images.unsplash.com/photo-1532012197367-934971842217'
                           ].map((img, i) => (
                              <div key={i} className="w-32 md:w-40 aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer relative">
                                 <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Bookmark className="w-8 h-8 text-white/50" />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

      {/* Global CSS fixes for scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.2); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .gold-text { background: linear-gradient(to right, #fde68a, #f59e0b, #fde68a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>
    </div>
  );
}
