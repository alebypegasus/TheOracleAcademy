import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Truck } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CartItem, PAYMENT_METHODS } from './MarketplaceTypes';
import { api } from '../../../../services/api';

export function MarketplaceCheckout({ 
  items, 
  onClose, 
  onSuccess, 
  currentUser 
}: {
  items: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
  currentUser: any;
}) {
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const handlePay = async () => {
    setStep('processing');
    try {
      // Usar a mesma lógica original
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.id?.toString() || '',
          'Authorization': `Bearer ${localStorage.getItem('oracle_jwt_token') || ''}`
        },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.id, title: i.title, quantity: i.quantity, unit_price: i.price })),
          paymentMethod,
          total
        })
      });
      const data = await res.json();

      if (data.init_point || data.sandbox_init_point) {
        // Redirect to Mercado Pago checkout
        window.open(data.sandbox_init_point || data.init_point, '_blank');
        setStep('success');
      } else if (data.error) {
        alert(`Erro no pagamento: ${data.error}`);
        setStep('method');
      } else {
        setStep('success');
      }
    } catch (err) {
      alert('Erro ao processar pagamento. Tente novamente.');
      setStep('method');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step === 'method' ? onClose : undefined}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-[#090612] border border-[#312e81] rounded-3xl z-[61] overflow-hidden shadow-2xl"
      >
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            <p className="font-serif text-slate-200">Processando pagamento...</p>
            <p className="text-xs text-slate-500">Conectando com o Mercado Pago</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <p className="font-serif text-xl text-slate-100">Pedido Realizado!</p>
            <p className="text-sm text-slate-400 text-center">Uma janela do Mercado Pago foi aberta para concluir o pagamento. Após aprovação, o vendedor entrará em contato sobre o envio.</p>
            <button onClick={onSuccess} className="mt-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-500 transition-colors">
              Voltar à Loja
            </button>
          </div>
        )}

        {step === 'method' && (
          <>
            <div className="flex items-center justify-between p-6 border-b border-[#1e1b4b]">
              <h2 className="font-serif text-xl text-slate-100">Finalizar Compra</h2>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order summary */}
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-400 truncate flex-1">{item.title} <span className="text-slate-600">×{item.quantity}</span></span>
                    <span className="text-slate-300 font-medium ml-4">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t border-[#1e1b4b]">
                  <span className="font-bold text-slate-200">Total</span>
                  <span className="font-bold text-xl text-indigo-300">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment methods */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Forma de Pagamento</p>
                {PAYMENT_METHODS.map(m => {
                  const Icon = (LucideIcons as any)[m.icon];
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        paymentMethod === m.id
                          ? 'border-indigo-500/60 bg-indigo-500/10'
                          : 'border-[#1e1b4b] hover:border-[#312e81]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${paymentMethod === m.id ? 'bg-indigo-600' : 'bg-white/5'}`}>
                        {Icon && <Icon className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{m.label}</p>
                        <p className="text-xs text-slate-500">{m.desc}</p>
                      </div>
                      {paymentMethod === m.id && <Check className="w-4 h-4 text-indigo-400 ml-auto" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Frete e envio combinados com o vendedor após confirmação do pagamento</span>
              </div>

              <button
                onClick={handlePay}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] active:scale-[0.98]"
              >
                Pagar R$ {total.toFixed(2)} via Mercado Pago
              </button>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
