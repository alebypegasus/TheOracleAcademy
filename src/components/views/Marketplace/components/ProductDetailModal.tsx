import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Truck, MessageCircle, Plus, Minus, ShoppingCart, Star, Check, Loader2 } from 'lucide-react';
import { Product, CATEGORIES } from './MarketplaceTypes';
import { StarRating } from './MarketplaceProductCard';

export function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  currentUser 
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
  currentUser: any;
}) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`/api/marketplace/items/${product.id}`, {
      headers: { 'x-user-id': currentUser?.id?.toString() || '' }
    })
      .then(r => r.json())
      .then(data => { if (data.reviews) setReviews(data.reviews); })
      .catch(() => {});
  }, [product.id]);

  const submitReview = async () => {
    if (!myRating || !myComment.trim()) return;
    setSubmittingReview(true);
    try {
      await fetch(`/api/marketplace/items/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser?.id?.toString() || '' },
        body: JSON.stringify({ rating: myRating, comment: myComment })
      });
      setReviews(prev => [{ authorName: currentUser?.name, rating: myRating, comment: myComment, date: new Date().toISOString() }, ...prev]);
      setMyRating(0);
      setMyComment('');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed inset-4 md:inset-10 lg:inset-[5%] bg-[#090612] border border-[#1e1b4b] rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/60 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
          {/* Left: Image */}
          <div className="md:w-2/5 relative bg-gradient-to-br from-indigo-950 to-slate-900 shrink-0 h-64 md:h-full">
            <img
              src={product.coverImage}
              alt={product.title}
              className="w-full h-full object-cover opacity-80"
              onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#090612] hidden md:block" />
          </div>

          {/* Right: Details */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-indigo-400 font-mono bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                  {CATEGORIES.find(c => c.id === product.category)?.label || product.category}
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl text-slate-100 mb-1">{product.title}</h1>
              {product.subtitle && <p className="text-slate-400 text-sm mb-2">{product.subtitle}</p>}
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} count={product.reviewCount} />
                <span className="text-xs text-slate-500">por <span className="text-slate-400">{product.authorName}</span></span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>

            {/* Shipping info */}
            <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-300 font-medium">Envio e Frete</p>
                <p className="text-xs text-slate-400 mt-0.5">{product.shippingInfo || 'Combinar frete e forma de envio diretamente com o vendedor após a compra.'}</p>
                <button className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 mt-2 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" /> Contatar vendedor
                </button>
              </div>
            </div>

            {/* Price and cart */}
            <div className="flex items-end justify-between gap-4 p-5 bg-black/30 border border-[#1e1b4b] rounded-2xl">
              <div>
                <span className="text-3xl font-bold text-indigo-300">R$ {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-slate-500 line-through">R$ {product.originalPrice.toFixed(2)}</span>
                    <span className="text-xs text-emerald-400 font-bold">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-black/40 border border-[#1e1b4b] rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-slate-100 px-2 min-w-[30px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => { onAddToCart(quantity); onClose(); }}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg text-slate-200">Avaliações</h3>
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-500">Seja o primeiro a avaliar este item!</p>
              ) : (
                <div className="space-y-3">
                  {reviews.slice(0, 4).map((r, i) => (
                    <div key={i} className="p-4 bg-white/[0.02] border border-[#1e1b4b] rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">{r.authorName}</span>
                        <StarRating rating={r.rating} />
                      </div>
                      <p className="text-xs text-slate-400">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {currentUser && (
                <div className="space-y-3 pt-4 border-t border-[#1e1b4b]">
                  <p className="text-sm text-slate-400">Deixe sua avaliação:</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <button key={i} onClick={() => setMyRating(i)}>
                        <Star className={`w-6 h-6 transition-colors ${i <= myRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600 hover:text-amber-400'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={myComment}
                    onChange={e => setMyComment(e.target.value)}
                    placeholder="Compartilhe sua experiência com este item..."
                    rows={3}
                    className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 resize-none outline-none"
                  />
                  <button
                    onClick={submitReview}
                    disabled={!myRating || !myComment.trim() || submittingReview}
                    className="flex items-center gap-2 bg-indigo-600 disabled:bg-indigo-900 disabled:text-slate-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all"
                  >
                    {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Enviar Avaliação
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
