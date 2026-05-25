import React, { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GrowthChartProps {
  profile: any;
}

export function XPGrowthChartCard({ profile }: GrowthChartProps) {
  const [particles, setParticles] = useState<{id: number, x: number, y: number}[]>([]);
  const [prevXp, setPrevXp] = useState(profile?.xp);

  useEffect(() => {
    if (profile?.xp !== prevXp) {
      if (profile?.xp > (prevXp || 0)) {
        // Create 10 particles
        const newParticles = Array.from({ length: 15 }).map((_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 60 - 30, // -30 to 30 spread
          y: Math.random() * -50 - 20, // shoot upwards
        }));
        setParticles(prev => [...prev, ...newParticles]);
        
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 1200);
      }
      setPrevXp(profile?.xp);
    }
  }, [profile?.xp, prevXp]);

  // Generate 30 days of mock trend data culminating in the current profile XP
  const trendData = useMemo(() => {
    const data = [];
    const now = new Date();
    let currentTotalXP = profile?.xp || 100;
    
    // Reverse engineer past 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      
      const dayLabel = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      
      // Simulate historical growth
      const dailyEarned = i === 0 ? 0 : Math.floor(Math.random() * 40);
      const pastTotal = currentTotalXP - (i * 15) - dailyEarned;
      const hours = (pastTotal * 0.05).toFixed(1); 
      
      data.push({
        date: dayLabel,
        xp: Math.max(0, pastTotal),
        hours: Math.max(0, parseFloat(hours))
      });
    }
    
    // Fix last data point to match current
    data[data.length - 1].xp = currentTotalXP;
    data[data.length - 1].hours = (currentTotalXP * 0.05).toFixed(1);
    
    return data;
  }, [profile?.xp]);

  return (
    <div className="h-full w-full p-6 relative overflow-hidden group flex flex-col">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none transition-opacity duration-700" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-serif font-medium text-slate-100 flex items-center gap-2">
            Evolução de Energia <TrendingUp className="w-5 h-5 text-indigo-400" />
          </h3>
          <p className="text-sm text-slate-400 mt-1">Sua trajetória de dedicação nos últimos 30 dias</p>
        </div>
        <div className="flex gap-4">
          <motion.div 
            key={profile?.xp}
            initial={{ scale: 1.1, backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
            animate={{ scale: 1, backgroundColor: 'transparent' }}
            transition={{ duration: 0.5 }}
            className="bg-black/20 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3 relative"
          >
            <div className="w-8 h-8 rounded-full premium-icon-container flex items-center justify-center border border-amber-500/20 relative">
              <Sparkles className="w-4 h-4 text-amber-400 z-10" />
              <AnimatePresence>
                {particles.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 0, x: p.x, y: p.y, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full z-0"
                  />
                ))}
              </AnimatePresence>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">XP Total</p>
              <p className="text-lg font-bold text-slate-200 leading-tight">{profile?.xp || 0}</p>
            </div>
          </motion.div>
          <div className="bg-[#0A0A0B] border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Horas de Estudo</p>
              <p className="text-lg font-bold text-slate-200 leading-tight">{((profile?.xp || 100) * 0.05).toFixed(1)}h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} minTickGap={20} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0d091a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 600 }}
              labelStyle={{ color: '#94a3b8', fontSize: '11px', marginBottom: '8px' }}
            />
            <Area type="monotone" dataKey="xp" name="XP Acumulado" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
