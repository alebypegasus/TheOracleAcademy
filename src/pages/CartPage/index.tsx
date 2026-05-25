import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, ArrowLeft, CreditCard, Sparkles, CheckCircle, Wallet, HelpCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CheckoutBrick } from '../../components/payments/CheckoutBrick';

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    clearCart, 
    getSubtotal, 
    getTax, 
    getTotal, 
    checkoutLoading,
    checkoutUrl,
    checkoutPreferenceId,
    setCheckoutPreferenceId,
    checkoutWithMercadoPago,
    completeSimulationPurchase 
  } = useCart();

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'checkout' | 'pix_sim'>('checkout');
  const [pixSimulatedCode, setPixSimulatedCode] = useState<string | null>(null);

  const handleCheckoutMercadoPago = async () => {
    const res = await checkoutWithMercadoPago();
    if (res && res.preferenceId) {
      // Preference saved to state, will render CheckoutBrick
    } else if (res && res.init_point) {
      // Open Mercado Pago checkout flow
      window.open(res.init_point, '_blank');
    } else {
      // If MP credentials aren't set, trigger local PIX flow automatically
      triggerPixSimulation();
    }
  };

  const triggerPixSimulation = () => {
    setActiveTab('pix_sim');
    // Generate a random payload representing a mystic PIX payload
    const pixPayload = `00020126580014BR.GOV.BCB.PIX0136oracle-academy-marketplace-split@pix.com5204000053039865408${getTotal().toFixed(2)}5802BR5925The Oracle Academy SaaS6009Sao Paulo62070503***6304`;
    setPixSimulatedCode(pixPayload);
  };

  const handleSimulatePaymentApproval = async () => {
    const success = await completeSimulationPurchase();
    if (success) {
      setPaymentSuccess(true);
      clearCart();
    }
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-10 rounded-2xl border border-emerald-500/30 flex flex-col items-center gap-6"
        >
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-serif text-slate-100 gold-text">Transação Aprovada!</h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Seus artefatos místicos foram sintonizados com sucesso à sua conta! As comissões da plataforma (15%) e repasses para os vendedores (85%) foram processados de forma escalável e segura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md"
            >
              Ir para o Painel
            </button>
            <button 
              onClick={() => navigate('/library')}
              className="py-3 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-all"
            >
              Voltar ao Mercado
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <button 
        onClick={() => navigate('/library')}
        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 font-semibold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Voltar ao Mercado Místico
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items list */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-indigo-500/10 pb-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-indigo-400" />
              <h1 className="text-3xl font-serif text-slate-100">Seu Carrinho</h1>
            </div>
            <span className="text-sm bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-semibold">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="glass-panel p-16 rounded-2xl border border-white/5 flex flex-col items-center gap-4 text-center">
              <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 mb-2">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif text-slate-200">Seu Caldeirão está Vazio!</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Nenhum amuleto, tomo ritualístico ou consulta mística foi adicionado ao seu carrinho ainda. Explore nossas relíquias!
              </p>
              <button 
                onClick={() => navigate('/library')}
                className="mt-4 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg"
              >
                Explorar Biblioteca & Mercado
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    exit={{ opacity: 0, x: -50 }}
                    className="glass-panel p-4 rounded-xl border border-white/5 hover:border-indigo-500/20 flex flex-col sm:flex-row items-center gap-4 transition-all"
                  >
                    <div className="h-16 w-16 rounded-lg bg-indigo-900/40 overflow-hidden flex-shrink-0 border border-indigo-500/10">
                      {item.cover_image ? (
                        <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-indigo-400 bg-indigo-500/10">
                          <Sparkles className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 font-bold uppercase">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold cursor-pointer hover:text-indigo-400" onClick={() => navigate(`/seller/${item.author_name}`)}>
                          por {item.author_name}
                        </span>
                      </div>
                      <h4 className="text-lg font-serif text-slate-200 mt-1">{item.title}</h4>
                      {item.subtitle && <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{item.subtitle}</p>}
                    </div>

                    <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                      <span className="text-lg font-bold text-slate-100 font-serif">
                        R$ {Number(item.price).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/10 hover:border-transparent transition-all"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Pricing Summary Sidepanel */}
        {cartItems.length > 0 && (
          <div className="w-full lg:w-96 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-6">
              <h3 className="text-xl font-serif text-slate-100 border-b border-indigo-500/10 pb-3 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-400" /> Resumo do Pedido
              </h3>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal de Artefatos</span>
                  <span className="font-semibold text-slate-200">R$ {getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Taxas da Egrégora</span>
                  <span className="font-semibold text-slate-200">R$ {getTax().toFixed(2)}</span>
                </div>
                <div className="border-t border-white/5 my-2"></div>
                <div className="flex justify-between text-lg font-bold text-slate-100">
                  <span className="font-serif">Total Místico</span>
                  <span className="font-serif gold-text">R$ {getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Commission split indicator info */}
              <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl flex gap-2.5 text-xs text-indigo-300">
                <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  <strong>Arquitetura de Split Seguro:</strong> 15% deste valor é retido para manter a infraestrutura da plataforma, e 85% é depositado instantaneamente na carteira de cada vendedor.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {activeTab === 'checkout' ? (
                  <>
                    <button 
                      onClick={handleCheckoutMercadoPago}
                      disabled={checkoutLoading}
                      className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:scale-[1.01]"
                    >
                      <CreditCard className="w-5 h-5" />
                      {checkoutLoading ? 'Processando...' : 'Pagar via Mercado Pago / PIX'}
                    </button>
                    <button 
                      onClick={triggerPixSimulation}
                      className="w-full py-2.5 px-6 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-xs transition-all text-center"
                    >
                      Ou Simular PIX Interno (Modo Sandbox)
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-4 bg-slate-900/60 p-4 rounded-xl border border-indigo-500/20 text-center animate-fade-in">
                    <h4 className="text-sm font-bold text-slate-200">PIX Sandbox Interno</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Escaneie ou copie a chave PIX abaixo para aprovar instantaneamente o repasse no banco de dados.
                    </p>
                    
                    <div className="bg-white p-2 rounded-lg inline-block mx-auto">
                      {/* Placeholder for QR Code */}
                      <div className="h-32 w-32 bg-slate-200 flex items-center justify-center text-slate-800 text-xs font-mono font-bold break-all border border-slate-300">
                        QR CODE PIX
                      </div>
                    </div>

                    <textarea
                      readOnly
                      value={pixSimulatedCode || ''}
                      className="w-full h-16 bg-black/40 text-[10px] text-indigo-300 font-mono p-2 rounded border border-white/10 select-all resize-none"
                    />

                    <button 
                      onClick={handleSimulatePaymentApproval}
                      disabled={checkoutLoading}
                      className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-md"
                    >
                      Aprovar Pagamento PIX (Simulado)
                    </button>

                    <button 
                      onClick={() => setActiveTab('checkout')}
                      className="text-xs text-slate-400 hover:text-slate-300 underline"
                    >
                      Voltar para Mercado Pago
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {checkoutPreferenceId && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#09071c] border-2 border-indigo-500/50 rounded-2xl overflow-hidden shadow-2xl relative mt-10 mb-10"
            >
              <button 
                onClick={() => setCheckoutPreferenceId(null)}
                className="absolute top-4 right-4 p-1.5 bg-black/50 hover:bg-white/5 rounded-full text-zinc-400 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 space-y-6 text-left relative z-0">
                <div className="text-center pb-2">
                  <h3 className="text-lg font-serif text-[#9d8ff7] font-black uppercase tracking-widest flex items-center gap-1.5 justify-center">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> Pagamento Seguro
                  </h3>
                </div>
                
                <CheckoutBrick 
                  preferenceId={checkoutPreferenceId} 
                  onSuccess={() => {
                    setCheckoutPreferenceId(null);
                    setPaymentSuccess(true);
                    clearCart();
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
