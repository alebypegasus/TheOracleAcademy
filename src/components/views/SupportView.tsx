import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Shield, ChevronRight, Video, 
  MoreHorizontal, Lock, Image as ImageIcon, Send, 
  Users, MapPin, Search, MessageSquare, Zap,
  LifeBuoy, HelpCircle, PhoneCall
} from 'lucide-react';

const FAQS = [
  { q: 'Minha aura não está subindo de nível, o que fazer?', a: 'O nível de aura é uma manifestação da sua ressonância espiritual com a egrégora. Ele depende da qualidade dos seus Ecos (posts) e do engajamento genuíno. Posts vazios não atraem luz, apenas sombra.', tag: 'Progresso' },
  { q: 'Como tornar meu Coven privado?', a: 'Nas configurações sagradas do seu Coven, ative o "Arcano do Sigilo". Isso envelopará sua irmandade em uma névoa impenetrável para não iniciados.', tag: 'Segurança' },
  { q: 'É seguro integrar meu WhatsApp?', a: 'Totalmente. Nossa integração utiliza tunelamento quântico criptografado. Não salvamos seus dados; apenas facilitamos a ponte entre o Santuário e sua comunicação mundana.', tag: 'Privacidade' },
  { q: 'Posso vender meus rituais no Santuário?', a: 'Sim! Utilize a aba "Serviços". Taxamos apenas 5% kármicos para a manutenção do templo digital e expansão da consciência coletiva.', tag: 'Comércio' },
  { q: 'O que acontece se eu for banido?', a: 'Sua aura é dissipada e seus Ecos são selados. Para retornar, é necessário um rito de apelação via Oráculo de Suporte.', tag: 'Regras' },
  { q: 'Como recuperar um grimório deletado?', a: 'Grimórios deletados retornam ao éter após 30 dias. Dentro desse prazo, você pode restaurá-los acessando o "Cofre de Memórias" em seu perfil.', tag: 'Recuperação' }
];

export function SupportView({ currentUser }: { currentUser: any }) {
  const [chatMessage, setChatMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: 'Saudações, buscador. Eu sou o Guardião das Chaves. Como posso iluminar seu caminho hoje? Estou aqui para resolver qualquer dúvida sobre as engrenagens místicas do Santuário.', sender: 'support', time: '04:20' }
  ]);

  const handleSupportChat = () => {
    if (!chatMessage.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const userMsg = { id: Date.now(), text: chatMessage, sender: 'user', time: timeStr };
    setChatHistory([...chatHistory, userMsg]);
    setChatMessage('');
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Sua mensagem ressoou nos planos internos. Um guia espiritual de suporte iniciará uma conexão direta em instantes. Mantenha seu canal aberto.',
        sender: 'support',
        time: timeStr
      }]);
    }, 1200);
  };

  const filteredFaqs = FAQS.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.tag.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 overflow-x-hidden">
      {/* Mystic Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto py-16 px-6 lg:px-8">
        
        {/* Hero Header */}
        <div className="text-center mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <LifeBuoy className="w-10 h-10 text-emerald-400" />
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-serif mb-6 gold-text tracking-tighter">
            Câmara de Orientação
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Onde a tecnologia encontra o sagrado para iluminar sua jornada. 
            Dúvidas, preces técnicas ou auxílio oracular direto.
          </motion.p>
        </div>

        {/* Quick Help Search */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto mb-24">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-400/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-[2rem] p-2 backdrop-blur-2xl">
              <Search className="w-6 h-6 text-slate-500 ml-6" />
              <input 
                type="text" 
                placeholder="Busque por tomos, segredos ou ajuda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-5 px-6 text-slate-100 outline-none placeholder:text-slate-600 text-lg font-light"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* FAQ - Tombs of Knowledge */}
          <div className="lg:col-span-12 space-y-10">
            <div className="flex items-end justify-between px-2">
              <div>
                <h3 className="text-2xl font-serif text-slate-200">Tomos de Auxílio</h3>
                <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Dúvidas Frequentes da Egrégora</p>
              </div>
              <div className="text-slate-500 text-xs font-mono">Total de {FAQS.length} segredos</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredFaqs.map((faq, i) => (
                  <motion.div 
                    layout
                    key={faq.q}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative h-full"
                  >
                    <div className="h-full p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-md hover:border-emerald-500/40 transition-all duration-500 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                            {faq.tag}
                          </span>
                          <HelpCircle className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <h4 className="text-lg font-serif text-slate-100 mb-4 leading-snug group-hover:text-white transition-colors">{faq.q}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-light italic">
                          "{faq.a}"
                        </p>
                      </div>
                      <div className="mt-8 flex items-center gap-2 text-emerald-400/40 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                         Ver Detalhes <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Support Actions */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
             <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-indigo-500/[0.02] flex items-center gap-6 group cursor-pointer hover:bg-indigo-500/5 transition-all">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <PhoneCall className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                   <h4 className="text-xl font-serif text-slate-100">Rito de Voz</h4>
                   <p className="text-sm text-slate-500 font-light mt-1">Solicite uma conexão auditiva direta com um mestre.</p>
                </div>
             </div>
             <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-amber-500/[0.02] flex items-center gap-6 group cursor-pointer hover:bg-amber-500/5 transition-all">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Zap className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                   <h4 className="text-xl font-serif text-slate-100">Urgência Crítica</h4>
                   <p className="text-sm text-slate-500 font-light mt-1">Para casos de invasão espiritual ou bugs críticos na aura.</p>
                </div>
             </div>
          </div>

          {/* Integrated Live Support Chat (WhatsApp Style Refined) */}
          <div className="lg:col-span-12 mt-12">
            <div className="flex items-center gap-3 mb-8 px-4">
               <MessageSquare className="w-6 h-6 text-emerald-400" />
               <h3 className="text-2xl font-serif text-slate-200">Oráculo Presencial</h3>
            </div>
            
            <div className="glass-panel overflow-hidden rounded-[3.5rem] border border-white/10 bg-black/60 flex flex-col h-[750px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative group/chat">
              
              {/* Chat Header */}
              <div className="p-6 bg-[#075e54]/80 backdrop-blur-xl flex items-center justify-between z-10 border-b border-white/10">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-slate-200 border-2 border-white/20 overflow-hidden shadow-xl">
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" alt="Oráculo de Suporte" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-4 border-[#075e54] rounded-full shadow-lg" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-bold leading-tight flex items-center gap-2">
                       Mestre de Suporte <Shield className="w-3 h-3 text-emerald-300" />
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                       <p className="text-[#d1eaeb] text-[10px] font-black uppercase tracking-widest">Conexão Ativa no Santuário</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 text-white/50">
                  <Video className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
                  <MoreHorizontal className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
                </div>
              </div>

              {/* Chat Background Pattern */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8 relative bg-black/40 custom-scrollbar">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none invert" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
                
                {/* Security Banner */}
                <div className="flex justify-center mb-12">
                  <div className="bg-emerald-500/10 text-emerald-400/80 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-2xl border border-emerald-500/20 backdrop-blur-md flex items-center gap-3">
                    <Lock className="w-3.5 h-3.5" /> Transmissão sigilosa ponto-a-ponto
                  </div>
                </div>

                {chatHistory.map((chat) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={chat.id} 
                    className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] rounded-[2rem] p-6 shadow-2xl relative border ${
                      chat.sender === 'user' 
                      ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-50 rounded-tr-none' 
                      : 'bg-white/[0.05] border-white/10 text-slate-100 rounded-tl-none'
                    }`}>
                      {chat.sender === 'support' && (
                        <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <Zap className="w-3 h-3" /> Entidade Oracular
                        </div>
                      )}
                      <p className="text-base font-light leading-relaxed tracking-wide">{chat.text}</p>
                      <div className={`text-[10px] ${chat.sender === 'user' ? 'text-emerald-400/50' : 'text-slate-600'} text-right mt-4 font-mono font-bold`}>
                         {chat.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat Footer Input */}
              <div className="p-8 bg-black/40 backdrop-blur-2xl border-t border-white/10 flex items-center gap-5">
                <div className="flex gap-4 text-slate-500">
                  <Sparkles className="w-6 h-6 cursor-pointer hover:text-emerald-400 transition-colors" />
                  <ImageIcon className="w-6 h-6 cursor-pointer hover:text-emerald-400 transition-colors" />
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSupportChat()}
                    placeholder="Sintonize sua frequência e digite..." 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-4 px-8 text-slate-100 outline-none shadow-inner focus:border-emerald-500/50 transition-all font-light"
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSupportChat}
                  className="w-14 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-all"
                >
                  <Send className="w-5 h-5 ml-1" />
                </motion.button>
              </div>

              {/* Refined Identity & Availability Footer */}
              <div className="bg-black/90 px-8 py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-2xl">
                <div className="flex flex-wrap gap-8 items-center">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                      <Users className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">ID Místico</p>
                      <p className="text-indigo-300 font-mono text-sm mt-1.5">@{currentUser?.nick || 'ANON_INITIATE'}</p>
                    </div>
                  </div>
                  
                  <div className="w-px h-8 bg-white/5 hidden md:block" />

                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Nível de Aura</p>
                      <p className="text-emerald-400 font-mono text-sm mt-1.5">Lvl. {currentUser?.auraLevel || 42}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Frequência Operacional</p>
                  <div className="flex gap-1.5">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => {
                      // Active Mon-Fri (Seg-Sex)
                      const isActive = day !== 'Dom' && day !== 'Sab';
                      return (
                        <div 
                          key={day}
                          className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all duration-300 ${
                            isActive 
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                            : 'bg-white/5 border-white/10 text-slate-600 opacity-40'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                    <span className="text-[9px] text-emerald-400/80 font-black uppercase tracking-[0.25em]">Portal de Atendimento Aberto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .gold-text { background: linear-gradient(to bottom right, #fde68a, #d97706, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.6); }
      `}</style>
    </div>
  );
}

