import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Shield, ChevronRight, Video, 
  MoreHorizontal, Lock, Image as ImageIcon, Send, 
  Users, MapPin, Search, MessageSquare, Zap,
  LifeBuoy, HelpCircle, PhoneCall, FileText, AlertOctagon, CheckCircle2, Clock, Trash2, ShieldAlert
} from 'lucide-react';

const FAQS = [
  { q: 'Minha aura não está subindo de nível, o que fazer?', a: 'O nível de aura é uma manifestação da sua ressonância espiritual com a egrégora. Ele depende da qualidade dos seus Ecos (posts) e do engajamento genuíno. Posts vazios não atraem luz, apenas sombra.', tag: 'Progresso' },
  { q: 'Como tornar meu Coven privado?', a: 'Nas configurações sagradas do seu Coven, ative o "Arcano do Sigilo". Isso envelopará sua irmandade em uma névoa impenetrável para não iniciados.', tag: 'Segurança' },
  { q: 'É seguro integrar meu WhatsApp e conta Google?', a: 'Totalmente. Nossa integração utiliza tunelamento quantum-criptografado direto. Não retemos seus tokens confidenciais; apenas sintonizamos a ponte hermética do Santuário.', tag: 'Privacidade' },
  { q: 'Como revender meus rituais e poções no Santuário?', a: 'Utilize a seção "Serviços" no seu Perfil. Taxamos apenas 5% de contribuição kármica para a sustentabilidade física e energética do nosso servidor celestial.', tag: 'Mercado' },
  { q: 'Como recuperar um grimório que foi purificado pelo fogo (deletado)?', a: 'Registros apagados retornam para o éter temporário por 30 dias. Você poderá restaurá-los acessando o "Cofre de Memórias Cósmicas" em suas configurações secretas.', tag: 'Recuperação' },
  { q: 'Como obter o certificado de Sacerdote ou Mago?', a: 'Ao concluir todos os módulos de aulas na aba de Cursos e atingir o nível necessário de XP correspondente na Egrégora, seu certificado surgirá de forma automática.', tag: 'Graduação' }
];

export function SupportView({ currentUser }: { currentUser: any }) {
  const [chatMessage, setChatMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: 'Saudações, buscador. Eu sou o Guardião das Chaves do Templo. Como posso sintonizar minhas energias para auxiliar sua jornada hoje?', sender: 'support', time: '04:20' }
  ]);

  // Support Tickets System with local cache
  const [tickets, setTickets] = useState<any[]>(() => {
    const saved = localStorage.getItem('mystic_support_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'ticket-1',
        title: 'Lentidão no carregamento do Mapa Astral permanente',
        category: 'Técnico',
        urgency: 'mental', // físico (baixo), mental (médio), astral (alto)
        description: 'Meus trânsitos astrológicos de Plutão e Saturno demoram cerca de 5 segundos para calcular após o login cósmico.',
        status: 'Resolvido',
        createdAt: '18/05/2026',
        response: 'Sua frequência astral foi sintonizada e limpamos as fuligens de cache do seu navegador nos servidores. O cálculo solar agora está superveloz!'
      }
    ];
  });

  // Ticket creation form states
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Dúvida Mística');
  const [ticketUrgency, setTicketUrgency] = useState('mental');
  const [ticketDescription, setTicketDescription] = useState('');

  useEffect(() => {
    localStorage.setItem('mystic_support_tickets', JSON.stringify(tickets));
  }, [tickets]);

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
        text: 'Sua prece espiritual ecoou nos planos internos de mentoria. Analisaremos sua emanação em instantes. Descanse seu espírito e aguarde sintonização.',
        sender: 'support',
        time: timeStr
      }]);
    }, 1500);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDescription.trim()) {
      alert("Por favor preencha o assunto e a descrição da sua prece de suporte.");
      return;
    }

    const newTicket = {
      id: 'ticket-' + Date.now(),
      title: ticketTitle,
      category: ticketCategory,
      urgency: ticketUrgency,
      description: ticketDescription,
      status: 'Análise Astral',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      response: null
    };

    setTickets([newTicket, ...tickets]);
    setTicketTitle('');
    setTicketDescription('');
    alert("Sua Prece de Suporte foi enviada ao altar celestial! Após um breve período de meditação dos mestres, você receberá resposta neste painel.");

    // Simulate magic divine response after 5 seconds of cosmic calculation
    setTimeout(() => {
      setTickets(prevTickets => 
        prevTickets.map(t => t.id === newTicket.id ? {
          ...t,
          status: 'Resolvido',
          response: `🌿 Saudação de Cura! Entendemos sua prece de ${newTicket.category}. Sintonizamos as conexões de luz e ativamos os servidores sagrados para corrigir seu fluxo energético. Suas configurações foram regeneradas pelo Oráculo!`
        } : t)
      );
    }, 5000);
  };

  const handleDeleteTicket = (id: string) => {
    if (confirm("Deseja expurgar do templo este registro de prece suporte?")) {
      setTickets(prev => prev.filter(t => t.id !== id));
    }
  };

  const filteredFaqs = FAQS.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.tag.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative min-h-screen bg-[#050505] text-slate-100 overflow-hidden font-sans">
      
      {/* Background gradients and noise overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050505] to-[#050505] z-0"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none z-0" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full mx-auto py-16 px-6 lg:px-8">
        
        {/* Hero Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
            <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-xl">
              <LifeBuoy className="w-10 h-10 text-indigo-400" />
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-serif mb-6 text-indigo-200 tracking-tighter">
            Altar de Orientação & Suporte
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed font-sans">
            Precisa de auxílio técnico, espiritual ou deseja reportar qualquer anomalia na sua aura digital? 
            Nosso Oráculo Presencial e equipe de Sábios estão a postos.
          </motion.p>
        </div>

        {/* Quick Help Search */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-indigo-950/20 border border-[#312e81] rounded-[2rem] p-2 backdrop-blur-2xl">
              <Search className="w-6 h-6 text-indigo-400 ml-6" />
              <input 
                type="text" 
                placeholder="Busque respostas rápidas nos Tomos de Conhecimento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-4 px-6 text-slate-100 outline-none placeholder:text-slate-650 text-base"
              />
            </div>
          </div>
        </motion.div>

        {/* Support Actions Quick Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="glass-panel p-6 rounded-2xl border border-[#312e81] bg-indigo-950/10 flex items-center gap-5 group hover:bg-indigo-500/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center group-hover:scale-115 transition-transform">
              <PhoneCall className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-lg font-serif text-slate-100">Chamado Auditivo de Suporte</h4>
              <p className="text-xs text-slate-400 font-light mt-1">Conecte-se auditivamente com um Mestre de Suporte em tempo real.</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-amber-950/10 flex items-center gap-5 group hover:bg-amber-950/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center group-hover:scale-115 transition-transform">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-lg font-serif text-slate-100">Urgência Crítica na Aura</h4>
              <p className="text-xs text-slate-400 font-light mt-1">Abra um chamado instantâneo prioritário para corrigir erros de carregamento na conta.</p>
            </div>
          </div>
        </div>

        {/* Main Bento Support Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Live chat & FAQ */}
          <div className="lg:col-span-7 space-y-10">
            {/* Integrated Live Support Chat */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
                <h3 className="text-2xl font-serif text-slate-200">Oráculo Presencial (Chat de Suporte)</h3>
              </div>
              
              <div className="glass-panel overflow-hidden rounded-[2.5rem] border border-[#1e1b4b] bg-black/50 flex flex-col h-[550px] shadow-2xl relative">
                {/* Chat Header */}
                <div className="p-4 bg-indigo-950/80 backdrop-blur-xl flex items-center justify-between z-10 border-b border-[#1e1b4b]">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-slate-200 border border-[#1e1b4b] overflow-hidden shadow-md">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" alt="Oráculo de Suporte" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-indigo-950 rounded-full shadow-lg" />
                    </div>
                    <div>
                      <h3 className="text-white text-sm font-bold leading-tight flex items-center gap-1">
                        Sábio Guardião <Shield className="w-3 h-3 text-emerald-400" />
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <p className="text-[#a5b4fc] text-[9px] font-bold uppercase tracking-wider">Altamente Conectado</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-white/50">
                    <Video className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                    <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                  </div>
                </div>

                {/* Chat Message Box */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 relative bg-black/20 custom-scrollbar">
                  <div className="flex justify-center mb-6">
                    <div className="bg-emerald-500/10 text-emerald-400/80 text-[9px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-xl border border-emerald-500/20 backdrop-blur-md flex items-center gap-2">
                      <Lock className="w-3 h-3" /> Transmissão sigilosa criptografada
                    </div>
                  </div>

                  {chatHistory.map((chat) => (
                    <div 
                      key={chat.id} 
                      className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-4 shadow-xl border ${
                        chat.sender === 'user' 
                        ? 'bg-indigo-600/25 border-indigo-500/30 text-indigo-50 rounded-tr-none' 
                        : 'bg-white/[0.04] border-[#1e1b4b] text-slate-100 rounded-tl-none'
                      }`}>
                        {chat.sender === 'support' && (
                          <div className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" /> Resposta Cósmica
                          </div>
                        )}
                        <p className="text-sm font-light leading-relaxed font-sans">{chat.text}</p>
                        <div className={`text-[9px] ${chat.sender === 'user' ? 'text-indigo-400/50' : 'text-slate-500'} text-right mt-2 font-mono`}>
                          {chat.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Footer Input */}
                <div className="p-4 bg-indigo-950/40 backdrop-blur-xl border-t border-[#1e1b4b] flex items-center gap-4">
                  <div className="flex gap-2.5 text-slate-500">
                    <Sparkles className="w-5 h-5 cursor-pointer hover:text-indigo-400 transition-colors" />
                    <ImageIcon className="w-5 h-5 cursor-pointer hover:text-indigo-400 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSupportChat()}
                      placeholder="Sintonize e digite sua prece técnica..." 
                      className="w-full bg-black/40 border border-[#1e1b4b] rounded-2xl py-2 px-4 text-slate-100 outline-none focus:border-indigo-500/50 transition-all font-light text-sm"
                    />
                  </div>
                  <button 
                    onClick={handleSupportChat}
                    className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shadow-xl transition-all"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tomos de Auxílio FAQ */}
            <div className="space-y-6">
              <div className="border-b border-[#1e1b4b] pb-3 flex items-center justify-between">
                <h3 className="text-2xl font-serif text-slate-200">Tomos de Conhecimento Comum</h3>
                <span className="text-slate-500 text-xs font-mono">Exibindo {filteredFaqs.length} tópicos</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredFaqs.map((faq, i) => (
                    <motion.div 
                      layout
                      key={faq.q}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl border border-[#1e1b4b] bg-indigo-950/5 flex flex-col justify-between hover:border-indigo-500/30 transition-all"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-[#312e81] text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                            {faq.tag}
                          </span>
                          <HelpCircle className="w-4 h-4 text-slate-650" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 mb-2 leading-relaxed">{faq.q}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-light italic">
                          "{faq.a}"
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT: Tickets Dashboard & Preces Creation */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Create support Ticket Card */}
            <div className="glass-panel p-6 rounded-3xl border border-[#312e81] bg-indigo-950/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-xl font-serif text-slate-200 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Oferecer Prece ao Altar (Novo Chamado)
              </h3>
              <p className="text-xs text-slate-400 mb-6">Cadastre sua solicitação formal. Nossa egrégora receberá o chamado nas linhas do éter.</p>

              <form onSubmit={handleCreateTicket} className="space-y-4 relative z-10 text-left">
                <div>
                  <label className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block mb-1">Título do Chamado (Assunto)</label>
                  <input
                    type="text"
                    required
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="Ex: Falha no salvamento do Certificado ao Drive"
                    className="w-full bg-black/40 border border-[#1e1b4b] rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block mb-1">Categoria</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full bg-black/40 border border-[#1e1b4b] rounded-xl py-2 px-3 text-xs text-slate-200 outline-none h-9 text-left"
                    >
                      <option value="Dúvida Mística">Dúvida Mística</option>
                      <option value="Bug de Sistema">Bug de Sistema</option>
                      <option value="Comércio & Pagamentos">Comércio & Financeiro</option>
                      <option value="Outros">Outros Tomos</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block mb-1">Ressonância (Gravidade)</label>
                    <select
                      value={ticketUrgency}
                      onChange={(e) => setTicketUrgency(e.target.value)}
                      className="w-full bg-black/40 border border-[#1e1b4b] rounded-xl py-2 px-3 text-xs text-slate-200 outline-none h-9 text-left"
                    >
                      <option value="fisico">Físico (Leve / Suave)</option>
                      <option value="mental">Mental (Moderado)</option>
                      <option value="astral">Astral (Urgente / Crítico)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block mb-1">Descrição Detalhada</label>
                  <textarea
                    required
                    rows={4}
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Descreva minuciosamente todos os fatos místicas ou erros técnicos encontrados..."
                    className="w-full bg-black/40 border border-[#1e1b4b] rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-400 resize-none h-24"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Enviar ao Altar Celestial
                </button>
              </form>
            </div>

            {/* Active Tickets Monitor */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-slate-200 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Histórico & Altar de Preces Ativas
              </h3>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {tickets.length === 0 ? (
                  <div className="p-6 border border-dashed border-[#1e1b4b] rounded-2xl text-center text-slate-500 text-xs">
                    Nenhum chamado de suporte ativo nas estrelas.
                  </div>
                ) : (
                  tickets.map((t) => (
                    <div 
                      key={t.id}
                      className={`p-5 rounded-2xl border ${
                        t.status === 'Resolvido' 
                        ? 'border-emerald-550/20 bg-emerald-950/5' 
                        : 'border-amber-550/20 bg-amber-950/5 animate-pulse'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-[9px] text-slate-500 font-mono block mb-1">Protocolo {t.id} - {t.createdAt}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            t.urgency === 'astral' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            t.urgency === 'mental' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-indigo-500/10 text-indigo-400 border border-[#312e81]'
                          }`}>
                            {t.urgency === 'astral' ? '🔴 Frequência Astral' :
                             t.urgency === 'mental' ? '🟡 Frequência Mental' :
                             '🔵 Frequência Física'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-bold ${
                            t.status === 'Resolvido' 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-indigo-500/15 text-indigo-400 border border-[#312e81]'
                          }`}>
                            {t.status}
                          </span>
                          <button 
                            onClick={() => handleDeleteTicket(t.id)}
                            className="text-slate-500 hover:text-rose-450 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-100 mb-1">{t.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">{t.description}</p>

                      {t.response ? (
                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl mt-3 text-xs text-slate-300 font-sans leading-relaxed">
                          <strong className="text-emerald-400 block mb-1">✨ Resposta de Suporte Celestial:</strong>
                          "{t.response}"
                        </div>
                      ) : (
                        <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-xl mt-3 text-xs text-slate-400 font-sans animate-pulse flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                          <span>Os magos estão emanando energias corretivas neste momento...</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(162,130,233,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(162,130,233,0.6); }
      `}</style>
    </div>
  );
}
