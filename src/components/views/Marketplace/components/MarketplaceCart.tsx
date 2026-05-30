import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Plus, Minus, Trash2, Truck, ShoppingBag } from 'lucide-react';
import { CartItem } from './MarketplaceTypes';

export function MarketplaceCart({ 
  items, 
  onClose, 
  onRemove, 
  onQuantity, 
  onCheckout 
}: {
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onQuantity: (id: string, q: number) => void;
  onCheckout: () => void;
}) {
  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a12] border-l border-[#1e1b4b] z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1e1b4b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-serif text-slate-100 text-lg">Carrinho Místico</h2>
              <p className="text-xs text-slate-500">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-500">
                <ShoppingBag className="w-16 h-16 opacity-20" />
                <p className="text-sm">Seu carrinho está vazio</p>
                <button onClick={onClose} className="text-indigo-400 text-xs hover:text-indigo-300">
                  Continuar explorando →
                </button>
              </div>
            ) : (
              items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  exit={{ opacity: 0, x: 50 }}
                  className="flex gap-3 p-3 bg-white/[0.03] border border-[#1e1b4b] rounded-xl hover:border-[#312e81] transition-colors"
                >
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover border border-[#1e1b4b]"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&q=80'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-slate-500 mb-2">por {item.authorName}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-black/40 border border-[#1e1b4b] rounded-lg overflow-hidden">
                        <button onClick={() => onQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium text-slate-200 px-1 min-w-[20px] text-center">{item.quantity}</span>
                        <button onClick={() => onQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-indigo-300">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-slate-600 hover:text-rose-400 transition-colors self-start">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#1e1b4b] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Subtotal</span>
              <span className="text-2xl font-bold text-slate-100">R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Frete e envio combinados diretamente com o vendedor</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] active:scale-[0.98]"
            >
              Finalizar Compra
            </button>
            <button onClick={onClose} className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Continuar explorando
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
