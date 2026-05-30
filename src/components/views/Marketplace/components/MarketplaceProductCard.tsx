import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Heart, Plus, Eye } from 'lucide-react';
import { PageCard } from '../../../ui/PageCard';
import { Product } from './MarketplaceTypes';

export function StarRating({ rating, count }: { rating?: number; count?: number }) {
  const r = rating || 0;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= r ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
      ))}
      {count !== undefined && <span className="text-xs text-slate-500 ml-1">({count})</span>}
    </div>
  );
}

export function MarketplaceProductCard({ 
  product, 
  onView, 
  onAddToCart, 
  isWishlisted, 
  onWishlist 
}: {
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onView}
    >
      <PageCard
        className="group relative overflow-hidden cursor-pointer hover:border-indigo-500/40 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] transition-all duration-300"
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
      </PageCard>
    </motion.div>
  );
}
