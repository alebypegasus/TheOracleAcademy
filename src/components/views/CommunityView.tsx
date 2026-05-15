import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Search, MessageSquare, Heart, Share2, Plus, Edit3, Sparkles, Moon, Star, Image as ImageIcon, Video, Link as LinkIcon, Compass, BookOpen, Calendar, Flame, UserPlus, Shield, X, MoreHorizontal, CheckCircle2, Navigation } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

const INITIAL_COVENS = [
  { id: 1, name: 'Tarot Avançado', members: 1205, description: 'Estudos profundos de arcanos e tiragens.', joined: true, image: 'https://images.unsplash.com/photo-1633519895058-20d04fd2e78d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Público' },
  { id: 2, name: 'Ocultismo Prático', members: 840, description: 'Tradições seculares, rituais e alta magia.', joined: false, image: 'https://images.unsplash.com/photo-1510064295325-1e391b1a45ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Privado' },
  { id: 3, name: 'Astrologia Kármica', members: 2310, description: 'Revolução solar, mapa astral zodiacal e karmas.', joined: true, image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Público' },
  { id: 4, name: 'Magia Natural & Ervas', members: 4500, description: 'Conexão com a natureza, chás e feitiços simples.', joined: false, image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'Público' },
];

const INITIAL_POSTS = [
  {
    id: 1,
    authorName: 'Elias Thorne',
    authorTitle: 'Mestre Ascenso',
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
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    coven: 'Magia Natural & Ervas',
    content: 'Hoje o rito será sobre Intuição e Clareza. Acendam uma vela de lavanda e segurem sua pedra da lua.',
    images: [],
    likes: 89,
    comments: 12,
    time: 'Há 5 horas',
    tags: ['Ritual', 'Lua']
  }
];

export function CommunityView({ currentUser }: { currentUser: any }) {
  const [activeTab, setActiveTab] = useState<'feed' | 'explorar' | 'meus-covens'>('feed');
  const [activeCoven, setActiveCoven] = useState<number | null>(null);
  const [covens, setCovens] = useState(INITIAL_COVENS);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatingCoven, setIsCreatingCoven] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null);

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) return;
    
    setPosts([
      {
        id: Date.now(),
        authorName: currentUser?.name || 'Membro do Santuário',
        authorTitle: 'Iniciado',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        coven: activeCoven ? covens.find(c => c.id === activeCoven)?.name || 'Feed Global' : 'Feed Global',
        content: newPostContent,
        images: [],
        likes: 0,
        comments: 0,
        time: 'Agora',
        tags: ['Geral']
      },
      ...posts
    ]);
    
    setIsCreatingPost(false);
    setNewPostContent('');
  };

  const toggleCovenMembership = (covenId: number) => {
    setCovens(covens.map(c => {
      if (c.id === covenId) {
        return { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 };
      }
      return c;
    }));
  };

  const filteredPosts = activeCoven 
    ? posts.filter(p => p.coven === covens.find(c => c.id === activeCoven)?.name)
    : posts;

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8 px-4 lg:px-8 relative min-h-screen">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden blur-[100px] opacity-30 z-0">
        <div className="absolute top-[10%] left-[5%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/40 mix-blend-screen" />
        <div className="absolute top-[40%] right-[0%] w-[40vw] h-[40vw] rounded-full bg-purple-900/40 mix-blend-screen" />
        <div className="absolute bottom-[0%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-blue-900/30 mix-blend-screen" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pt-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-serif text-slate-100 gold-text tracking-wider mt-2">Santuário Cósmico</h2>
          <p className="text-slate-400 text-sm lg:text-base mt-2 font-light">Sua rede social mágica. Conecte-se, crie covens e compartilhe rituais.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
          <div className="relative flex-1 md:w-80">
            <input 
              type="text" 
              placeholder="Pesquisar grimórios, pessoas, covens..." 
              className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-full pl-12 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/80 shadow-inner transition-all focus:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column - Navigation */}
        <div className="hidden xl:block xl:col-span-3 space-y-6">
          <div className="glass-panel p-5 rounded-3xl border border-white/5 sticky top-8 shadow-2xl">
            <nav className="space-y-1">
              <button 
                onClick={() => { setActiveTab('feed'); setActiveCoven(null); }} 
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'feed' && !activeCoven ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-indigo-300 border border-indigo-500/30 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}
              >
                <Compass className={`w-5 h-5 ${activeTab === 'feed' && !activeCoven ? 'text-indigo-400' : ''}`} />
                <span className="font-semibold text-sm">Feed Akáshico</span>
              </button>
              <button 
                onClick={() => { setActiveTab('explorar'); setActiveCoven(null); }} 
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'explorar' ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-indigo-300 border border-indigo-500/30 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}
              >
                <Search className={`w-5 h-5 ${activeTab === 'explorar' ? 'text-indigo-400' : ''}`} />
                <span className="font-semibold text-sm">Explorar Covens</span>
              </button>
              <button 
                onClick={() => setIsCreatingCoven(true)} 
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold text-sm">Criar um Coven</span>
              </button>
            </nav>

            <div className="mt-10 px-2">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Users className="w-3 h-3" /> Seus Covens
              </h3>
              <div className="space-y-1">
                {covens.filter(c => c.joined).map((group) => (
                  <button 
                    key={group.id} 
                    onClick={() => { setActiveCoven(group.id); setActiveTab('feed'); }}
                    className={`flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-all w-full group/btn p-2 rounded-xl ${activeCoven === group.id ? 'bg-white/5 text-slate-200' : 'hover:bg-white/5'}`}
                  >
                    <div className="relative">
                      <img src={group.image} alt={group.name} className="w-8 h-8 rounded-lg object-cover border border-white/10 group-hover/btn:border-indigo-500/50 transition-colors" />
                    </div>
                    <span className="text-sm font-medium truncate">{group.name}</span>
                  </button>
                ))}
                {covens.filter(c => c.joined).length === 0 && (
                  <p className="text-xs text-slate-500 px-2">Você ainda não entrou em nenhum coven.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Feed & Content */}
        <div className="xl:col-span-6 space-y-6 min-h-screen">
          
          {/* Mobile Navigation */}
          <div className="xl:hidden flex gap-3 overflow-x-auto hide-scrollbar pb-2 mb-2">
            <button 
              onClick={() => { setActiveTab('feed'); setActiveCoven(null); }} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === 'feed' && !activeCoven ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 bg-black/40 hover:text-slate-200 hover:bg-white/5 border border-white/5'}`}
            >
              <Compass className="w-4 h-4" /> Feed Akáshico
            </button>
            <button 
              onClick={() => { setActiveTab('explorar'); setActiveCoven(null); }} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === 'explorar' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 bg-black/40 hover:text-slate-200 hover:bg-white/5 border border-white/5'}`}
            >
              <Search className="w-4 h-4" /> Explorar Covens
            </button>
          </div>

          {activeTab === 'explorar' && !activeCoven ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-2xl font-serif text-slate-100">Explorar Comunidades</h3>
                  <p className="text-slate-400 text-sm">Encontre sua egrégora e conecte-se com mentes afins.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {covens.map(coven => (
                  <div key={coven.id} className="glass-panel overflow-hidden rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all group relative flex flex-col">
                    <div className="h-32 w-full relative">
                      <img src={coven.image} alt={coven.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c1b] to-transparent" />
                      <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 tracking-widest uppercase">
                        {coven.type}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1 relative -mt-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#0e0c1b] border-2 border-[#0e0c1b] flex items-center justify-center mb-3 shadow-xl overflow-hidden">
                        <img src={coven.image} alt={coven.name} className="w-full h-full object-cover opacity-80" />
                      </div>
                      <h4 className="text-lg font-serif text-slate-100 group-hover:text-indigo-300 transition-colors">{coven.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Users className="w-3 h-3" /> {coven.members.toLocaleString()} membros</p>
                      <p className="text-sm text-slate-300 mt-3 line-clamp-2 flex-1">{coven.description}</p>
                      
                      <button 
                        onClick={() => toggleCovenMembership(coven.id)}
                        className={`w-full mt-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          coven.joined 
                            ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                        }`}
                      >
                        {coven.joined ? 'Sair do Coven' : 'Juntar-se'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              {activeCoven && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl border border-white/10 mb-6 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: `url(${covens.find(c => c.id === activeCoven)?.image})`}}>
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                         <img src={covens.find(c => c.id === activeCoven)?.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-serif text-white">{covens.find(c => c.id === activeCoven)?.name}</h2>
                        <p className="text-sm text-indigo-200 mt-1 flex items-center gap-2">
                          <Users className="w-4 h-4" /> {covens.find(c => c.id === activeCoven)?.members.toLocaleString()} Almas conectadas
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10 backdrop-blur-md">
                        <UserPlus className="w-4 h-4" /> <span className="hidden sm:inline">Convidar</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Composer */}
              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 bg-black/40 relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <img src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3'} alt="You" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-white/10 shadow-lg shrink-0" />
                  <div className="flex-1 space-y-4">
                    <TextareaAutosize 
                      minRows={isCreatingPost ? 3 : 1}
                      onFocus={() => setIsCreatingPost(true)}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder={activeCoven ? `Trazendo algo para ${covens.find(c => c.id === activeCoven)?.name}?` : "Compartilhe uma revelação, dúvida ou prática no Santuário..."}
                      className="w-full bg-transparent text-slate-200 text-sm sm:text-base outline-none resize-none placeholder:text-slate-500 py-1 sm:py-3 transition-all"
                    />
                    
                    <AnimatePresence>
                      {isCreatingPost && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-3 border-t border-white/10 flex justify-between items-center">
                          <div className="flex gap-1 sm:gap-2">
                            <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 flex items-center justify-center text-rose-400 transition-colors"><ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                            <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 flex items-center justify-center text-blue-400 transition-colors"><Video className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                            <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 flex items-center justify-center text-emerald-400 transition-colors"><Star className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => { setIsCreatingPost(false); setNewPostContent(''); }} className="px-4 py-2 text-slate-400 hover:text-slate-200 text-xs sm:text-sm font-medium transition-colors">Cancelar</button>
                            <button 
                              onClick={handlePostSubmit}
                              disabled={!newPostContent.trim()}
                              className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs sm:text-sm font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:shadow-none"
                            >
                              <Navigation className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /> Transmitir
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Feed Posts */}
              <div className="space-y-6 pt-2">
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={post.id} 
                      className="glass-panel rounded-3xl border border-white/10 bg-[#0a0a0a]/60 overflow-hidden shadow-2xl"
                    >
                      <div className="p-5 sm:p-6 pb-4 border-b border-white/5">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative group cursor-pointer" onClick={() => setSelectedUserProfile(post)}>
                              <img src={post.avatar} alt={post.authorName} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/20 shadow-lg" />
                            </div>
                            <div className="leading-tight">
                              <h4 onClick={() => setSelectedUserProfile(post)} className="font-bold text-slate-100 hover:text-indigo-300 cursor-pointer transition-colors text-[15px] inline-block">{post.authorName}</h4>
                              <p className="text-xs text-slate-400 mt-1">
                                <span className="font-medium text-emerald-400/80">{post.authorTitle}</span>
                                <span className="mx-1.5 opacity-50">•</span>
                                {post.time}
                                <span className="mx-1.5 opacity-50">•</span>
                                <span className="text-indigo-300 hover:underline cursor-pointer">{post.coven}</span>
                              </p>
                            </div>
                          </div>
                          <button className="text-slate-500 hover:text-slate-300 p-2 rounded-full hover:bg-white/5 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>
                        
                        {/* Content */}
                        <p className="text-slate-200 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{post.content}</p>
                        
                        {/* Images */}
                        {post.images && post.images.length > 0 && (
                          <div className="mt-4 -mx-5 sm:-mx-6 px-1">
                            <img src={post.images[0]} alt="Post media" className="w-full max-h-[500px] object-cover" />
                          </div>
                        )}
                      </div>
                      
                      {/* Interaction Bar */}
                      <div className="px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 bg-black/20">
                        {/* Stats mini */}
                        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                          <div className="flex -space-x-1.5 mr-2">
                            {[1,2,3].map(i => (
                              <div key={i} className={`w-5 h-5 rounded-full border border-black bg-gradient-to-br from-indigo-400 to-purple-500 opacity-${100 - (i*20)}`} />
                            ))}
                          </div>
                          {post.likes} sentiram
                        </div>

                        <div className="flex items-center gap-1 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-rose-400 hover:bg-white/5 py-2 px-3 sm:px-4 rounded-xl transition-all group font-semibold">
                            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" /> <span className="hidden xs:inline">Ressoar</span>
                          </button>
                          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-indigo-400 hover:bg-white/5 py-2 px-3 sm:px-4 rounded-xl transition-all group font-semibold">
                            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" /> <span>{post.comments} <span className="hidden xs:inline">Ecos</span></span>
                          </button>
                          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-indigo-400 hover:bg-white/5 py-2 px-3 sm:px-4 rounded-xl transition-all group font-semibold">
                            <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> <span className="hidden xs:inline">Propagar</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                        <Users className="w-10 h-10 text-slate-500" />
                      </div>
                      <h4 className="text-xl font-serif text-slate-300">O silêncio ecoa aqui.</h4>
                      <p className="text-slate-500">Seja o primeiro a transmitir uma mensagem neste coven.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Right Column - Widgets */}
        <div className="hidden xl:block xl:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-black/40 sticky top-8 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100 mb-5 flex items-center gap-2 uppercase tracking-wider"><Sparkles className="w-4 h-4 text-amber-400" /> Em Ascensão</h3>
            <div className="space-y-4">
              {[
                { tag: 'Tarot', count: '1.2k', title: 'A Jornada do Louco' },
                { tag: 'Astrologia', count: '856', title: 'Plutão em Aquário' },
                { tag: 'Magia', count: '432', title: 'Sigilos e Servidores' }
              ].map((trend, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase text-indigo-400 font-bold tracking-widest">{trend.tag}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{trend.count} ecos</span>
                  </div>
                  <h4 className="text-[15px] text-slate-200 font-medium group-hover:text-indigo-300 transition-colors leading-tight">{trend.title}</h4>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 my-6" />

            <h3 className="text-sm font-bold text-slate-100 mb-5 flex items-center gap-2 uppercase tracking-wider"><Moon className="w-4 h-4 text-slate-300" /> Fases & Astros</h3>
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/10 rounded-2xl p-5 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-indigo-200 uppercase tracking-widest font-bold">Lua Atual</div>
                <div className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">98%</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,0.8)] border-4 border-indigo-200/20" />
                <div>
                  <div className="text-[15px] text-white font-bold mb-0.5">Cheia em Leão</div>
                  <div className="text-xs text-indigo-200 font-medium line-clamp-2">Criatividade e magnetismo pessoal no ápice.</div>
                </div>
              </div>
              <button className="w-full mt-5 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-xl text-xs font-bold text-indigo-300 transition-all uppercase tracking-wider">
                Ver Guia Astrológico
              </button>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-slate-500 font-medium">
              <span className="hover:text-slate-300 cursor-pointer">Diretrizes</span> • 
              <span className="hover:text-slate-300 cursor-pointer">Privacidade</span> • 
              <span className="hover:text-slate-300 cursor-pointer">Termos Mágicos</span> • 
              <span className="hover:text-slate-300 cursor-pointer">Ajuda</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-600">
              Santuário Global © 2026
            </div>
          </div>
        </div>

      </div>

      {/* Modal Criar Coven */}
      <AnimatePresence>
        {isCreatingCoven && createPortal(
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#0e0c1b]"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-serif text-slate-100 flex items-center gap-2"><Shield className="w-6 h-6 text-indigo-400" /> Fundir um Novo Coven</h3>
                <button onClick={() => setIsCreatingCoven(false)} className="text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Nome da Egrégora</label>
                  <input type="text" placeholder="Ex: Oráculo dos Sonhos" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500/50" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Propósito / Descrição</label>
                  <textarea rows={3} placeholder="Mural de estudos sobre..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500/50 resize-none" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Vibração (Privacidade)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="border border-indigo-500 text-indigo-300 bg-indigo-500/10 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all">
                      <Compass className="w-6 h-6" />
                      <span className="text-sm font-bold">Público</span>
                    </button>
                    <button className="border border-white/10 text-slate-400 hover:bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all">
                      <Lock className="w-6 h-6" />
                      <span className="text-sm font-bold">Oculto</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                <button onClick={() => setIsCreatingCoven(false)} className="px-5 py-2.5 text-slate-400 hover:text-slate-200 text-sm font-bold transition-colors">Cancelar</button>
                <button 
                  onClick={() => setIsCreatingCoven(false)} 
                  className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                >
                  Criar Coven
                </button>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
        
        {selectedUserProfile && createPortal(
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex md:items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-panel w-full max-w-4xl rounded-none md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#0e0c1b] flex flex-col min-h-full md:min-h-0 relative z-[110]"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 sticky top-0 z-20 backdrop-blur-xl">
                <h3 className="text-xl font-serif text-slate-100 flex items-center gap-2">Perfil do Membro</h3>
                <button onClick={() => setSelectedUserProfile(null)} className="text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar relative">
                {/* Header Profile Info */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)] shrink-0 relative">
                     <img src={selectedUserProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                     <h2 className="text-3xl font-serif text-slate-100">{selectedUserProfile.authorName}</h2>
                     <p className="text-indigo-300 font-medium tracking-widest uppercase text-sm mt-1">{selectedUserProfile.authorTitle}</p>
                     
                     <p className="text-slate-400 mt-4 leading-relaxed max-w-2xl">
                        Atuando nas artes oraculares e magia natural há mais de 5 anos. Criador de conteúdos sobre {selectedUserProfile.coven} e oraculista profissional. Buscando sempre a iluminação interior.
                     </p>
                     
                     <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-white/5 text-slate-300 rounded-full text-xs hover:bg-white/10 transition-colors cursor-pointer border border-white/5">Website</span>
                        <span className="px-3 py-1 bg-white/5 text-slate-300 rounded-full text-xs hover:bg-white/10 transition-colors cursor-pointer border border-white/5">Instagram</span>
                        <span className="px-3 py-1 bg-white/5 text-slate-300 rounded-full text-xs hover:bg-white/10 transition-colors cursor-pointer border border-white/5">Telegram</span>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                   
                   {/* Services Section */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-serif text-slate-200 flex items-center gap-2"><Star className="w-5 h-5 text-amber-400" /> Serviços & Consultas</h3>
                     <div className="glass-panel p-5 rounded-2xl border border-indigo-500/10 hover:border-indigo-500/30 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-indigo-300 group-hover:text-indigo-200">Leitura Ano Novo - Astrológica</h4>
                           <span className="text-emerald-400 text-sm font-black">R$ 250</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-4 line-clamp-2">Uma análise completa dos 12 meses, revelando tendências e aconselhamentos espirituais profundos.</p>
                        <button className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-bold uppercase tracking-wider text-xs rounded-xl transition-colors">Agendar / Comprar</button>
                     </div>
                     <div className="glass-panel p-5 rounded-2xl border border-indigo-500/10 hover:border-indigo-500/30 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-indigo-300 group-hover:text-indigo-200">Consulta Tarot Express</h4>
                           <span className="text-emerald-400 text-sm font-black">R$ 50</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-4 line-clamp-2">Perguntas objetivas. Resposta em até 24h via áudio para decisões rápidas.</p>
                        <button className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-bold uppercase tracking-wider text-xs rounded-xl transition-colors">Agendar / Comprar</button>
                     </div>
                   </div>

                   {/* External Certificates Section */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-serif text-slate-200 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-400" /> Certificações e Formações</h3>
                     
                     <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center border border-indigo-500/20 shrink-0">
                           <Shield className="w-6 h-6 text-indigo-300" />
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-slate-200">Tarot Praticante Certificado</h4>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 mt-0.5">Emissor: Oracle Academy</p>
                           <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">Verificado</span>
                        </div>
                     </div>

                     <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-start gap-4 opacity-80">
                        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 shrink-0">
                           <Award className="w-6 h-6 text-slate-300" />
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-slate-200">Terapia Holística Integrada</h4>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 mt-0.5">Emissor: Instituto Brasileiro T.H.</p>
                           <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded font-medium">Externo</span>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
}

// Dummy Lock icon since it wasn't imported above to keep it concise, adding it quick here if missing
const Lock = ({className}: {className: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)

const Award = ({className}: {className: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
)
