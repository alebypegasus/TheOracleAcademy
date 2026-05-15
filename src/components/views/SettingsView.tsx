import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Upload, CheckCircle2 } from 'lucide-react';

export function SettingsView({ profile, setProfile }: any) {
  const [name, setName] = useState(profile.name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = () => {
    setProfile({ ...profile, name, avatar: avatarUrl });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="glass-panel p-8 md:p-12 rounded-[2rem] border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full border border-indigo-500/30 flex items-center justify-center bg-indigo-500/10">
          <Settings className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-serif text-slate-100">Configurações de Perfil</h2>
          <p className="text-sm text-slate-400">Atualize sua identidade na rede do Oráculo.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-white/5">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/40 relative group">
            <img src={avatarUrl} alt="Preview Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">URL do Avatar</label>
            <input 
              type="text" 
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-colors"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Seu Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-colors"
              placeholder="Seu Nome"
            />
          </div>
        </div>

        <div className="pt-6 flex items-center justify-end gap-4">
          <AnimatePresence>
            {savedStatus && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="text-sm text-emerald-400 flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" /> Perfil Atualizado
              </motion.span>
            )}
          </AnimatePresence>
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/25"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
