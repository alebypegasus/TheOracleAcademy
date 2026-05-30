import React, { useState, useEffect } from 'react';
import { ShoppingCart, Sparkles, Upload, Store } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { AdBanner } from '../../AdBanner';
import { PageCard } from '../../ui/PageCard';

import { Product, CartItem } from './components/MarketplaceTypes';
import { MarketplaceShowcase } from './components/MarketplaceShowcase';
import { MarketplaceCart } from './components/MarketplaceCart';
import { MarketplaceCheckout } from './components/MarketplaceCheckout';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CreateProductWizard } from './components/CreateProductWizard';
import { SellerDashboard } from './components/SellerDashboard';

export function MarketplaceRootView({ currentUser }: { currentUser: any }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'store' | 'dashboard'>('store');

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

  const isSeller = currentUser?.role === 'vendedor' || currentUser?.role === 'admin' || currentUser?.role === 'dono';

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

  const addToCart = (product: Product | CartItem, q: number = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + q } : i);
      return [...prev, { ...product as Product, quantity: q }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  
  const updateQuantity = (id: string, q: number) => {
    if (q <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: q } : i));
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  const handleProductCreated = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Deseja realmente remover este artefato da loja?')) return;
    try {
      await fetch(`/api/marketplace/items/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser?.id?.toString() || '' }
      });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert('Erro ao excluir item.');
    }
  };

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <PageCard className="relative overflow-hidden mb-8 p-8 bg-gradient-to-br from-[#0d0a1a] via-[#120c24] to-[#0a0d1a]">
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
              {isSeller && (
                <div className="flex bg-[#0a0a12]/80 border border-[#1e1b4b] rounded-xl p-1 mr-4">
                  <button
                    onClick={() => setActiveTab('store')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'store' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <Store className="w-4 h-4 inline-block mr-1.5" /> Loja
                  </button>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    Meu Painel
                  </button>
                </div>
              )}
              
              {(!isSeller || activeTab === 'store') && (
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
              )}
              {(!isSeller) && (
                 <button
                  onClick={() => setShowPublish(true)}
                  className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Vender Aqui
                </button>
              )}
            </div>
          </div>
        </div>
      </PageCard>

      <AdBanner placement="marketplace" className="mb-6" />

      {activeTab === 'store' ? (
        <MarketplaceShowcase
          products={products}
          onViewProduct={setViewingProduct}
          onAddToCart={(p) => addToCart(p, 1)}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
        />
      ) : (
        <SellerDashboard
          currentUser={currentUser}
          products={products}
          onEdit={(p) => setViewingProduct(p)} // Simple fallback for edit
          onDelete={handleDeleteProduct}
          onNewProduct={() => setShowPublish(true)}
        />
      )}

      {/* Overlays / Modals */}
      <AnimatePresence>
        {showCart && (
          <MarketplaceCart
            items={cart}
            onClose={() => setShowCart(false)}
            onRemove={removeFromCart}
            onQuantity={updateQuantity}
            onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckout && (
          <MarketplaceCheckout
            items={cart}
            onClose={() => setShowCheckout(false)}
            onSuccess={() => { setCart([]); setShowCheckout(false); }}
            currentUser={currentUser}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingProduct && (
          <ProductDetailModal
            product={viewingProduct}
            onClose={() => setViewingProduct(null)}
            onAddToCart={(quantity) => addToCart(viewingProduct, quantity)}
            currentUser={currentUser}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPublish && (
          <CreateProductWizard
            onClose={() => setShowPublish(false)}
            onSuccess={handleProductCreated}
            currentUser={currentUser}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
