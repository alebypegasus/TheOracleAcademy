import React, { useState } from 'react';
import { Send, Image as ImageIcon, Flame, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { PageCard } from '../../../../ui/PageCard';

export function EgregoraChatFeed({ 
  egregora, 
  currentUser 
}: { 
  egregora: any; 
  currentUser: any; 
}) {
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState<any[]>([
    {
      id: 1,
      author: 'Guardião Sábio',
      content: 'Bem-vindos à nossa Egrégora. Que a luz do conhecimento ilumine nossos estudos.',
      timestamp: new Date().toISOString(),
      likes: 12,
    }
  ]);

  const handlePost = () => {
    if (!message.trim()) return;
    const newPost = {
      id: Date.now(),
      author: currentUser.name || currentUser.nickname,
      content: message,
      timestamp: new Date().toISOString(),
      likes: 0,
    };
    setPosts([newPost, ...posts]);
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Create Post Input */}
      <PageCard className="p-4 border-[#1e1b4b]">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-900 overflow-hidden shrink-0">
            <img src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Compartilhe seus estudos, dúvidas ou visões místicas..."
              className="w-full bg-transparent border-none text-slate-200 outline-none resize-none h-12 pt-2 placeholder:text-slate-600 text-sm"
            />
            <div className="flex items-center justify-between border-t border-[#1e1b4b] pt-3 mt-2">
              <button className="text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded-lg hover:bg-white/5">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={handlePost}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
              >
                Emanar <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </PageCard>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PageCard key={post.id} className="p-5 border-[#1e1b4b]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-900" />
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{post.author}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(post.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
              <button className="text-slate-500 hover:text-slate-300">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {post.content}
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-[#1e1b4b]/50">
              <button className="flex items-center gap-1.5 text-xs text-amber-500/70 hover:text-amber-400 transition-colors font-bold">
                <Flame className="w-4 h-4" /> {post.likes} Faíscas
              </button>
            </div>
          </PageCard>
        ))}
      </div>
    </div>
  );
}
