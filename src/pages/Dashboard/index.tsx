import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      transition={{ duration: 0.3 }} 
      className="max-w-7xl mx-auto w-full"
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
      
      {!isZenMode && (currentUser?.role === 'vendedor' || currentUser?.role === 'admin') && (
        <div className="flex border-b border-white/5 gap-6 mt-6 mb-8">
          <button 
            onClick={() => setDashboardTab('overview')}
            className={`pb-4 px-1 text-sm font-bold relative transition-colors ${dashboardTab === 'overview' ? 'text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Painel de Estudos
            {dashboardTab === 'overview' && (
              <motion.div layoutId="dashboardTabActive" className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setDashboardTab('revenue')}
            className={`pb-4 px-1 text-sm font-bold relative transition-colors ${dashboardTab === 'revenue' ? 'text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Relatórios de Receita
            {dashboardTab === 'revenue' && (
              <motion.div layoutId="dashboardTabActive" className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-full" />
            )}
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {dashboardTab === 'overview' || (currentUser?.role !== 'vendedor' && currentUser?.role !== 'admin') ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Row 1: Course and Calendar */}
            <div className="lg:col-span-8">
              <CurrentCourseCard searchQuery={searchQuery} currentUser={currentUser} onNavigate={(path) => navigate(path)} />
            </div>
            <div className="lg:col-span-4">
              <CalendarWidget grimoireEntries={grimoireEntries} addGrimoireEntry={addGrimoireEntry} />
            </div>

            {/* Row 2: Daily Challenges (Full Width) */}
            <div className="lg:col-span-12">
              <DailyChallenges 
                onNavigate={(path: string) => navigate(path)} 
                profile={profile} 
                grimoireEntries={grimoireEntries} 
                currentUser={currentUser} 
                challenges={challenges} 
              />
            </div>

            {/* Row 3: Streak and Word / Oracle Tip */}
            <div className="lg:col-span-8">
              <StudyStreakCard />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <DailyWordCard />
              <OracleTipCard />
            </div>

            {/* Row 4: XP Growth Trend */}
            <div className="lg:col-span-12">
              <XPGrowthChartCard profile={profile} />
            </div>

            {/* Row 5: AI Personalized Study Plan (Full Width) */}
            <div className="lg:col-span-12">
              <AIStudyPlanCard currentUser={currentUser} profile={profile} setProfile={setProfile} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="revenue"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <RevenueReport />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
