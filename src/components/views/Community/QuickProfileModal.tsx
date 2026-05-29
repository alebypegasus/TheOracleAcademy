import React from 'react';
import { motion } from 'motion/react';
import { Settings, Edit3, Shield, Star, Hexagon, Sparkles, Book, Scroll, Wand2, Moon, Flame, Wind, Droplets } from 'lucide-react';

interface QuickProfileModalProps {
  currentUser: any;
  status: string;
  onClose: () => void;
  onGoToProfile: () => void;
}

export function QuickProfileModal({ currentUser, status, onClose, onGoToProfile }: QuickProfileModalProps) {
  const getStatusColor = (s: string) => {
    switch(s) {
      case 'online': return 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]';
      case 'away': return 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  const statusMap = {
    'online': 'Conectado no Éter',
    'away': 'Ausente / Em Meditação',
    'offline': 'Invisível aos Sentidos'
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0a0a0f] border border-[#2a2a4a] rounded-3xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-auto"
      >
        {/* Esquerda: Avatar e Info Básica */}
        <div className="w-full md:w-1/3 bg-[#0f0f1a] border-r border-white/5 flex flex-col">
          <div className="h-32 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] to-transparent"></div>
            <button onClick={onClose} className="md:hidden absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 backdrop-blur-md">✕</button>
          </div>

          <div className="px-6 pb-6 flex flex-col items-center -mt-16 relative z-10 flex-1">
            <div className="relative mb-4">
              <img 
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full border-4 border-[#0f0f1a] object-cover bg-black shadow-xl"
              />
              <div className={`absolute bottom-2 right-2 w-6 h-6 border-4 border-[#0f0f1a] rounded-full ${getStatusColor(status)}`}></div>
            </div>
            
            <h2 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2 mb-1">
              {currentUser?.name || 'Buscador'}
            </h2>
            <p className="text-purple-400 font-medium text-sm mb-2 flex items-center gap-1.5 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              <Star className="w-3 h-3"/> {currentUser?.authorTitle || 'Iniciado'}
            </p>
            <p className="text-xs text-gray-400 mb-6 italic text-center px-4">"{statusMap[status as keyof typeof statusMap]}"</p>

            <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 mb-6 flex-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 flex items-center gap-1"><Hexagon className="w-3 h-3 text-indigo-400"/> Nível Místico</span>
                <span className="font-bold text-white">42</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400"/> Pontos de Luz</span>
                <span className="font-bold text-white">1.2k</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 flex items-center gap-1"><Book className="w-3 h-3 text-emerald-400"/> Grimórios Escritos</span>
                <span className="font-bold text-white">14</span>
              </div>
            </div>

            <button 
              onClick={onGoToProfile}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors mt-auto"
            >
              <Edit3 size={16}/> Acessar Grimório Pessoal
            </button>
          </div>
        </div>

        {/* Direita: RPG Stats e Badges */}
        <div className="w-full md:w-2/3 p-6 overflow-y-auto scrollbar-hide">
          <div className="hidden md:flex justify-end mb-4">
             <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
          </div>

          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Atributos Mágicos</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400 flex items-center gap-1"><Flame className="w-3 h-3 text-red-400"/> Vontade Cósmica</span>
                 <span className="text-white font-bold">85%</span>
               </div>
               <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-red-600 to-orange-400 w-[85%]"></div>
               </div>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400 flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400"/> Intuição D'água</span>
                 <span className="text-white font-bold">60%</span>
               </div>
               <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-[60%]"></div>
               </div>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400 flex items-center gap-1"><Wind className="w-3 h-3 text-slate-300"/> Magia Mental</span>
                 <span className="text-white font-bold">92%</span>
               </div>
               <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-slate-500 to-white w-[92%]"></div>
               </div>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-400 flex items-center gap-1"><Moon className="w-3 h-3 text-purple-400"/> Evocação (Goetia)</span>
                 <span className="text-white font-bold">45%</span>
               </div>
               <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-purple-800 to-fuchsia-500 w-[45%]"></div>
               </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Consagrações (Badges)</h3>
          <div className="flex flex-wrap gap-3 mb-8">
             <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/50 rounded-full flex items-center justify-center text-amber-400 tooltip-hover relative group cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <Flame size={20} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none border border-white/10 z-20">Mestre da Chama</span>
             </div>
             <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/50 rounded-full flex items-center justify-center text-purple-400 tooltip-hover relative group cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <Scroll size={20} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none border border-white/10 z-20">Guardião do Círculo</span>
             </div>
             <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-400 tooltip-hover relative group cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <Wand2 size={20} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none border border-white/10 z-20">Alquimista Verde</span>
             </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-widest border-b border-white/10 pb-2">Biografia Cósmica</h3>
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 text-sm text-gray-400 leading-relaxed italic">
            "Buscador da verdade nas entrelinhas da realidade. Praticante solitário focado em hermetismo e magia cerimonial desde 2024. Buscando compreender a mente através dos antigos."
          </div>

        </div>
      </motion.div>
    </div>
  );
}
