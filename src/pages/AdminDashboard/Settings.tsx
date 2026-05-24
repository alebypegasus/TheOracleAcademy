import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<any>({
    site_name: 'The Oracle Academy',
    system_name: 'Oracle System',
    cnpj: '',
    company_info: '',
    favicon_url: '/favicon.svg',
    logo_url: '/logo.svg',
    sublogo_url: '',
    partners: [],
    ad_companies: []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings', {
      headers: { 'x-user-id': localStorage.getItem('userId') || '1' }
    })
    .then(r => r.json())
    .then(data => {
      if(data && Object.keys(data).length > 0) {
        setSettings(data);
      }
    })
    .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('userId') || '1'
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert("Configurações atualizadas com sucesso!");
        // O ideal é usar Context ou Recarregar para o Favicon/Site name atualizar no DOM
        window.location.reload(); 
      } else {
        alert("Erro ao salvar.");
      }
    } catch (err) {
      alert("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <h2 className="text-3xl font-serif mb-6 text-white">Configurações Globais do Sistema</h2>
      <p className="text-slate-400 mb-8">Altere informações visuais, legais e configurações de parceiros.</p>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#110D1A] p-6 rounded-xl border border-white/5 space-y-4">
          <h3 className="text-xl font-medium text-slate-200 border-b border-white/5 pb-2">Identidade Visual & Marca</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Nome do Site</label>
              <input type="text" name="site_name" value={settings.site_name} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Nome do Sistema (Interno)</label>
              <input type="text" name="system_name" value={settings.system_name} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">URL da Logo</label>
              <input type="text" name="logo_url" value={settings.logo_url} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">URL do Favicon</label>
              <input type="text" name="favicon_url" value={settings.favicon_url} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#110D1A] p-6 rounded-xl border border-white/5 space-y-4">
          <h3 className="text-xl font-medium text-slate-200 border-b border-white/5 pb-2">Informações Legais da Empresa</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">CNPJ</label>
              <input type="text" name="cnpj" value={settings.cnpj} onChange={handleChange} placeholder="00.000.000/0001-00" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-400 mb-1">Razão Social / Informações Legais (Rodapé)</label>
              <textarea name="company_info" value={settings.company_info} onChange={handleChange} rows={3} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </form>
    </div>
  );
}
