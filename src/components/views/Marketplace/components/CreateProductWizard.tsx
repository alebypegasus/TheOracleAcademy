import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Loader2, DollarSign } from 'lucide-react';
import { CATEGORIES } from './MarketplaceTypes';
import { api } from '../../../../services/api';

export function CreateProductWizard({ 
  onClose, 
  onSuccess, 
  currentUser 
}: {
  onClose: () => void;
  onSuccess: (newProduct: any) => void;
  currentUser: any;
}) {
  const [form, setForm] = useState({ 
    title: '', 
    subtitle: '', 
    description: '', 
    price: '', 
    category: 'books', 
    coverImage: '' 
  });
  const [publishing, setPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, coverImage: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!form.title || !form.price) return;
    setPublishing(true);
    try {
      const res = await fetch('/api/marketplace/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser?.id?.toString() || '' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.id) {
        onSuccess({
          ...form,
          id: String(data.id),
          userId: currentUser?.id,
          authorName: currentUser?.name,
          price: parseFloat(form.price),
          hashtags: [],
          date: new Date().toISOString()
        });
        onClose();
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />
      {/* Centering wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="pointer-events-auto w-full max-w-2xl bg-[#090612] border border-[#1e1b4b] rounded-3xl shadow-2xl flex flex-col"
          style={{ maxHeight: 'calc(100vh - 2rem)' }}
        >

        <div className="flex items-center justify-between p-6 border-b border-[#1e1b4b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Upload className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-slate-100">Publicar Artefato</h2>
              <p className="text-xs text-slate-500">Adicione um novo item à loja mística</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Título do Artefato</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: Grimório da Lua Cheia"
                  className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl p-3 text-sm text-slate-200 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subtítulo (Opcional)</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Ex: Edição Especial de Inverno"
                  className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl p-3 text-sm text-slate-200 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Categoria</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl p-3 text-sm text-slate-200 outline-none transition-colors appearance-none"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Preço (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Imagem de Capa</label>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {/* Clickable upload area / preview */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full h-40 rounded-xl border border-dashed border-[#1e1b4b] overflow-hidden cursor-pointer group hover:border-indigo-500/50 transition-colors"
                >
                  {form.coverImage ? (
                    <>
                      <img
                        src={form.coverImage}
                        alt="Preview"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80'; }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <Upload className="w-6 h-6 text-white mb-1" />
                        <span className="text-xs text-white font-medium">Trocar imagem</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-black/40 flex flex-col items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                      <Upload className="w-8 h-8 mb-2 opacity-60" />
                      <span className="text-sm font-medium">Clique para enviar imagem</span>
                      <span className="text-xs mt-1 opacity-60">PNG, JPG, WEBP — ou cole uma URL abaixo</span>
                    </div>
                  )}
                </div>
                {/* URL fallback */}
                <input
                  type="text"
                  value={form.coverImage.startsWith('data:') ? '' : form.coverImage}
                  onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
                  placeholder="Ou cole a URL da imagem aqui..."
                  className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl p-2.5 text-sm text-slate-400 outline-none transition-colors mt-2 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Descrição Detalhada</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descreva as propriedades e detalhes do seu artefato..."
                  rows={4}
                  className="w-full bg-black/40 border border-[#1e1b4b] focus:border-indigo-500/50 rounded-xl p-3 text-sm text-slate-200 outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#1e1b4b] bg-black/20 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
            Cancelar
          </button>
          <button
            onClick={handlePublish}
            disabled={!form.title || !form.price || publishing}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {publishing ? 'Publicando...' : 'Publicar na Loja'}
          </button>
        </div>
      </motion.div>
      </div>
    </>
  );
}
