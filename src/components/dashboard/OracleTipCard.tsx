import React, { useState, useEffect } from 'react';
import { HelpCircle, Star, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const ORACLE_TIPS = [
  {
    type: 'dica',
    title: 'Leitura com Inteligência Artificial',
    content: 'Fale diretamente com os mestres e oráculos acessando a Leitura do Oráculo — as estrelas guiarão suas respostas.'
  },
  {
    type: 'dica',
    title: 'Altar Místico & Perfil',
    content: 'Atualize seu Altar Místico em seu perfil para sincronizar suas afinidades e selar suas insígnias mágicas.'
  },
  {
    type: 'dica',
    title: 'Desafios & Jornada',
    content: 'Complete seus desafios diários para acumular experiência (XP) e elevar seu grau iniciático frente ao templo.'
  },
  {
    type: 'dica',
    title: 'Seu Grimório Pessoal',
    content: 'O Grimório Pessoal é seu espaço celestial seguro para registrar intuições, rituais e leituras diárias realizadas.'
  },
  {
    type: 'dica',
    title: 'A Biblioteca Mística',
    content: 'Consulte a Biblioteca de rituais para adquirir novos grimórios e ensinamentos criados por outros sacerdotes do santuário.'
  },
  {
    type: 'dica',
    title: 'Certificados de Mestria',
    content: 'Acompanhe seus certificados na sala de maestria para validar suas formações espirituais e coroar suas conquistas.'
  },
  {
    type: 'motivacional',
    title: 'Alinhamento da Intuição',
    content: 'Que o éter ilumine sua intuição hoje. A maior sabedoria está no silêncio entre as leituras astrológicas.'
  },
  {
    type: 'motivacional',
    title: 'Sutilezas Cósmicas',
    content: 'A verdadeira magia não reside no acaso mecânico, mas sim na sua capacidade de decifrar as sincronicidades do universo.'
  },
  {
    type: 'motivacional',
    title: 'Paciência e Sincronia',
    content: 'A pressa fragmenta a energia. Respire fundo, mentalize sua dúvida e permita a revelação mística se desdobrar.'
  },
  {
    type: 'motivacional',
    title: 'Símbolos Despertos',
    content: 'Cada arcano e símbolo encontrado em seu caminho funciona como um espelho de uma verdade que já habita em você.'
  },
  {
    type: 'motivacional',
    title: 'Soberania Astral',
    content: 'Os astros influenciam e sugerem inclinações, mas o livre-arbítrio determina a órbita final de sua mente.'
  },
  {
    type: 'motivacional',
    title: 'Chama Interior',
    content: 'Não tema o escuro do desconhecido; sua chama interna de buscador é suficiente para banhar qualquer encruzilhada.'
  }
];

export function OracleTipCard() {
  const [activeTip, setActiveTip] = useState(ORACLE_TIPS[0]);
  const [hoursLeft, setHoursLeft] = useState(24);

  useEffect(() => {
    const fetchOracleTip = () => {
      const storedTipData = localStorage.getItem('oracle_tip_data');
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;

      if (storedTipData) {
        try {
          const parsed = JSON.parse(storedTipData);
          const timeElapsed = now - parsed.timestamp;

          if (timeElapsed < dayInMs) {
            setActiveTip(parsed.tip);
            const remainingHours = Math.max(1, Math.ceil((dayInMs - timeElapsed) / (1000 * 60 * 60)));
            setHoursLeft(remainingHours);
            return;
          }
        } catch (e) {
          console.error("Erro ao ler dado de cache:", e);
        }
      }

      // If no valid cached tip or 24h passed, pick a new one
      const randomIndex = Math.floor(Math.random() * ORACLE_TIPS.length);
      const newTip = ORACLE_TIPS[randomIndex];
      
      localStorage.setItem('oracle_tip_data', JSON.stringify({
        tip: newTip,
        timestamp: now
      }));
      
      setActiveTip(newTip);
      setHoursLeft(24);
    };

    fetchOracleTip();
    // Refresh check occasionally
    const interval = setInterval(fetchOracleTip, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="oracle-tip-widget" className="glass-panel p-6 rounded-2xl relative overflow-hidden group h-full flex flex-col justify-between">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at bottom right, var(--theme-primary-500) 0%, transparent 80%)', opacity: 0.12 }} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl border border-indigo-500/20 bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-indigo-400 rotate-12 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Conselho Diário</h4>
              <h3 className="text-sm font-semibold text-slate-300 font-serif">Dica do Oráculo</h3>
            </div>
          </div>
          <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
            {activeTip.type === 'dica' ? 'Dica' : 'Inovação'}
          </span>
        </div>

        <div className="space-y-2 py-1">
          <h5 className="text-sm font-semibold text-slate-200 font-serif flex items-center gap-1.5">
            {activeTip.title}
          </h5>
          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            {activeTip.content}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Alinhamento em: ~{hoursLeft}h</span>
        <div className="flex items-center gap-1 text-indigo-400/80 group-hover:text-indigo-300 transition-colors">
          <span>Praticar Sabedoria</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
