import { BookOpen, Star, Crown, Flame, Sparkles, Droplets, CircleDot, Feather, Eye, Infinity as InfinityIcon, Wind } from 'lucide-react';

export const MODULES = [
  {
    level: 0,
    title: 'Módulo 0 — Fundamentos',
    desc: 'Obrigatório antes de qualquer oráculo. Evita prática superficial e confusão simbólica. Aprenda a base.',
    unlocked: true,
    bgGlow: 'bg-amber-500',
    nodes: [
      { id: 'fund-espirito', name: 'Natureza da Espiritualidade', desc: 'Espiritualidade, religião e ocultismo', icon: Crown, color: 'text-amber-400', tailwindColor: 'bg-amber-500' },
      { id: 'fund-magia', name: 'Estrutura da Magia', desc: 'Visão histórica, antropológica e correntes', icon: Sparkles, color: 'text-purple-400', tailwindColor: 'bg-purple-500' },
      { id: 'fund-altares', name: 'Altares e Consagração', desc: 'Como montar, consagrar ritualística e proteção', icon: Flame, color: 'text-rose-400', tailwindColor: 'bg-rose-500' },
    ]
  },
  {
    level: 1,
    title: 'Nível 1 — Oráculos Intuitivos',
    desc: 'Pouca estrutura, foco em percepção. Onde se aprende que intuição não é fantasia.',
    unlocked: true,
    bgGlow: 'bg-orange-500',
    nodes: [
      { id: 'leitura-velas', name: 'Leitura de Velas e Fumaça', desc: 'Piromancia, queima ritual, padrões', icon: Flame, color: 'text-orange-400', tailwindColor: 'bg-orange-500' },
      { id: 'leitura-agua', name: 'Água e Sombras', desc: 'Hidromancia, reflexos, visões', icon: Droplets, color: 'text-cyan-400', tailwindColor: 'bg-cyan-500' },
      { id: 'leitura-sorteios', name: 'Acaso e Pêndulo', desc: 'Dados, bibliomancia, radiestesia', icon: CircleDot, color: 'text-emerald-400', tailwindColor: 'bg-emerald-500' },
    ]
  },
  {
    level: 2,
    title: 'Nível 2 — Oráculos Simbólicos',
    desc: 'Sistemas leves e estruturados. Entra a disciplina interpretativa.',
    unlocked: false,
    bgGlow: 'bg-indigo-500',
    nodes: [
      { id: 'lenormand-kipper', name: 'Lenormand e Kipper', desc: 'Cartas objetivas e narrativa social', icon: BookOpen, color: 'text-indigo-400', tailwindColor: 'bg-indigo-500' },
      { id: 'runas-ogham', name: 'Runas e Ogham', desc: 'Sistemas nórdicos e celtas, alfabetos mágicos', icon: Feather, color: 'text-sky-400', tailwindColor: 'bg-sky-500' },
      { id: 'sibilla', name: 'Sibilla Italiana', desc: 'Narrativa emocional e prática de leitura', icon: Eye, color: 'text-pink-400', tailwindColor: 'bg-pink-500' },
    ]
  },
  {
    level: 3,
    title: 'Nível 3 — Oráculos Interpretativos',
    desc: 'Maior complexidade simbólica. Exigem interpretação profunda e associação.',
    unlocked: false,
    bgGlow: 'bg-purple-500',
    nodes: [
      { id: 'tarot', name: 'Tarot Clássico', desc: 'Sistema simbólico, arquétipos, numerologia', icon: Star, color: 'text-purple-400', tailwindColor: 'bg-purple-500' },
      { id: 'cafeomancia', name: 'Cafeomancia e Quiromancia', desc: 'Leitura de borras e linhas das mãos', icon: Droplets, color: 'text-amber-500', tailwindColor: 'bg-amber-600' },
      { id: 'oniromancia', name: 'Oniromancia e Geomancia', desc: 'Sonhos e 16 figuras astrológicas na terra', icon: Sparkles, color: 'text-blue-400', tailwindColor: 'bg-blue-500' },
    ]
  },
  {
    level: 4,
    title: 'Nível 4 — Sistemas Estruturados',
    desc: 'Sistemas avançados baseados em estrutura matemática, filosófica ou cosmológica.',
    unlocked: false,
    bgGlow: 'bg-emerald-500',
    nodes: [
      { id: 'iching', name: 'I Ching', desc: '64 hexagramas, filosofia taoísta profunda', icon: InfinityIcon, color: 'text-emerald-500', tailwindColor: 'bg-emerald-600' },
      { id: 'astrologias', name: 'Astrologias', desc: 'Ocidental, Chinesa, Védica (esforço de cálculo)', icon: Star, color: 'text-cyan-500', tailwindColor: 'bg-cyan-600' },
      { id: 'numerologia', name: 'Numerologia e Qi Men', desc: 'Estrutura matemática e estratégia chinesa', icon: BookOpen, color: 'text-indigo-500', tailwindColor: 'bg-indigo-600' },
    ]
  },
  {
    level: 5,
    title: 'Nível 5 — Oráculos Tradicionais',
    desc: 'Sistemas iniciáticos ligados a culturas religiosas específicas.',
    unlocked: false,
    bgGlow: 'bg-rose-500',
    nodes: [
      { id: 'ifa', name: 'Ifá e Búzios', desc: 'Sistema yorubá (Odus) e derivações oraculares', icon: Wind, color: 'text-orange-500', tailwindColor: 'bg-orange-600' },
      { id: 'obi', name: 'Obi e Diloggún', desc: 'Consulta simples à tradição viva', icon: Flame, color: 'text-rose-500', tailwindColor: 'bg-rose-600' },
      { id: 'prashna', name: 'Prashna Astrológico', desc: 'Astrologia horária e contextos religiosos antigos', icon: Eye, color: 'text-purple-500', tailwindColor: 'bg-purple-600' },
    ]
  },
  {
    level: 6,
    title: 'Nível 6 — Esotéricos e Rituais',
    desc: 'Oráculos mestres que envolvem alta magia, entidades ou alteração de consciência.',
    unlocked: false,
    bgGlow: 'bg-red-500',
    nodes: [
      { id: 'cabala', name: 'Oráculos Cabalísticos', desc: 'Árvore da Vida, geometria divina', icon: Crown, color: 'text-yellow-500', tailwindColor: 'bg-yellow-500' },
      { id: 'enochiano', name: 'Goécia e Enochiano', desc: 'Evocação, sistema mágico complexo', icon: Eye, color: 'text-red-500', tailwindColor: 'bg-red-600' },
      { id: 'hermetismo', name: 'Hermetismo e Necromancia', desc: 'Visões alteradas, rituais e ancestralidade', icon: Sparkles, color: 'text-indigo-400', tailwindColor: 'bg-indigo-500' },
    ]
  }
];

export const INNER_PATH = [
  { id: 1, type: 'lição', title: 'Teoria e Fundamentos', isCompleted: true, locked: false },
  { id: 2, type: 'lição', title: 'Prática Guiada', isCompleted: true, locked: false },
  { id: 3, type: 'lição', title: 'Erros Comuns', isCompleted: false, locked: false, isCurrent: true },
  { id: 4, type: 'lição', title: 'Visão Crítica', isCompleted: false, locked: false },
  { id: 5, type: 'desafio', title: 'Exercícios Práticos', isCompleted: false, locked: false },
  { id: 6, type: 'prova', title: 'Avaliação com IA', isCompleted: false, locked: false },
];
