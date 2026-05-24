import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Users as UsersIcon, Settings as SettingsIcon, FileText, ChevronLeft } from 'lucide-react';
import UsersAdmin from './Users';
import ContentAdmin from './Content';
import SettingsAdmin from './Settings';

export default function AdminDashboard({ currentUser }: { currentUser: any }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const navItems = [
    { name: 'Visão Geral', path: '/admin', icon: <Shield className="w-5 h-5" /> },
    { name: 'Usuários', path: '/admin/users', icon: <UsersIcon className="w-5 h-5" /> },
    { name: 'Conteúdo', path: '/admin/content', icon: <FileText className="w-5 h-5" /> },
    { name: 'Configurações', path: '/admin/settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#080510] text-slate-200">
      {/* Admin Sidebar */}
      <div className="w-64 border-r border-indigo-900/30 bg-[#0B0A10] flex flex-col">
        <div className="p-6 border-b border-indigo-900/30 flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-500" />
          <h1 className="font-serif text-xl font-bold tracking-wider text-red-100">Painel Moderador</h1>
        </div>
        
        <div className="flex-1 py-4 flex flex-col gap-2 px-4">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${location.pathname === item.path ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-indigo-900/30">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors w-full p-2 rounded-lg hover:bg-white/5"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar ao App Normal
          </button>
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative hide-scrollbar">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/users" element={<UsersAdmin />} />
            <Route path="/content" element={<ContentAdmin />} />
            <Route path="/settings" element={<SettingsAdmin />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/logs', {
      headers: { 'x-user-id': '1' } // Será substituído pelo interceptor ou backend (usa o ID real)
    })
    .then(r => r.json())
    .then(data => {
      if(Array.isArray(data)) setLogs(data);
    })
    .catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-serif mb-6 text-white">Central de Moderação</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#110D1A] to-[#0A0710] border border-red-900/20 shadow-lg">
          <h3 className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Ações Recentes</h3>
          <p className="text-4xl font-light text-red-400">{logs.length}</p>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#110D1A] to-[#0A0710] border border-indigo-900/20 shadow-lg">
          <h3 className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Status do Sistema</h3>
          <p className="text-4xl font-light text-emerald-400">Operacional</p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-[#110D1A] border border-white/5">
        <h3 className="text-xl font-serif mb-6 text-slate-300">Logs de Moderação</h3>
        {logs.length === 0 ? (
          <p className="text-slate-500">Nenhum log registrado ainda.</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log: any) => (
              <div key={log.id} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-lg bg-black/20 border border-white/5">
                <div>
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-red-400">{log.admin_email}</span> executou <span className="font-bold text-indigo-300">{log.action}</span>
                  </p>
                  {log.target_email && <p className="text-xs text-slate-500 mt-1">Alvo: {log.target_email}</p>}
                  {log.reason && <p className="text-xs text-slate-400 mt-1 italic">"{log.reason}"</p>}
                </div>
                <span className="text-xs text-slate-600">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
