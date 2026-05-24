import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, ShieldCheck, Star, Sparkles, MapPin, Award, 
  ShoppingBag, ArrowLeft, Send, Mail, Phone, ExternalLink,
  Wallet, ArrowUpRight, CheckCircle, AlertTriangle
} from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../hooks/useCart';

interface SellerProfile {
  userId: number;
  name: string;
  avatar: string;
  grau: string;
  authorTitle: string;
  location: string;
  description: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
  website?: string;
  balance?: number;
  isSelf?: boolean;
}

interface Product {
  id: number;
  title: string;
  subtitle?: string;
  price: number;
  category: string;
  cover_image?: string;
  author_name: string;
  description: string;
}

export default function SellerPage() {
  const { id } = useParams<{ id: string }>(); // Seller username or ID
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (id) {
      fetchSellerData();
    }
  }, [id]);

  const fetchSellerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.marketplace.getSellerProfile(id!);
      if (data && !data.error) {
        setProfile({
          userId: data.seller.userId,
          name: data.seller.name,
          avatar: data.seller.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
          grau: data.seller.grau || 'Membro do Coven',
          authorTitle: data.seller.authorTitle || 'Guardião Esotérico',
          location: data.seller.location || 'Santuário Astral',
          description: data.seller.description || 'Místico sintonizado com as energias cósmicas do mercado sagrado.',
          whatsapp: data.seller.whatsapp,
          telegram: data.seller.telegram,
          instagram: data.seller.instagram,
          website: data.seller.website,
          balance: Number(data.seller.balance || 0),
          isSelf: data.isSelf
        });
        setProducts(data.products || []);
      } else {
        throw new Error('Perfil de vendedor não encontrado.');
      }
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar vendedor');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.isSelf) return;
    
    const amountNum = Number(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawStatus({ type: 'error', message: 'Por favor, insira um valor de saque válido.' });
      return;
    }

    if (amountNum > (profile.balance || 0)) {
      setWithdrawStatus({ type: 'error', message: 'Saldo insuficiente para realizar este saque.' });
      return;
    }

    if (!pixKey.trim()) {
      setWithdrawStatus({ type: 'error', message: 'Insira uma chave PIX para repasse.' });
      return;
    }

    setWithdrawLoading(true);
    setWithdrawStatus(null);

    try {
      const res = await api.payment.withdraw(amountNum, pixKey);
      if (res && res.success) {
        setWithdrawStatus({ 
          type: 'success', 
          message: `Saque de R$ ${amountNum.toFixed(2)} solicitado com sucesso! O valor será creditado em sua chave PIX.` 
        });
        setWithdrawAmount('');
        // Reload profile data to reflect updated balance
        fetchSellerData();
      } else {
        throw new Error(res.error || 'Erro ao processar saque.');
      }
    } catch (err: any) {
      setWithdrawStatus({ type: 'error', message: err.message || 'Erro ao realizar saque.' });
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif text-indigo-300 animate-pulse tracking-wider">Sintonizando Canal de Comunicação Espiritual...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="glass-panel p-10 rounded-2xl border border-red-500/20 flex flex-col items-center gap-4">
          <AlertTriangle className="w-12 h-12 text-red-400" />
          <h3 className="text-2xl font-serif text-slate-100">Portal Obscuro</h3>
          <p className="text-slate-400 text-sm">{error || 'Vendedor não encontrado ou indisponível.'}</p>
          <button 
            onClick={() => navigate('/library')}
            className="mt-2 py-2 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
          >
            Voltar ao Mercado
          </button>
        </div>
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
        {/* Profile Card & Details */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-indigo-500/40 p-1 bg-black/40">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white p-1 rounded-full border-2 border-slate-900" title="Vendedor Verificado">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <h2 className="text-2xl font-serif text-slate-100 font-bold">{profile.name}</h2>
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mt-1">{profile.authorTitle}</p>
            <span className="text-slate-400 text-xs px-2.5 py-0.5 rounded bg-white/5 border border-white/10 mt-2">
              {profile.grau}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-4">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{profile.location}</span>
            </div>

            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-xs text-slate-300 ml-1.5 font-bold">5.0 (Vendedor Ouro)</span>
            </div>

            <div className="w-full border-t border-white/5 my-5"></div>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed text-justify">
              {profile.description}
            </p>

            <div className="w-full border-t border-white/5 my-5"></div>

            <div className="w-full flex flex-col gap-2">
              {profile.whatsapp && (
                <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-between text-xs text-slate-300 bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/5 transition-all">
                  <span className="flex items-center gap-2 font-semibold"><Phone className="w-4 h-4 text-emerald-400" /> WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              )}
              {profile.telegram && (
                <a href={`https://t.me/${profile.telegram}`} target="_blank" rel="noreferrer" className="flex items-center justify-between text-xs text-slate-300 bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/5 transition-all">
                  <span className="flex items-center gap-2 font-semibold"><Send className="w-4 h-4 text-sky-400" /> Telegram</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center justify-between text-xs text-slate-300 bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/5 transition-all">
                  <span className="flex items-center gap-2 font-semibold"><ExternalLink className="w-4 h-4 text-purple-400" /> Website</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              )}
            </div>
          </div>

          {/* Wallet and Payout for Self-Seller */}
          {profile.isSelf && (
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/20">
              <h3 className="text-lg font-serif text-slate-100 flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-indigo-400" /> Portal Financeiro
              </h3>
              
              <div className="flex justify-between items-center bg-black/20 p-3.5 rounded-xl border border-white/5">
                <span className="text-slate-400 text-xs">Saldo Disponível</span>
                <span className="font-serif text-xl font-bold text-emerald-400">R$ {(profile.balance || 0).toFixed(2)}</span>
              </div>

              <form onSubmit={handleWithdraw} className="flex flex-col gap-3 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Valor do Saque</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="R$ 0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-black/40 text-slate-200 border border-white/10 rounded-lg p-2 text-sm focus:border-indigo-500/50 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Chave PIX (CPF/E-mail/Telefone)</label>
                  <input
                    type="text"
                    placeholder="Chave para transferência"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="w-full bg-black/40 text-slate-200 border border-white/10 rounded-lg p-2 text-sm focus:border-indigo-500/50 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={withdrawLoading || !withdrawAmount || !pixKey}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md mt-1"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  {withdrawLoading ? 'Processando Saque...' : 'Sacar para Conta PIX'}
                </button>
              </form>

              <AnimatePresence>
                {withdrawStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-4 p-3 rounded-lg text-xs leading-relaxed ${
                      withdrawStatus.type === 'success' 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
                        : 'bg-red-500/10 border border-red-500/20 text-red-300'
                    }`}
                  >
                    {withdrawStatus.type === 'success' && <CheckCircle className="w-4 h-4 inline mr-1 text-emerald-400" />}
                    {withdrawStatus.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Listings Portfolio */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="border-b border-indigo-500/10 pb-4 flex items-center justify-between">
            <h3 className="text-2xl font-serif text-slate-100 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-indigo-400" /> Relíquias do Vendedor
            </h3>
            <span className="text-xs text-slate-400 font-semibold bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {products.length} {products.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="glass-panel p-16 rounded-2xl border border-white/5 text-center flex flex-col items-center gap-4">
              <Sparkles className="w-8 h-8 text-indigo-400 opacity-40 animate-pulse" />
              <h4 className="text-lg font-serif text-slate-200">Sem Relíquias Ativas</h4>
              <p className="text-slate-400 text-xs max-w-xs">
                Este vendedor não possui artefatos místicos ativos no momento. Volte em breve para novos produtos!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => {
                const isInCart = cartItems.some(i => i.id === product.id);
                return (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -4 }}
                    className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/20 flex flex-col transition-all"
                  >
                    <div className="h-44 w-full bg-slate-900 overflow-hidden relative border-b border-white/5">
                      {product.cover_image ? (
                        <img src={product.cover_image} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-indigo-400 bg-indigo-500/10">
                          <Sparkles className="w-8 h-8" />
                        </div>
                      )}
                      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/20 backdrop-blur-md">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-serif text-slate-200 font-bold">{product.title}</h4>
                        {product.subtitle && <p className="text-indigo-400/80 text-xs mt-0.5">{product.subtitle}</p>}
                        <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-5 border-t border-white/5 pt-4 flex items-center justify-between">
                        <span className="text-xl font-serif font-bold text-slate-100">
                          R$ {Number(product.price).toFixed(2)}
                        </span>
                        
                        <button
                          onClick={() => {
                            addToCart({
                              id: product.id,
                              title: product.title,
                              subtitle: product.subtitle,
                              price: Number(product.price),
                              category: product.category,
                              cover_image: product.cover_image,
                              author_name: product.author_name
                            });
                            navigate('/cart');
                          }}
                          disabled={isInCart}
                          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-md ${
                            isInCart 
                              ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400' 
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.02]'
                          }`}
                        >
                          {isInCart ? 'No Carrinho' : 'Adicionar ao Carrinho'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
