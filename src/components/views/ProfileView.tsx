import React, { useState } from 'react';
import { Camera, Save, Upload } from 'lucide-react';
import { motion } from 'motion/react';

export function ProfileView({ currentUser, setCurrentUser }: { currentUser: any, setCurrentUser: any }) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    nickname: currentUser?.nickname || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    zipCode: currentUser?.zipCode || '',
    address: currentUser?.address || '',
    description: currentUser?.description || '',
    portfolio: currentUser?.portfolio || '',
    website: currentUser?.website || '',
    whatsapp: currentUser?.whatsapp || '',
    telegram: currentUser?.telegram || '',
    facebook: currentUser?.facebook || '',
    instagram: currentUser?.instagram || '',
    x_twitter: currentUser?.x_twitter || '',
    otherNet: currentUser?.otherNet || '',
    showPhone: currentUser?.showPhone ?? false,
    showAddress: currentUser?.showAddress ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePrivacy = (field: 'showPhone' | 'showAddress') => {
    setFormData({ ...formData, [field]: !formData[field as keyof typeof formData] });
  };

  const handleSave = () => {
    setCurrentUser({ ...currentUser, ...formData });
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div className="max-w-5xl mx-auto py-10 w-full">
      <div className="mb-8">
        <h2 className="text-4xl font-serif text-slate-100 uppercase tracking-wider mb-2">Seu Perfil</h2>
        <p className="text-slate-400">Configure suas informações pessoais, redes sociais e portfólio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
          {/* Avatar Section */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/20 mb-4 relative group cursor-pointer">
              <img src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'} alt="Avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-slate-200">{formData.name || 'Seu Nome'}</h3>
            <p className="text-sm text-slate-400 mb-4">{formData.nickname || '@nickname'}</p>
            <button className="px-4 py-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition-colors text-xs uppercase tracking-wider font-semibold w-full">
              Alterar Foto
            </button>
          </div>

          {/* Plan Section */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
             {currentUser?.isPaid ? (
               <>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none" />
                 <h3 className="text-lg font-serif text-amber-400 mb-4 uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">Plano Premium Ativo</h3>
                 
                 <div className="space-y-4 relative z-10">
                   <div className="flex justify-between items-center pb-2 border-b border-white/5">
                     <span className="text-xs text-slate-400 uppercase">Status</span>
                     <span className="text-xs px-2 py-1 rounded-full font-medium bg-emerald-500/20 text-emerald-400">
                        Ativo
                     </span>
                   </div>

                   <div className="flex justify-between items-center pb-2 border-b border-white/5">
                     <span className="text-xs text-slate-400 uppercase">Data de Início</span>
                     <span className="text-sm text-slate-300">10/01/2024</span>
                   </div>
                   
                   <div className="flex justify-between items-center pb-2 border-b border-white/5">
                     <span className="text-xs text-slate-400 uppercase">Data de Expiração</span>
                     <span className="text-sm text-slate-300">10/01/2025</span>
                   </div>
                 </div>

                 <div className="mt-4 pt-4 border-t border-white/5 relative z-10">
                    <a href="#/subscription" className="w-full block text-center py-2 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 rounded-lg text-xs uppercase tracking-wider transition-colors">
                      Gerenciar Assinatura
                    </a>
                 </div>
               </>
             ) : (
               <>
                 <h3 className="text-lg font-serif text-slate-200 mb-4 uppercase tracking-widest text-sm">Seu Plano</h3>
                 
                 <div className="space-y-4">
                   <div className="flex justify-between items-center pb-2 border-b border-white/5">
                     <span className="text-xs text-slate-400 uppercase">Plano Atual</span>
                     <span className="text-sm font-bold text-slate-300">
                       Gratuito
                     </span>
                   </div>
                   
                   <div className="flex justify-between items-center pb-2 border-b border-white/5">
                     <span className="text-xs text-slate-400 uppercase">Status</span>
                     <span className="text-xs px-2 py-1 rounded-full font-medium bg-rose-500/20 text-rose-400">
                        Expirado
                     </span>
                   </div>

                   <div className="flex justify-between items-center pb-2 border-b border-white/5">
                     <span className="text-xs text-slate-400 uppercase">Expiração</span>
                     <span className="text-sm text-slate-500">Ilimitado (Básico)</span>
                   </div>
                 </div>

                 <div className="mt-6 border-t border-white/5 pt-4">
                   <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
                     Seu plano expirou ou você está na versão gratuita. Volte a ter acessos avançados.
                   </p>
                   <a href="#/subscription" className="w-full text-center block px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-xl text-xs uppercase tracking-wider hover:from-amber-500 hover:to-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                     Fazer Upgrade
                   </a>
                 </div>
               </>
             )}
          </div>

          {/* Certificates Overview Section */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-serif text-slate-200 mb-2 uppercase tracking-widest text-sm">Meus Certificados</h3>
              <p className="text-xs text-slate-400 mb-4">Veja o histórico de todas as suas formações.</p>
              <a href="#/certificates" className="block w-full text-center px-4 py-2 border border-indigo-500/30 text-indigo-300 rounded-xl hover:bg-indigo-500/10 transition-colors text-xs uppercase tracking-wider font-semibold">
                Ver Histórico Completo
              </a>
            </div>
            
            <div className="border-t border-white/10 pt-4 mt-2">
              <h3 className="text-lg font-serif text-slate-200 mb-2 uppercase tracking-widest text-[11px]">Certificados Externos</h3>
              <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">Faça upload de certificados de outras instituições para exibir no seu perfil público.</p>
              
              <div className="border hover:border-indigo-500/50 border-dashed border-white/20 rounded-xl py-4 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                 <Upload className="w-5 h-5 text-indigo-400 mb-1 group-hover:-translate-y-1 transition-transform" />
                 <span className="text-xs text-slate-400 font-medium tracking-wide">Anexar Certificado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <div className="glass-panel p-6 md:p-8 rounded-2xl">
            <h3 className="text-xl font-serif text-slate-200 mb-6 uppercase tracking-widest text-sm border-b border-white/10 pb-4">Informações Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Nome Completo</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Apelido (Nickname)</label>
                <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">E-mail</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-400 uppercase tracking-widest block">Telefone</label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={formData.showPhone} onChange={() => handleTogglePrivacy('showPhone')} className="sr-only peer" />
                    <div className="w-5 h-3 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-amber-500 relative"></div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest group-hover:text-amber-400 transition-colors">Público</span>
                  </label>
                </div>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">CEP</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-400 uppercase tracking-widest block">Endereço Completo</label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={formData.showAddress} onChange={() => handleTogglePrivacy('showAddress')} className="sr-only peer" />
                    <div className="w-5 h-3 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-amber-500 relative"></div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest group-hover:text-amber-400 transition-colors">Público</span>
                  </label>
                </div>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
            </div>

            <div className="mb-8">
              <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Sobre Mim (Biografia)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 h-24 resize-none"></textarea>
            </div>

            <h3 className="text-xl font-serif text-slate-200 mb-6 uppercase tracking-widest text-sm border-b border-white/10 pb-4 mt-8">Redes, Portfólio & Contato</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Website</label>
                <input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Portfólio</label>
                <input type="text" name="portfolio" value={formData.portfolio} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">WhatsApp</label>
                <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Telegram</label>
                <input type="text" name="telegram" value={formData.telegram} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Instagram</label>
                <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Facebook</label>
                <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">X (Twitter)</label>
                <input type="text" name="x_twitter" value={formData.x_twitter} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                 <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Outros / Joeds</label>
                 <input type="text" name="otherNet" value={formData.otherNet} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-serif text-slate-200 mb-6 uppercase tracking-widest text-sm border-b border-white/10 pb-4">Serviços e Consultas</h3>
              
              {!currentUser?.isPaid ? (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                  <h4 className="text-rose-400 font-medium mb-2">Recurso Bloqueado</h4>
                  <p className="text-sm text-slate-400 max-w-md mb-4">
                    Para cadastrar uma leitura oracular, serviço ou produto para seus clientes, você precisa ser Premium.
                  </p>
                  <button className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-full text-xs uppercase tracking-wider">
                     Assinar Premium
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="border border-white/10 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-4">
                         <h4 className="font-medium text-indigo-300">Consulta de Tarô - 30 Minutos</h4>
                         <span className="text-emerald-400 text-sm font-bold">R$ 150,00</span>
                      </div>
                      <p className="text-xs text-slate-400">Leitura geral ou focada em uma área específica da vida.</p>
                      <div className="mt-4 flex gap-2">
                         <button className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 rounded hover:bg-indigo-500/20 text-xs">Editar</button>
                         <button className="px-3 py-1.5 bg-rose-500/10 text-rose-300 rounded hover:bg-rose-500/20 text-xs">Remover</button>
                      </div>
                   </div>
                   
                   <button className="w-full py-3 border border-dashed border-indigo-500/30 text-indigo-400 rounded-xl hover:bg-indigo-500/10 transition-colors text-sm font-medium">
                     + Adicionar Novo Serviço / Produto
                   </button>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={handleSave} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Salvar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
