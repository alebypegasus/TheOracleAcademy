import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Check, X, Star, Sparkles, ShoppingBag, ArrowRight, User, Key } from 'lucide-react';

export function LandingPage({ currentUser, onLogin, onEnterApp }: { currentUser: any, onLogin: (user: any) => void, onEnterApp: () => void }) {
  const isPaid = currentUser?.isPaid ?? false;
  
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@admin.com' && password === '123456') {
      onLogin({ email, isPaid: true, name: 'Admin Master', xp: 5000, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' });
      setShowLogin(false);
      onEnterApp();
    } else if (email === 'user@user.com' && password === '123456') {
      onLogin({ email, isPaid: false, name: 'Usuário Comum', xp: 120, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop' });
      setShowLogin(false);
      onEnterApp();
    } else {
      setError('Credenciais inválidas. Tente admin@admin.com (pago) ou user@user.com (gratuito) com senha 123456.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#080510] text-slate-200 overflow-y-auto overflow-x-hidden relative">
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm glass-panel p-8 rounded-3xl border border-indigo-500/30 relative"
            >
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6 theme-logo-glow flex flex-col items-center justify-center">
                 <div className="w-16 h-16 mb-4 opacity-80 theme-logo-image" />
                 <h2 className="text-2xl font-serif text-slate-100">Acesse o Santuário</h2>
              </div>

              {error && <div className="mb-4 text-rose-400 text-xs bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{error}</div>}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block">E-mail</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-colors"
                      placeholder="admin@admin.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block">Senha</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-colors"
                      placeholder="••••••"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold tracking-wider uppercase transition-colors shadow-lg shadow-indigo-500/20 mt-4">
                  Entrar
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15)_0%,transparent_70%)] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="flex flex-col items-center gap-6 mb-8 theme-logo-glow">
            <div className="h-40 w-40 md:h-56 md:w-56 theme-logo-image" />
            <div className="h-12 w-[160px] md:h-16 md:w-[220px] theme-logo-text" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-slate-100 tracking-wider mb-6">A Sabedoria Além do Véu</h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Descubra o conhecimento oculto, estude sob a tutela de mestres e conecte-se com seu poder intuitivo em uma plataforma criada para buscadores reais.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-bold rounded-full text-lg uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105">
              {currentUser ? 'Entrar no App' : 'Venha Fazer Parte'}
            </button>
            {!currentUser && (
              <button onClick={() => setShowLogin(true)} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold rounded-full text-lg uppercase tracking-wider transition-all backdrop-blur-sm">
                Conheça os Cursos
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* History Section */}
      <section className="relative py-24 px-4 bg-black/40 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif text-slate-100 mb-8 uppercase tracking-widest">Nossa História</h2>
          <p className="text-slate-300 leading-loose text-lg mb-6">
            A Oracle Academy nasceu de uma visão antiga, passada por gerações de leitores, místicos e estudiosos do esoterismo. Percebemos que o profundo conhecimento do Tarot, Lenormand e oráculos estava se fragmentando na era digital. 
          </p>
          <p className="text-slate-300 leading-loose text-lg">
            Nossa missão é centralizar sabedoria atemporal, combinando tecnologia de ponta com tradição ancestral, para guiar tanto novatos quanto praticantes avançados em seu despertar espiritual. Criamos um santuário seguro e estruturado para seu aprendizado contínuo.
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-100 mb-4 uppercase tracking-widest">A Jornada do Aprendiz</h2>
            <p className="text-slate-400">Currículos abrangentes desenvolvidos por grandes mestres.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course 1 */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col hover:border-indigo-500/30 transition-all relative">
              <div className="h-48 rounded-2xl bg-indigo-900/20 mb-6 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800" alt="Arcanos Maiores" className="w-full h-full object-cover mix-blend-luminosity opacity-70" />
              </div>
              <h3 className="text-xl font-serif text-slate-100 mb-2">Fundamentos do Tarot</h3>
              <p className="text-slate-400 text-sm mb-4">Domine os 78 arcanos, simbolismo e numerologia. Inclui 40 horas de videoaulas, certificados e acesso à tutoria AI.</p>
              <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="mt-auto px-6 py-3 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition-colors uppercase text-sm tracking-wider font-semibold">
                Venha Aprender Conosco
              </button>
            </div>
            
            {/* Course 2 */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col hover:border-blue-500/30 transition-all">
              <div className="h-48 rounded-2xl bg-blue-900/20 mb-6 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1602498456745-e9503b3cc417?auto=format&fit=crop&q=80&w=800" alt="Mesa Real" className="w-full h-full object-cover mix-blend-luminosity opacity-70" />
              </div>
              <h3 className="text-xl font-serif text-slate-100 mb-2">Lenormand Avançado</h3>
              <p className="text-slate-400 text-sm mb-4">Aprenda a ler a famosa Mesa Real (Grand Tableau), combinações complexas e método de distância.</p>
              <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="mt-auto px-6 py-3 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 transition-colors uppercase text-sm tracking-wider font-semibold">
                Matricule-se
              </button>
            </div>

            {/* Course 3 */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col hover:border-amber-500/30 transition-all">
              <div className="h-48 rounded-2xl bg-amber-900/20 mb-6 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1602693680608-a1bf18685122?auto=format&fit=crop&q=80&w=800" alt="Intuição" className="w-full h-full object-cover mix-blend-luminosity opacity-70" />
              </div>
              <h3 className="text-xl font-serif text-slate-100 mb-2">Desenvolvimento Intuitivo</h3>
              <p className="text-slate-400 text-sm mb-4">Práticas xamânicas, meditação profunda e aterramento. Como ser um oraculista neutro e protegido energeticamente.</p>
              <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="mt-auto px-6 py-3 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-colors uppercase text-sm tracking-wider font-semibold">
                Matricule-se
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 px-4 bg-black/40 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-100 mb-4 uppercase tracking-widest">Vozes da Comunidade</h2>
            <p className="text-slate-400">O que nossos estudantes dizem sobre a Oracle Academy.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel p-8 rounded-3xl relative">
                <div className="flex text-amber-400 mb-4">
                  {[1,2,3,4,5].map(s => <Star fill="currentColor" key={s} className="w-4 h-4" />)}
                </div>
                <p className="text-slate-300 italic mb-6 text-sm leading-relaxed">
                  "A estruturação dos cursos é impecável. A imersão me ajudou a sair do básico e finalmente compreender as entrelinhas dos arcanos maiores. O tutor de IA é como ter um mestre particular tirando minhas dúvidas 24/7."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/30" />
                  <div>
                    <h4 className="font-medium text-slate-100 text-sm">Mariana Silva</h4>
                    <p className="text-xs text-slate-500">Aluna Certificada</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto glass-panel p-8 md:p-16 rounded-[3rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-900/10 to-transparent">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <ShoppingBag className="w-12 h-12 text-indigo-400 mb-6" />
              <h2 className="text-3xl md:text-4xl font-serif text-slate-100 mb-6 uppercase tracking-widest">MARKETPLACE ARCANA</h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Nossa plataforma não é apenas para aprender. Usuários com certificação verificada da Oracle Academy ou profissionais validados podem vender seus próprios serviços de leitura, mapas astrais, ou materiais digitais.
              </p>
              <ul className="space-y-4 mb-8 text-sm text-slate-400">
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-indigo-400" /> Você configura o valor de cada serviço.</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-indigo-400" /> Venda leituras personalizadas em PDF ou Vídeo.</li>
                <li className="flex items-center gap-2"><Check className="w-5 h-5 text-indigo-400" /> A Oracle Academy retém apenas de 15% a 20% por transação.</li>
              </ul>
              <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20">
                Venha fazer suas leituras
              </button>
            </div>
            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.1)_0%,transparent_70%)]" />
              <div className="space-y-4 relative z-10">
                <div className="glass-panel p-4 rounded-xl flex items-center justify-between border border-indigo-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/30" />
                    <div><h4 className="text-sm font-medium">Leitura Profunda de Tarot</h4><p className="text-xs text-slate-400">Por Luiza M.</p></div>
                  </div>
                  <span className="text-indigo-300 font-medium">R$ 150</span>
                </div>
                <div className="glass-panel p-4 rounded-xl flex items-center justify-between border border-white/5 opacity-70">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/30" />
                    <div><h4 className="text-sm font-medium">Mesa Real Lenormand</h4><p className="text-xs text-slate-400">Por Carlos E.</p></div>
                  </div>
                  <span className="text-blue-300 font-medium">R$ 220</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitors Comparison Section */}
      <section className="relative py-24 px-4 bg-black/40 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-100 mb-4 uppercase tracking-widest">Por quê a Oracle Academy?</h2>
            <p className="text-slate-400">Compare e veja por que somos o porto seguro do misticismo na era digital.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b border-white/10 text-slate-400 font-medium uppercase tracking-wider text-sm">Recurso</th>
                  <th className="p-4 border-b border-white/10 text-amber-400 font-bold uppercase tracking-wider text-sm text-center">Oracle Academy</th>
                  <th className="p-4 border-b border-white/10 text-slate-500 font-medium uppercase tracking-wider text-sm text-center">Místicos Genéricos</th>
                  <th className="p-4 border-b border-white/10 text-slate-500 font-medium uppercase tracking-wider text-sm text-center">Plataformas de Cursos</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="p-4 border-b border-white/5 text-slate-300">Cursos Focados e Estruturados</td>
                  <td className="p-4 border-b border-white/5 text-center"><Check className="w-5 h-5 text-green-400 inline-block" /></td>
                  <td className="p-4 border-b border-white/5 text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                  <td className="p-4 border-b border-white/5 text-center"><Check className="w-5 h-5 text-green-400 inline-block" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-white/5 text-slate-300">Tutor Oráculo com IA Pessoal</td>
                  <td className="p-4 border-b border-white/5 text-center"><Check className="w-5 h-5 text-green-400 inline-block" /></td>
                  <td className="p-4 border-b border-white/5 text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                  <td className="p-4 border-b border-white/5 text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-white/5 text-slate-300">Grimório Digital Integrado</td>
                  <td className="p-4 border-b border-white/5 text-center"><Check className="w-5 h-5 text-green-400 inline-block" /></td>
                  <td className="p-4 border-b border-white/5 text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                  <td className="p-4 border-b border-white/5 text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-white/5 text-slate-300">Marketplace Justo (15% - 20% taxa)</td>
                  <td className="p-4 border-b border-white/5 text-center"><Check className="w-5 h-5 text-green-400 inline-block" /></td>
                  <td className="p-4 border-b border-white/5 text-center"><X className="w-5 h-5 text-rose-500 inline-block" /> (Até 50%)</td>
                  <td className="p-4 border-b border-white/5 text-center"><X className="w-5 h-5 text-rose-500 inline-block" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-100 mb-4 uppercase tracking-widest">Investimento na sua Jornada</h2>
            <p className="text-slate-400">Planos flexíveis para cada nível de buscador.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Monthly */}
            <div className="glass-panel p-8 rounded-[2rem] border border-white/10 hover:border-purple-500/50 transition-colors flex flex-col items-center text-center">
              <h3 className="text-purple-400 uppercase tracking-widest text-sm mb-4">Mensal</h3>
              <div className="flex items-start mb-6">
                 <span className="text-sm mt-2 font-medium">R$</span>
                 <span className="text-5xl font-serif">49</span>
                 <span className="text-sm self-end mb-1 text-slate-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-slate-300 text-left w-full">
                <li className="flex gap-2"><Check className="w-4 h-4 text-purple-400 flex-shrink-0" /> Cursos Básicos</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-purple-400 flex-shrink-0" /> Grimório com 50 espaços</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-purple-400 flex-shrink-0" /> Tutor IA Limitado</li>
              </ul>
              <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="mt-auto w-full py-3 rounded-full border border-purple-500/50 text-purple-200 hover:bg-purple-500/10 uppercase tracking-wider text-sm font-bold">
                Adquira Aqui
              </button>
            </div>

            {/* Quarterly */}
            <div className="glass-panel p-8 rounded-[2rem] border border-blue-500/30 hover:border-blue-500/60 bg-blue-900/10 transition-colors flex flex-col items-center text-center transform md:scale-105 shadow-xl shadow-blue-900/20 relative z-10">
              <h3 className="text-blue-400 uppercase tracking-widest text-sm mb-4 font-bold">Trimestral</h3>
              <div className="flex items-start mb-6">
                 <span className="text-sm mt-2 font-medium">R$</span>
                 <span className="text-5xl font-serif">129</span>
                 <span className="text-sm self-end mb-1 text-slate-500">/trim</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-slate-200 text-left w-full">
                <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400 flex-shrink-0" /> Todos os recursos Mensais</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400 flex-shrink-0" /> Grimório Ilimitado</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400 flex-shrink-0" /> Cursos Avançados</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400 flex-shrink-0" /> Acesso ao Marketplace (Para Vender)</li>
              </ul>
              <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="mt-auto w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-wider text-sm font-bold shadow-lg shadow-blue-500/25">
                Adquira Aqui
              </button>
            </div>

            {/* Annual */}
            <div className="glass-panel p-8 rounded-[2rem] border border-amber-500/30 hover:border-amber-400/60 transition-colors flex flex-col items-center text-center gold-glow">
              <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-amber-950 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full mb-4">Melhor Valor</div>
              <h3 className="text-amber-400 uppercase tracking-widest text-sm mb-4">Anual</h3>
              <div className="flex items-start mb-6">
                 <span className="text-sm mt-2 font-medium">R$</span>
                 <span className="text-5xl font-serif">399</span>
                 <span className="text-sm self-end mb-1 text-slate-500">/ano</span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-slate-300 text-left w-full">
                <li className="flex gap-2"><Check className="w-4 h-4 text-amber-400 flex-shrink-0" /> Tutor IA Ilimitado</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-amber-400 flex-shrink-0" /> Descontos na Loja</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-amber-400 flex-shrink-0" /> Masterclasses ao vivo exclusivas</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-amber-400 flex-shrink-0" /> Rituais Fechados</li>
              </ul>
              <button onClick={() => currentUser ? onEnterApp() : setShowLogin(true)} className="mt-auto w-full py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-amber-950 font-bold uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                Adquira Aqui
              </button>
            </div>
          </div>
          
        </div>
      </section>

      <footer className="text-center py-8 border-t border-white/5 opacity-50 text-sm">
        <p>&copy; 2024 The Oracle Academy. Conhecimento Hoje, Sabedoria Sempre.</p>
      </footer>
    </div>
  );
}
