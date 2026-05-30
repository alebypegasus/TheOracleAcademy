import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageCard } from '../../../../ui/PageCard';
import { Shield, Globe, Users, Wand2, Key, Star } from 'lucide-react';

export function EgregoraCreateWizard({ 
  onClose, 
  onCreate, 
  currentUser 
}: { 
  onClose: () => void, 
  onCreate: (data: any) => void,
  currentUser: any 
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'public' as 'public' | 'private' | 'secret',
    theme: 'mystic',
    minXp: 0,
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    onCreate({
      ...formData,
      ownerId: currentUser.id,
      ownerName: currentUser.name || currentUser.nickname,
      createdAt: new Date().toISOString(),
      admins: [currentUser.id],
      members: [currentUser.id]
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl"
      >
        <PageCard className="p-8 border border-indigo-500/30 bg-black/90 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h2 className="text-2xl font-serif text-slate-100 flex items-center gap-3">
                <Wand2 className="w-6 h-6 text-indigo-400" /> 
                Fundar Egrégora
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Estabeleça um novo pacto no Santuário (Passo {step} de 3)
              </p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
              ✕
            </button>
          </div>

          <div className="space-y-6 relative z-10">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-indigo-300 font-bold uppercase tracking-wider block mb-2">Nome Sagrado da Irmandade</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Coven do Solstício de Inverno"
                      className="w-full bg-black/40 border border-[#1e1b4b] rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-indigo-300 font-bold uppercase tracking-wider block mb-2">Propósito (Descrição)</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Descreva o propósito e as regras de convivência desta egrégora..."
                      rows={4}
                      className="w-full bg-black/40 border border-[#1e1b4b] rounded-xl py-3 px-4 text-slate-200 outline-none focus:border-indigo-500/50 resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <label className="text-xs text-indigo-300 font-bold uppercase tracking-wider block mb-4">Nível de Acesso (Privacidade)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    onClick={() => setFormData({...formData, type: 'public'})}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.type === 'public' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-[#1e1b4b] bg-black/20 hover:border-emerald-500/30'}`}
                  >
                    <Globe className={`w-6 h-6 mb-2 ${formData.type === 'public' ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <h4 className="text-sm font-bold text-slate-200 mb-1">Pública</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">Qualquer buscador pode ver e entrar nesta Egrégora.</p>
                  </div>
                  <div 
                    onClick={() => setFormData({...formData, type: 'private'})}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.type === 'private' ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-[#1e1b4b] bg-black/20 hover:border-indigo-500/30'}`}
                  >
                    <Shield className={`w-6 h-6 mb-2 ${formData.type === 'private' ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <h4 className="text-sm font-bold text-slate-200 mb-1">Privada</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">Visível no templo, mas a entrada exige aprovação dos Mestres.</p>
                  </div>
                  <div 
                    onClick={() => setFormData({...formData, type: 'secret'})}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.type === 'secret' ? 'border-rose-500/50 bg-rose-500/10' : 'border-[#1e1b4b] bg-black/20 hover:border-rose-500/30'}`}
                  >
                    <Key className={`w-6 h-6 mb-2 ${formData.type === 'secret' ? 'text-rose-400' : 'text-slate-500'}`} />
                    <h4 className="text-sm font-bold text-slate-200 mb-1">Secreta</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">Invisível. Apenas convidados através de convite direto podem entrar.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-indigo-300 font-bold uppercase tracking-wider block mb-2">Restrição por Experiência (XP Mínimo)</label>
                    <div className="flex items-center gap-4 bg-black/40 border border-[#1e1b4b] rounded-xl p-4">
                      <Star className="w-5 h-5 text-amber-400" />
                      <input 
                        type="number"
                        min="0"
                        step="100"
                        value={formData.minXp}
                        onChange={e => setFormData({...formData, minXp: parseInt(e.target.value) || 0})}
                        className="w-24 bg-black/40 border border-[#1e1b4b] rounded-lg py-2 px-3 text-slate-200 outline-none"
                      />
                      <span className="text-xs text-slate-400">XP necessário para pedir entrada. (0 para livre acesso)</span>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-indigo-300 mb-2">Pacto do Fundador</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Ao conjurar esta Egrégora, você se torna o <strong>Proprietário (Fundador)</strong> da mesma. 
                      Sua responsabilidade será manter o conhecimento fluindo, promover Magos para Administradores, 
                      e zelar pela lei do Santuário. O título de propriedade poderá ser transferido futuramente se desejar.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#1e1b4b]">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="px-6 py-2 border border-[#1e1b4b] hover:bg-white/5 rounded-xl text-xs font-bold text-slate-300 uppercase tracking-wider transition-colors">
                  Voltar
                </button>
              ) : <div></div>}
              
              <button 
                onClick={handleNext} 
                disabled={step === 1 && !formData.name}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
              >
                {step === 3 ? 'Conjurar Egrégora' : 'Prosseguir'}
              </button>
            </div>

          </div>
        </PageCard>
      </motion.div>
    </div>
  );
}
