import React, { useState } from 'react';
import { Moon, Star, CheckCircle2, Eye, Flame, ShieldCheck, CreditCard, RefreshCcw, Heart, ArrowRight } from 'lucide-react';

function FeatureFoot({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-default">
      <Icon className="w-6 h-6 text-amber-500/70" />
      <div>
        <h4 className="text-xs uppercase tracking-widest text-slate-300 font-medium mb-1">{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  )
}

export function SubscriptionView() {
  const [cycle, setCycle] = useState<'mensal' | 'trimestral' | 'anual'>('mensal');
  const currentPlan = 'basico'; // Mock current plan

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center flex-1 py-10 px-4">
      <div className="mb-12 text-center flex flex-col items-center w-full max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-serif text-slate-100 tracking-wider uppercase mb-4">Gerenciador de Assinatura</h2>
        <p className="text-slate-400 text-lg mb-8">Evolua seu acesso aos conhecimentos das artes ocultas. Mantenha, melhore ou modifique seu plano a qualquer momento.</p>
        
        {/* Current Status Box */}
        <div className="w-full bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center text-left mb-10 shadow-lg">
           <div>
              <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold mb-1">Status Atual</p>
              <h3 className="text-2xl font-serif text-white">Iniciado (Básico)</h3>
              <p className="text-sm text-slate-400 mt-1">Sua jornada começou. Acesso gratuito ativado.</p>
           </div>
           <div className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-500/10 border border-indigo-500/50 text-indigo-300 rounded-lg text-sm font-bold">
              Plano Ativo
           </div>
        </div>

        {/* Cycle Toggle */}
        <div className="flex bg-[#0e0c1b] border border-white/10 rounded-full p-1 w-full max-w-md shadow-2xl">
           <button 
             onClick={() => setCycle('mensal')} 
             className={`flex-1 py-3 px-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${cycle === 'mensal' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Mensal
           </button>
           <button 
             onClick={() => setCycle('trimestral')} 
             className={`flex-1 py-3 px-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${cycle === 'trimestral' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Trimestral
           </button>
           <button 
             onClick={() => setCycle('anual')} 
             className={`flex-1 py-3 px-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${cycle === 'anual' ? 'bg-amber-600/20 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Anual <span className="text-[9px] ml-1 bg-amber-500 text-amber-950 px-1.5 py-0.5 rounded-sm">-30%</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
        
        {/* Basic Plan */}
        <div className={`glass-panel rounded-3xl p-8 border transition-all duration-300 flex flex-col relative overflow-hidden ${currentPlan === 'basico' ? 'border-indigo-500/50 bg-[#110c1c]/90' : 'border-white/10 bg-[#0c0814]/80'}`}>
          <div className="mx-auto w-12 h-12 rounded-full border border-slate-500/30 flex items-center justify-center mb-6">
            <Moon className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-center mb-6">
             <h3 className="text-xl font-serif text-slate-200 mb-2">Plano Básico</h3>
             <p className="text-xs text-slate-400">O essencial para sua jornada</p>
          </div>
          
          <ul className="space-y-4 text-sm text-slate-300 text-left mb-10 flex-1 border-t border-white/5 pt-6">
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" /> <span className="pt-0.5">Acesso aos cursos iniciais</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" /> <span className="pt-0.5">Leituras oraculares gratuitas (limitado)</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" /> <span className="pt-0.5">Perfil na comunidade</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" /> <span className="pt-0.5">Acesso à biblioteca pública</span></li>
          </ul>
          
          {currentPlan === 'basico' ? (
             <div className="w-full py-4 rounded-xl border border-indigo-500/50 text-indigo-300 bg-indigo-500/10 text-center text-sm font-bold tracking-widest uppercase">
               Plano Atual
             </div>
          ) : (
             <button className="w-full py-4 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 transition-colors text-sm font-bold tracking-widest uppercase">
               Fazer Downgrade
             </button>
          )}
        </div>

        {/* Medium Plan */}
        <div className={`glass-panel rounded-3xl p-8 border transition-all duration-300 flex flex-col relative overflow-hidden transform md:scale-105 z-10 ${currentPlan === 'adepto' ? 'border-purple-500 bg-[#160c29]/90 shadow-2xl' : 'border-purple-500/30 bg-[#0e0a1a]/90'}`}>
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="mx-auto w-12 h-12 rounded-full border border-purple-500/40 flex items-center justify-center mb-6 z-10 bg-purple-900/20">
            <Star className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-center mb-6 z-10">
             <h3 className="text-xl font-serif text-white mb-2">Plano Adepto</h3>
             <p className="text-xs text-purple-300">Conhecimento avançado e contínuo</p>
          </div>
          
          <ul className="space-y-4 text-sm text-slate-200 text-left mb-10 flex-1 z-10 border-t border-purple-500/20 pt-6">
            <li className="flex items-start gap-3"><ArrowRight className="w-5 h-5 text-purple-500 flex-shrink-0" /> <span className="pt-0.5 font-bold text-purple-200">Tudo do Básico, e mais:</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" /> <span className="pt-0.5">Acesso a todos os cursos lançados</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" /> <span className="pt-0.5">Geração de Flashcards Ilimitada</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" /> <span className="pt-0.5">Venda de consultas pelo seu perfil</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" /> <span className="pt-0.5">Certificados com selo "Adepto"</span></li>
          </ul>
          
          <button className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors text-sm font-bold tracking-widest uppercase z-10 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
             Fazer Upgrade
          </button>
        </div>

        {/* Top Plan (Magus) */}
        <div className={`glass-panel rounded-3xl p-8 border transition-all duration-300 flex flex-col relative overflow-hidden ${currentPlan === 'magus' ? 'border-amber-500 bg-[#1c1408]/90' : 'border-amber-500/20 hover:border-amber-500/50 bg-[#120d04]/90'}`}>
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="mx-auto w-12 h-12 rounded-full border border-amber-500/50 flex items-center justify-center mb-6 mt-4 z-10 bg-amber-900/20">
            <Eye className="w-5 h-5 text-amber-400" />
          </div>
           <div className="text-center mb-6 z-10">
             <h3 className="text-xl font-serif text-amber-400 mb-2 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">Plano Mestre</h3>
             <p className="text-xs text-amber-500/80">O poder máximo do Santuário</p>
          </div>
          
          <ul className="space-y-4 text-sm text-slate-200 text-left mb-10 flex-1 z-10 border-t border-amber-500/20 pt-6">
            <li className="flex items-start gap-3"><ArrowRight className="w-5 h-5 text-amber-500 flex-shrink-0" /> <span className="pt-0.5 font-bold text-amber-200">Tudo do Adepto, e mais:</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" /> <span className="pt-0.5">Bibliotecas herméticas ocultas</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" /> <span className="pt-0.5">Contato direto (1-a-1) c/ Mestres</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" /> <span className="pt-0.5">Convites automáticos para Retiros</span></li>
            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" /> <span className="pt-0.5">Perfil destacado ("Selo Dourado")</span></li>
          </ul>
          
          <button className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-amber-950 transition-colors text-sm font-bold tracking-widest uppercase z-10 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
             Vire Mestre
          </button>
        </div>
      </div>

      {/* Footer Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl pt-8 border-t border-white/5 opacity-80">
         <FeatureFoot icon={ShieldCheck} title="Seguro & Privado" desc="Seus dados estão protegidos" />
         <FeatureFoot icon={CreditCard} title="Cancele Quando Quiser" desc="Sem compromissos" />
         <FeatureFoot icon={RefreshCcw} title="Sempre Evoluindo" desc="Conteúdo novo, sempre" />
         <FeatureFoot icon={Heart} title="Comunidade Global" desc="Junte-se a milhares" />
      </div>
    </div>
  );
}
