import React, { useState, useMemo, useEffect } from 'react';
import Markdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from 'recharts';
import { 
  DollarSign, TrendingUp, Calendar, Filter, Sparkles, 
  ShoppingBag, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart3, HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES = [
  { id: 'all', label: 'Todas as Categorias' },
  { id: 'books', label: 'Livros & Grimórios' },
  { id: 'jewelry', label: 'Joias & Amuletos' },
  { id: 'instruments', label: 'Oráculos & Ferramentas' },
  { id: 'consultations', label: 'Serviços & Consultas' },
  { id: 'alchemy', label: 'Perfumes & Alquimia' },
  { id: 'other', label: 'Relíquias Diversas' }
];

interface SaleTransaction {
  id: string;
  title: string;
  category: string;
  timestamp: string; // ISO or date string
  price: number;
  buyerName: string;
  platform: 'Mercado Pago' | 'Créditos Oráculo';
  status: 'Aprovado' | 'Pendente' | 'Sandbox';
}

// Generate rich mock sales data across the last 30 days
const generateMockSales = (): SaleTransaction[] => {
  const buyers = [
    'Aline S.', 'Gael M.', 'Lúcia D.', 'Nicolas F.', 'Kaelen R.', 
    'Morgana L.', 'Isis V.', 'Hermes P.', 'Gabriel C.', 'Hathor M.'
  ];
  
  const items = [
    { title: 'Grimório das Runas Ancestrais', category: 'books', basePrice: 89.90 },
    { title: 'Amuleto Solares de Proteção', category: 'jewelry', basePrice: 120.00 },
    { title: 'Oráculo das 7 Esferas Cósmicas', category: 'instruments', basePrice: 145.00 },
    { title: 'Perfume Alquímico de Vênus', category: 'alchemy', basePrice: 68.00 },
    { title: 'Consulta de Mapa Astral Direta', category: 'consultations', basePrice: 250.00 },
    { title: 'Relíquia Homúnculo de Prata', category: 'other', basePrice: 320.00 },
    { title: 'Livro Secreto da Kabbalah Hermética', category: 'books', basePrice: 110.00 },
    { title: 'Pêndulo de Cristal Ametista', category: 'instruments', basePrice: 55.00 },
    { title: 'Sérum Oracular Foco & Visão', category: 'alchemy', basePrice: 79.90 },
    { title: 'Alinhamento de Chacras & Aura', category: 'consultations', basePrice: 180.00 }
  ];

  const sales: SaleTransaction[] = [];
  const now = new Date();

  // Create ~45 random historical sales spread across 30 days
  for (let i = 0; i < 45; i++) {
    const daysAgo = Math.floor(Math.sin(i / 3) * 12 + 15); // Spread across month
    const saleDate = new Date();
    saleDate.setDate(now.getDate() - daysAgo);

    const item = items[i % items.length];
    const buyer = buyers[Math.floor(Math.random() * buyers.length)];
    const priceVariance = (Math.random() * 0.2 - 0.1) * item.basePrice; // +/- 10%
    const finalPrice = Math.round((item.basePrice + priceVariance) * 100) / 100;
    
    // Mix payment gateway sources & statuses
    const isSandboxValue = i % 5 === 0;
    const isMp = i % 3 !== 0;

    sales.push({
      id: `TXT-${12903 + i}`,
      title: item.title,
      category: item.category,
      timestamp: saleDate.toISOString(),
      price: finalPrice,
      buyerName: buyer,
      platform: isMp ? 'Mercado Pago' : 'Créditos Oráculo',
      status: isSandboxValue ? 'Sandbox' : 'Aprovado'
    });
  }

  // Sort chronologically
  return sales.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

const MOCK_SALES_RECORDS = generateMockSales();

export function RevenueReport() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('30d');
  
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  
  // Exclude today for stability, calculate boundary
  const daysBoundary = timeRange === '7d' ? 7 : 30;

  // Filter local state based on active filters
  const filteredSales = useMemo(() => {
    const boundaryDate = new Date();
    boundaryDate.setDate(boundaryDate.getDate() - daysBoundary);

    return MOCK_SALES_RECORDS.filter(sale => {
      const saleDate = new Date(sale.timestamp);
      const isWithinTime = saleDate >= boundaryDate;
      const isWithinCategory = selectedCategory === 'all' || sale.category === selectedCategory;
      return isWithinTime && isWithinCategory;
    });
  }, [selectedCategory, daysBoundary]);

  // Automatic trigger of Gemini Analysis
  const generateAiSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch('/api/ai/analyze-revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ salesData: filteredSales })
      });
      const data = await res.json();
      if (data && data.summary) {
        setAiSummary(data.summary);
      }
    } catch (err) {
      console.error("Erro ao sintonizar resumo da IA:", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (filteredSales.length > 0) {
      generateAiSummary();
    }
  }, [filteredSales]);

  // PDF Export and formatting function
  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Header banner
    doc.setFillColor(13, 9, 26); // Cosmic Dark
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("MERCADO MISTICO - ANÁLISE DE RECEITA", 14, 18);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(165, 180, 252);
    doc.text(`Periodo de Analise: Ultimos ${daysBoundary} Dias | Filtro de Categorias: ${selectedCategory === 'all' ? 'Todas' : selectedCategory}`, 14, 28);
    
    // KPI summary table
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(14, 48, 182, 38, 3, 3, 'F');
    
    doc.setTextColor(51, 65, 85);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("RESUMO EXECUTIVO DO FATURAMENTO", 18, 56);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Receita Integrada Total: R$ ${kpis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 18, 66);
    doc.text(`Volume de Vendas: ${kpis.totalSalesCount} transacoes`, 18, 72);
    doc.text(`Ticket Medio por Troca: R$ ${kpis.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 18, 78);
    
    // Transactions Table Title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("HISTORICO DE TRANSACOES RECENTES (ÚLTIMOS CASOS)", 14, 100);
    
    // Table header
    doc.setFillColor(15, 23, 42);
    doc.rect(14, 104, 182, 8, 'F');
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("ID", 16, 109);
    doc.text("CONTRATO / PRODUTO", 40, 109);
    doc.text("COMPRADOR", 110, 109);
    doc.text("CANAL", 150, 109);
    doc.text("VALOR", 175, 109);
    
    // Table content lines
    let yIdx = 118;
    doc.setTextColor(51, 65, 85);
    doc.setFont("Helvetica", "normal");
    
    // Slice latest 18 events to fit nicely on the document
    const salesToRender = filteredSales.slice(-18).reverse();
    
    salesToRender.forEach((sale, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, yIdx - 4, 182, 7, 'F');
      }
      
      doc.setFont("Courier", "normal");
      doc.setFontSize(7);
      doc.text(sale.id, 16, yIdx);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      
      const titleCleaned = sale.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const buyerCleaned = sale.buyerName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      doc.text(titleCleaned.length > 35 ? titleCleaned.substring(0, 32) + "..." : titleCleaned, 40, yIdx);
      doc.text(buyerCleaned, 110, yIdx);
      
      doc.setFont("Courier", "bold");
      doc.text(sale.platform, 150, yIdx);
      
      doc.setFont("Helvetica", "bold");
      doc.text(`R$ ${sale.price.toFixed(2)}`, 175, yIdx);
      
      yIdx += 8;
      
      if (yIdx > 275) {
        doc.addPage();
        yIdx = 20;
      }
    });

    doc.save(`Faturamento-Oraculo-MP-${timeRange}.pdf`);
  };

  // KPIs
  const kpis = useMemo(() => {
    const total = filteredSales.reduce((sum, item) => sum + item.price, 0);
    const mpTotal = filteredSales.filter(v => v.platform === 'Mercado Pago').reduce((sum, item) => sum + item.price, 0);
    const count = filteredSales.length;
    const avg = count > 0 ? total / count : 0;
    
    return {
      totalRevenue: total,
      totalSalesCount: count,
      avgTicket: avg,
      mercadoPagoShare: count > 0 ? (mpTotal / total) * 100 : 0
    };
  }, [filteredSales]);

  // Chart 1: Revenue Over Time
  const revenueTrendData = useMemo(() => {
    const dailyMap: Record<string, number> = {};
    const now = new Date();

    // Initialize all days in range to 0
    for (let i = daysBoundary - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      dailyMap[key] = 0;
    }

    // Accumulate actual revenues
    filteredSales.forEach(sale => {
      const key = new Date(sale.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      if (dailyMap[key] !== undefined) {
        dailyMap[key] += sale.price;
      }
    });

    const data = Object.entries(dailyMap).map(([date, revenue]) => ({
      date,
      vendas: Math.round(revenue * 100) / 100
    }));

    // Calculate cumulative sum for helper area
    let cumulative = 0;
    return data.map(pt => {
      cumulative += pt.vendas;
      return {
        ...pt,
        acumulado: Math.round(cumulative * 100) / 100
      };
    });
  }, [filteredSales, daysBoundary]);

  // Chart 2: Share by Category
  const categorySplitData = useMemo(() => {
    const counts: Record<string, { name: string, value: number, color: string }> = {
      books: { name: 'Grimórios', value: 0, color: '#6366f1' },
      jewelry: { name: 'Amuletos', value: 0, color: '#ec4899' },
      instruments: { name: 'Oráculos', value: 0, color: '#f59e0b' },
      consultations: { name: 'Serviços', value: 0, color: '#10b981' },
      alchemy: { name: 'Alquimia', value: 0, color: '#06b6d4' },
      other: { name: 'Outros', value: 0, color: '#8b5cf6' }
    };

    filteredSales.forEach(sale => {
      if (counts[sale.category]) {
        counts[sale.category].value += sale.price;
      }
    });

    return Object.values(counts)
      .filter(item => item.value > 0)
      .map(item => ({
        ...item,
        value: Math.round(item.value * 100) / 100
      }));
  }, [filteredSales]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full">
      {/* Intro Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-serif font-black text-slate-100 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-400" /> Relatórios de Receita
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Análise e rastreamento de vendas no Mercado Místico integrada com faturamento espiritual do Mercado Pago.
          </p>
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 self-stretch lg:self-auto">
          {/* PDF Export Action */}
          <button 
            onClick={exportPDF}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
            title="Gerar Resumo em PDF do Relatório de Vendas"
          >
            Exportar PDF
          </button>

          {/* Time range switcher */}
          <div className="bg-black/40 border border-white/10 p-1 rounded-xl flex items-center shrink-0">
            <button 
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === '7d' ? 'bg-indigo-600 shadow text-white' : 'text-slate-400 hover:text-white'}`}
            >
              7 Dias
            </button>
            <button 
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === '30d' ? 'bg-indigo-600 shadow text-white' : 'text-slate-400 hover:text-white'}`}
            >
              30 Dias
            </button>
          </div>

          {/* Category drop selection */}
          <div className="relative flex items-center bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 w-full sm:w-auto shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-200 cursor-pointer pr-4 font-medium"
            >
              {CATEGORIES.map(category => (
                <option key={category.id} value={category.id} className="bg-slate-950 text-slate-200">
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#110d21]/40 to-black relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-emerald-500/10">
            <DollarSign className="w-12 h-12" />
          </div>
          <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest block">Receita Integrada</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-400">R$ {kpis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
              <ArrowUpRight className="w-2.5 h-2.5" /> +14.8%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Valor bruto transmutado</p>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#110d21]/40 to-black relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-indigo-500/10">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest block">Volume de Vendas</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-indigo-300">{kpis.totalSalesCount} transações</span>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
              <ArrowUpRight className="w-2.5 h-2.5" /> +8.3%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Unidades sagradas entregues</p>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#110d21]/40 to-black relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-amber-500/10">
            <Sparkles className="w-12 h-12" />
          </div>
          <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest block">Ticket Médio</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-amber-400">R$ {kpis.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-[10px] text-slate-400 font-mono">Médio</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Média por troca oracular</p>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#110d21]/40 to-black relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-cyan-500/10">
            <TrendingUp className="w-12 h-12" />
          </div>
          <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest block">Participação MP</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-cyan-300">{kpis.mercadoPagoShare.toFixed(1)}%</span>
            <span className="text-[10px] text-emerald-400 font-black">Online</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Taxa de preferência Mercado Pago</p>
        </div>
      </div>

      {/* AI Automated Forecast & Summary Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-[2.2rem] border border-indigo-500/15 bg-gradient-to-br from-[#120930]/30 via-slate-950/40 to-black relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 blur-xl opacity-30 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 border-b border-indigo-500/10 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-serif font-black text-slate-100 flex items-center gap-2">
                Análise de Previsões Oraculares por IA
              </h3>
              <p className="text-xs text-slate-400">Canalizações herméticas das tendências financeiras das últimas semanas</p>
            </div>
          </div>

          <button
            onClick={generateAiSummary}
            disabled={loadingSummary}
            className="px-5 py-2.5 bg-indigo-600/15 hover:bg-indigo-600/30 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#a5b4fc] transition-all flex items-center gap-2"
          >
            {loadingSummary ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
            Sintonizar IA Oracular
          </button>
        </div>

        {loadingSummary ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-[11px] text-indigo-300 font-mono tracking-widest animate-pulse">LENDO AS FORÇAS DA LIQUIDEZ CELESTIAL...</p>
          </div>
        ) : aiSummary ? (
          <div className="text-sm text-slate-300 leading-relaxed font-light prose prose-invert prose-indigo max-w-none">
            <Markdown>{aiSummary}</Markdown>
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 text-xs">
            Nenhuma canalização gerada ainda. Clique no botão acima para sintonizar a inteligência artificial.
          </div>
        )}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/5 bg-black/30 relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-serif font-black text-slate-100 flex items-center gap-2">
                Curva Temporal de Vendas <TrendingUp className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400">Total transacionado nominal acumulado diariamente</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="cumulativeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d091a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#e2e8f0', fontSize: '11px' }}
                  labelStyle={{ color: '#6366f1', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
                  formatter={(value: any) => [`R$ ${parseFloat(value).toFixed(2)}`, '']}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="vendas" name="Faturamento Diário" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#revenueGrad)" />
                <Area type="monotone" dataKey="acumulado" name="Total Acumulado" stroke="#6366f1" strokeWidth={1} strokeDasharray="4 4" fillOpacity={1} fill="url(#cumulativeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Share Bar Chart */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/5 bg-black/30 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-serif font-black text-slate-100 mb-1">
              Faturamento por Categoria
            </h3>
            <p className="text-xs text-slate-400 mb-6">Divisão de receita gerada por tipo de artefato</p>
          </div>

          <div className="h-56 w-full">
            {categorySplitData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Nenhum dado com os filtros atuais.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySplitData} layout="vertical" margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#e2e8f0', fontSize: 10 }} width={70} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d091a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#e2e8f0', fontSize: '11px' }}
                    formatter={(value: any) => `R$ ${parseFloat(value).toFixed(2)}`}
                  />
                  <Bar dataKey="value" name="Total" radius={[0, 4, 4, 0]}>
                    {categorySplitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            {categorySplitData.slice(0, 4).map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: R$ {Math.round(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Transaction History Table */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-black/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-serif font-black text-slate-100">
              Histórico de Vendas (Mercado Pago / Oráculo)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Lista das transações registradas no ecossistema de ensino e produtos.
            </p>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {filteredSales.length} transações encontradas
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">ID Transação</th>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Comprador</th>
                <th className="py-3 px-4 text-center">Via</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Data</th>
                <th className="py-3 px-4 text-right">Preço</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSales.slice().reverse().map((sale) => (
                <tr key={sale.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3.5 px-4 font-mono text-indigo-400 text-[11px]">{sale.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-100 group-hover:text-amber-400 transition-colors">{sale.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] capitalize text-slate-400">
                      {CATEGORIES.find(c => c.id === sale.category)?.label.split(' ')[0] || sale.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{sale.buyerName}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${sale.platform === 'Mercado Pago' ? 'bg-[#009ee3]/10 border border-[#009ee3]/20 text-[#009ee3]' : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'}`}>
                      {sale.platform}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-black ${
                      sale.status === 'Aprovado' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${sale.status === 'Aprovado' ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-500 text-[11px] font-mono">
                    {new Date(sale.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-200">
                    R$ {sale.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
