import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, ShoppingBag, Plus, Upload, Tag, 
  ShoppingCart, X, MapPin, Sparkles, ChevronRight, Zap, 
  Award, Shield, CheckCircle2, Star, BookOpen, Crown,
  GripHorizontal, RefreshCw, Gem
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionLock } from '../ui/SectionLock';

const CATEGORIES = [
  { id: 'all', label: 'Todos os Artefatos' },
  { id: 'books', label: 'Livros & Grimórios' },
  { id: 'jewelry', label: 'Joias & Amuletos' },
  { id: 'instruments', label: 'Oráculos & Ferramentas' },
  { id: 'consultations', label: 'Serviços & Consultas' },
  { id: 'alchemy', label: 'Perfumes & Alquimia' },
  { id: 'other', label: 'Relíquias Diversas' }
];

const CATEGORY_ICONS: Record<string, typeof Sparkles> = {
  books: BookOpen,
  jewelry: Gem,
  instruments: Sparkles,
  consultations: Star,
  alchemy: Zap,
  other: Shield
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
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'checkout' | 'success'>('checkout');

  // Listing Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0.00');
  const [category, setCategory] = useState('books');
  const [coverImage, setCoverImage] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/marketplace/items');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentBalance = useMemo(() => {
    const raw = localStorage.getItem('oracle_balance');
    return raw ? parseFloat(raw) : 120.00; // Starter money
  }, []);

  const handlePurchase = async () => {
    if (!selectedItem) return;
    setIsPurchasing(true);
    // Simulate real purchase flow
    setTimeout(() => {
      // Deduct balance
      const newBal = currentBalance - selectedItem.price;
      localStorage.setItem('oracle_balance', newBal.toString());
      setPurchaseStep('success');
      setIsPurchasing(false);
    }, 1500);
  };

  const handleListProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !coverImage) return;

    setIsSubmitting(true);
    const tags = hashtags.split(',').map(t => t.trim().replace(/^#/, '')).filter(t => t);
    
    // In preview mode or unauthenticated fallback, create directly in local memory if needed
    // The endpoint acts as memory fallback
    try {
      const res = await fetch('/api/marketplace/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.id?.toString() || '1'
        },
        body: JSON.stringify({
          title, subtitle, description,
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
        setTitle(''); setSubtitle(''); setDescription(''); setPrice('0.00'); setCoverImage(''); setHashtags('');
      } else {
        alert("Não foi possível listar o produto. Módulo bloqueado no preview sem Auth.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  if (!currentUser?.isPaid) {
    return <SectionLock title="Mercado Místico" description="Acesso exclusivo ao comércio hermético e oracular. Faça o upgrade de assinatura para comprar, vender e trocar itens sagrados." />;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Hero Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#120f26] via-[#090616] to-[#0d0a20] border border-white/5 shadow-2xl group">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        {/* Mystic overlay patterns */}
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[150%] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative p-10 flex flex-col items-center text-center space-y-4">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-2xl shadow-xl shadow-black/50 mb-2">
            <ShoppingBag className="w-10 h-10 text-indigo-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-indigo-300 tracking-tight">
            Mercado Místico
          </h1>
          <p className="text-slate-400 font-light max-w-xl text-sm md:text-base leading-relaxed">
            O coração comercial da egrégora. Troque, venda e adquira relíquias espirituais, cursos independentes, leituras de tarot e essências alquímicas com irmãs e irmãos de caminhada.
          </p>
          
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setIsListingModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-1 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> 
              Anunciar no Mercado
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Filters */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Virtual Wallet Mini Display */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-slate-950/60 text-xs shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 flex items-center gap-1.5"><ShoppingCart className="w-3.5 h-3.5" /> Cofre Astral</h3>
            <div className="bg-[#0b0817] p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Balanço Atual</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shadow-inner">
                R$ {currentBalance.toFixed(2)}
              </span>
            </div>
            <p className="text-[9px] text-zinc-500 mt-3 text-center leading-relaxed">Transações protegidas pelo Sigilo de Salathiel.</p>
          </div>

          <div className="glass-panel p-6 rounded-[2.2rem] border border-white/5 bg-[#120f26]/30 shadow-lg sticky top-24">
            <h3 className="text-[11px] font-black tracking-[0.2em] text-[#9d8ff7] uppercase mb-5 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-400" /> Vias de Busca
            </h3>

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Procurar artefato..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1538]/50 border border-white/5 text-slate-200 text-sm rounded-xl py-2.5 pl-11 pr-4 outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600 focus:bg-[#1a1538]/80 shadow-inner"
              />
            </div>

            {/* Category Radios */}
            <div className="space-y-1.5 flex flex-col">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-row items-center w-full text-left py-2.5 px-3 rounded-xl transition-all duration-300 text-xs font-semibold
                    ${selectedCategory === cat.id 
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 shadow-md shadow-indigo-900/10' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                >
                  <span className="flex-1 truncate">{cat.label}</span>
                  {selectedCategory === cat.id && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
             <div className="h-64 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Lendo os ventos comerciais...</p>
             </div>
          ) : filteredItems.length === 0 ? (
            <div className="glass-panel p-16 rounded-[2.2rem] border border-white/5 text-center flex flex-col items-center justify-center bg-black/20">
              <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-white/5">
                <Search className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-300 mb-2">O vácuo comercial.</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm">
                Nenhuma mercadoria ou feitiço encontrado sob estas condições seculares. Seja o primeiro a ofertar algo aqui.
              </p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
                className="text-indigo-400 text-sm font-bold bg-indigo-500/10 px-6 py-2 rounded-full border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence>
                {filteredItems.map(item => {
                   const IconCmp = CATEGORY_ICONS[item.category] || Sparkles;
                   return (
                    <motion.button
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id}
                      onClick={() => { setSelectedItem(item); setPurchaseStep('checkout'); setIsDetailModalOpen(true); }}
                      className="glass-panel flex flex-col text-left group bg-[#110d21]/60 hover:bg-[#150f2e]/80 border border-white/5 hover:border-indigo-500/30 rounded-[2rem] overflow-hidden transition-all duration-300 shadow-xl hover:shadow-indigo-500/10"
                    >
                      <div className="h-44 w-full relative overflow-hidden bg-slate-900 border-b border-white/5">
                        <img 
                          src={item.coverImage} 
                          alt="" 
                          className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#110d21] to-transparent opacity-80" />
                        
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-lg">
                          <IconCmp className="w-3 h-3 text-indigo-300" />
                          <span className="text-[9px] font-black uppercase text-indigo-200 tracking-wider">
                            {CATEGORIES.find(c => c.id === item.category)?.label || 'Artefato'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex flex-col flex-1 relative z-10 w-full pt-4">
                        <div className="mb-auto">
                          <h3 className="font-bold text-slate-100 text-[15px] leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-slate-400 text-[11px] mt-1 line-clamp-1">{item.subtitle}</p>
                          
                          <div className="flex gap-1.5 mt-3 overflow-hidden flex-wrap max-h-5 overflow-hidden">
                            {item.hashtags?.slice(0,2).map(tag => (
                              <span key={tag} className="text-[9px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-full whitespace-nowrap border border-white/5 group-hover:border-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                                #{tag}
                              </span>
                            ))}
                            {item.hashtags && item.hashtags.length > 2 && <span className="text-[9px] text-slate-500">+{item.hashtags.length - 2}</span>}
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between w-full">
                           <div className="flex items-center gap-2">
                             <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 text-[9px] font-bold border border-indigo-500/30">
                               {item.authorName.charAt(0)}
                             </div>
                             <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[80px]">{item.authorName}</span>
                           </div>
                           <div className="text-right">
                             {item.price > 0 ? (
                               <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">R$ {item.price.toFixed(2)}</span>
                             ) : (
                               <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-500/20 group-hover:bg-amber-400 group-hover:text-amber-950 transition-colors">Gratuito</span>
                             )}
                           </div>
                        </div>
                      </div>
                    </motion.button>
                   );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ANUNCIAR MODAL */}
      <AnimatePresence>
        {isListingModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#110d21] w-full max-w-2xl rounded-[2.5rem] border border-[#2e266a]/60 shadow-[0_0_40px_rgba(157,143,247,0.1)] overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-serif">
                  <Shield className="w-5 h-5 text-amber-400" />
                  Ofertório Místico
                </h2>
                <button onClick={() => setIsListingModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <form id="listing-form" onSubmit={handleListProduct} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* General Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#9d8ff7] font-bold mb-1.5">Título do Item / Serviço</label>
                        <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500/50 outline-none" placeholder="Ex: Tarot dos Anjos, Pingente de Obsidiana..." />
                      </div>
                      
                      <div>
                         <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">Resumo Rápido</label>
                         <input required type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500/50 outline-none" placeholder="Um insight curto da sua mercadoria..." />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">Categoria Principal</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500/50 outline-none appearance-none"
                        >
                          {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                            <option key={c.id} value={c.id} className="bg-slate-900">{c.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                         <label className="block text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1.5">Valor (BRL R$)</label>
                         <input required type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-black/30 border border-emerald-500/20 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500/50 outline-none font-mono" />
                         <p className="text-[9px] text-zinc-500 mt-1">&quot;0.00&quot; para deixar Gratuito (doação de energia).</p>
                      </div>
                    </div>

                    {/* Media and Description */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#9d8ff7] font-bold mb-1.5">URL da Imagem Sagrada</label>
                        {coverImage ? (
                          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 bg-slate-800">
                             <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                             <button type="button" onClick={() => setCoverImage('')} className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:text-rose-400">
                               <X className="w-3 h-3" />
                             </button>
                          </div>
                        ) : (
                          <div className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus-within:border-indigo-500/50 transition-colors">
                             <input required type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full bg-transparent text-white outline-none placeholder:text-zinc-600" placeholder="https://..." />
                             <p className="text-[9px] font-mono text-indigo-400/50 mt-1">Insira uma URL pública.</p>
                          </div>
                        )}
                      </div>

                       <div>
                         <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">Palavras-chave Mágicas (Tags)</label>
                         <input type="text" value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500/50 outline-none" placeholder="tarot, oráculo, incenso natural..." />
                      </div>

                      <div>
                         <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">Pergaminho (Descrição)</label>
                         <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500/50 outline-none min-h-[100px] resize-none" placeholder="Explique os mistérios e usos do seu item/serviço..." />
                      </div>
                    </div>

                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-white/5 bg-black/40 flex justify-end gap-3 rounded-b-[2.5rem]">
                <button type="button" onClick={() => setIsListingModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  form="listing-form"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg border border-indigo-500/30 transition-all active:scale-95 flex items-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Lançar ao Mercado
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {isDetailModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#110d21] w-full max-w-4xl rounded-[2.5rem] border border-[#2e266a]/60 shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
            >
              <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors">
                <X className="w-4 h-4" />
              </button>

              {/* Product Cover */}
              <div className="md:w-[45%] h-64 md:h-auto bg-slate-900 relative">
                <img src={selectedItem.coverImage} alt="" className="w-full h-full object-cover mix-blend-overlay opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110d21] via-transparent to-transparent opacity-80" />
                 <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                    <span className="text-[10px] font-black uppercase text-indigo-200 tracking-wider">
                      {CATEGORIES.find(c => c.id === selectedItem.category)?.label || 'Artefato'}
                    </span>
                 </div>
              </div>

              {/* Product Details & Purchase Area */}
              <div className="md:w-[55%] p-8 flex flex-col max-h-[85vh] overflow-y-auto custom-scrollbar bg-gradient-to-br from-[#120f26] to-[#0b081a]">
                
                {purchaseStep === 'checkout' ? (
                  <>
                    <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-100 leading-tight mb-2">
                       {selectedItem.title}
                    </h2>
                    <p className="text-slate-400 text-sm">{selectedItem.subtitle}</p>

                    <div className="flex items-center gap-3 mt-5 pb-5 border-b border-white/5">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold border border-indigo-500/30">
                         {selectedItem.authorName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Artesão / Mago</p>
                        <p className="text-sm font-bold text-slate-200 flex items-center gap-1">{selectedItem.authorName} <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /></p>
                      </div>
                    </div>

                    <div className="py-6 flex-1 text-slate-300 text-sm font-light leading-relaxed whitespace-pre-wrap">
                       {selectedItem.description}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                       {selectedItem.hashtags?.map(tag => (
                         <span key={tag} className="text-[10px] bg-white/5 text-slate-400 px-3 py-1 rounded-full border border-white/10">
                           #{tag}
                         </span>
                       ))}
                    </div>

                    <div className="mt-auto bg-black/30 p-5 rounded-2xl border border-white/5">
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-mono text-slate-400">Valor do Intercâmbio</span>
                          {selectedItem.price > 0 ? (
                            <span className="text-2xl font-black text-emerald-400">R$ {selectedItem.price.toFixed(2)}</span>
                          ) : (
                            <span className="text-xl font-black text-amber-400 uppercase tracking-widest">Oferenda (0.00)</span>
                          )}
                       </div>
                       
                       <button 
                         onClick={handlePurchase}
                         disabled={isPurchasing || (selectedItem.price > 0 && currentBalance < selectedItem.price)}
                         className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl shadow-lg border border-indigo-500/30 transition-all flex justify-center items-center gap-2"
                       >
                         {isPurchasing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
                         {isPurchasing ? 'Transmutando Pagamento...' : selectedItem.price > 0 ? 'Concluir Aquisição' : 'Obter Ensinamento'}
                       </button>

                       {selectedItem.price > 0 && currentBalance < selectedItem.price && (
                         <p className="text-rose-400 text-[10px] uppercase font-bold tracking-widest text-center mt-3 flex justify-center items-center gap-1">
                           <X className="w-3 h-3" /> Saldo Oracular Insuficiente
                         </p>
                       )}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10 fade-in">
                     <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border-2 border-emerald-500 mb-2">
                       <CheckCircle2 className="w-10 h-10" />
                     </div>
                     <h3 className="text-3xl font-serif font-black text-slate-100">Transação Iluminada</h3>
                     <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                       O artefato <strong className="text-indigo-300">{selectedItem.title}</strong> agora compõe o seu grimório de aprendizados ou relíquias!
                     </p>
                     <div className="pt-6">
                       <button onClick={() => setIsDetailModalOpen(false)} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">
                         Retornar ao Mercado
                       </button>
                     </div>
                  </div>
                )}
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
