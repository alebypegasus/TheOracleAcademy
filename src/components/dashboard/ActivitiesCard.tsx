import React from 'react';
import { motion } from 'motion/react';
import { Bell, Award, BookOpen, Star, Sparkles } from 'lucide-react';

const activities = [
  { id: 1, icon: <Award className="w-4 h-4 text-amber-400" />, title: "Nova Conquista", desc: "Você desbloqueou 'Leitor Intuitivo'.", time: "Há 2 horas", color: "border-amber-500/20" },
  { id: 2, icon: <BookOpen className="w-4 h-4 text-indigo-400" />, title: "Módulo Concluído", desc: "Simbolismo das Copas e Ouros finalizado.", time: "Hoje, 10:30", color: "border-indigo-500/20" },
  { id: 3, icon: <Star className="w-4 h-4 text-purple-400" />, title: "XP Bônus Recebido", desc: "+50 XP por acessar 3 dias seguidos.", time: "Ontem", color: "border-purple-500/20" },
  { id: 4, icon: <Sparkles className="w-4 h-4 text-emerald-400" />, title: "Portal Aberto", desc: "Novo oráculo disponível para consulta.", time: "Há 2 dias", color: "border-emerald-500/20" },
];

export function ActivitiesCard() {
  return (
    <div className="h-full w-full p-6 sm:p-8 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-xl font-serif text-slate-100 flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-400" />
          Atividades
        </h3>
        <span className="text-[10px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/20">
          Novidades
        </span>
      </div>

      <div className="flex flex-col gap-3 relative z-10 flex-1">
        {activities.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className={`flex items-start gap-4 p-4 rounded-2xl border bg-black/20 hover:bg-white/5 transition-all duration-300 cursor-default group hover:scale-[1.02] shadow-sm hover:shadow-xl hover:shadow-black/50 ${item.color}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black/40 border border-white/5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                {item.icon}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">{item.title}</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 group-hover:text-slate-300 transition-colors">{item.desc}</p>
            </div>
            <div className="text-[10px] text-slate-500 whitespace-nowrap mt-1">
              {item.time}
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="mt-6 w-full py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-300 transition-colors border border-transparent hover:border-indigo-500/20 rounded-xl hover:bg-indigo-500/10 relative z-10">
        Histórico Completo
      </button>
    </div>
  );
}
