import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, Lock, Share2, CheckCircle2, Book, 
  Users, Image as ImageIcon, ChevronRight 
} from 'lucide-react';

export function GuidelinesView() {
  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12 pb-20">
        <div className="glass-panel p-10 rounded-[3rem] border border-white/5 bg-black/40">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-3xl font-serif text-slate-100">Código de Ética & Conduta</h2>
              <p className="text-indigo-400/60 text-xs font-black uppercase tracking-widest mt-1">Versão 2.4 | Éon Atemporal</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-10">
            <section>
              <h3 className="text-xl gold-text font-serif mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pillar da Intencionalidade
              </h3>
              <p className="text-slate-400 leading-relaxed text-base italic">
                Todo membro do Santuário concorda em utilizar as ferramentas oraculares e rituais com intencionalidade pura. 
                O uso para ferir, manipular ou exercer domínio injusto sobre terceiros resultará na expulsão imediata da egrégora.
              </p>
              <div className="mt-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-200">Permitido</h4>
                  <ul className="text-xs text-emerald-400/80 space-y-2 list-disc pl-4">
                    <li>Manifestação de abundância pessoal.</li>
                    <li>Estudos comparativos entre escolas de mistério.</li>
                    <li>Compartilhamento de saberia ancestral.</li>
                    <li>Comércio justo de artefatos e consultas.</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-200">Proibido</h4>
                  <ul className="text-xs text-rose-400/80 space-y-2 list-disc pl-4">
                    <li>Assédio místico ou perseguição energética.</li>
                    <li>Plágio de grimórios e rituais autorais.</li>
                    <li>Venda de promessas milagrosas sem base.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl text-slate-100 font-serif flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Propriedade Intelectual & Copyright
              </h3>
              <p className="text-slate-400 leading-relaxed">
                O Santuário respeita a sacralidade da criação. Todo conteúdo publicado (Ecos) permanece sob a aura de seu criador originário.
              </p>
              <div className="glass-panel p-6 rounded-3xl border border-indigo-500/10 bg-indigo-500/5 flex items-start gap-4">
                <Lock className="w-8 h-8 text-indigo-400 shrink-0" />
                <div className="text-sm text-slate-300 leading-relaxed font-medium">
                  <span className="text-indigo-300 font-bold">© 2026 Oracle Sanctum:</span> A arquitetura visual, os algoritmos radiestésicos e a interface de usuário são protegidos por leis internacionais de propriedade intelectual e selos de proteção teúrgica. A reprodução sem permissão escrita viola as leis físicas e kármicas.
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl text-slate-100 font-serif">Termos de Aura (Uso)</h3>
              <div className="space-y-4">
                {[
                  { q: 'Coleta de Dados', a: 'Nossos algoritmos lêem apenas o campo que você manifesta. Dados de geolocalização mística são utilizados apenas para ritos sazonais e não são compartilhados com entidades externas.' },
                  { q: 'Responsabilidade Oracular', a: 'O Santuário não se responsabiliza por decisões tomadas com base em consultas. O oráculo sugere, mas o livre arbítrio impera.' },
                  { q: 'Direito ao Esquecimento', a: 'A qualquer momento você pode recolher sua aura (deletar conta), apagando todos os seus ecos do registro público do Santuário.' }
                ].map((item, i) => (
                  <div key={i} className="p-5 border border-white/5 rounded-2xl bg-black/20">
                    <h4 className="text-sm font-bold text-slate-200 mb-2">{item.q}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl text-slate-100 font-serif flex items-center gap-2"><Book className="w-5 h-5 text-amber-500" /> Documentos & Anexos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Manual do Iniciado.pdf', size: '2.4 MB', icon: Book },
                  { name: 'Contrato_Egrégora_V2.docx', size: '156 KB', icon: Shield },
                  { name: 'Tabela_Correspondencias.png', size: '5.1 MB', icon: ImageIcon },
                  { name: 'Diretrizes_Parceiros.pdf', size: '1.2 MB', icon: Users }
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <doc.icon className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-200">{doc.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{doc.size}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-16 flex flex-wrap gap-4 pt-10 border-t border-white/5">
            <button className="flex items-center gap-3 px-6 py-3 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600/30 transition-all">
              <Share2 className="w-4 h-4" /> Exportar Grimório Legal
            </button>
            <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              <CheckCircle2 className="w-4 h-4" /> Aceitar Todos os Termos
            </button>
          </div>
        </div>
      </motion.div>
      <style>{`
        .gold-text { background: linear-gradient(to right, #fde68a, #f59e0b, #fde68a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>
    </div>
  );
}
