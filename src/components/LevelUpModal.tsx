import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Sparkles, X } from 'lucide-react';

export function LevelUpModal({ xp, currentMilestone, onClose }: { xp: number, currentMilestone: number, onClose: () => void }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="relative max-w-md w-full glass-panel rounded-3xl p-8 border border-amber-500/30 overflow-hidden text-center"
        >
          {/* Confetti / Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-amber-500/20 blur-[100px] pointer-events-none" />
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-[0_0_40px_rgba(245,158,11,0.5)]"
            >
              <div className="w-full h-full bg-[#0B0A10] rounded-full flex items-center justify-center border-4 border-transparent">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-serif font-medium text-white mb-2"
            >
              Elevação Cósmica!
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-slate-300 text-sm mb-8"
            >
              Sua centelha interior atingiu uma nova frequência vibratória. Você superou o marco de <span className="text-amber-400 font-bold">{currentMilestone} XP</span>.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center"
            >
              <div className="flex justify-center -space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center text-indigo-400"><Sparkles className="w-4 h-4"/></div>
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400"><Star className="w-4 h-4"/></div>
              </div>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Nova Insígnia Descoberta</p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onClose}
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm tracking-widest uppercase hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
            >
              Continuar Jornada
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
