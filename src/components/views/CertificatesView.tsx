import React from 'react';
import { motion } from 'motion/react';
import { Award, Lock, Download, Share2, Eye, Upload, ShieldCheck } from 'lucide-react';

const COURSES = [
  { id: 1, title: 'Fundamentos do Tarot', completed: true, date: '15/03/2024', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600' },
  { id: 2, title: 'Lenormand Avançado', completed: true, date: '02/05/2024', image: 'https://images.unsplash.com/photo-1602498456745-e9503b3cc417?auto=format&fit=crop&q=80&w=600' },
  { id: 3, title: 'Desenvolvimento Intuitivo', completed: false, progress: 45, image: 'https://images.unsplash.com/photo-1602693680608-a1bf18685122?auto=format&fit=crop&q=80&w=600' },
  { id: 4, title: 'Astrologia Kármica', completed: false, progress: 0, image: 'https://images.unsplash.com/photo-1532054950961-002ab40dd324?auto=format&fit=crop&q=80&w=600' },
  { id: 5, title: 'Numerologia Cabalística', completed: false, progress: 10, image: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&q=80&w=600' },
  { id: 6, title: 'Radiestesia e Radiônica', completed: false, progress: 0, image: 'https://images.unsplash.com/photo-1616045585507-452140cb4ac8?auto=format&fit=crop&q=80&w=600' },
];

export function CertificatesView() {
  return (
    <div className="max-w-6xl mx-auto py-10 w-full h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-4xl font-serif text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-400" />
          Seus Certificados
        </h2>
        <p className="text-slate-400">O histórico de todas as suas formações e conquistas na Oracle Academy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {COURSES.map((course, index) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`glass-panel rounded-2xl overflow-hidden border relative ${course.completed ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-white/5 opacity-80'}`}
          >
            <div className="h-40 relative">
              <img src={course.image} alt={course.title} className={`w-full h-full object-cover ${!course.completed ? 'grayscale opacity-40' : 'mix-blend-luminosity opacity-80'}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090514] to-transparent" />
              
              {!course.completed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="p-4 rounded-full bg-black/60 border border-white/10">
                    <Lock className="w-8 h-8 text-slate-400" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 relative z-10">
              <h3 className="text-xl font-serif text-slate-100 mb-2">{course.title}</h3>
              
              {course.completed ? (
                <div>
                  <p className="text-xs text-amber-400 mb-4 font-medium uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Concluído em {course.date}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 transition-colors text-xs font-semibold flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Baixar
                    </button>
                    <button className="flex-1 px-3 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors text-xs font-semibold flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" /> Compartilhar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                   <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Curso Trancado</p>
                   <div className="w-full bg-black/40 rounded-full h-1.5 mb-4 border border-white/5">
                     <div className="bg-indigo-500/50 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                   </div>
                   <button disabled className="w-full px-3 py-2 bg-black/40 text-slate-600 border border-white/5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-4 h-4" /> Indisponível
                   </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 pt-12 border-t border-white/10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-serif text-slate-100 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              Certificados Externos
            </h3>
            <p className="text-sm text-slate-400">Armazene e exiba certificações de outras instituições no seu perfil público.</p>
          </div>
          <button className="px-5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" /> Anexar Novo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Mock External Certificate */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                 <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-slate-400" />
                 </div>
                 <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">Verificado</span>
              </div>
              <div>
                 <h4 className="text-lg font-serif text-slate-200 leading-tight mb-1">Terapia Holística Integrada</h4>
                 <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Emissor: Instituto Brasileiro T.H.</p>
                 <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Eye className="w-4 h-4" /> Visível no Perfil
                 </div>
              </div>
              <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                 <button className="flex-1 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors">Editar</button>
                 <button className="flex-1 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors">Remover</button>
              </div>
           </motion.div>

           {/* Empty State for Upload */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl border border-dashed border-white/20 hover:border-indigo-500/50 flex flex-col items-center justify-center gap-3 cursor-pointer text-center group transition-colors min-h-[220px]">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:-translate-y-1 transition-transform group-hover:bg-indigo-500/10">
                 <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div>
                 <p className="text-sm font-bold text-slate-300 group-hover:text-indigo-300">Carregar Documento</p>
                 <p className="text-xs text-slate-500 mt-1">PDF, JPG ou PNG (Max. 5MB)</p>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}

// Helper icon
function CheckCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
