import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function ContentAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/posts', {
        headers: { 'x-user-id': localStorage.getItem('userId') || '1' }
      });
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/posts/${id}/status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('userId') || '1'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchContent();
      }
    } catch (e) {
      alert("Erro de conexão");
    }
  };

  if (loading) return <div className="text-slate-400">Carregando conteúdo...</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-serif mb-6 text-white">Moderação de Conteúdo</h2>
      <p className="text-slate-400 mb-8">Gerencie as postagens da comunidade e itens do marketplace.</p>

      <div className="bg-[#110D1A] rounded-xl border border-[#1e1b4b] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-slate-400 text-sm border-b border-[#1e1b4b]">
                <th className="p-4 font-medium">Autor</th>
                <th className="p-4 font-medium">Conteúdo</th>
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1b4b]">
              {posts.map(p => (
                <tr key={p.id} className="text-slate-300 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-slate-200">{p.author_name}</p>
                    <p className="text-xs text-slate-500">Postagem</p>
                  </td>
                  <td className="p-4 max-w-xs truncate">
                    {p.content}
                  </td>
                  <td className="p-4 text-xs text-slate-400">
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'aprovado' ? 'bg-emerald-500/20 text-emerald-300' : p.status === 'rejeitado' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {p.status ? p.status.toUpperCase() : 'APROVADO'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        title="Ver completo"
                        className="p-2 rounded hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        title="Aprovar"
                        onClick={() => handleStatus(p.id, 'aprovado')}
                        className="p-2 rounded hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        title="Rejeitar/Ocultar"
                        onClick={() => handleStatus(p.id, 'rejeitado')}
                        className="p-2 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Nenhum conteúdo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
