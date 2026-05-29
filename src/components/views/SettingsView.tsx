import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Upload, CheckCircle2, Phone, Shield, ShieldCheck, Bell, BellRing, Wallet, DollarSign, ArrowRightLeft, Clock, History } from 'lucide-react';
import { requestForToken } from '../../lib/firebase';

export function SettingsView({ profile, setProfile }: any) {
  const [name, setName] = useState(profile.name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar);
  const [phoneNumber, setPhoneNumber] = useState(profile.phone || '');
  const [mfaEnabled, setMfaEnabled] = useState(profile.mfaEnabled || false);
  const [fcmEnabled, setFcmEnabled] = useState(profile.fcmEnabled || false);
  const [savedStatus, setSavedStatus] = useState(false);

  // Saque/Wallet state
  const [pixKey, setPixKey] = useState('');
  const [pixType, setPixType] = useState('cpf');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(profile.balance || 1250.75); // Mocked positive value
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [credentialsStatus, setCredentialsStatus] = useState<any>(null);
  const [loadingCredentials, setLoadingCredentials] = useState(false);

  useEffect(() => {
     let isMounted = true;
     const loadTx = async () => {
        setLoadingTx(true);
        try {
           const res = await fetch('/api/payments/transactions', {
              headers: { 'x-user-id': profile.id?.toString() || '1' }
           });
           const data = await res.json();
           if (isMounted && data.transactions) {
              setTransactions(data.transactions);
           }
        } catch(e) {
           console.error(e);
        } finally {
           if (isMounted) setLoadingTx(false);
        }
     };

     const loadCredentials = async () => {
        setLoadingCredentials(true);
        try {
           const res = await fetch('/api/payments/validate-credentials');
           const data = await res.json();
           if (isMounted) {
              setCredentialsStatus(data);
           }
        } catch(e) {
           console.error(e);
        } finally {
           if (isMounted) setLoadingCredentials(false);
        }
     };

     loadTx();
     loadCredentials();
     return () => { isMounted = false; };
  }, [profile.id]);

  const handleWithdraw = async () => {
    if (!pixKey.trim() || !withdrawAmount) {
      alert("⚠️ Preencha a chave PIX e o valor desejado.");
      return;
    }
    const amountNum = parseFloat(withdrawAmount);
    if (amountNum > walletBalance) {
      alert("⚠️ Saldo oracular insuficiente para este saque.");
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await fetch('/api/payments/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': profile.id || '1' },
        body: JSON.stringify({ amount: amountNum, pixKey, type: pixType })
      });
      const data = await res.json();
      if (res.ok) {
        setWalletBalance(prev => prev - amountNum);
        alert(`✅ ${data.message}`);
        setWithdrawAmount('');
      } else {
        alert(`❌ Erro: ${data.error}`);
      }
    } catch (e) {
      alert("❌ Falha ao processar saque.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleSave = () => {
    setProfile({ 
      ...profile, 
      name, 
      avatar: avatarUrl, 
      phone: phoneNumber,
      whatsapp: phoneNumber,
      mfaEnabled,
      fcmEnabled
    });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="glass-panel p-8 md:p-12 rounded-[2rem] border border-[#1e1b4b] relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full border border-indigo-500/30 flex items-center justify-center bg-indigo-500/10">
          <Settings className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-serif text-slate-100">Configurações de Perfil</h2>
          <p className="text-sm text-slate-400">Atualize sua identidade na rede do Oráculo.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-[#1e1b4b]">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/40 relative group">
            <img src={avatarUrl} alt="Preview Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">URL do Avatar</label>
            <input 
              type="text" 
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-colors"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Seu Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-colors"
              placeholder="Seu Nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" /> Número de Smartphone (WhatsApp / Celular)
            </label>
            <input 
              type="text" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-colors"
              placeholder="+55 (11) 99999-9999"
            />
          </div>

          {/* SMS MFA Card */}
          <div className="p-6 rounded-2xl border border-[#312e81] bg-indigo-500/[0.02] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  Autenticação de Dois Fatores (MFA) por SMS
                  {mfaEnabled ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" /> Ativada
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full">
                      Desativada
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                  Permita que usuários incluam uma camada extra de segurança nas contas deles. Assim que essa autenticação for ativada e configurada, os usuários precisarão passar por um processo de duas etapas por SMS para acessar o templo místico.
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => {
                if (!phoneNumber) {
                  alert("Por favor, preencha o número de smartphone primeiro para poder ativar a MFA por SMS.");
                  return;
                }
                setMfaEnabled(!mfaEnabled);
              }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                mfaEnabled 
                  ? 'border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400' 
                  : 'border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400'
              }`}
            >
              {mfaEnabled ? 'Desativar MFA' : 'Ativar MFA'}
            </button>
          </div>
          {/* FCM Push Notifications Card */}
          <div className="p-6 rounded-2xl border border-[#312e81] bg-indigo-500/[0.02] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  Notificações Push (Missões de Estudo)
                  {fcmEnabled ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                      <BellRing className="w-3 h-3" /> Ativadas
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full">
                      Desativadas
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                  Habilite os alertas de novas missões e tarefas em seu plano de estudos. Você receberá uma notificação diretamente no seu navegador.
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={async () => {
                if (!fcmEnabled) {
                  try {
                    const token = await requestForToken();
                    if (token) {
                      setFcmEnabled(true);
                      alert("Notificações ativadas com sucesso!");
                    } else {
                      alert("Permissão necessária para enviar notificações.");
                    }
                  } catch (e) {
                    console.error(e);
                  }
                } else {
                  setFcmEnabled(false);
                }
              }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shrink-0 ${
                fcmEnabled 
                  ? 'border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400' 
                  : 'border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400'
              }`}
            >
              {fcmEnabled ? 'Desativar Alertas' : 'Ativar Alertas'}
            </button>
          </div>

          {/* GUIA DE CREDENCIAIS & AMBIENTE SANDBOX MERCADO PAGO */}
          <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] flex flex-col gap-4 mt-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e1b4b] pb-4">
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-amber-500" />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-slate-100">
                         Guia de Credenciais & Conexão Sandbox Mercado Pago
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">Configure o ambiente de pagamentos do Mercado Pago localmente ou em produção.</p>
                   </div>
                </div>
                
                {/* Dynamic status chip */}
                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Status Detectado:</span>
                   {loadingCredentials ? (
                      <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2.5 py-1 rounded-full animate-pulse">Consultando...</span>
                   ) : credentialsStatus?.status === 'configured' ? (
                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Conectado / Configurado</span>
                   ) : (
                      <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Sandbox / Não-Configurado</span>
                   )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-200 leading-relaxed">
                <div className="space-y-3">
                   <p className="font-bold text-slate-100">1. Como Obter suas Chaves Sandbox</p>
                   <ol className="list-decimal pl-4 space-y-1.5 text-slate-400">
                      <li>Acesse as <span className="text-amber-300">Suas Aplicações</span> no Painel do Desenvolvedor do Mercado Pago.</li>
                      <li>Crie um novo aplicativo para o Oráculo ou selecione um existente.</li>
                      <li>No menu lateral, vá em <span className="text-slate-300">Credenciais de Produção</span> ou <span className="text-slate-300">Credenciais de Teste</span> e copie o seu Access Token.</li>
                   </ol>
                </div>

                <div className="space-y-3">
                   <p className="font-bold text-slate-100">2. Configuração de Variáveis de Ambiente</p>
                   <p className="text-slate-400">
                      Para efetuar a conexão segura, configure a seguinte variável no seu painel ou arquivo <span className="text-indigo-400 font-mono">.env</span>:
                   </p>
                   <div className="bg-black/60 p-2.5 rounded-lg border border-[#1e1b4b] font-mono text-[10px] text-indigo-300 select-all">
                      MERCADO_PAGO_ACCESS_TOKEN=APP_USR-... ou TEST-...
                   </div>
                   <p className="text-[10px] text-zinc-500 italic">
                      * Por padrão, a plataforma utiliza credenciais simuladas para testes rápidos de checkout caso a chave não esteja presente.
                   </p>
                </div>
             </div>
          </div>

          {/* WALLET / WITHDRAWAL SECTION (Mercado Pago API connected) */}
          <div className="mt-8 mb-4 p-8 rounded-2xl border border-[#312e81] bg-gradient-to-br from-indigo-950/20 to-black relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Wallet className="w-24 h-24" />
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-[#312e81] pb-6 mb-6">
                <div>
                   <h3 className="text-2xl font-serif text-slate-100 flex items-center gap-3">
                     <Wallet className="w-6 h-6 text-indigo-400" />
                     Carteira Oracular
                   </h3>
                   <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">
                     Gerenciamento e Recebimentos Mercado Pago
                   </p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-medium text-slate-400">Saldo Disponível para Saque</p>
                   <p className="text-3xl font-black text-indigo-400 tracking-tight">
                     {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(walletBalance)}
                   </p>
                </div>
             </div>

             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Withdrawal Form */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-200">Solicitar Repasse via PIX</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Tipo de Chave PIX</label>
                      <select 
                        value={pixType}
                        onChange={(e) => setPixType(e.target.value)}
                        className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl px-3 py-2 text-sm text-slate-200 outline-none"
                      >
                        <option value="cpf">CPF / CNPJ</option>
                        <option value="email">E-mail</option>
                        <option value="phone">Telefone</option>
                        <option value="random">Chave Aleatória</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Valor do Saque (R$)</label>
                      <input 
                        type="number"
                        min="1"
                        max={walletBalance}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Chave PIX de Destino</label>
                    <input 
                      type="text"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                      placeholder="Sua chave..."
                    />
                  </div>

                  <button
                    disabled={isWithdrawing || walletBalance <= 0}
                    onClick={handleWithdraw}
                    className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isWithdrawing ? "Processando..." : (
                      <>
                        <ArrowRightLeft className="w-4 h-4" /> Efetuar Saque 
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-500 text-center">
                    Os repasses são mediados pelo Mercado Pago e processados em até 30 minutos na sua conta.
                  </p>
                </div>

                {/* Information / Rules */}
                <div className="bg-black/30 p-5 border border-[#1e1b4b] rounded-xl">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-[#312e81] pb-2 mb-3">
                    <DollarSign className="w-4 h-4 inline-block mr-1" />
                    Regras de Monetização
                  </h4>
                  <ul className="space-y-3 text-xs text-slate-400 leading-relaxed">
                    <li className="flex items-start gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                       Toda vez que você vender consultorias, serviços ou cursos (no Marketplace), 80-85% do valor vai parar nesta carteira, os 15-20% são descontados para a plataforma manter a ordem mística funcionando e por conta das taxas de cartão.
                    </li>
                    <li className="flex items-start gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                       Valor mínimo para saque é de R$ 50,00 limitados em até 5 saques mensais, livres de tarifas de TED.
                    </li>
                  </ul>
                </div>
             </div>

             {/* Extrato Financeiro */}
             <div className="relative z-10 mt-8 pt-8 border-t border-[#312e81]">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
                  <History className="w-4 h-4 text-indigo-400" />
                  Extrato Financeiro
                </h4>
                {loadingTx ? (
                   <p className="text-xs text-slate-500">Carregando transações astrais...</p>
                ) : transactions.length > 0 ? (
                   <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                     {transactions.map(tx => (
                        <div key={tx.id} className="flex justify-between items-center bg-black/40 border border-[#1e1b4b] p-3 rounded-lg hover:border-indigo-500/30 transition-colors">
                           <div>
                              <p className="text-xs font-bold text-slate-200">{tx.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                  tx.type === 'compra' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                  tx.type === 'venda' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                  'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                }`}>{tx.type}</span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(tx.date).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className={`text-sm font-bold ${tx.type === 'venda' ? 'text-emerald-400' : 'text-slate-200'}`}>
                                 {tx.type === 'venda' ? '+' : ''}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}
                              </p>
                              <p className="text-[10px] text-slate-500 capitalize">{tx.status}</p>
                           </div>
                        </div>
                     ))}
                   </div>
                ) : (
                   <p className="text-xs text-slate-500 border border-dashed border-[#1e1b4b] rounded-xl p-4 text-center">
                     Nenhuma transação financeira registrada até o momento.
                   </p>
                )}
             </div>
          </div>
        </div>

        <div className="pt-6 flex items-center justify-end gap-4">
          <AnimatePresence>
            {savedStatus && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="text-sm text-emerald-400 flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" /> Perfil Atualizado
              </motion.span>
            )}
          </AnimatePresence>
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/25"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
