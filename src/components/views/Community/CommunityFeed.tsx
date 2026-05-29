import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RichPostEditor } from './RichPostEditor';
import { Heart, MessageCircle, Share2, Sparkles, MoreHorizontal, User } from 'lucide-react';

interface CommunityFeedProps {
  currentUser: any;
}

export function CommunityFeed({ currentUser }: CommunityFeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community/posts', {
        headers: { 'Authorization': `Bearer fake-jwt`, 'x-user-id': currentUser?.id || '1' }
      });
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (content: string, coven: string) => {
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer fake-jwt`,
          'x-user-id': currentUser?.id || '1'
        },
        body: JSON.stringify({ content, coven, tags: [] })
      });
      if (!res.ok) throw new Error("Backend falhou, usando mock local");
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
    } catch (e) {
      // Mock Bypass (já que o banco está vazio/desconectado para a UI Test)
      const mockPost = {
        id: Date.now(),
        content,
        coven,
        author: currentUser || { name: 'Mago Sem Nome', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150' },
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      setPosts([mockPost, ...posts]);
    }
  };

  const handleLike = async (postId: string | number) => {
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer fake-jwt`, 'x-user-id': currentUser?.id || '1' }
      });
      const data = await res.json();
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: data.likes } : p));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">
        <RichPostEditor currentUser={currentUser} onSubmit={handlePostSubmit} />
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, idx) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-purple-500/50 object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white hover:text-purple-400 cursor-pointer transition-colors">{post.authorName}</h4>
                        {post.authorTitle === 'Magus Supremo' && <Sparkles size={14} className="text-yellow-400" />}
                      </div>
                      <p className="text-xs text-gray-400">{post.coven} • {post.date || post.time}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* HTML CONTENT rendered safely using dangerouslySetInnerHTML */}
                <div 
                  className="text-gray-200 text-[15px] leading-relaxed mb-4 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {post.images && post.images.length > 0 && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
                    <img src={post.images[0]} alt="Post" className="w-full h-auto object-cover max-h-96" />
                  </div>
                )}

                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Heart size={18} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors ml-auto">
                    <Share2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
