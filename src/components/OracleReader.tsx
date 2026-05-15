import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Save, Book, Loader2, Play, ThumbsUp, ThumbsDown, Lock } from 'lucide-react';
import Markdown from 'react-markdown';
import { SectionLock } from './ui/SectionLock';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function OracleReader({ profile, setProfile, addGrimoireEntry, currentUser }: any) {
  const [question, setQuestion] = useState('');
  const [spreadType, setSpreadType] = useState('Tarot (3-Card)');
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<{cards: string[], interpretation: string} | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const isLocked = !currentUser?.isPaid;

  const handleAsk = async () => {
    if (!question.trim() || isLocked) return;
    setLoading(true);
    setReading(null);
    setFeedback(null);

    try {
      const prompt = `Você é um místico Oráculo e leitor de Tarot/Lenormand. 
O usuário pergunta: "${question}"
Tipo de tiragem solicitada: ${spreadType}.
1. Tire aleatoriamente as cartas apropriadas para esta tiragem.
2. Forneça uma interpretação envolvente e perspicaz das cartas em relação à pergunta (em Português do Brasil).
3. Retorne a resposta em formato JSON correspondente a este schema: 
{ "cards": ["Carta 1", "Carta 2"...], "interpretation": "Interpretação mística detalhada... (use Markdown para formatação)" }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      const result = JSON.parse(text);
      setReading(result);

      // Award XP for doing a reading
      setProfile((prev: any) => ({ ...prev, xp: prev.xp + 50 }));

      // Add to grimoire
      addGrimoireEntry({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        question,
        spreadType,
        cards: result.cards,
        interpretation: result.interpretation
      });

    } catch (error) {
      console.error(error);
      alert("A visão do Oráculo está turva no momento. Por favor tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 relative">
      <SectionLock isPaid={currentUser?.isPaid} className="absolute top-8 right-4" />
      <div className="mb-8 text-center pt-8">
        <h2 className="text-4xl md:text-5xl font-serif text-slate-100 gold-text tracking-wider uppercase mb-3">Consulte o Oráculo</h2>
        <p className="text-slate-400">Faça sua pergunta e receba a orientação cósmica.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl mb-8 relative overflow-hidden group">
        {isLocked && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-2xl">
            <Lock className="w-12 h-12 text-rose-400 mb-4 opacity-80" />
            <h3 className="text-xl font-serif text-slate-200 mb-2">Oráculo Restrito</h3>
            <p className="text-sm text-slate-400 mb-6 text-center max-w-xs">Destrave o acesso ao Oráculo adquirindo a assinatura Premium.</p>
            <button className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-full text-sm uppercase tracking-wider">
              Assinar Plano
            </button>
          </div>
        )}

        <div className={`${isLocked ? 'opacity-30 pointer-events-none' : ''}`}>
          <textarea 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Que sabedoria você procura?"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500/50 transition-colors resize-none h-32 mb-4"
          />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <select 
              value={spreadType}
              onChange={(e) => setSpreadType(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
            >
              <option>Tarot (1 Carta)</option>
              <option>Tarot (3 Cartas Passado/Presente/Futuro)</option>
              <option>Lenormand (Tiragem de 3 Cartas)</option>
              <option>Oráculo (Conselho Diário)</option>
            </select>

            <button 
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Consultar o Oráculo
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {reading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
               <span className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30">
                 +50 XP Concedido
               </span>
            </div>
            <h3 className="text-xl font-serif text-slate-100 mb-6 border-b border-white/10 pb-4">As Cartas Tiradas</h3>
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              {reading.cards.map((card, i) => (
                <div key={i} className="w-40 h-64 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl flex items-center justify-center p-4 text-center shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
                  <span className="font-serif text-slate-200">{card}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-serif text-slate-100 mb-4 border-b border-white/10 pb-4">A Interpretação do Oráculo</h3>
            <div className="prose prose-invert max-w-none text-slate-300">
               <Markdown>{reading.interpretation}</Markdown>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <span className="text-sm text-slate-400">A interpretação foi útil?</span>
                <button 
                  onClick={() => setFeedback('up')} 
                  className={`p-2 rounded-full transition-colors ${feedback === 'up' ? 'bg-indigo-500/30 text-indigo-300' : 'hover:bg-white/5 text-slate-400'}`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setFeedback('down')} 
                  className={`p-2 rounded-full transition-colors ${feedback === 'down' ? 'bg-indigo-500/30 text-indigo-300' : 'hover:bg-white/5 text-slate-400'}`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-indigo-400 flex items-center gap-2">
                <Save className="w-4 h-4" /> Salvo automaticamente em seu Grimório
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
