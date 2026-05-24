import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Lock, Download, Share2, Eye, Upload, ShieldCheck, CheckCircle, Trash2, Edit, X, EyeOff } from 'lucide-react';

const COURSES = [
  { id: 1, title: 'Fundamentos do Tarot', completed: true, date: '15/03/2024', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600' },
  { id: 2, title: 'Lenormand Avançado', completed: true, date: '02/05/2024', image: 'https://images.unsplash.com/photo-1602498456745-e9503b3cc417?auto=format&fit=crop&q=80&w=600' },
  { id: 3, title: 'Desenvolvimento Intuitivo', completed: false, progress: 45, image: 'https://images.unsplash.com/photo-1602693680608-a1bf18685122?auto=format&fit=crop&q=80&w=600' },
  { id: 4, title: 'Astrologia Kármica', completed: false, progress: 0, image: 'https://images.unsplash.com/photo-1532054950961-002ab40dd324?auto=format&fit=crop&q=80&w=600' },
  { id: 5, title: 'Numerologia Cabalística', completed: false, progress: 10, image: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&q=80&w=600' },
  { id: 6, title: 'Radiestesia e Radiônica', completed: false, progress: 0, image: 'https://images.unsplash.com/photo-1616045585507-452140cb4ac8?auto=format&fit=crop&q=80&w=600' },
];

export function CertificatesView() {
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [syncedDrive, setSyncedDrive] = useState<Record<string, boolean>>({});
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  // External Certificates loaded/persisted to LocalStorage
  const [externalList, setExternalList] = useState<any[]>(() => {
    const saved = localStorage.getItem('external_certs');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { console.error(e); }
    }
    return [
      { id: 'ext-1', title: 'Terapia Holística Integrada', issuer: 'Instituto Brasileiro T.H.', date: '12/11/2023', verified: true, visible: true, file: '' }
    ];
  });

  // Modal State for Adding/Editing certificates
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    visible: true,
    file: ''
  });

  useEffect(() => {
    localStorage.setItem('external_certs', JSON.stringify(externalList));
  }, [externalList]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { getAccessToken } = await import('../../lib/firebase');
        const token = await getAccessToken();
        setGoogleToken(token);
      } catch (e) {
        console.error(e);
      }
    };
    fetchToken();
  }, []);

  const handleDownloadCertificate = (cert: { title: string, issuer?: string, date?: string }) => {
    const text = `
==================================================
           ORACLE ACADEMY CERTIFICATE
==================================================
Certificamos que o buscador concluiu com sucesso
e distinção cósmica a formação mística:

TÍTULO: ${cert.title}
EMISSOR: ${cert.issuer || 'Oracle Academy Portal'}
CONCLUSÃO: ${cert.date || 'Recém Emitido'}

Status: REGISTRADO & VERIFICADO NAS ESTRELAS
Selo Celestial: OC-CERT-${Math.floor(Math.random() * 900000 + 100000)}
==================================================
    `;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificado_${cert.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareCertificate = (cert: { title: string, issuer?: string }) => {
    const shareText = `🔮 Selo de Conclusão de Treinamento! Finalizei minha formação de alta magia em "${cert.title}" emitido por ${cert.issuer || 'Oracle Academy'}. Alinhamento cósmico atingido! ✨🌌`;
    if (navigator.share) {
      navigator.share({
        title: `Meu Certificado: ${cert.title}`,
        text: shareText,
        url: window.location.href
      }).catch(err => {
        console.log(err);
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert(`Texto para redes sociais copiado com sucesso! Compartilhe o seu brilho:\n\n"${shareText}"`);
    }
  };

  const handleSaveToDrive = async (id: string | number, title: string, issuer: string = 'Oracle Academy') => {
    const uniqueKey = id.toString();
    try {
      setIsUploading(prev => ({ ...prev, [uniqueKey]: true }));
      const { getAccessToken } = await import('../../lib/firebase');
      const token = await getAccessToken();
      if (!token) {
        alert("Sua conta do Google Workspace não está conectada. Visite a aba Workspace e faça login com o Google para autorizar.");
        return;
      }

      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `Certificado_${title.replace(/\s+/g, '_')}.txt`,
          mimeType: 'text/plain'
        })
      });

      if (!res.ok) throw new Error("Erro Drive API");
      const file = await res.json();

      const certificateText = `
========================================
       ORACLE ACADEMY CERTIFICATE       
========================================
Certificamos que o estudante concluiu com 
sucesso e distinção a formação mística:
${title}

Emissor: ${issuer}
Selo de Registro Celestial Digital
Emitido por: Oracle Academy Portal
Status: Sincronizado à Nuvem de Estudos
ID: OC-${id}-${Date.now()}
========================================
      `;

      const uploadRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${file.id}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain; charset=UTF-8'
        },
        body: certificateText
      });

      if (uploadRes.ok) {
        setSyncedDrive(prev => ({ ...prev, [uniqueKey]: true }));
        alert(`Certificado "${title}" sincronizado com sucesso no seu Google Drive!`);
      } else {
        throw new Error("Erro salvando arquivo");
      }
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar o certificado no Google Drive. Tente novamente.");
    } finally {
      setIsUploading(prev => ({ ...prev, [uniqueKey]: false }));
    }
  };

  const openAddModal = () => {
    setModalMode('create');
    setFormData({ title: '', issuer: '', date: '', visible: true, file: '' });
    setShowModal(true);
  };

  const openEditModal = (cert: any) => {
    setModalMode('edit');
    setEditingCertId(cert.id);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date || '',
      visible: cert.visible ?? true,
      file: cert.file || ''
    });
    setShowModal(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.issuer) {
      alert("Por favor preencha o título e o emissor.");
      return;
    }

    if (modalMode === 'create') {
      const newCert = {
        id: 'ext-' + Date.now(),
        title: formData.title,
        issuer: formData.issuer,
        date: formData.date || new Date().toLocaleDateString('pt-BR'),
        verified: true,
        visible: formData.visible,
        file: formData.file
      };
      setExternalList(prev => [...prev, newCert]);
    } else {
      setExternalList(prev => prev.map(c => c.id === editingCertId ? {
        ...c,
        title: formData.title,
        issuer: formData.issuer,
        date: formData.date,
        visible: formData.visible,
        file: formData.file
      } : c));
    }
    setShowModal(false);
  };

  const handleDeleteCert = (id: string) => {
    if (confirm("Deseja realmente remover este certificado das suas memórias cósmicas?")) {
      setExternalList(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, file: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="max-w-6xl mx-auto py-10 w-full h-full flex flex-col" id="certificates-view-root">
      <div className="mb-10 text-center lg:text-left relative">
        <h2 className="text-4xl font-serif text-slate-100 uppercase tracking-widest mb-3 flex items-center justify-center lg:justify-start gap-4">
          <Award className="w-8 h-8 text-amber-400 animate-pulse" />
          Seus Certificados
        </h2>
        <p className="text-slate-400 font-light max-w-2xl text-sm">O histórico luminoso de todas as suas formações esotéricas, conquistas profissionais e selos divinos.</p>
      </div>

      {/* Grid of Course Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {COURSES.map((course, index) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`glass-panel rounded-2xl overflow-hidden border relative flex flex-col ${course.completed ? 'border-amber-500/30 bg-indigo-950/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-white/5 opacity-80'}`}
          >
            <div className="h-40 relative">
              <img src={course.image} alt={course.title} className={`w-full h-full object-cover ${!course.completed ? 'grayscale opacity-40' : 'mix-blend-luminosity opacity-85'}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090514] via-[#090514]/40 to-transparent" />
              
              {!course.completed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="p-4 rounded-full bg-black/60 border border-white/10">
                    <Lock className="w-8 h-8 text-slate-400" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif text-slate-100 mb-2">{course.title}</h3>
                
                {course.completed ? (
                  <p className="text-xs text-amber-400 mb-4 font-medium uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Concluído em {course.date}
                  </p>
                ) : (
                  <div>
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Curso Trancado</p>
                    <div className="w-full bg-black/40 rounded-full h-1.5 mb-4 border border-white/5">
                      <div className="bg-indigo-500/50 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {course.completed ? (
                <div className="space-y-2 mt-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDownloadCertificate({ title: course.title, date: course.date })}
                      className="flex-1 px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg transition-colors text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Baixar
                    </button>
                    <button 
                      onClick={() => handleShareCertificate({ title: course.title })}
                      className="flex-1 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg transition-colors text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" /> Compartilhar
                    </button>
                  </div>

                  <button
                    onClick={() => handleSaveToDrive(course.id, course.title)}
                    disabled={isUploading[course.id.toString()] || syncedDrive[course.id.toString()]}
                    className={`w-full px-3 py-2 border rounded-lg text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 ${
                      syncedDrive[course.id.toString()]
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 cursor-default'
                        : 'border-indigo-500/40 hover:border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {isUploading[course.id.toString()] ? (
                      'Salvando no Drive...'
                    ) : syncedDrive[course.id.toString()] ? (
                      '✓ Salvo no Google Drive'
                    ) : (
                      '💾 Salvar no Google Drive'
                    )}
                  </button>
                </div>
              ) : (
                <button disabled className="w-full mt-4 px-3 py-2 bg-black/40 text-slate-600 border border-white/5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                  <Lock className="w-4 h-4" /> Indisponível
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* External Certificates Management with Local Storage Persistence */}
      <div className="mt-12 pt-12 border-t border-white/10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-serif text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              Certificados Externos
            </h3>
            <p className="text-sm text-slate-400">Armazene e comprove qualificações de outras linhagens e santuários.</p>
          </div>
          <button 
            onClick={openAddModal}
            className="px-5 py-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Anexar Novo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {externalList.map((cert) => (
            <motion.div 
              key={cert.id}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="glass-panel p-5 rounded-2xl border border-white/5 bg-indigo-950/10 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-indigo-500/5 rounded-xl border border-indigo-500/15 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">Verificado</span>
                    {cert.visible ? (
                      <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1"><Eye className="w-3 h-3 text-indigo-400" /> Público</span>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1"><EyeOff className="w-3 h-3 text-slate-550" /> Privado</span>
                    )}
                  </div>
                </div>
                
                <h4 className="text-lg font-serif text-slate-200 leading-tight mb-1">{cert.title}</h4>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-1">Emissor: {cert.issuer}</p>
                {cert.date && <p className="text-[10px] text-slate-500">Conclusão: {cert.date}</p>}

                {cert.file && (
                  <div className="mt-2 text-xs text-indigo-300/80 bg-indigo-500/5 border border-indigo-500/10 rounded px-2.5 py-1 inline-block truncate w-full">
                    📎 Arquivo Digital Anexado
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDownloadCertificate(cert)}
                    className="flex-1 py-1.5 px-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-slate-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" /> Baixar
                  </button>
                  <button 
                    onClick={() => handleShareCertificate(cert)}
                    className="flex-1 py-1.5 px-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-slate-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-400" /> Compartilhar
                  </button>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSaveToDrive(cert.id, cert.title, cert.issuer)}
                    disabled={isUploading[cert.id] || syncedDrive[cert.id]}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-colors flex items-center justify-center gap-1 border ${
                      syncedDrive[cert.id]
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 hover:border-indigo-500/40 text-indigo-300'
                    }`}
                  >
                    {isUploading[cert.id] ? 'Carregando...' : syncedDrive[cert.id] ? '✓ No Drive' : '💾 Drive'}
                  </button>
                  <button 
                    onClick={() => openEditModal(cert)}
                    className="py-1.5 px-3 border border-white/10 hover:border-indigo-500/40 rounded-lg text-xs text-slate-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-indigo-400" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCert(cert.id)}
                    className="py-1.5 px-3 border border-white/10 hover:border-rose-500/40 rounded-lg text-xs text-rose-400 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Empty Placecard to Upload / Create */}
          <div 
            onClick={openAddModal}
            className="glass-panel p-6 rounded-2xl border border-dashed border-white/20 hover:border-indigo-500/50 flex flex-col items-center justify-center gap-3 cursor-pointer text-center group transition-colors min-h-[220px]"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:-translate-y-1 transition-transform group-hover:bg-indigo-500/10">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-300 group-hover:text-indigo-300">Carregar Documento</p>
              <p className="text-xs text-slate-500 mt-1">PDF, JPG ou PNG (Max. 5MB)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal Dialog */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-950 border border-indigo-500/20 w-full max-w-lg rounded-2xl overflow-hidden p-6 relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-serif text-slate-100 uppercase tracking-widest mb-6 border-b border-indigo-500/20 pb-3 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                {modalMode === 'create' ? 'Anexar Certificado Externo' : 'Editar Certificado'}
              </h3>

              <form onSubmit={handleSaveModal} className="space-y-4">
                <div>
                  <label className="text-xs text-indigo-300 uppercase tracking-wider block mb-1 font-bold">Título da Formação</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-400"
                    placeholder="Ex: Terapeuta Prânico Estelar"
                  />
                </div>

                <div>
                  <label className="text-xs text-indigo-300 uppercase tracking-wider block mb-1 font-bold">Emissor / Linhagem</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-400"
                    placeholder="Ex: Templo Esotérico Urânia"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-indigo-300 uppercase tracking-wider block mb-1 font-bold">Data de Conclusão</label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 outline-none focus:border-indigo-400"
                      placeholder="Ex: 12/10/2023"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-indigo-300 uppercase tracking-wider block mb-3 font-bold">Visibilidade</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.visible}
                        onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                        className="rounded bg-black/40 border-white/15 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span className="text-xs text-slate-300 font-medium">Exibir no perfil público</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-indigo-300 uppercase tracking-wider block mb-1 font-bold">Upload de Comprovante (Imagem / PDF)</label>
                  <div className="border border-dashed border-white/10 hover:border-indigo-500/40 rounded-xl p-4 text-center cursor-pointer relative">
                    <input 
                      type="file" 
                      accept="image/*,application/pdf"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                    />
                    <Upload className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400">
                      {formData.file ? '✓ Novo comprovante carregado!' : 'Selecione comprovante digital'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-400 transition-colors uppercase"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors uppercase shadow-lg shadow-indigo-500/20"
                  >
                    {modalMode === 'create' ? 'Concluir Anexo' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
