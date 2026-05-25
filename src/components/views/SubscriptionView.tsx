import React, { useState, useEffect } from 'react';
import {
  Moon, Star, Eye, CheckCircle2, XCircle, ArrowRight,
  ShieldCheck, CreditCard, RefreshCcw, Heart,
  Zap, Crown, Calendar, AlertTriangle, Loader2
} from 'lucide-react';

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

function PlanCard({
  plan, cycle, currentPlan, onSubscribe, loading
}: {
  plan: typeof PLANS['medium'];
  cycle: string;
  currentPlan: string;
  onSubscribe: (plan: string, cycle: string) => void;
  loading: boolean;
}) {
  const isActive = currentPlan === plan.key;
  const isFree = plan.key === 'free';
  const price = (plan.price as any)[cycle];
  const Icon = plan.icon;
  const isAmber = plan.color === 'amber';
  const isPurple = plan.color === 'purple';

  return (
    <div className={`relative rounded-3xl p-8 border flex flex-col transition-all duration-300
      ${isActive
        ? isAmber ? 'border-amber-500 bg-[#1c1408]/90 shadow-[0_0_40px_rgba(245,158,11,0.15)]'
          : isPurple ? 'border-purple-500 bg-[#160c29]/90 shadow-[0_0_40px_rgba(147,51,234,0.15)]'
          : 'border-indigo-500/50 bg-[#110c1c]/90'
        : isAmber ? 'border-amber-500/20 bg-[#120d04]/90 hover:border-amber-500/40'
          : isPurple ? 'border-purple-500/30 bg-[#0e0a1a]/90 hover:border-purple-500/50 md:scale-105 z-10'
          : 'border-white/10 bg-[#0c0814]/80 hover:border-white/20'
      }
      ${plan.key === 'medium' ? 'md:scale-105 z-10' : ''}
    `}>

      {/* Top glow line for medium/master */}
      {(isPurple || isAmber) && (
        <div className={`absolute top-0 inset-x-0 h-0.5 rounded-t-3xl
          ${isAmber ? 'bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600'
            : 'bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600'}`} />
      )}

      {/* Active badge */}
      {isActive && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold tracking-widest
          ${isAmber ? 'bg-amber-500 text-amber-950' : isPurple ? 'bg-purple-500 text-white' : 'bg-indigo-500 text-white'}`}>
          PLANO ATUAL
        </div>
      )}

      {/* Icon */}
      <div className={`mx-auto w-12 h-12 rounded-full border flex items-center justify-center mb-6 mt-2
        ${isAmber ? 'border-amber-500/50 bg-amber-900/20' : isPurple ? 'border-purple-500/40 bg-purple-900/20' : 'border-slate-500/30'}`}>
        <Icon className={`w-5 h-5 ${isAmber ? 'text-amber-400' : isPurple ? 'text-purple-400' : 'text-slate-400'}`} />
      </div>

      {/* Name & price */}
      <div className="text-center mb-6">
        <h3 className={`text-xl font-serif mb-1 ${isAmber ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]' : isPurple ? 'text-white' : 'text-slate-200'}`}>
          {plan.name}
        </h3>
        <p className={`text-xs mb-4 ${isAmber ? 'text-amber-500/80' : isPurple ? 'text-purple-300' : 'text-slate-400'}`}>
          {plan.description}
        </p>
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-3xl font-bold ${isAmber ? 'text-amber-300' : isPurple ? 'text-purple-300' : 'text-slate-300'}`}>
            {fmt(price)}
          </span>
          {!isFree && <span className="text-xs text-slate-500">/{cycle === 'mensal' ? 'mês' : cycle === 'trimestral' ? 'trim.' : 'ano'}</span>}
        </div>
        {!isFree && cycle !== 'mensal' && (
          <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold mt-1 inline-block
            ${isAmber ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
            {CYCLE_DISCOUNT[cycle]} OFF
          </span>
        )}
      </div>

      {/* Features */}
      <ul className={`space-y-3 text-sm text-left mb-8 flex-1 border-t pt-5
        ${isAmber ? 'border-amber-500/20' : isPurple ? 'border-purple-500/20' : 'border-white/5'}`}>
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            {f.ok
              ? <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isAmber ? 'text-amber-500' : isPurple ? 'text-purple-400' : 'text-indigo-500'}`} />
              : <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-600" />
            }
            <span className={f.ok ? 'text-slate-300' : 'text-slate-600 line-through'}>{f.text}</span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      {isActive ? (
        <div className={`w-full py-3.5 rounded-xl border text-center text-sm font-bold tracking-widest uppercase
          ${isAmber ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' : isPurple ? 'border-purple-500/50 text-purple-300 bg-purple-500/10' : 'border-indigo-500/50 text-indigo-300 bg-indigo-500/10'}`}>
          ✓ Ativo
        </div>
      ) : isFree ? (
        <button className="w-full py-3.5 rounded-xl border border-white/20 text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all text-sm font-bold tracking-widest uppercase">
          Fazer Downgrade
        </button>
      ) : (
        <button
          onClick={() => onSubscribe(plan.key, cycle)}
          disabled={loading}
          className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            ${isAmber
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-amber-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]'
            }`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isAmber ? 'Tornar-se Mestre' : 'Fazer Upgrade'}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function SubscriptionView({ currentUser }: { currentUser?: any }) {
  const [cycle, setCycle] = useState<'mensal' | 'trimestral' | 'anual'>('mensal');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [subInfo, setSubInfo] = useState<any>(null);
  const [checkoutData, setCheckoutData] = useState<{ amount: number; plan: string; cycle: string } | null>(null);

  // Get actual plan from user object
  const currentPlan = currentUser?.plan || 'free';
  const planExpiresAt = currentUser?.planExpiresAt;

  // Fetch subscription details
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
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center flex-1 py-10 px-4">

      {/* Header */}
      <div className="mb-12 text-center flex flex-col items-center w-full max-w-3xl">

        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500/70 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
          <Star className="w-3 h-3" />
          Portal das Assinaturas
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-slate-100 tracking-wider uppercase mb-4">
          Eleve Seu Acesso
        </h2>
        <p className="text-slate-400 text-lg mb-8">
          Desbloqueie os conhecimentos das artes ocultas e alcance níveis mais altos de sabedoria.
        </p>

        {/* Current plan status */}
        <div className={`w-full border rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center text-left mb-10 shadow-lg
          ${currentPlan === 'master' ? 'bg-amber-900/20 border-amber-500/30' : currentPlan === 'medium' ? 'bg-purple-900/20 border-purple-500/30' : 'bg-indigo-900/10 border-indigo-500/20'}`}>
          <div>
            <p className={`text-xs uppercase tracking-widest font-bold mb-1 ${currentPlan === 'master' ? 'text-amber-400' : currentPlan === 'medium' ? 'text-purple-400' : 'text-indigo-400'}`}>
              Status Atual
            </p>
            <h3 className="text-2xl font-serif text-white">
              {PLANS[currentPlan as keyof typeof PLANS]?.name || 'Iniciado'}
            </h3>
            {planExpiresAt && (
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Válido até {new Date(planExpiresAt).toLocaleDateString('pt-BR')}
              </p>
            )}
            {subInfo?.subscription?.status === 'cancelled' && (
              <p className="text-sm text-amber-400 mt-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Cancelado — acesso mantido até o fim do período
              </p>
            )}
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            {currentPlan !== 'free' && subInfo?.subscription?.status === 'active' && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors"
              >
                Cancelar
              </button>
            )}
            <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${currentPlan === 'master' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : currentPlan === 'medium' ? 'bg-purple-500/10 border-purple-500/50 text-purple-300' : 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300'}`}>
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

        {/* Billing cycle toggle */}
        <div className="flex bg-[#0e0c1b] border border-white/10 rounded-full p-1 w-full max-w-md shadow-2xl">
          {(['mensal', 'trimestral', 'anual'] as const).map(c => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              className={`flex-1 py-3 px-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5
                ${cycle === c
                  ? c === 'anual' ? 'bg-amber-600/20 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
              {CYCLE_DISCOUNT[c] && (
                <span className="text-[9px] bg-amber-500 text-amber-950 px-1.5 py-0.5 rounded-sm">
                  {CYCLE_DISCOUNT[c]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16 items-start">
        {(Object.values(PLANS) as any[]).map(plan => (
          <PlanCard
            key={plan.key}
            plan={plan}
            cycle={cycle}
            currentPlan={currentPlan}
            onSubscribe={handleSubscribe}
            loading={loading}
          />
        ))}
      </div>

      {/* Payment methods */}
      <div className="flex items-center gap-4 mb-12 text-xs text-slate-500">
        <CreditCard className="w-4 h-4" />
        <span>Pix • Cartão de Crédito • Cartão de Débito</span>
        <ShieldCheck className="w-4 h-4 text-emerald-500/60" />
        <span className="text-emerald-500/60">Pagamento seguro via Mercado Pago</span>
      </div>

      {/* Footer features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl pt-8 border-t border-white/5 opacity-70">
        {[
          { icon: ShieldCheck, title: 'Seguro & Privado', desc: 'Dados protegidos com criptografia' },
          { icon: CreditCard, title: 'Cancele Quando Quiser', desc: 'Sem fidelidade ou multas' },
          { icon: RefreshCcw, title: 'Sempre Evoluindo', desc: 'Conteúdo novo constantemente' },
          { icon: Heart, title: 'Comunidade Global', desc: 'Junte-se a milhares de praticantes' },
        ].map(f => (
          <div key={f.title} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <f.icon className="w-5 h-5 text-amber-500/60" />
            <div>
              <h4 className="text-xs uppercase tracking-widest text-slate-300 font-medium mb-1">{f.title}</h4>
              <p className="text-xs text-slate-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
