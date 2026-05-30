import React, { useState, useEffect } from "react";
import { Camera, Save, Upload, Sparkles, Shield, Flame, Compass, Trophy, Crown, BookOpen, Award, Zap, Star, Brain } from "lucide-react";
import { motion } from "motion/react";
import { CertificatesView } from './CertificatesView';
import { WorkspaceView } from './WorkspaceView';
import { PageCard } from '../ui/PageCard';

export function getAutoMagicDetails(xp: number = 100) {
  if (xp < 150) {
    return {
      authorTitle: "Busca-Caminhos",
      grau: "Grau I - Iniciado",
      location: "Estrela de Entrada",
    };
  } else if (xp < 400) {
    return {
      authorTitle: "Cartomante Prático",
      grau: "Grau III - Guardião do Portal",
      location: "Santuário Sagrado",
    };
  } else if (xp < 1000) {
    return {
      authorTitle: "Alquimista Mental",
      grau: "Grau V - Mestre dos Símbolos",
      location: "Oráculo do Éter",
    };
  } else if (xp < 3000) {
    return {
      authorTitle: "Sacerdote Solstício",
      grau: "Grau VII - Adepto Elevado",
      location: "Templo das Plêiades",
    };
  } else {
    return {
      authorTitle: "Magus Supremo",
      grau: "Grau VIII - Grão-Mestre",
      location: "Santuário Urânia",
    };
  }
}

export function ProfileView({
  currentUser,
  setCurrentUser,
  savedBirthChart,
  setSavedBirthChart,
}: {
  currentUser: any;
  setCurrentUser: any;
  savedBirthChart?: any;
  setSavedBirthChart?: any;
}) {
  const [isSyncingProfile, setIsSyncingProfile] = useState(false);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [isLoadingBadges, setIsLoadingBadges] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'certificates' | 'workspace'>('profile');
  
  // Fetch badges
  useEffect(() => {
    if (currentUser) {
      setIsLoadingBadges(true);
      fetch('/api/profile/badges', { headers: { 'x-user-id': currentUser.id.toString() } })
        .then(r => r.json())
        .then(data => {
          if (data && data.badges) {
            setUserBadges(data.badges);
          }
        })
        .catch(err => console.error("Error loading badges:", err))
        .finally(() => setIsLoadingBadges(false));
    }
  }, [currentUser]);
  
  // Auto-calculated fields based on user XP
  const autoDetails = getAutoMagicDetails(currentUser?.xp || 100);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    nickname: currentUser?.nickname || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    zipCode: currentUser?.zipCode || "",
    address: currentUser?.address || "",
    description: currentUser?.description || "",
    portfolio: currentUser?.portfolio || "",
    website: currentUser?.website || "",
    whatsapp: currentUser?.whatsapp || "",
    telegram: currentUser?.telegram || "",
    facebook: currentUser?.facebook || "",
    instagram: currentUser?.instagram || "",
    x_twitter: currentUser?.x_twitter || "",
    otherNet: currentUser?.otherNet || "",
    showPhone: currentUser?.showPhone ?? false,
    showAddress: currentUser?.showAddress ?? false,
    avatar:
      currentUser?.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
    authorTitle: autoDetails.authorTitle,
    grau: autoDetails.grau,
    location: autoDetails.location,
  });

  const handleGoogleProfileSync = async () => {
    try {
      setIsSyncingProfile(true);
      const { getAccessToken } = await import("../../lib/firebase");
      const token = await getAccessToken();
      if (!token) {
        alert("Sua conta do Google Workspace não está conectada. Visite a aba Workspace e faça o login com o Google para autorizar.");
        return;
      }

      const res = await fetch("https://people.googleapis.com/v1/people/me?personFields=names,photos,addresses,emailAddresses,biographies,phoneNumbers", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Erro na resposta da People API");
      }

      const data = await res.json();
      const updates: any = {};

      if (data.names && data.names.length > 0) {
        updates.name = data.names[0].displayName || "";
      }
      if (data.photos && data.photos.length > 0) {
        updates.avatar = data.photos[0].url || "";
      }
      if (data.emailAddresses && data.emailAddresses.length > 0) {
        updates.email = data.emailAddresses[0].value || "";
      }
      if (data.phoneNumbers && data.phoneNumbers.length > 0) {
        updates.phone = data.phoneNumbers[0].value || "";
      }
      if (data.addresses && data.addresses.length > 0) {
        updates.address = data.addresses[0].formattedValue || "";
        if (data.addresses[0].postalCode) {
          updates.zipCode = data.addresses[0].postalCode;
        }
      }
      if (data.biographies && data.biographies.length > 0) {
        updates.description = data.biographies[0].value || "";
      }

      setFormData(prev => ({ ...prev, ...updates }));
      alert("Sucesso! Seus dados foram preenchidos com as informações do Google.");
    } catch (err) {
      console.error(err);
      alert("Falha ao recuperar dados do Google Contacts. Verifique se o seu perfil do Google possui as informações ou tente conectar novamente.");
    } finally {
      setIsSyncingProfile(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePrivacy = (field: "showPhone" | "showAddress") => {
    setFormData({
      ...formData,
      [field]: !formData[field as keyof typeof formData],
    });
  };

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      const activeAutoDetails = getAutoMagicDetails(currentUser.xp || 100);
      const finalPayload = {
        ...formData,
        ...activeAutoDetails
      };
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id.toString(),
        },
        body: JSON.stringify(finalPayload),
      });
      if (res.ok) {
        const updatedUser = { ...currentUser, ...finalPayload };
        setCurrentUser(updatedUser);
        localStorage.setItem('oracle_user', JSON.stringify(updatedUser));
        alert("Perfil místico sincronizado com as estrelas!");
      } else {
        const errorData = await res.json();
        alert(
          "Erro ao sincronizar informações com o santuário: " +
            (errorData.error || ""),
        );
      }
    } catch (err) {
      console.error(err);
      alert("Falha de conexão com a infraestrutura celestial.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full px-4 md:px-8 mx-auto py-10">
      <div className="mb-8 text-center lg:text-left relative">
        <h2 className="text-4xl font-serif text-slate-100 uppercase tracking-widest mb-3 flex items-center justify-center lg:justify-start gap-4">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
          Seu Perfil Místico
        </h2>
        <p className="text-slate-400 max-w-xl text-sm font-light">
          Configure suas informações dimensionais, assinaturas energéticas, links celestiais e portfólio.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-[#0d0a1a]/80 border border-[#1e1b4b] rounded-2xl p-1.5 mb-8 overflow-x-auto">
        {([
          { id: 'profile', label: 'Perfil', emoji: '👤' },
          { id: 'certificates', label: 'Certificados', emoji: '🏅' },
          { id: 'workspace', label: 'Google Workspace', emoji: '✨' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 flex-1 justify-center px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap min-w-0 ${
              activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>{tab.emoji}</span> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'certificates' ? (
        <CertificatesView />
      ) : activeTab === 'workspace' ? (
        <WorkspaceView currentUser={currentUser} />
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
          {/* Avatar Section */}
          <PageCard 
            className="p-6 rounded-3xl flex flex-col items-center text-center border-[#1e1b4b] shadow-[0_0_40px_rgba(99,102,241,0.08)] hover:shadow-indigo-500/20 transition-all duration-500"
          >
            <input
              type="file"
              id="avatar-uploader-file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData(prev => ({ ...prev, avatar: reader.result as string }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => document.getElementById("avatar-uploader-file")?.click()}
              className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#312e81] shadow-xl mb-5 relative group cursor-pointer"
            >
              <img
                src={
                  formData.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
                }
                alt="Avatar"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-serif text-slate-100 font-bold tracking-wide">
              {formData.name || "Seu Nome"}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              {formData.nickname || "@nickname"}
            </p>
            <button 
              type="button"
              onClick={() => document.getElementById("avatar-uploader-file")?.click()}
              className="px-4 py-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition-colors text-xs uppercase tracking-wider font-semibold w-full"
            >
              Alterar Foto
            </button>
          </PageCard>

          {/* Plan Section */}
          <PageCard className="p-6 rounded-2xl relative overflow-hidden group">
            {currentUser?.isPaid ? (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none" />
                <h3 className="text-lg font-serif text-amber-400 mb-4 uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                  Plano Premium Ativo
                </h3>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center pb-2 border-b border-[#1e1b4b]">
                    <span className="text-xs text-slate-400 uppercase">
                      Status
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-emerald-500/20 text-emerald-400">
                      Ativo
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-[#1e1b4b]">
                    <span className="text-xs text-slate-400 uppercase">
                      Data de Início
                    </span>
                    <span className="text-sm text-slate-300">10/01/2024</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-[#1e1b4b]">
                    <span className="text-xs text-slate-400 uppercase">
                      Data de Expiração
                    </span>
                    <span className="text-sm text-slate-300">10/01/2025</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#1e1b4b] relative z-10">
                  <a
                    href="#/subscription"
                    className="w-full block text-center py-2 border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 rounded-lg text-xs uppercase tracking-wider transition-colors"
                  >
                    Gerenciar Assinatura
                  </a>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-serif text-slate-200 mb-4 uppercase tracking-widest text-sm">
                  Seu Plano
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#1e1b4b]">
                    <span className="text-xs text-slate-400 uppercase">
                      Plano Atual
                    </span>
                    <span className="text-sm font-bold text-slate-300">
                      Gratuito
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-[#1e1b4b]">
                    <span className="text-xs text-slate-400 uppercase">
                      Status
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-rose-500/20 text-rose-400">
                      Expirado
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-[#1e1b4b]">
                    <span className="text-xs text-slate-400 uppercase">
                      Expiração
                    </span>
                    <span className="text-sm text-slate-500">
                      Ilimitado (Básico)
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-[#1e1b4b] pt-4">
                  <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
                    Seu plano expirou ou você está na versão gratuita. Volte a
                    ter acessos avançados.
                  </p>
                  <a
                    href="#/subscription"
                    className="w-full text-center block px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-xl text-xs uppercase tracking-wider hover:from-amber-500 hover:to-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  >
                    Fazer Upgrade
                  </a>
                </div>
              </>
            )}
          </PageCard>

          {/* Certificates Shortcut Section - now a tab button */}
          <PageCard className="p-6 rounded-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-serif text-slate-200 mb-2 uppercase tracking-widest text-sm">
                Meus Certificados
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Veja o histórico de todas as suas formações.
              </p>
              <button
                onClick={() => setActiveTab('certificates')}
                className="block w-full text-center px-4 py-2 border border-indigo-500/30 text-indigo-300 rounded-xl hover:bg-indigo-500/10 transition-colors text-xs uppercase tracking-wider font-semibold"
              >
                Ver Certificados
              </button>
            </div>

            <div className="border-t border-[#1e1b4b] pt-4 mt-2">
              <h3 className="text-lg font-serif text-slate-200 mb-2 uppercase tracking-widest text-[11px]">
                Certificados Externos
              </h3>
              <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
                Faça upload de certificados de outras instituições para exibir
                no seu perfil público.
              </p>

              <div 
                onClick={() => setActiveTab('certificates')}
                className="border hover:border-indigo-500/50 border-dashed border-[#312e81] rounded-xl py-4 flex flex-col items-center justify-center cursor-pointer transition-colors group"
              >
                <Upload className="w-5 h-5 text-indigo-400 mb-1 group-hover:-translate-y-1 transition-transform" />
                <span className="text-xs text-slate-400 font-medium tracking-wide">
                  Anexar Certificado
                </span>
              </div>
            </div>
          </PageCard>

          {/* Gamification Badge Widget */}
          <PageCard className="p-6 rounded-2xl flex flex-col gap-6" id="gamification-badges">
            <div>
              <h3 className="text-lg font-serif text-slate-200 mb-1 uppercase tracking-widest text-sm flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Selos de Maestria
              </h3>
              <p className="text-xs text-slate-400">
                Seu crescimento esotérico certificado pelos astros.
              </p>
            </div>

            {/* Level and XP indicator */}
            <div className="bg-indigo-950/20 border border-[#1e1b4b] rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Progresso Cósmico</span>
                <span className="text-xs text-indigo-300 font-extrabold">{currentUser?.xp || 120} XP</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-[#1e1b4b]">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((currentUser?.xp || 120) % 500) / 5)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500 font-mono">
                <span>Grau Atual</span>
                <span>Prox: {500 - ((currentUser?.xp || 120) % 500)} XP</span>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: "b1",
                  title: "Estrela Guia",
                  desc: "Progresso inicial oracular.",
                  unlocked: true,
                  icon: Sparkles,
                  color: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30"
                },
                {
                  id: "b2",
                  title: "Leitor de Sinais",
                  desc: "XP acumulado acima de 150.",
                  unlocked: (currentUser?.xp || 120) >= 150,
                  icon: Compass,
                  color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-400/30"
                },
                {
                  id: "b3",
                  title: "Alta Sintonização",
                  desc: "XP acumulado acima de 400 ou Alinhamento Premium.",
                  unlocked: (currentUser?.xp || 120) >= 400 || !!currentUser?.isPaid,
                  icon: Zap,
                  color: "from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30"
                },
                {
                  id: "b4",
                  title: "Magus Real",
                  desc: "Completa o quiz com pontuação máxima.",
                  unlocked: (currentUser?.xp || 120) >= 600,
                  icon: Crown,
                  color: "from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/30"
                }
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    key={badge.id}
                    className={`p-3 rounded-2xl flex flex-col items-center text-center border transition-all ${badge.unlocked ? `bg-gradient-to-br ${badge.color} scale-100 shadow-md` : 'bg-black/20 border-[#1e1b4b] opacity-40 grayscale group-hover:grayscale-0'}`}
                  >
                    <div className={`p-2 rounded-xl mb-2 ${badge.unlocked ? 'bg-black/20' : 'bg-white/5'}`}>
                      <motion.div 
                        animate={badge.unlocked ? { rotate: [0, 10, -10, 0] } : {}} 
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                    </div>
                    <span className="text-xs font-bold text-slate-200 block truncate w-full">{badge.title}</span>
                    <span className="text-[9px] text-slate-500 mt-0.5 leading-snug hidden sm:block lines-clamp-2">{badge.desc}</span>
                  </motion.div>
                );
              })}
            </div>
          </PageCard>
        </div>

        <div className="col-span-2 space-y-6">
          <PageCard className="p-6 md:p-8 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#1e1b4b] pb-4">
              <h3 className="text-xl font-serif text-slate-200 uppercase tracking-widest text-sm">
                Informações Pessoais & Altar Místico
              </h3>
              <button
                type="button"
                onClick={handleGoogleProfileSync}
                disabled={isSyncingProfile}
                className="px-4 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-indigo-400" />
                {isSyncingProfile ? "Buscando..." : "Preencher via Google"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  Apelido (Nickname)
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block font-bold">
                  Imagem de Avatar (URL)
                </label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 text-xs"
                />
              </div>
              <div className="bg-indigo-950/20 border border-[#1e1b4b] p-4 rounded-xl">
                <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider block">Título Místico (Automático via XP)</span>
                <span className="text-sm font-semibold text-slate-200 mt-1 block">{autoDetails.authorTitle}</span>
              </div>
              <div className="bg-indigo-950/20 border border-[#1e1b4b] p-4 rounded-xl">
                <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider block">Grau Iniciático (Automático via XP)</span>
                <span className="text-sm font-semibold text-slate-200 mt-1 block">{autoDetails.grau}</span>
              </div>
              <div className="bg-indigo-950/20 border border-[#1e1b4b] p-4 rounded-xl md:col-span-2">
                <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider block">Santuário Cósmico (Automático via XP)</span>
                <span className="text-sm font-semibold text-slate-200 mt-1 block">{autoDetails.location}</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-400 uppercase tracking-widest block">
                    Telefone
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.showPhone}
                      onChange={() => handleTogglePrivacy("showPhone")}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-3 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-amber-500 relative"></div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest group-hover:text-amber-400 transition-colors">
                      Público
                    </span>
                  </label>
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  CEP
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-400 uppercase tracking-widest block">
                    Endereço Completo
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.showAddress}
                      onChange={() => handleTogglePrivacy("showAddress")}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-3 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-amber-500 relative"></div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest group-hover:text-amber-400 transition-colors">
                      Público
                    </span>
                  </label>
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                Sobre Mim (Biografia)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 h-24 resize-none"
              ></textarea>
            </div>

            <h3 className="text-xl font-serif text-slate-200 mb-6 uppercase tracking-widest text-sm border-b border-[#1e1b4b] pb-4 mt-8">
              Redes, Portfólio & Contato
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  Portfólio
                </label>
                <input
                  type="text"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  Telegram
                </label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  X (Twitter)
                </label>
                <input
                  type="text"
                  name="x_twitter"
                  value={formData.x_twitter}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest mb-2 block">
                  Outros / Joeds
                </label>
                <input
                  type="text"
                  name="otherNet"
                  value={formData.otherNet}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Perfil
              </button>
            </div>
          </PageCard>

            {/* SAVED BIRTH CHART SECTION */}
            <PageCard className="mt-8 p-6 md:p-8 rounded-2xl border-amber-500/20 bg-gradient-to-r from-slate-950 via-[#120e29] to-slate-950 relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
              <h3 className="text-xl font-serif text-amber-400 mb-6 uppercase tracking-widest text-sm border-b border-amber-500/20 pb-4 flex items-center gap-2 font-bold">
                🔮 Seu Mapa Astral Permanente
              </h3>

              {savedBirthChart && savedBirthChart.chartData ? (
                <div className="space-y-6">
                  <div className="p-4 bg-indigo-500/5 border border-[#1e1b4b] rounded-xl text-left">
                    <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider block">Leitura Sintonizada para</span>
                    <strong className="text-sm text-slate-100 font-serif uppercase tracking-wider block mt-1">{savedBirthChart.fullName}</strong>
                    <span className="text-xs text-slate-400 font-mono mt-1 block">Nascimento: {savedBirthChart.birthDate} às {savedBirthChart.birthTime} em {savedBirthChart.birthLocation}</span>
                  </div>

                  {/* Solares Alignments row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-[#1e1b4b] rounded-xl text-center">
                      <span className="text-[10px] text-slate-500 tracking-wider font-mono block uppercase">Signo Solar</span>
                      <div className="text-base font-serif text-amber-400 font-bold mt-1">☀️ {savedBirthChart.chartData.signoSolar}</div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-[#1e1b4b] rounded-xl text-center">
                      <span className="text-[10px] text-slate-500 tracking-wider font-mono block uppercase">Signo Ascendente</span>
                      <div className="text-base font-serif text-indigo-400 font-bold mt-1">🌅 {savedBirthChart.chartData.signoAscendente}</div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-[#1e1b4b] rounded-xl text-center">
                      <span className="text-[10px] text-slate-500 tracking-wider font-mono block uppercase">Luminar Lunar</span>
                      <div className="text-base font-serif text-cyan-400 font-bold mt-1">🌙 {savedBirthChart.chartData.luna}</div>
                    </div>
                  </div>

                  {/* Readings */}
                  <div className="space-y-4 text-left">
                    <div className="p-4 bg-rose-950/[0.05] border border-rose-500/10 rounded-xl">
                      <h4 className="text-xs font-mono text-rose-300 uppercase tracking-widest mb-2 font-black">❤️ Vida Amorosa</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{savedBirthChart.chartData.vidaAmorosa}</p>
                    </div>

                    <div className="p-4 bg-emerald-950/[0.05] border border-emerald-500/10 rounded-xl">
                      <h4 className="text-xs font-mono text-emerald-300 uppercase tracking-widest mb-2 font-black">💼 Prosperidade & Finanças</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{savedBirthChart.chartData.vidaFinanceira}</p>
                    </div>

                    <div className="p-4 bg-indigo-950/[0.05] border border-[#1e1b4b] rounded-xl">
                      <h4 className="text-xs font-mono text-indigo-300 uppercase tracking-widest mb-2 font-black">🌌 Jornada Espiritual</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{savedBirthChart.chartData.vidaEspiritual}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-amber-950/20 to-transparent border border-amber-500/20 rounded-xl text-left">
                    <h5 className="text-xs font-serif text-amber-300 uppercase tracking-wider mb-2 font-bold">📜 O Selo Alquímico Final</h5>
                    <p className="text-xs text-slate-300 font-light italic leading-relaxed">"{savedBirthChart.chartData.conselhoEstelar}"</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-white/[0.01] border border-dashed border-[#1e1b4b] rounded-xl text-center space-y-4">
                  <p className="text-xs text-slate-400">Você ainda não calculou e sintonizou seu Mapa Astral permanente nas estrelas.</p>
                  <a
                    href="#/landing"
                    className="inline-block px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    Gerar Meu Mapa Astral Grátis
                  </a>
                </div>
              )}
            </PageCard>

            {/* BADGES SECTION */}
            <PageCard className="mt-8 p-6 md:p-8 rounded-2xl border-[#312e81] bg-gradient-to-r from-[#0d091e] to-[#120e29] relative overflow-hidden text-left">
              <h3 className="text-xl font-serif text-indigo-400 mb-6 uppercase tracking-widest text-sm border-b border-[#312e81] pb-4 flex items-center gap-2 font-bold">
                🏅 Insígnias & Conquistas
              </h3>
              
              {isLoadingBadges ? (
                <div className="text-center py-6"><span className="text-slate-500 text-sm">Carregando conquistas do registro celestial...</span></div>
              ) : userBadges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {userBadges.map((badge, idx) => {
                    const icons = [Award, Star, Sparkles, BookOpen, Brain, Zap, Flame, Trophy];
                    const IconComp = icons[idx % icons.length];
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        key={badge.id}
                        className="p-4 bg-white/5 border border-[#1e1b4b] rounded-xl text-center flex flex-col items-center justify-center hover:bg-white/10 hover:border-indigo-500/50 transition-colors shadow-lg"
                        title={badge.description}
                      >
                         <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-indigo-500/10 border border-[#312e81] shadow-[0_0_15px_rgba(99,102,241,0.2)] text-indigo-400">
                           <IconComp className="w-6 h-6 animate-pulse" />
                         </div>
                         <h4 className="text-xs font-bold text-slate-200 mb-1 leading-tight">{badge.name}</h4>
                         <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest leading-tight">{badge.category}</p>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-6 bg-white/[0.01] border border-dashed border-[#1e1b4b] rounded-xl text-center">
                  <p className="text-xs text-slate-400">Nenhuma insígnia conquistada ainda. Continue sua jornada!</p>
                </div>
              )}
            </PageCard>

          </div>
        </div>
      )}
    </motion.div>
  );
}
