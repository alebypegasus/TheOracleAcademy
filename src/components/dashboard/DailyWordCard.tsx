import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const SPIRITUAL_WORDS = [
  { word: "Sincronicidade", reflection: "A vida não é feita de coincidências, mas de fluxos perfeitos orquestrados pelo universo." },
  { word: "Intuição", reflection: "A voz suave da sua alma que transcende a lógica e conhece o caminho antes da mente." },
  { word: "Despertar", reflection: "Abrir os olhos além do véu da ilusão e reconhecer a divindade em si mesmo e no todo." },
  { word: "Transmutação", reflection: "A arte alquímica de transformar as energias densas em pura luz de consciência." },
  { word: "Serenidade", reflection: "O silêncio interior que permanece inabalável, independentemente das tempestades externas." },
  { word: "Plenitude", reflection: "O estado de ser completo no momento presente, onde nada falta e tudo flui." },
  { word: "Gratidão", reflection: "A força magnética que atrai milagres e sintoniza seu coração na frequência da abundância." },
  { word: "Equilíbrio", reflection: "Caminhar no fio da navalha entre a luz e a sombra, aceitando e integrando ambas as partes." }
];

export function DailyWordCard() {
  const [dailyWord, setDailyWord] = useState(SPIRITUAL_WORDS[0]);

  useEffect(() => {
    // Calcula um índice baseado no dia do ano
    const date = new Date();
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % SPIRITUAL_WORDS.length;
    setDailyWord(SPIRITUAL_WORDS[index]);
  }, []);

  return (
    <div className="h-full w-full p-6 relative overflow-hidden group flex flex-col">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, var(--theme-primary-500) 0%, transparent 70%)', opacity: 0.15 }} />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2">Palavra Diária</h3>
        <p className="text-2xl font-serif text-slate-100 mb-3">{dailyWord.word}</p>
        <p className="text-sm text-slate-400 italic">"{dailyWord.reflection}"</p>
      </div>
    </div>
  );
}

