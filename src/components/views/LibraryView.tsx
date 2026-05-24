import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, ShoppingBag, Plus, Upload, X, Sparkles, 
  ChevronRight, Zap, Shield, CheckCircle2, Star, BookOpen, 
  RefreshCw, Gem, Wallet, Tag, Info, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionLock } from '../ui/SectionLock';

const CATEGORIES = [
  { id: 'all', label: 'Todos os Artefatos', description: 'Todas as energias e matérias combinadas' },
  { id: 'books', label: 'Livros & Grimórios', description: 'Sabedoria teúrgica e escritos medievais' },
  { id: 'jewelry', label: 'Joias & Amuletos', description: 'Pedras e metais imbuídos de proteção' },
  { id: 'instruments', label: 'Oráculos & Ferramentas', description: 'Tarôs, cinzelos e pêndulos radiestésicos' },
  { id: 'consultations', label: 'Serviços & Consultas', description: 'Direcionamento cósmico iluminado' },
  { id: 'alchemy', label: 'Perfumes & Alquimia', description: 'Essências sagradas e óleos de unção' },
  { id: 'other', label: 'Relíquias Diversas', description: 'Raridades inclassificáveis da tradição' }
];

const CATEGORY_ICONS: Record<string, typeof Sparkles> = {
  books: BookOpen,
  jewelry: Gem,
  instruments: Sparkles,
  consultations: Star,
  alchemy: Zap,
  other: Shield
};

const CATEGORY_COLORS: Record<string, string> = {
  books: 'border-blue-500/20 text-blue-300 bg-blue-500/5',
  jewelry: 'border-purple-500/20 text-purple-300 bg-purple-500/5',
  instruments: 'border-amber-500/20 text-amber-300 bg-amber-500/5',
  consultations: 'border-emerald-500/20 text-emerald-300 bg-emerald-500/5',
  alchemy: 'border-pink-500/20 text-pink-300 bg-pink-500/5',
  other: 'border-slate-500/20 text-slate-300 bg-slate-500/5'
};

interface MarketplaceItem {
  id: string;
  userId: number;
  authorName: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  category: string;
  coverImage: string;
  hashtags: string[];
  fileUrl?: string;
  date: string;
}

export function LibraryView({ currentUser }: { currentUser: any }) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Real balance and transaction states
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'checkout' | 'processing' | 'success' | 'error'>('checkout');
  const [purchaseError, setPurchaseError] = useState('');

  // Listing Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0.00');
  const [category, setCategory] = useState('books');
  const [coverImage, setCoverImage] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load items and balance on mount
  useEffect(() => {
    if (currentUser?.isPaid) {
      fetchItems();
      fetchBalance();
    }
  }, [currentUser]);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/marketplace/items');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Erro ao carregar itens do mercado:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      setBalanceLoading(true);
      const res = await fetch('/api/payments/balance', {
        headers: {
          'x-user-id': currentUser?.id?.toString() || ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
        // Sync with community view
        localStorage.setItem('oracle_balance', data.balance.toString());
      }
    } catch (err) {
      console.error("Erro ao sintonizar saldo:", err);
    } finally {
      setBalanceLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedItem) return;
    setIsPurchasing(true);
    setPurchaseStep('processing');
    setPurchaseError('');

    try {
      const res = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.id?.toString() || ''
        },
        body: JSON.stringify({ itemId: selectedItem.id })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setBalance(data.newBalance);
        localStorage.setItem('oracle_balance', data.newBalance.toString());
        setPurchaseStep('success');
      } else {
        setPurchaseError(data.error || 'Falha inexplicável nas leis cósmicas.');
        setPurchaseStep('error');
      }
    } catch (err) {
      console.error("Erro ao concretizar intercâmbio:", err);
      setPurchaseError('Transmissão astral interrompida. Verifique sua conexão.');
      setPurchaseStep('error');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleListProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !coverImage) return;

    setIsSubmitting(true);
    const tags = hashtags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t);
    
    try {
      const res = await fetch('/api/marketplace/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.id?.toString() || ''
        },
        body: JSON.stringify({
          title, 
          subtitle, 
          description,
          price: parseFloat(price),
          category,
          coverImage,
          hashtags: tags,
          fileUrl: ''
        })
      });

      if (res.ok) {
        const newItem = await res.json();
        setItems(prev => [newItem, ...prev]);
        setIsListingModalOpen(false);
        // Reset form
        setTitle(''); 
        setSubtitle(''); 
        setDescription(''); 
        setPrice('0.00'); 
        setCoverImage(''); 
        setHashtags('');
      } else {
        const errData = await res.json();
        alert(errData.error || "Não foi possível cadastrar o item.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  if (!currentUser?.isPaid) {
    return (
      <SectionLock 
        title="Mercado Místico" 
        description="Acesso exclusivo ao comércio hermético e oracular. Faça o upgrade de assinatura para comprar, vender e trocar itens sagrados com mestres de todo o país." 
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Visual Header Banner - Ultra Clean and Mistical */}
      <div className="relative rounded-[2rem] p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-[#0c091f] via-[#04030a] to-[#0d0a1b] border border-indigo-500/10 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-400" />
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-indigo-300">Mercado Aberto</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-100 tracking-tight">
              Mercado Místico
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
              Canal comercial espiritual. Adquira grimórios autorais, sintonias de pêndulos, leituras personalizadas e artefatos transmutadores produzidos pela própria egrégora.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            {/* Wallet Info Display */}
            <div className="bg-slate-950/80 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-md">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="text-start">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Carteira Oracular</p>
                  {balanceLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400 mt-1" />
                  ) : (
                    <p className="text-base font-black font-mono text-emerald-400 whitespace-nowrap">
                      R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={fetchBalance}
                title="Sintonizar saldo atual"
                className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List Item Button */}
            <button 
              onClick={() => setIsListingModalOpen(true)}
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" /> 
              Ofertar Item
            </button>
          </div>
        </div>
      </div>

      {/* Modern Horizontal Filter and Quick Stats Bar */}
      <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Main Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar grimórios, amuletos, oráculos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#110d24]/40 border border-[#231b40]/80 text-slate-200 text-xs rounded-xl py-3 pl-11 pr-4 outline-none focus:border-indigo-500/50 focus:bg-[#110d24]/80 transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-bold"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="text-right text-[10px] font-mono text-slate-500">
            {filteredItems.length} {filteredItems.length === 1 ? 'item sintonizado' : 'itens sintonizados'}
          </div>
        </div>

        {/* Categories Tab Bar Selector (Highly Touch-Responsive) */}
        <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-indigo-950 scrollbar-track-transparent">
          <div className="flex items-center gap-2 min-w-max">
            {CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICONS[cat.id] || Sparkles;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs rounded-xl font-semibold border transition-all duration-300 whitespace-nowrap cursor-pointer
                    ${isSelected 
                      ? 'bg-indigo-600/15 text-indigo-300 border-indigo-500/40 shadow-md shadow-indigo-950/50' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:border-slate-800'}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Lendo os ventos comerciais...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel p-16 rounded-[2rem] border border-white/5 text-center flex flex-col items-center justify-center bg-black/10">
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-6 border border-white/10">
            <Search className="w-6 h-6 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold font-serif text-slate-300 mb-2">Vácuo de Oferendas</h3>
          <p className="text-slate-500 text-xs mb-6 max-w-md mx-auto leading-relaxed">
            Nenhuma mercadoria cósmica corresponde à sua busca no escopo secular. Tente limpar os filtros para refazer a comunhão astral.
          </p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="text-xs font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/10 px-6 py-3 rounded-xl border border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer"
          >
            Resetar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredItems.map(item => {
              const IconCmp = CATEGORY_ICONS[item.category] || Sparkles;
              const colorTheme = CATEGORY_COLORS[item.category] || 'border-indigo-500/10 text-indigo-300 bg-indigo-500/5';
              return (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  key={item.id}
                  onClick={() => { 
                    setSelectedItem(item); 
                    setPurchaseStep('checkout'); 
                    setIsDetailModalOpen(true); 
                  }}
                  className="group flex flex-col text-left bg-[#100c25]/80 hover:bg-[#161132]/90 border border-white/5 hover:border-indigo-500/30 rounded-2.5xl overflow-hidden shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer w-full h-full justify-between"
                  id={`item-card-${item.id}`}
                >
                  <div>
                    {/* Visual Cover Header */}
                    <div className="h-44 w-full relative overflow-hidden bg-slate-950 border-b border-white/5">
                      <img 
                        src={item.coverImage} 
                        alt="" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 object-center"
                        onError={(e) => {
                          // Failover to default beautiful placeholder pattern
                          (e.target as any).src = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=300&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#100c25] to-transparent opacity-90" />
                      
                      {/* Top bar indicators */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase font-mono px-2.5 py-1 rounded-lg border backdrop-blur-md ${colorTheme}`}>
                          <IconCmp className="w-3 h-3" />
                          {CATEGORIES.find(c => c.id === item.category)?.label.split(' ')[0] || 'Artefato'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Text Core Content */}
                    <div className="p-5 space-y-2">
                      <h3 className="font-serif font-black text-[15px] sm:text-[16px] text-slate-100 leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 font-light">
                        {item.subtitle}
                      </p>
                      
                      {item.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.hashtags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[9px] font-mono text-indigo-400/70 bg-indigo-500/5 px-2 py-0.5 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Creator row */}
                  <div className="px-5 pb-5 pt-4 border-t border-white/5 flex items-center justify-between gap-2 mt-2 bg-black/10">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-[10px] font-bold shrink-0">
                        {item.authorName?.charAt(0) || 'A'}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono truncate">{item.authorName}</span>
                    </div>

                    <div className="shrink-0 text-right">
                      {item.price > 0 ? (
                        <span className="text-[11px] sm:text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg shadow-inner">
                          R$ {item.price.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[9px] font-black font-mono uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                          Oferenda
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ANUNCIAR MODAL (Redesigned from scratch to avoid overlapping fields) */}
      <AnimatePresence>
        {isListingModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#0f0c22] w-full max-w-2xl rounded-3xl border border-indigo-500/20 shadow-2xl my-8 overflow-hidden"
              id="ofertorio-modal"
            >
              {/* Header */}
              <div className="p-6 border-b border-indigo-500/10 flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-black text-slate-100">Portal do Ofertório</h2>
                    <p className="text-[10px] text-slate-400">Cadastre seu ensinamento ou ferramenta para o fluxo espiritual</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsListingModalOpen(false)} 
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleListProduct} id="listing-new-item-form" className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Column Left (Metadata) */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-indigo-300 mb-1">Título do Item ou Serviço *</label>
                      <input 
                        required 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="w-full bg-black/40 border border-indigo-500/10 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all placeholder:text-zinc-600 focus:bg-black/60" 
                        placeholder="Ex: Tarot das Almas Sagradas" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Subtítulo / Linha de Apoio *</label>
                      <input 
                        required 
                        type="text" 
                        value={subtitle} 
                        onChange={(e) => setSubtitle(e.target.value)} 
                        className="w-full bg-black/40 border border-indigo-500/10 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all placeholder:text-zinc-600" 
                        placeholder="Ex: Apostila em PDF com explicações das 22 runas" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Categoria *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-black/40 border border-indigo-500/10 focus:border-indigo-500/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none cursor-pointer"
                        >
                          {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                            <option key={c.id} value={c.id} className="bg-[#120f26] text-xs py-2">{c.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-400 mb-1">Preço (R$) *</label>
                        <input 
                          required 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          value={price} 
                          onChange={(e) => setPrice(e.target.value)} 
                          className="w-full bg-black/40 border border-emerald-500/20 focus:border-emerald-500/60 rounded-xl px-3 py-2.5 text-xs font-mono text-emerald-300 outline-none" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Palavras-chave (Separadas por vírgula)</label>
                      <input 
                        type="text" 
                        value={hashtags} 
                        onChange={(e) => setHashtags(e.target.value)} 
                        className="w-full bg-black/40 border border-indigo-500/10 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all placeholder:text-zinc-600" 
                        placeholder="tarot, estudo, alquimia" 
                      />
                    </div>
                  </div>

                  {/* Column Right (Media & Pergaminho) */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-indigo-300 mb-1">URL da Imagem de Capa *</label>
                      <div className="space-y-2">
                        <input 
                          required 
                          type="text" 
                          value={coverImage} 
                          onChange={(e) => setCoverImage(e.target.value)} 
                          className="w-full bg-black/40 border border-indigo-500/10 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-all placeholder:text-zinc-600" 
                          placeholder="https://images.unsplash.com/..." 
                        />
                        {coverImage ? (
                          <div className="relative h-20 w-full rounded-lg overflow-hidden border border-white/10">
                            <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => setCoverImage('')}
                              className="absolute top-1 right-1 bg-black/60 p-1 rounded-md text-white hover:text-rose-400 hover:bg-black"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="p-3 bg-black/20 border border-dashed border-white/5 rounded-xl text-center">
                            <p className="text-[10px] text-zinc-500">Insira um link de imagem do Unsplash ou similar</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Descrição Detalhada / Pergaminho *</label>
                      <textarea 
                        required 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="w-full bg-black/40 border border-indigo-500/10 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none min-h-[110px] resize-none h-full placeholder:text-zinc-600" 
                        placeholder="Explique os mistérios, e o que o comprador receberá ao invocar este item..." 
                      />
                    </div>
                  </div>

                </div>

                {/* Footer Controls */}
                <div className="pt-6 border-t border-indigo-500/10 flex items-center justify-end gap-3 bg-black/10 -mx-6 -mb-6 p-6">
                  <button 
                    type="button" 
                    onClick={() => setIsListingModalOpen(false)} 
                    className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Estornar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/30 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Lançar ao Mercado
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL & TRANSACTION MODAL (Beautiful, single-column vertical on mobile, clean side-by-side on desktop) */}
      <AnimatePresence>
        {isDetailModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#0f0c22] w-full max-w-4xl rounded-3xl border border-indigo-500/20 shadow-2xl overflow-hidden flex flex-col md:flex-row my-8"
              id="detalhe-item-modal"
            >
              {/* Cover Half Panel */}
              <div className="md:w-5/12 h-64 md:h-initial max-h-[70vh] relative min-h-[300px] bg-slate-950">
                <img 
                  src={selectedItem.coverImage} 
                  alt="" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as any).src = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=300&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0f0c22] via-transparent to-[#0f0c22]/10 md:from-[#0f0c22] opacity-100" />
                
                {/* Category chip inside image */}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase font-mono px-3 py-1.5 rounded-lg border bg-black/75 text-indigo-300 border-indigo-500/30 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    {CATEGORIES.find(c => c.id === selectedItem.category)?.label || 'Artefato'}
                  </span>
                </div>

                {/* Return button for mobile */}
                <button 
                  onClick={() => setIsDetailModalOpen(false)} 
                  className="absolute top-6 right-6 md:hidden w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contents & Purchase Workflow */}
              <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] md:max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {/* Upper Close button for desktop */}
                <div className="hidden md:flex justify-end -mt-2 -mr-2 mb-3">
                  <button 
                    onClick={() => setIsDetailModalOpen(false)} 
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {purchaseStep === 'checkout' && (
                    <motion.div
                      key="checkout"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 flex-1 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-100 leading-tight">
                            {selectedItem.title}
                          </h2>
                          <p className="text-slate-400 text-xs sm:text-sm mt-1">{selectedItem.subtitle}</p>
                        </div>

                        {/* Producer Meta */}
                        <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-300 text-xs shrink-0">
                            {selectedItem.authorName?.charAt(0) || 'A'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Autor / Artesão</p>
                            <p className="text-xs font-bold text-slate-300 truncate">{selectedItem.authorName}</p>
                          </div>
                        </div>

                        {/* Scrolls Description */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Resumo Teúrgico</p>
                          <div className="bg-slate-950/50 p-4 border border-indigo-500/5 rounded-xl">
                            <p className="text-slate-300 text-xs leading-relaxed font-light whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
                              {selectedItem.description}
                            </p>
                          </div>
                        </div>

                        {/* Hashtag List */}
                        {selectedItem.hashtags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedItem.hashtags.map(tag => (
                              <span key={tag} className="text-[9px] font-mono text-indigo-300/80 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/10">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Transaction Bottom Bar */}
                      <div className="pt-6 border-t border-indigo-500/10 space-y-4">
                        <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl border border-white/5">
                          <div>
                            <p className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Investimento</p>
                            <p className="text-xs text-slate-400">Intercâmbio comercial sagrado</p>
                          </div>
                          <div>
                            {selectedItem.price > 0 ? (
                              <p className="text-lg font-black font-mono text-emerald-400">
                                R$ {selectedItem.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            ) : (
                              <p className="text-sm font-black uppercase tracking-widest text-[#9d8ff7]">Gratuito</p>
                            )}
                          </div>
                        </div>

                        {/* Wallet check alert */}
                        {selectedItem.price > 0 && balance < selectedItem.price ? (
                          <div className="bg-rose-500/15 border border-rose-500/20 p-3 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                            <div>
                              <p className="font-bold">Saldo Insuficiente</p>
                              <p className="text-[10px] text-rose-400/80">Você tem R$ {balance.toFixed(2)}. Complete fundos na tela social.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#121c17] border border-emerald-950 p-3 rounded-xl flex items-center gap-2.5 text-emerald-300 text-xs">
                            <Info className="w-4 h-4 shrink-0 text-emerald-400 animate-pulse" />
                            <p className="text-[10px] text-emerald-400/80 leading-relaxed">
                              Após adquirir o item, a quantia será transferida ao cofre do criador sob a proteção teúrgica.
                            </p>
                          </div>
                        )}

                        <button
                          onClick={handlePurchase}
                          disabled={selectedItem.price > 0 && balance < selectedItem.price}
                          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-950/50 flex justify-center items-center gap-2 cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          {selectedItem.price > 0 ? 'Concluir Aquisição' : 'Obter Ensinamento'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {purchaseStep === 'processing' && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-12 flex flex-col items-center justify-center text-center space-y-6 h-full"
                    >
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-emerald-400"
                        />
                        <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-serif font-black text-indigo-300">Transmutando Acordo...</h3>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Emitindo guias de custódia e registrando a transação espiritual na carteira oracular...
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {purchaseStep === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-8 flex flex-col items-center justify-center text-center space-y-5 h-full"
                    >
                      <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-serif font-black text-slate-100">Transação Iluminada</h3>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          O artefato <strong className="text-indigo-300">{selectedItem.title}</strong> foi adquirido com pleno sucesso comercial!
                        </p>
                      </div>
                      <div className="bg-slate-950/70 p-4 border border-white/5 rounded-xl w-full text-left space-y-1.5 max-w-sm">
                        <p className="text-[10px] font-mono text-emerald-400 flex items-center justify-between">
                          <span>Novo Saldo Oracular:</span>
                          <strong>R$ {balance.toFixed(2)}</strong>
                        </p>
                        <p className="text-[9px] text-zinc-500 leading-relaxed font-light">
                          Os conteúdos agora fazem parte de sua sintonização pessoal. Encontre o vendedor na comunidade para esclarecer dúvidas.
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsDetailModalOpen(false)} 
                        className="px-6 py-2.5 bg-[#171333] hover:bg-[#201b44] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Retornar ao Catálogo
                      </button>
                    </motion.div>
                  )}

                  {purchaseStep === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 flex flex-col items-center justify-center text-center space-y-5 h-full"
                    >
                      <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-serif font-black text-rose-300">Falha no Processo</h3>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          {purchaseError || 'A translação comercial não obteve sintonização adequada com o banco.'}
                        </p>
                      </div>
                      <button 
                        onClick={() => setPurchaseStep('checkout')} 
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Tentar Novamente
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
