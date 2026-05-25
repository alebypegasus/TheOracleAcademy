import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Sparkles } from 'lucide-react';

import { Header } from '../../components/layout/Header';
import { CurrentCourseCard } from '../../components/dashboard/CurrentCourseCard';
import { CalendarWidget } from '../../components/dashboard/CalendarWidget';
import { StudyStreakCard } from '../../components/dashboard/StudyStreakCard';
import { DailyChallenges } from '../../components/dashboard/DailyChallenges';
import { DailyWordCard } from '../../components/dashboard/DailyWordCard';
import { OracleTipCard } from '../../components/dashboard/OracleTipCard';
import { AIStudyPlanCard } from '../../components/dashboard/AIStudyPlanCard';
import { XPGrowthChartCard } from '../../components/dashboard/XPGrowthChartCard';
import { RevenueReport } from '../../components/dashboard/RevenueReport';

const cardBaseStyle = "bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] relative overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/20";

// Custom Card Wrapper to replace MagicCard without height constraints
const DashboardCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`${cardBaseStyle} ${className || ''}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    {children}
  </div>
);

interface DashboardPageProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  profile: any;
  setProfile: (p: any) => void;
  currentUser: any;
  isZenMode: boolean;
  setIsMobileMenuOpen: (o: boolean) => void;
  grimoireEntries: any[];
  addGrimoireEntry: (e: any) => void;
  challenges: any;
}

export default function DashboardPage({
  searchQuery,
  setSearchQuery,
  profile,
  setProfile,
  currentUser,
  isZenMode,
  setIsMobileMenuOpen,
  grimoireEntries,
  addGrimoireEntry,
  challenges
}: DashboardPageProps) {
  const navigate = useNavigate();
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'revenue'>('overview');
  const [greeting, setGreeting] = useState('');
  const [GreetingIcon, setGreetingIcon] = useState<any>(Sun);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bom dia');
      setGreetingIcon(Sun);
    } else if (hour < 18) {
      setGreeting('Boa tarde');
      setGreetingIcon(Sun);
    } else {
      setGreeting('Boa noite');
      setGreetingIcon(Moon);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5, ease: "easeOut" }} 
      className="max-w-7xl mx-auto w-full pb-20 px-4 md:px-8"
    >
      {!isZenMode && (
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          profile={profile} 
          currentUser={currentUser} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />
      )}

      {/* Personalized Greeting Header */}
      {!isZenMode && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 mb-8"
        >
          <div className="flex items-center gap-3 text-slate-400 mb-1">
            <GreetingIcon className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium tracking-wide uppercase">{greeting},</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-slate-100 flex items-center gap-4">
            {currentUser?.name || 'Mestre Oculto'}
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl leading-relaxed">
            Sua egrégora de estudos está pronta. Que os oráculos guiem sua intuição na jornada de hoje.
          </p>
        </motion.div>
      )}
      
      {!isZenMode && (currentUser?.role === 'vendedor' || currentUser?.role === 'admin') && (
        <div className="flex border-b border-white/10 gap-8 mt-2 mb-8">
          <button 
            onClick={() => setDashboardTab('overview')}
            className={`pb-4 px-2 text-sm font-bold relative transition-colors ${dashboardTab === 'overview' ? 'text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Painel de Estudos
            {dashboardTab === 'overview' && (
              <motion.div layoutId="dashboardTabActive" className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            )}
          </button>
          <button 
            onClick={() => setDashboardTab('revenue')}
            className={`pb-4 px-2 text-sm font-bold relative transition-colors ${dashboardTab === 'revenue' ? 'text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Relatórios de Receita
            {dashboardTab === 'revenue' && (
              <motion.div layoutId="dashboardTabActive" className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            )}
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {dashboardTab === 'overview' || (currentUser?.role !== 'vendedor' && currentUser?.role !== 'admin') ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {/* Top Row: Course Focus (Span 8) and Calendar (Span 4) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="md:col-span-12 lg:col-span-8 flex"
            >
              <DashboardCard className="w-full">
                <CurrentCourseCard searchQuery={searchQuery} currentUser={currentUser} onNavigate={(path) => navigate(path)} />
              </DashboardCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-12 lg:col-span-4 flex"
            >
              <DashboardCard className="w-full">
                <CalendarWidget grimoireEntries={grimoireEntries} addGrimoireEntry={addGrimoireEntry} />
              </DashboardCard>
            </motion.div>

            {/* Daily Challenges (Span 12) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-12 flex"
            >
              <DashboardCard className="w-full">
                <DailyChallenges 
                  onNavigate={(path: string) => navigate(path)} 
                  profile={profile} 
                  grimoireEntries={grimoireEntries} 
                  currentUser={currentUser} 
                  challenges={challenges} 
                />
              </DashboardCard>
            </motion.div>

            {/* Streak (Span 4) and XP Growth (Span 8) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-12 lg:col-span-4 flex"
            >
              <DashboardCard className="w-full">
                <StudyStreakCard />
              </DashboardCard>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-12 lg:col-span-8 flex"
            >
              <DashboardCard className="w-full">
                <XPGrowthChartCard profile={profile} />
              </DashboardCard>
            </motion.div>
            
            {/* Daily Word & Oracle Tip (Span 6 each) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
              className="md:col-span-12 lg:col-span-6 flex"
            >
              <DashboardCard className="w-full">
                <DailyWordCard />
              </DashboardCard>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
              className="md:col-span-12 lg:col-span-6 flex"
            >
              <DashboardCard className="w-full">
                <OracleTipCard />
              </DashboardCard>
            </motion.div>

            {/* AI Study Plan (Span 12) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
              className="md:col-span-12 flex"
            >
              <DashboardCard className="w-full">
                <AIStudyPlanCard currentUser={currentUser} profile={profile} setProfile={setProfile} />
              </DashboardCard>
            </motion.div>
            
          </motion.div>
        ) : (
          <motion.div
            key="revenue"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <DashboardCard className="p-1">
               <RevenueReport />
            </DashboardCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
