import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle2, XCircle, LayoutTemplate } from 'lucide-react';

export default function AdsAdmin() {
  const [ads, setAds] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newAd, setNewAd] = useState({
    title: '',
    image_url: '',
    link_url: '',
    placement: 'marketplace'
  });

  const loadAds = async () => {
    try {
      const token = localStorage.getItem('oracle_token') || '';
      const res = await fetch('/api/admin/ads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setAds(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('oracle_token') || '';
      await fetch(`/api/admin/ads/${id}/toggle`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      loadAds();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta propaganda?')) return;
    try {
      const token = localStorage.getItem('oracle_token') || '';
      await fetch(`/api/admin/ads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadAds();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('oracle_token') || '';
      await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newAd)
      });
      setIsAdding(false);
      setNewAd({ title: '', image_url: '', link_url: '', placement: 'marketplace' });
      loadAds();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-white flex items-center gap-3">
            <LayoutTemplate className="w-8 h-8 text-amber-500" />
            Propagandas
          </h2>
          <p className="text-slate-400 mt-2">Gerencie os banners patrocinados em diferentes áreas da plataforma.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-xl flex items-center gap-2 transition-colors text-sm"
        >
          {isAdding ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancelar' : 'Nova Propaganda'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-[#110D1A] border border-[#1e1b4b] p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-serif text-amber-400 mb-6">Cadastrar Novo Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Título (Interno)</label>
              <input 
                type="text" 
                required
                value={newAd.title}
                onChange={e => setNewAd({...newAd, title: e.target.value})}
                className="w-full bg-black/30 border border-[#1e1b4b] rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-amber-500/50"
                placeholder="Ex: Campanha Livro Novo"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Posição (Placement)</label>
              <select 
                value={newAd.placement}
                onChange={e => setNewAd({...newAd, placement: e.target.value})}
                className="w-full bg-black/30 border border-[#1e1b4b] rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-amber-500/50"
              >
                <option value="marketplace">Mercado Místico</option>
                <option value="community">Comunidade</option>
                <option value="grimoire">Grimório Pessoal</option>
                <option value="oracle">Oráculo Divinatório</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">URL da Imagem Banner</label>
              <input 
                type="url" 
                required
                value={newAd.image_url}
                onChange={e => setNewAd({...newAd, image_url: e.target.value})}
                className="w-full bg-black/30 border border-[#1e1b4b] rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-amber-500/50"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">URL de Destino (Link ao clicar)</label>
              <input 
                type="url"
                required
                value={newAd.link_url}
                onChange={e => setNewAd({...newAd, link_url: e.target.value})}
                className="w-full bg-black/30 border border-[#1e1b4b] rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-amber-500/50"
                placeholder="https://..."
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-black font-bold uppercase tracking-widest rounded-xl transition-all"
          >
            {loading ? 'Salvando...' : 'Salvar Propaganda'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {ads.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-[#110D1A] rounded-2xl border border-[#1e1b4b]">
            Nenhuma propaganda cadastrada ainda.
          </div>
        ) : (
          ads.map(ad => (
            <div key={ad.id} className="flex flex-col md:flex-row gap-6 bg-[#110D1A] border border-[#1e1b4b] p-4 rounded-2xl items-center">
              <div className="w-full md:w-48 h-24 rounded-lg overflow-hidden shrink-0 border border-white/5 relative">
                <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 px-2 py-0.5 bg-black/70 rounded text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                  {ad.placement}
                </div>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h4 className="text-lg font-bold text-slate-200 truncate">{ad.title}</h4>
                <p className="text-xs text-slate-500 truncate mt-1">Link: {ad.link_url}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${ad.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {ad.is_active ? 'Ativa' : 'Inativa'}
                  </span>
                  <span className="text-xs text-slate-600 ml-2">Criado em {new Date(ad.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                <button 
                  onClick={() => handleToggle(ad.id, ad.is_active)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-colors border ${ad.is_active ? 'bg-black border-red-500/30 text-red-400 hover:bg-red-500/10' : 'bg-black border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}
                >
                  {ad.is_active ? 'Desativar' : 'Ativar'}
                </button>
                <button 
                  onClick={() => handleDelete(ad.id)}
                  className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
