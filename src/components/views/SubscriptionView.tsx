import React, { useState, useEffect } from 'react';
import {
  Moon, Star, Eye, CheckCircle2, XCircle, ArrowRight,
  ShieldCheck, CreditCard, RefreshCcw, Heart,
  Zap, Crown, Calendar, AlertTriangle, Loader2,
  Check, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PLANS = {
  free: {
    key: 'free',
    name: 'Iniciado',
    icon: Moon,
    color: 'slate',
    description: 'Comece sua jornada esotérica',
    price: { mensal: 0, trimestral: 0, anual: 0 },
    features: [
      { ok: true, text: 'Mercado (comprar & solicitar leitura)' },
      { ok: true, text: 'Desafios diários' },
      { ok: true, text: 'Certificados externos' },
      { ok: true, text: 'Comunidade (participar & conversar)' },
      { ok: true, text: 'Personalizar perfil' },
      { ok: true, text: 'Módulo 0 dos cursos completo' },
      { ok: false, text: 'Demais módulos dos cursos' },
      { ok: false, text: 'Biblioteca completa' },
      { ok: false, text: 'Grimório ilimitado' },
      { ok: false, text: 'Flashcards ilimitados' },
      { ok: false, text: 'Orientação Oracular (IA)' },
    ]
  },
  medium: {
    key: 'medium',
    name: 'Ascendente',
    icon: Zap,
    color: 'purple',
    badge: 'Mais Popular',
    description: 'Conhecimento avançado e contínuo',
    price: { mensal: 49.90, trimestral: 134.73, anual: 419.16 },
    features: [
      { ok: true, text: 'Tudo do plano Iniciado' },
      { ok: true, text: 'Todos os módulos dos cursos' },
      { ok: true, text: 'Biblioteca completa' },
      { ok: true, text: 'Grimório ilimitado' },
      { ok: true, text: 'Flashcards ilimitados' },
      { ok: false, text: 'Orientação Oracular (IA)' },
    ]
  },
  master: {
    key: 'master',
    name: 'Mestre Supremo',
    icon: Crown,
    color: 'amber',
    description: 'O poder máximo do Santuário',
    price: { mensal: 109.90, trimestral: 296.73, anual: 922.56 },
    features: [
      { ok: true, text: 'Tudo do plano Ascendente' },
      { ok: true, text: 'Orientação Oracular (IA)' },
      { ok: true, text: 'Destaque "Selo Dourado" no perfil' },
      { ok: true, text: 'Acesso antecipado a novos cursos' },
    ]
  }
};

const CYCLE_DISCOUNT: Record<string, string> = {
  mensal: '',
  trimestral: '-10%',
  anual: '-30%'
};

function fmt(val: number) {
  return val === 0 ? 'Grátis' : `R$ ${val.toFixed(2).replace('.', ',')}`;
}

export function SubscriptionView({ currentUser }: { currentUser?: any }) {
  const [cycle, setCycle] = useState<'mensal' | 'trimestral' | 'anual'>('mensal');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [subInfo, setSubInfo] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('medium');

  // Get actual plan from user object
  const currentPlan = currentUser?.plan || 'free';
  const planExpiresAt = currentUser?.planExpiresAt;

  useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem('oracle_token') || '';
    fetch('/api/payments/subscription', {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': currentUser.id?.toString() || ''
      }
    })
      .then(r => r.json())
      .then(data => { if (!data.error) setSubInfo(data); })
      .catch(() => {});
  }, [currentUser]);

  const handleSubscribe = async (plan: string, selectedCycle: string) => {
    if (!currentUser) return;
    if (plan === 'free') {
       setErrorMsg('O downgrade para o plano gratuito deve ser feito cancelando a assinatura atual.');
       return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    const authToken = localStorage.getItem('oracle_token') || '';
    
    try {
      const res = await fetch('/api/payments/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
          'x-user-id': currentUser.id?.toString() || ''
        },
        body: JSON.stringify({ 
          plan: plan, 
          cycle: selectedCycle, 
          payerEmail: currentUser.email
        })
      });
      const data = await res.json();
      
      if (data.error) {
        setErrorMsg(data.error);
      } else if (data.init_point) {
        setSuccessMsg("Redirecionando para o ambiente seguro de pagamento...");
        window.location.href = data.init_point;
      }
    } catch (err: any) {
      setErrorMsg('Erro ao iniciar plano. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!currentUser || !confirm('Confirma o cancelamento da assinatura?')) return;
    const token = localStorage.getItem('oracle_token') || '';
    const res = await fetch('/api/payments/cancel-subscription', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'x-user-id': currentUser.id?.toString() || '' }
    });
    const data = await res.json();
    if (data.success) {
      setSuccessMsg('Assinatura cancelada. Você mantém o acesso até o fim do período.');
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col items-center flex-1 py-10 px-4 md:px-8">
      {/* Header */}
      <div className="mb-10 text-center flex flex-col items-center w-full max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500/70 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
          <Star className="w-3 h-3" />
          Portal das Assinaturas
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-slate-100 tracking-wider uppercase mb-4">
          Eleve Seu Acesso
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto font-light">
          Desbloqueie os conhecimentos das artes ocultas e alcance níveis mais altos de sabedoria na egrégora.
        </p>

        {/* Current plan status */}
        <div className={`w-full border rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center text-left mb-10 shadow-2xl relative overflow-hidden
          ${currentPlan === 'master' ? 'bg-amber-900/10 border-amber-500/30' : currentPlan === 'medium' ? 'bg-purple-900/10 border-purple-500/30' : 'bg-indigo-900/10 border-[#312e81]'}`}>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <p className={`text-xs uppercase tracking-widest font-bold mb-1 ${currentPlan === 'master' ? 'text-amber-400' : currentPlan === 'medium' ? 'text-purple-400' : 'text-indigo-400'}`}>
              Status Atual
            </p>
            <h3 className="text-2xl font-serif text-white">
              {PLANS[currentPlan as keyof typeof PLANS]?.name || 'Iniciado'}
            </h3>
            {planExpiresAt && (
              <p className="text-sm text-slate-400 mt-2 flex items-center gap-1.5 font-light">
                <Calendar className="w-3.5 h-3.5" />
                Válido até {new Date(planExpiresAt).toLocaleDateString('pt-BR')}
              </p>
            )}
            {subInfo?.subscription?.status === 'cancelled' && (
              <p className="text-xs font-bold text-amber-400 mt-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Cancelado — acesso mantido até o fim do período
              </p>
            )}
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2 relative z-10">
            {currentPlan !== 'free' && subInfo?.subscription?.status === 'active' && (
              <button onClick={handleCancel} className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-colors uppercase tracking-widest">
                Cancelar
              </button>
            )}
            <div className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border shadow-lg ${currentPlan === 'master' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : currentPlan === 'medium' ? 'bg-purple-500/10 border-purple-500/50 text-purple-300' : 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300'}`}>
              Plano Ativo
            </div>
          </div>
        </div>

        {/* Success / Error messages */}
        {successMsg && (
          <div className="w-full mb-6 p-4 bg-emerald-900/30 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="w-full mb-6 p-4 bg-red-900/30 border border-red-500/40 rounded-xl text-red-300 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}
      </div>

      {/* Main Pricing Form (Watermelon UI Inspired) */}
      <div className="w-full max-w-2xl bg-[#080512] rounded-[32px] p-2 border border-[#1e1b4b] shadow-[0_20px_40px_rgba(0,0,0,0.5)] mb-16 relative">
        <div className="absolute top-0 right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
        
        {/* Billing cycle toggle */}
        <div className="flex bg-[#0c081c] border border-[#1e1b4b] rounded-[24px] p-1.5 w-full shadow-inner mb-4 relative z-10">
          {(['mensal', 'trimestral', 'anual'] as const).map(c => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              className={`flex-1 py-3 px-3 rounded-[20px] text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5
                ${cycle === c
                  ? c === 'anual' ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-white/10 text-white shadow-sm border border-[#1e1b4b]'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
              {CYCLE_DISCOUNT[c] && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md ml-1 ${cycle === c && c === 'anual' ? 'bg-amber-500 text-amber-950' : 'bg-indigo-500/20 text-indigo-300'}`}>
                  {CYCLE_DISCOUNT[c]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Changeable Plans Accordion */}
        <div className="flex flex-col gap-2 relative z-10">
          {(Object.values(PLANS) as any[]).map((plan) => {
            const isSelected = selectedPlan === plan.key;
            const price = plan.price[cycle];
            const isAmber = plan.color === 'amber';
            const isPurple = plan.color === 'purple';

            return (
              <motion.div
                layout
                key={plan.key}
                onClick={() => setSelectedPlan(plan.key)}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={`relative overflow-hidden cursor-pointer rounded-[24px] transition-colors duration-300 bg-[#0c081c] ${
                  isSelected
                    ? isAmber ? "border border-amber-500/40 shadow-[0_4px_24px_rgba(245,158,11,0.15)] bg-amber-900/10" 
                      : isPurple ? "border border-purple-500/40 shadow-[0_4px_24px_rgba(168,85,247,0.15)] bg-purple-900/10"
                      : "border border-indigo-500/40 shadow-[0_4px_24px_rgba(99,102,241,0.15)] bg-indigo-900/10"
                    : "border border-[#1e1b4b] hover:border-[#312e81] hover:bg-white/5"
                }`}
              >
                <div className="px-5 py-5 sm:px-6 sm:py-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-1 gap-4">
                      {/* Custom Checkbox */}
                      <div className="mt-1 shrink-0">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                            isSelected
                              ? isAmber ? "border-amber-500 bg-amber-500" : isPurple ? "border-purple-500 bg-purple-500" : "border-indigo-500 bg-indigo-500"
                              : "border-slate-700 bg-[#0c081c]"
                          }`}
                        >
                          {isSelected && (
                            <Check size={12} strokeWidth={4} className="text-[#080512]" />
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[17px] font-serif font-black leading-none ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {plan.name}
                          </span>
                          {plan.badge && (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider leading-none">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-slate-400 mt-2 font-light leading-snug">
                          {plan.description}
                        </span>
                      </div>
                    </div>

                    {/* Price Animated Block */}
                    <div className="flex flex-col items-end shrink-0 pl-4">
                      <div className="flex items-center justify-end text-[18px] sm:text-[20px] font-black text-slate-100 leading-none overflow-hidden h-[24px]">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={cycle}
                            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="inline-block whitespace-nowrap font-mono"
                          >
                            {fmt(price)}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-1.5 font-mono">
                        {plan.key === 'free' ? 'Eterno' : cycle === 'mensal' ? '/mês' : cycle === 'trimestral' ? '/trim' : '/ano'}
                      </span>
                    </div>
                  </div>

                  {/* Features accordion */}
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        key="features"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ opacity: { duration: 0.2 }, height: { duration: 0.3, ease: "easeOut" } }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-dashed border-[#312e81]">
                          <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase mb-4 font-mono">
                            O que está incluso:
                          </p>
                          <div className="flex flex-col gap-3">
                            {plan.features.map((feature: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-3">
                                {feature.ok ? (
                                    <CheckCircle2 size={16} strokeWidth={2.5} className={`shrink-0 ${isAmber ? 'text-amber-500' : isPurple ? 'text-purple-400' : 'text-indigo-400'}`} />
                                ) : (
                                    <XCircle size={16} strokeWidth={2.5} className="shrink-0 text-slate-700" />
                                )}
                                <span className={`text-[13px] leading-tight font-light ${feature.ok ? 'text-slate-300' : 'text-slate-600 line-through'}`}>
                                  {feature.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-6 px-3 pb-3">
            <button
                onClick={() => handleSubscribe(selectedPlan, cycle)}
                disabled={loading}
                className={`w-full py-4 rounded-[20px] text-xs font-black tracking-widest uppercase transition-all shadow-2xl flex items-center justify-center gap-3 ${loading ? 'opacity-50' : ''} ${
                    selectedPlan === 'master' 
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-amber-500/20' 
                        : selectedPlan === 'medium'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-purple-500/20'
                        : 'bg-white/5 border border-[#312e81] text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {selectedPlan === 'free' ? 'Manter Gratuito' : selectedPlan === 'master' ? 'Consagrar Mestria' : 'Realizar Upgrade'}
                <ArrowRight className="w-4 h-4" />
            </button>
            
            <p className="text-center text-[10px] text-slate-500 font-mono mt-4">
                Transações processadas via integração segura com Mercado Pago.
            </p>
        </div>
      </div>
    </div>
  );
}
