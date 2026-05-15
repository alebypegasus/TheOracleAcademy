import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Bell } from 'lucide-react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { OracleReader } from './components/OracleReader';
import { GrimoireView } from './components/GrimoireView';
import { ChallengesView } from './components/ChallengesView';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CurrentCourseCard } from './components/dashboard/CurrentCourseCard';
import { CalendarWidget } from './components/dashboard/CalendarWidget';
import { StudyStreakCard } from './components/dashboard/StudyStreakCard';
import { DailyChallenges } from './components/dashboard/DailyChallenges';
import { DailyWordCard } from './components/dashboard/DailyWordCard';

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

function AppContent({
  isDarkMode, themePreference, setThemePreference, colorTheme, setColorTheme,
  profile, setProfile,
  grimoireEntries, setGrimoireEntries,
  addGrimoireEntry,
  currentUser, setCurrentUser
}: any) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Redireciona o usuário para a landing page se não estiver logado
  // mantendo /landing livre
  useEffect(() => {
    if (!currentUser && location.pathname !== '/landing') {
      navigate('/landing');
    }
  }, [currentUser, location.pathname, navigate]);

  return (
    <div className="flex relative h-screen bg-transparent overflow-hidden text-slate-200 transition-colors duration-500 w-full">
      {location.pathname !== '/landing' && currentUser && (
        <Sidebar 
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
      )}
      <main className={`flex-1 overflow-y-auto w-full relative hide-scrollbar ${location.pathname === '/landing' ? 'p-0' : 'p-6 lg:p-10'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Landing Page Route */}
            <Route path="/landing" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LandingPage currentUser={currentUser} onLogin={setCurrentUser} onEnterApp={() => navigate('/dashboard')} />
              </motion.div>
            } />
            
            {/* Dashboard Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto w-full">
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} profile={profile} />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                  {/* Row 1: Course and Calendar */}
                  <div className="lg:col-span-8">
                    <CurrentCourseCard searchQuery={searchQuery} currentUser={currentUser} />
                  </div>
                  <div className="lg:col-span-4">
                    <CalendarWidget grimoireEntries={grimoireEntries} addGrimoireEntry={addGrimoireEntry} />
                  </div>

                  {/* Row 2: Daily Challenges (Full Width) */}
                  <div className="lg:col-span-12">
                    <DailyChallenges onNavigate={(path: string) => navigate(path)} profile={profile} grimoireEntries={grimoireEntries} currentUser={currentUser} />
                  </div>

                  {/* Row 3: Streak and Word */}
                  <div className="lg:col-span-7">
                    <StudyStreakCard />
                  </div>
                  <div className="lg:col-span-5">
                    <DailyWordCard />
                  </div>
                </div>
              </motion.div>
            } />
            
            <Route path="/oracle" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="py-10">
                <OracleReader profile={profile} setProfile={setProfile} addGrimoireEntry={addGrimoireEntry} currentUser={currentUser} />
              </motion.div>
            } />
            
            <Route path="/grimoire" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="py-10">
                <GrimoireView entries={grimoireEntries} currentUser={currentUser} addEntry={addGrimoireEntry} />
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
                <ChallengesView profile={profile} setProfile={setProfile} grimoireEntries={grimoireEntries} currentUser={currentUser} />
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
                <ProfileView currentUser={currentUser} setCurrentUser={setCurrentUser} />
              </motion.div>
            } />
            
            <Route path="/certificates" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="h-full px-4 lg:px-10 overflow-y-auto">
                <CertificatesView />
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
      
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[30%] w-[20%] h-[20%] rounded-full bg-amber-900/5 blur-[80px] pointer-events-none z-0" />
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('oracle_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('oracle_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('oracle_user');
    }
  }, [currentUser]);

  const [themePreference, setThemePreference] = useState(() => {
    const saved = localStorage.getItem('oracle_theme_pref');
    return saved ? saved : 'auto';
  });

  const [isDarkMode, setIsDarkMode] = useState(true);

  const [colorTheme, setColorTheme] = useState(() => {
    const saved = localStorage.getItem('oracle_color_theme');
    return saved ? saved : 'oracle';
  });

  useEffect(() => {
    localStorage.setItem('oracle_color_theme', colorTheme);
    document.documentElement.setAttribute('data-color-theme', colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    localStorage.setItem('oracle_theme_pref', themePreference);
    
    if (themePreference === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches);
      
      const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      setIsDarkMode(themePreference === 'dark');
    }
  }, [themePreference]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light'); // For legacy styles
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.add('light'); // For legacy styles
    }
  }, [isDarkMode]);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('oracle_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Aria Nova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      xp: 850
    };
  });

  useEffect(() => {
    localStorage.setItem('oracle_profile', JSON.stringify(profile));
  }, [profile]);

  const [grimoireEntries, setGrimoireEntries] = useState(() => {
    const saved = localStorage.getItem('oracle_grimoire');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('oracle_grimoire', JSON.stringify(grimoireEntries));
  }, [grimoireEntries]);

  const addGrimoireEntry = (entry: any) => {
    setGrimoireEntries([...grimoireEntries, entry]);
  };

  return (
    <HashRouter>
      <AppContent 
        isDarkMode={isDarkMode} 
        themePreference={themePreference} 
        setThemePreference={setThemePreference}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
        profile={profile} setProfile={setProfile}
        grimoireEntries={grimoireEntries} setGrimoireEntries={setGrimoireEntries}
        addGrimoireEntry={addGrimoireEntry}
        currentUser={currentUser} setCurrentUser={setCurrentUser}
      />
    </HashRouter>
  );
}
