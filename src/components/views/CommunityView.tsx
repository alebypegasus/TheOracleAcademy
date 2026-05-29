import React from 'react';
import { motion } from 'motion/react';
import { Moon, Sparkles, Crown } from 'lucide-react';
import { Avatar } from '@heroui/react';
import { CommunityLayout } from './Community/CommunityLayout';

interface CommunityViewProps {
  currentUser: any;
}

// ─── Community View ───────────────────────────────────────────────────────────
export function CommunityView({ currentUser }: CommunityViewProps) {
  return (
    <div className="p-4 md:p-8 w-full mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
          Círculo do Éter
        </h1>
        <p className="text-gray-400 text-lg">Onde os mistérios são compartilhados e a sabedoria é coletiva.</p>
      </motion.div>

      <CommunityLayout currentUser={currentUser} />
    </div>
  );
}

// ─── Lunar Calendar Widget ────────────────────────────────────────────────────
export function LunarWidget() {
  const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  const today = new Date();
  const dayOfMonth = today.getDate();
  const phaseIndex = Math.floor((dayOfMonth / 30) * 8) % 8;
  const phaseNames = ['Lua Nova', 'Crescente', 'Quarto Crescente', 'Gibosa Crescente', 'Lua Cheia', 'Gibosa Minguante', 'Quarto Minguante', 'Minguante'];
  const energies = ['Novos começos', 'Intenção', 'Ação', 'Expansão', 'Realização', 'Gratidão', 'Reflexão', 'Libertação'];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg hover:border-purple-500/30 transition-all">
      <div className="flex items-center gap-2 mb-4">
        <Moon className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Calendário Lunar</span>
      </div>
      <div className="text-center py-3">
        <div className="text-5xl mb-2">{phases[phaseIndex]}</div>
        <p className="font-serif text-slate-200 text-lg">{phaseNames[phaseIndex]}</p>
        <p className="text-xs text-purple-400 mt-1">{energies[phaseIndex]}</p>
      </div>
      <div className="mt-4 grid grid-cols-8 gap-1">
        {phases.map((p, i) => (
          <div key={i} className={`text-center text-lg rounded-lg py-1 transition-colors ${i === phaseIndex ? 'bg-purple-500/20 border border-purple-500/30' : 'opacity-30'}`}>
            {p}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 text-center mt-3">
        {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>
    </div>
  );
}

// ─── Online Members Widget ────────────────────────────────────────────────────
export function OnlineWidget() {
  // Mock data for online widget since it was previously reliant on rankings state
  const mockRankings = [
    { name: "Serena Moon", xp: 1200, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    { name: "Elias Thorne", xp: 950, avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d" },
    { name: "Lyra Star", xp: 820, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg hover:border-purple-500/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Egrégora Online</span>
        </div>
        <span className="text-xs text-emerald-400">{mockRankings.length} ativos</span>
      </div>
      <div className="space-y-3">
        {mockRankings.map((u, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="relative">
              {/* @ts-ignore */}
              <Avatar src={u.avatar} name={u.name} size="sm" />
              <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-zinc-900 ${i < 3 ? 'bg-emerald-500' : 'bg-slate-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-300 truncate">{u.name}</p>
              <p className="text-xs text-purple-400">{u.xp?.toLocaleString() || 0} XP</p>
            </div>
            {i === 0 && <Crown className="w-3 h-3 text-amber-400 shrink-0 drop-shadow-md" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Witch Calendar Widget ────────────────────────────────────────────────────
export function WitchCalendarWidget() {
  const sabbats = [
    { name: 'Beltane', date: '01/05', emoji: '🌸', desc: 'Fertilidade e Vida' },
    { name: 'Litha', date: '21/06', emoji: '☀️', desc: 'Solstício de Verão' },
    { name: 'Lammas', date: '01/08', emoji: '🌾', desc: 'Primeira Colheita' },
    { name: 'Mabon', date: '22/09', emoji: '🍂', desc: 'Equinócio Outono' },
    { name: 'Samhain', date: '31/10', emoji: '🎃', desc: 'Véu Fino' },
    { name: 'Yule', date: '21/12', emoji: '❄️', desc: 'Solstício de Inverno' },
  ];

  const now = new Date();
  const nextSabbat = sabbats.find(s => {
    const [d, m] = s.date.split('/').map(Number);
    return new Date(now.getFullYear(), m - 1, d) >= now;
  }) || sabbats[0];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg hover:border-purple-500/30 transition-all">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Calendário Bruxo</span>
      </div>
      <div className="text-center mb-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
        <p className="text-xs text-purple-400 mb-1">Próximo Sabbat</p>
        <div className="text-3xl mb-1 drop-shadow-lg">{nextSabbat.emoji}</div>
        <p className="font-serif text-slate-200">{nextSabbat.name}</p>
        <p className="text-xs text-slate-400">{nextSabbat.date} • {nextSabbat.desc}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {sabbats.map((s, i) => (
          <div key={i} className={`text-center p-2 rounded-xl text-xs transition-colors ${s.name === nextSabbat.name ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300' : 'text-slate-500 hover:bg-white/5'}`}>
            <div>{s.emoji}</div>
            <div className="font-medium mt-1">{s.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
