import React, { useState } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Product, CATEGORIES, SORT_OPTIONS } from './MarketplaceTypes';
import { MarketplaceProductCard } from './MarketplaceProductCard';

export function MarketplaceShowcase({
  products,
  onViewProduct,
  onAddToCart,
  wishlist,
  onToggleWishlist
}: {
  products: Product[];
  onViewProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filtered = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <>
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar grimórios, amuletos, consultas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a12]/80 border border-[#1e1b4b] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500/50 outline-none transition-all"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 bg-[#0a0a12]/80 border border-[#1e1b4b] rounded-xl px-4 py-3 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>{SORT_OPTIONS.find(s => s.id === sortBy)?.label}</span>
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a12] border border-[#1e1b4b] rounded-xl shadow-xl z-30 overflow-hidden">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setSortBy(opt.id); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      sortBy === opt.id ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const Icon = (LucideIcons as any)[cat.icon] || Sparkles;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                  isSelected
                    ? `bg-gradient-to-r ${cat.color} text-white border-transparent`
                    : 'bg-[#0a0a12]/80 text-slate-400 border-[#1e1b4b] hover:border-[#312e81] hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-[#1e1b4b]/30 flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-indigo-400/50" />
          </div>
          <h3 className="font-serif text-xl text-slate-300 mb-2">Nenhum artefato encontrado</h3>
          <p className="text-slate-500">Tente buscar por outros termos ou categorias.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <MarketplaceProductCard
              key={product.id}
              product={product}
              onView={() => onViewProduct(product)}
              onAddToCart={() => onAddToCart(product)}
              isWishlisted={wishlist.includes(product.id)}
              onWishlist={() => onToggleWishlist(product.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
