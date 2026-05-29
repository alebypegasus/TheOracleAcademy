import React, { useState, useEffect } from 'react';
import { AlertTriangle, UserX, UserCheck, ShieldAlert } from 'lucide-react';

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      // O App.tsx ou AdminLayout irá garantir que currentUser.id está nos headers via interceptor ou manual
      // Vamos assumir fetch com cookies/session ou header adaptado
      const res = await fetch('/api/admin/users', {
        headers: { 'x-user-id': localStorage.getItem('userId') || '1' }
      });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (id: number, actionType: 'status' | 'strike', payload: any) => {
    try {
      const endpoint = actionType === 'status' ? `/api/admin/users/${id}/status` : `/api/admin/users/${id}/strike`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('userId') || '1'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchUsers();
      } else {
        alert("Erro ao realizar ação");
      }
    } catch (e) {
      alert("Erro de conexão");
    }
  };

  if (loading) return <div className="text-slate-400">Carregando usuários...</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-serif mb-6 text-white">Moderação de Usuários</h2>
      
      <div className="bg-[#110D1A] rounded-xl border border-[#1e1b4b] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-slate-400 text-sm border-b border-[#1e1b4b]">
                <th className="p-4 font-medium">Usuário</th>
                <th className="p-4 font-medium">Papel</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Strikes</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1b4b]">
              {users.map(u => (
                <tr key={u.id} className="text-slate-300 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-slate-200">{u.name || 'Sem nome'}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${u.role === 'admin' ? 'bg-red-500/20 text-red-300' : u.role === 'vendedor' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${u.status === 'ativo' ? 'text-emerald-400' : u.status === 'suspenso' ? 'text-amber-400' : 'text-red-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${u.status === 'ativo' ? 'bg-emerald-400' : u.status === 'suspenso' ? 'bg-amber-400' : 'bg-red-500'}`} />
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${i < u.strikes ? 'bg-red-500' : 'bg-white/10'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        title="Aplicar Strike (Aviso)"
                        onClick={() => {
                          const reason = prompt("Motivo da infração?");
                          if (reason) handleAction(u.id, 'strike', { reason });
                        }}
                        className="p-2 rounded hover:bg-amber-500/20 text-amber-400 transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                      
                      {u.status !== 'ativo' ? (
                        <button 
                          title="Reativar Conta"
                          onClick={() => handleAction(u.id, 'status', { status: 'ativo', reason: 'Reativado pelo admin' })}
                          className="p-2 rounded hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          title="Suspender (Temporário)"
                          onClick={() => handleAction(u.id, 'status', { status: 'suspenso', reason: 'Suspensão manual' })}
                          className="p-2 rounded hover:bg-amber-500/20 text-amber-500 transition-colors"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}

                      <button 
                        title="Banir (Permanente)"
                        onClick={() => {
                          if (window.confirm(`Tem certeza que deseja BANIR ${u.email} permanentemente?`)) {
                            handleAction(u.id, 'status', { status: 'banido', reason: 'Banimento manual' });
                          }
                        }}
                        className="p-2 rounded hover:bg-red-500/20 text-red-500 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    </div>
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
