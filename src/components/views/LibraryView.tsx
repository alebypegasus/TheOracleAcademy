import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart, Search, X, Star, Plus, Minus, Trash2,
  Filter, ChevronRight, Sparkles, BookOpen, Gem, Zap,
  Shield, Package, Heart, Eye, Tag, Truck, MessageCircle,
  CreditCard, QrCode, Check, ArrowLeft, Upload, ShoppingBag,
  ChevronDown, ChevronUp, Loader2
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  userId: number;
  authorName: string;
  authorAvatar?: string;
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  coverImage: string;
  hashtags: string[];
  rating?: number;
  reviewCount?: number;
  stock?: number;
  date: string;
  shippingInfo?: string;
}

interface CartItem extends Product {
  quantity: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Sparkles, color: 'from-indigo-500 to-purple-600' },
  { id: 'books', label: 'Livros & Grimórios', icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
  { id: 'jewelry', label: 'Joias & Amuletos', icon: Gem, color: 'from-purple-500 to-pink-600' },
  { id: 'instruments', label: 'Oráculos & Ferramentas', icon: Sparkles, color: 'from-amber-500 to-orange-600' },
  { id: 'consultations', label: 'Consultas', icon: Star, color: 'from-emerald-500 to-teal-600' },
  { id: 'alchemy', label: 'Perfumes & Alquimia', icon: Zap, color: 'from-rose-500 to-pink-600' },
  { id: 'other', label: 'Relíquias', icon: Shield, color: 'from-slate-500 to-gray-600' },
];

const SORT_OPTIONS = [
  { id: 'recent', label: 'Mais recentes' },
  { id: 'price_asc', label: 'Menor preço' },
  { id: 'price_desc', label: 'Maior preço' },
  { id: 'rating', label: 'Melhor avaliados' },
];

const PAYMENT_METHODS = [
  { id: 'pix', label: 'PIX', icon: QrCode, desc: 'Instantâneo, sem taxas' },
  { id: 'credit', label: 'Cartão de Crédito', icon: CreditCard, desc: 'Em até 12x sem juros' },
  { id: 'debit', label: 'Cartão de Débito', icon: CreditCard, desc: 'Débito direto na conta' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating?: number; count?: number }) {
  const r = rating || 0;
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= r ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
      ))}
      {count !== undefined && <span className="text-xs text-slate-500 ml-1">({count})</span>}
    </div>
  );
}

function ProductCard({ product, onView, onAddToCart, isWishlisted, onWishlist }: {
  product: Product;
  onView: () => void;
  onAddToCart: () => void;
  isWishlisted: boolean;
  onWishlist: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-[#0d0d14] border border-[#1e1b4b] rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-500/40 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onView}
    >
      {/* Cover Image */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-indigo-950 to-slate-900">
        <img
          src={product.coverImage}
          alt={product.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-transparent to-transparent" />

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={e => { e.stopPropagation(); onWishlist(); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-black/40 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick view overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center gap-2"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={onView}
                className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-xl border border-white/10 hover:bg-indigo-600 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Ver detalhes
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif text-slate-100 text-sm font-medium line-clamp-2 leading-snug flex-1">
            {product.title}
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-2">por {product.authorName}</p>
        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1e1b4b]">
          <div>
            <span className="text-lg font-bold text-indigo-300">
              R$ {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-500 line-through ml-2">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(); }}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-2 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CartDrawer({ items, onClose, onRemove, onQuantity, onCheckout }: {
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

function ProductModal({ product, onClose, onAddToCart, currentUser }: {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
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
                  onClick={() => { for (let i = 0; i < quantity; i++) onAddToCart(); onClose(); }}
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

function CheckoutModal({ items, onClose, onSuccess, currentUser }: {
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
                  const Icon = m.icon;
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
                        <Icon className="w-5 h-5 text-white" />
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

// ─── Main Component ────────────────────────────────────────────────────────────
export function LibraryView({ currentUser }: { currentUser: any }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Detail modal
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Publish form
  const [showPublish, setShowPublish] = useState(false);
  const [publishForm, setPublishForm] = useState({ title: '', subtitle: '', description: '', price: '', category: 'books', coverImage: '' });
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/marketplace/items', {
      headers: { 'x-user-id': currentUser?.id?.toString() || '' }
    })
      .then(r => r.json())
      .then((data: any[]) => {
        setProducts(Array.isArray(data) ? data.map(d => ({
          id: String(d.id),
          userId: d.user_id || d.userId,
          authorName: d.author_name || d.authorName || 'Vendedor',
          title: d.title,
          subtitle: d.subtitle,
          description: d.description,
          price: parseFloat(d.price) || 0,
          category: d.category || 'other',
          coverImage: d.cover_image || d.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
          hashtags: d.hashtags || [],
          rating: d.avg_rating || d.rating,
          reviewCount: d.review_count || d.reviewCount || 0,
          date: d.date || d.created_at,
          shippingInfo: d.shipping_info
        })) : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const setQuantity = (id: string, q: number) => {
    if (q <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: q } : i));
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  const handlePublish = async () => {
    if (!publishForm.title || !publishForm.price) return;
    setPublishing(true);
    try {
      const res = await fetch('/api/marketplace/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser?.id?.toString() || '' },
        body: JSON.stringify(publishForm)
      });
      const data = await res.json();
      if (data.id) {
        setProducts(prev => [{ ...publishForm, id: String(data.id), userId: currentUser?.id, authorName: currentUser?.name, price: parseFloat(publishForm.price), hashtags: [], date: new Date().toISOString() }, ...prev]);
        setShowPublish(false);
        setPublishForm({ title: '', subtitle: '', description: '', price: '', category: 'books', coverImage: '' });
      }
    } finally {
      setPublishing(false);
    }
  };

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl mb-8 p-8 bg-gradient-to-br from-[#0d0a1a] via-[#120c24] to-[#0a0d1a] border border-[#1e1b4b]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">Mercado Místico</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-slate-100 mb-2">Artefatos & Relíquias</h1>
              <p className="text-slate-400 text-sm max-w-lg">Encontre grimórios, amuletos, consultas e serviços dos praticantes da nossa egrégora.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPublish(true)}
                className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                <Upload className="w-4 h-4" />
                Vender Aqui
              </button>
              <button
                onClick={() => setShowCart(true)}
                className="relative flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-indigo-500/25"
              >
                <ShoppingCart className="w-4 h-4" />
                Carrinho
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar artefatos, autores..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0d0d14] border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-3 bg-[#0d0d14] border border-[#1e1b4b] hover:border-[#312e81] rounded-xl text-sm text-slate-400 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {SORT_OPTIONS.find(s => s.id === sortBy)?.label}
              <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-[#0d0d14] border border-[#1e1b4b] rounded-xl overflow-hidden shadow-2xl z-20"
                >
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setSortBy(opt.id); setShowSortDropdown(false); }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${sortBy === opt.id ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-[#0d0d14] border border-[#1e1b4b] text-slate-400 hover:text-slate-200 hover:border-[#312e81]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
                {isActive && products.filter(p => cat.id === 'all' || p.category === cat.id).length > 0 && (
                  <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                    {products.filter(p => cat.id === 'all' || p.category === cat.id).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-[#0d0d14] border border-[#1e1b4b] rounded-2xl overflow-hidden animate-pulse">
              <div className="h-52 bg-indigo-950/40" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
                <div className="h-6 bg-slate-800 rounded w-1/3 mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-500">
          <Package className="w-16 h-16 opacity-20" />
          <p className="font-serif text-lg text-slate-400">Nenhum artefato encontrado</p>
          <p className="text-sm">Tente ajustar os filtros ou seja o primeiro a vender nesta categoria!</p>
          <button onClick={() => setShowPublish(true)} className="mt-2 text-indigo-400 text-sm hover:text-indigo-300">
            Publicar um item →
          </button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onView={() => setViewingProduct(p)}
                onAddToCart={() => { addToCart(p); setShowCart(true); }}
                isWishlisted={wishlist.includes(p.id)}
                onWishlist={() => toggleWishlist(p.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Overlays */}
      <AnimatePresence>
        {showCart && (
          <CartDrawer
            items={cart}
            onClose={() => setShowCart(false)}
            onRemove={removeFromCart}
            onQuantity={setQuantity}
            onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
          />
        )}

        {viewingProduct && (
          <ProductModal
            product={viewingProduct}
            onClose={() => setViewingProduct(null)}
            onAddToCart={() => { addToCart(viewingProduct); }}
            currentUser={currentUser}
          />
        )}

        {showCheckout && (
          <CheckoutModal
            items={cart}
            onClose={() => setShowCheckout(false)}
            onSuccess={() => { setShowCheckout(false); setCart([]); }}
            currentUser={currentUser}
          />
        )}

        {/* Publish Form */}
        {showPublish && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPublish(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-[#090612] border border-[#312e81] rounded-3xl z-50 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#1e1b4b]">
                <h2 className="font-serif text-xl text-slate-100">Publicar um Artefato</h2>
                <button onClick={() => setShowPublish(false)} className="p-2 text-slate-500 hover:text-slate-200 rounded-xl hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                <input value={publishForm.title} onChange={e => setPublishForm(p => ({...p, title: e.target.value}))} placeholder="Nome do artefato *" className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none" />
                <input value={publishForm.subtitle} onChange={e => setPublishForm(p => ({...p, subtitle: e.target.value}))} placeholder="Subtítulo (opcional)" className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none" />
                <textarea value={publishForm.description} onChange={e => setPublishForm(p => ({...p, description: e.target.value}))} placeholder="Descrição completa do item..." rows={4} className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" min="0" step="0.01" value={publishForm.price} onChange={e => setPublishForm(p => ({...p, price: e.target.value}))} placeholder="Preço (R$) *" className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none" />
                  <select value={publishForm.category} onChange={e => setPublishForm(p => ({...p, category: e.target.value}))} className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none">
                    {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <input value={publishForm.coverImage} onChange={e => setPublishForm(p => ({...p, coverImage: e.target.value}))} placeholder="URL da imagem de capa" className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none" />
                <button onClick={handlePublish} disabled={!publishForm.title || !publishForm.price || publishing} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-[0.98]">
                  {publishing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Publicar no Mercado Místico'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
