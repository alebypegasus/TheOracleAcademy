import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Bell, Menu } from 'lucide-react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { OracleReader } from './components/OracleReader';
import { GrimoireView } from './components/GrimoireView';
import { ChallengesView } from './components/ChallengesView';
import { LevelUpModal } from './components/LevelUpModal';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CurrentCourseCard } from './components/dashboard/CurrentCourseCard';
import { CalendarWidget } from './components/dashboard/CalendarWidget';
import { StudyStreakCard } from './components/dashboard/StudyStreakCard';
import { DailyChallenges } from './components/dashboard/DailyChallenges';
import { DailyWordCard } from './components/dashboard/DailyWordCard';
import { OracleTipCard } from './components/dashboard/OracleTipCard';
import { AIStudyPlanCard } from './components/dashboard/AIStudyPlanCard';
import { XPGrowthChartCard } from './components/dashboard/XPGrowthChartCard';
import { RevenueReport } from './components/dashboard/RevenueReport';

import { SettingsView } from './components/views/SettingsView';
import { LibraryView } from './components/views/LibraryView';
import { LandingPage } from './components/views/LandingPage';
import { SubscriptionView } from './components/views/SubscriptionView';
import { CommunityView } from './components/views/CommunityView';
import { ProfileView } from './components/views/ProfileView';
import { CertificatesView } from './components/views/CertificatesView';
import { CoursesView } from './components/views/CoursesView';
import { GuidelinesView } from './components/views/GuidelinesView';
import { SupportView } from './components/views/SupportView';
import { WorkspaceView } from './components/views/WorkspaceView';

import { saveGrimoireEntryLocal, getAllGrimoireEntriesLocal, saveStudyProgressLocal, getStudyProgressLocal, addToSyncQueue, getSyncQueue, clearSyncQueueItem } from './lib/idb';

function AppContent({
  isDarkMode, themePreference, setThemePreference, colorTheme, setColorTheme,
  profile, setProfile,
  grimoireEntries, setGrimoireEntries,
  addGrimoireEntry, updateGrimoireEntry, deleteGrimoireEntry,
  currentUser, setCurrentUser,
  challenges, setChallenges,
  savedBirthChart, setSavedBirthChart
}: any) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isZenMode, setIsZenMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'revenue'>('overview');
  
  const [prevXp, setPrevXp] = useState(profile.xp);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);

  useEffect(() => {
    if (profile.xp > prevXp) {
       const milestones = [200, 500, 1000, 2000, 5000];
       for (const ms of milestones) {
          if (prevXp < ms && profile.xp >= ms) {
             setCurrentMilestone(ms);
             setShowLevelUp(true);
             break;
          }
       }
    }
    setPrevXp(profile.xp);
  }, [profile.xp, prevXp]);

  // Redireciona o usuário para a landing page se não estiver logado
  // mantendo /landing livre
  useEffect(() => {
    if (!currentUser && location.pathname !== '/landing') {
      navigate('/landing');
    }
  }, [currentUser, location.pathname, navigate]);

  return (
    <div className={`flex relative h-screen ${isZenMode ? 'bg-slate-50 dark:bg-[#0B0A10]' : 'bg-transparent'} overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-500 w-full`}>
      {showLevelUp && (
        <LevelUpModal 
          xp={profile.xp} 
          currentMilestone={currentMilestone} 
          onClose={() => setShowLevelUp(false)} 
        />
      )}
      {location.pathname !== '/landing' && currentUser && !isZenMode && (
        <>
          {/* Desktop Sidebar */}
          <Sidebar 
            className="hidden xl:flex"
            currentPath={location.pathname} 
            isDarkMode={isDarkMode}
            themePreference={themePreference}
            setThemePreference={setThemePreference}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            profile={profile}
            onNavigate={(path: string) => navigate(path)}
            onLogout={() => {
              setCurrentUser(null);
              navigate('/landing');
            }}
            currentUser={currentUser}
          />
          
          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden"
                />
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed inset-y-0 left-0 z-50 xl:hidden"
                >
                  <Sidebar 
                    className="flex xl:hidden"
                    onMobileClose={() => setIsMobileMenuOpen(false)}
                    currentPath={location.pathname} 
                    isDarkMode={isDarkMode}
                    themePreference={themePreference}
                    setThemePreference={setThemePreference}
                    colorTheme={colorTheme}
                    setColorTheme={setColorTheme}
                    profile={profile}
                    onNavigate={(path: string) => Object.assign(navigate(path), setIsMobileMenuOpen(false))}
                    onLogout={() => {
                      setCurrentUser(null);
                      navigate('/landing');
                    }}
                    currentUser={currentUser}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
      
      {location.pathname !== '/landing' && currentUser && (
        <button 
          onClick={() => setIsZenMode(!isZenMode)}
          className={`fixed bottom-6 right-6 p-3 rounded-full z-40 transition-all duration-500 hover:scale-110 ${isZenMode ? 'bg-[#15151A] text-indigo-400 border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.2)]' : 'bg-slate-800 text-slate-400 hover:text-white border border-white/10 shadow-lg'}`}
          title={isZenMode ? "Sair do Modo Zen" : "Entrar no Modo Zen"}
        >
          {isZenMode ? <Compass className="w-5 h-5 animate-pulse" /> : <Compass className="w-5 h-5" />}
        </button>
      )}

      <div className="flex flex-col flex-1 w-full h-full relative overflow-hidden">
        {/* Global Mobile Top Bar */}
        {location.pathname !== '/landing' && currentUser && !isZenMode && (
          <div className="xl:hidden flex items-center justify-between p-4 border-b border-indigo-500/10 bg-slate-50/80 dark:bg-[#080510]/80 backdrop-blur-md z-30 flex-shrink-0">
            <div className="flex items-center gap-2 theme-logo-glow">
              <div className="h-10 w-10 theme-logo-image" />
              <div className="h-5 w-[80px] theme-logo-text" />
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-white/5 border border-indigo-500/10 text-slate-500 hover:text-indigo-400 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        )}

        <main className={`flex-1 overflow-y-auto w-full relative hide-scrollbar ${location.pathname === '/landing' ? 'p-0' : 'p-4 sm:p-6 lg:p-10'} ${isZenMode ? 'bg-[#0B0A10] inset-0 fixed z-50 p-6 lg:p-10' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Landing Page Route */}
            <Route path="/landing" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LandingPage 
                  currentUser={currentUser} 
                  onLogin={setCurrentUser} 
                  onEnterApp={() => navigate('/dashboard')} 
                  savedBirthChart={savedBirthChart}
                  setSavedBirthChart={setSavedBirthChart}
                />
              </motion.div>
            } />
            
            {/* Dashboard Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto w-full">
                {!isZenMode && <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} profile={profile} currentUser={currentUser} onMenuClick={() => setIsMobileMenuOpen(true)} />}
                
                {/* Tab selector for general overview or revenue reports */}
                {!isZenMode && (
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
                  {dashboardTab === 'overview' ? (
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
                        <CurrentCourseCard searchQuery={searchQuery} currentUser={currentUser} />
                      </div>
                      <div className="lg:col-span-4">
                        <CalendarWidget grimoireEntries={grimoireEntries} addGrimoireEntry={addGrimoireEntry} />
                      </div>

                      {/* Row 2: Daily Challenges (Full Width) */}
                      <div className="lg:col-span-12">
                        <DailyChallenges onNavigate={(path: string) => navigate(path)} profile={profile} grimoireEntries={grimoireEntries} currentUser={currentUser} challenges={challenges} />
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
            } />
            
            <Route path="/oracle" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="py-10">
                <OracleReader profile={profile} setProfile={setProfile} addGrimoireEntry={addGrimoireEntry} currentUser={currentUser} />
              </motion.div>
            } />
            
            <Route path="/grimoire" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="py-10">
                <GrimoireView 
                  entries={grimoireEntries} 
                  currentUser={currentUser} 
                  addEntry={addGrimoireEntry} 
                  updateEntry={updateGrimoireEntry}
                  deleteEntry={deleteGrimoireEntry}
                />
              </motion.div>
            } />
            
            <Route path="/library" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="h-full flex items-center justify-center p-4 lg:p-10">
                <LibraryView currentUser={currentUser} />
              </motion.div>
            } />
            
            <Route path="/courses" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="w-full">
                <CoursesView />
              </motion.div>
            } />
            
            <Route path="/community" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="w-full">
                <CommunityView currentUser={currentUser} />
              </motion.div>
            } />
            
            <Route path="/guidelines" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="w-full">
                <GuidelinesView />
              </motion.div>
            } />
            
            <Route path="/support" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="w-full">
                <SupportView currentUser={currentUser} />
              </motion.div>
            } />
            
            <Route path="/challenges" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="py-10">
                <ChallengesView profile={profile} setProfile={setProfile} grimoireEntries={grimoireEntries} currentUser={currentUser} addGrimoireEntry={addGrimoireEntry} challenges={challenges} setChallenges={setChallenges} />
              </motion.div>
            } />
            
            <Route path="/subscription" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="py-10">
                <SubscriptionView />
              </motion.div>
            } />
            
            <Route path="/settings" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto w-full pt-8">
                <SettingsView profile={profile} setProfile={setProfile} />
              </motion.div>
            } />
            
            <Route path="/profile" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="h-full flex px-4 lg:px-10">
                <ProfileView 
                  currentUser={currentUser} 
                  setCurrentUser={setCurrentUser} 
                  savedBirthChart={savedBirthChart}
                  setSavedBirthChart={setSavedBirthChart}
                />
              </motion.div>
            } />
            
            <Route path="/certificates" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="h-full px-4 lg:px-10 overflow-y-auto">
                <CertificatesView />
              </motion.div>
            } />
            
            <Route path="/workspace" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="py-10">
                <WorkspaceView currentUser={currentUser} />
              </motion.div>
            } />
            
            <Route path="*" element={
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-slate-500">
                 <Compass className="w-16 h-16 mb-4 opacity-50" />
                 <h2 className="text-2xl font-serif text-slate-300">O Caminho Continua</h2>
                 <p className="mt-2 text-center text-sm md:text-base">Esta seção do grimório está em construção.<br/>Volte depois para novos conhecimentos.</p>
               </motion.div>
            } />
          </Routes>
        </AnimatePresence>
        </main>
      </div>
      
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[30%] w-[20%] h-[20%] rounded-full bg-amber-900/5 blur-[80px] pointer-events-none z-0" />
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [themePreference, setThemePreference] = useState('dark');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [colorTheme, setColorTheme] = useState('oracle');
  const [isLoading, setIsLoading] = useState(false);
  const [savedBirthChart, setSavedBirthChart] = useState<any>(null);

  const [profile, setProfile] = useState({
    name: 'Buscador',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    xp: 100
  });

  const [grimoireEntries, setGrimoireEntries] = useState<any[]>([]);

  const [challenges, setChallenges] = useState({
    completedQuiz: false,
    flashcardCount: 0,
    flashcardCompleted: false,
    completedJournal: false
  });

  // Fetch all separated states from backend when user logs in
  useEffect(() => {
    if (!currentUser) {
      setProfile({
        name: 'Buscador',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        xp: 100
      });
      setGrimoireEntries([]);
      setChallenges({
        completedQuiz: false,
        flashcardCount: 0,
        flashcardCompleted: false,
        completedJournal: false
      });
      setSavedBirthChart(null);
      return;
    }

    setIsLoading(true);
    const pullData = async () => {
      try {
        const res = await fetch('/api/user/sync', {
          headers: { 'x-user-id': currentUser.id.toString() }
        });
        if (!res.ok) throw new Error('Offline');
        const data = await res.json();
        
        if (data && !data.error) {
          if (data.profile) {
            setProfile(data.profile);
            saveStudyProgressLocal(data.profile);
          }
          if (data.settings) {
            if (data.settings.themePreference) setThemePreference(data.settings.themePreference);
            if (data.settings.colorTheme) setColorTheme(data.settings.colorTheme);
          }
          if (data.challenges) setChallenges(data.challenges);
          if (data.grimoireEntries) {
            setGrimoireEntries(data.grimoireEntries);
            data.grimoireEntries.forEach((entry: any) => saveGrimoireEntryLocal(entry));
          }
          if (data.savedBirthChart) setSavedBirthChart(data.savedBirthChart);
        }
      } catch (err) {
        console.warn("Offline, loading from IndexedDB");
        const localGrimoire = await getAllGrimoireEntriesLocal();
        if (localGrimoire.length > 0) setGrimoireEntries(localGrimoire.reverse());
        const localProgress = await getStudyProgressLocal();
        if (localProgress && localProgress.length > 0) {
          setProfile(prev => ({ ...prev, ...localProgress[0] }));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    pullData();
  }, [currentUser]);

  // Sync mechanism
  useEffect(() => {
    const syncOfflineData = async () => {
      const queue = await getSyncQueue();
      if (!queue || queue.length === 0) return;
      
      for (const item of queue) {
        if (item.type === 'ADD_GRIMOIRE') {
          try {
            const res = await fetch('/api/grimoire/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser?.id.toString() || '1' },
              body: JSON.stringify(item.payload)
            });
            if (res.ok) {
              await clearSyncQueueItem(item.id!);
            }
          } catch (e) {
            console.error("Sync failed for", item.id);
          }
        }
      }
    };

    window.addEventListener('online', syncOfflineData);
    if (navigator.onLine) syncOfflineData();
    
    return () => window.removeEventListener('online', syncOfflineData);
  }, [currentUser]);

  // Hook settings update to database for Color Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', colorTheme);
    if (currentUser) {
      fetch('/api/settings/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id.toString()
        },
        body: JSON.stringify({ colorTheme })
      }).catch(err => console.error(err));
    }
  }, [colorTheme, currentUser]);

  // Hook settings update to database for Theme Preference
  useEffect(() => {
    if (themePreference === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches);
      
      const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      setIsDarkMode(themePreference === 'dark');
    }

    if (currentUser) {
      fetch('/api/settings/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id.toString()
        },
        body: JSON.stringify({ themePreference })
      }).catch(err => console.error(err));
    }
  }, [themePreference, currentUser]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    }
  }, [isDarkMode]);

  // Custom setter for Profile that pushes update to PostgreSQL
  const updateProfile = (newProfile: any) => {
    setProfile(prev => {
      const next = typeof newProfile === 'function' ? newProfile(prev) : newProfile;
      if (currentUser) {
        fetch('/api/profile/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id.toString()
          },
          body: JSON.stringify(next)
        }).catch(err => console.error("Erro ao salvar perfil no PostgreSQL:", err));
      }
      return next;
    });
  };

  // Custom setter for Challenges that pushes update to PostgreSQL
  const updateChallenges = (newChallenges: any) => {
    setChallenges(prev => {
      const next = typeof newChallenges === 'function' ? newChallenges(prev) : newChallenges;
      if (currentUser) {
        fetch('/api/challenges/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id.toString()
          },
          body: JSON.stringify(next)
        }).catch(err => console.error("Erro ao salvar conquistas no PostgreSQL:", err));
      }
      return next;
    });
  };

  // Custom function to add a grimoire entry into PostgreSQL
  const addGrimoireEntry = (entry: any) => {
    const tempId = 'local_' + Date.now();
    const fullEntry = { ...entry, id: tempId, date: new Date().toISOString() };
    
    setGrimoireEntries(prev => [fullEntry, ...prev]);
    saveGrimoireEntryLocal(fullEntry);
    addToSyncQueue('ADD_GRIMOIRE', entry);
    
    if (currentUser && navigator.onLine) {
      fetch('/api/grimoire/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id.toString()
        },
        body: JSON.stringify(entry)
      })
      .then(r => r.json())
      .then(async data => {
        if (data && data.success) {
          setGrimoireEntries(prev => prev.map(e => e.id === tempId ? { ...entry, id: data.entryId, date: data.date } : e));
          await saveGrimoireEntryLocal({ ...entry, id: data.entryId, date: data.date });
        }
      })
      .catch(err => console.error("Erro ao salvar registro no Grimório:", err));
    }
  };

  // Custom function to update a grimoire entry in PostgreSQL
  const updateGrimoireEntry = (id: string, updatedFields: any) => {
    const payload = {
      id,
      question: updatedFields.title || updatedFields.question,
      spreadType: updatedFields.spreadType || updatedFields.type,
      cards: updatedFields.cards || [],
      interpretation: updatedFields.content || updatedFields.interpretation,
      attachments: updatedFields.attachments || []
    };

    if (currentUser) {
      fetch('/api/grimoire/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id.toString()
        },
        body: JSON.stringify(payload)
      })
      .then(r => r.json())
      .then(data => {
        if (data && data.success) {
          setGrimoireEntries(prev => prev.map(item => 
            item.id === id ? { ...item, ...updatedFields } : item
          ));
        }
      })
      .catch(err => console.error("Erro ao atualizar registro no Grimório:", err));
    } else {
      setGrimoireEntries(prev => prev.map(item => 
        item.id === id ? { ...item, ...updatedFields } : item
      ));
    }
  };

  // Custom function to delete a grimoire entry in PostgreSQL
  const deleteGrimoireEntry = (id: string) => {
    if (currentUser) {
      fetch(`/api/grimoire/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': currentUser.id.toString()
        }
      })
      .then(r => r.json())
      .then(data => {
        if (data && data.success) {
          setGrimoireEntries(prev => prev.filter(item => item.id !== id));
        }
      })
      .catch(err => console.error("Erro ao deletar registro do Grimório:", err));
    } else {
      setGrimoireEntries(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <HashRouter>
      {isLoading ? (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#080510] text-slate-200">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-serif text-lg tracking-widest text-indigo-300 animate-pulse">SINTONIZANDO COM A INFRAESTRUTURA CÓSMICA...</p>
        </div>
      ) : (
        <AppContent 
          isDarkMode={isDarkMode} 
          themePreference={themePreference} 
          setThemePreference={setThemePreference}
          colorTheme={colorTheme}
          setColorTheme={setColorTheme}
          profile={profile} setProfile={updateProfile}
          grimoireEntries={grimoireEntries} setGrimoireEntries={setGrimoireEntries}
          addGrimoireEntry={addGrimoireEntry}
          updateGrimoireEntry={updateGrimoireEntry}
          deleteGrimoireEntry={deleteGrimoireEntry}
          currentUser={currentUser} setCurrentUser={setCurrentUser}
          challenges={challenges} setChallenges={updateChallenges}
          savedBirthChart={savedBirthChart} setSavedBirthChart={setSavedBirthChart}
        />
      )}
    </HashRouter>
  );
}
