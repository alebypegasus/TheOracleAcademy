import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Image as ImageIcon, MessageCircle } from 'lucide-react';
import { ScrollShadow } from '@heroui/react';
import { getAuthHeaders } from '../../../services/api';

interface DirectMessagesTabProps {
  currentUser: any;
}

export function DirectMessagesTab({ currentUser }: DirectMessagesTabProps) {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  const dummyChats = [
    { id: 2, name: 'Serena Moon', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', status: 'online', lastMsg: 'Você viu a lua hoje?' },
    { id: 3, name: 'Elias Thorne', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150', status: 'offline', lastMsg: 'Recomendo a leitura de Agrippa.' }
  ];

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const fetchMessages = async (friendId: number) => {
    try {
      const res = await fetch(`/api/community/messages/${friendId}`, {
        headers: getAuthHeaders(currentUser?.id)
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setMessages(data);
      } else {
        setMessages([{ id: 1, sender_id: friendId, content: 'Olá! A luz astral o guia.', sent_at: new Date().toISOString() }]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !selectedChat) return;

    const optimisticMsg = {
      id: Date.now(),
      sender_id: currentUser?.id || 1,
      receiver_id: selectedChat.id,
      content: inputText,
      sent_at: new Date().toISOString()
    };
    
    setMessages([...messages, optimisticMsg]);
    const txt = inputText;
    setInputText('');

    try {
      await fetch('/api/community/messages', {
        method: 'POST',
        headers: { ...getAuthHeaders(currentUser?.id), 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: selectedChat.id, content: txt, format: 'text' })
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      {/* Chats List Sidebar */}
      <div className="w-full md:w-80 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 bg-black/20">
          <h3 className="font-bold text-white text-lg">Mensagens</h3>
        </div>
        <ScrollShadow className="flex-1 overflow-y-auto">
          {dummyChats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-white/5 ${selectedChat?.id === chat.id ? 'bg-purple-500/20' : 'hover:bg-white/5'}`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
                {chat.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate">{chat.name}</h4>
                <p className="text-gray-400 text-xs truncate">{chat.lastMsg}</p>
              </div>
            </div>
          ))}
        </ScrollShadow>
      </div>

      {/* Active Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col min-w-0 bg-black/10">
          <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3 shadow-md z-10">
            <img src={selectedChat.avatar} alt={selectedChat.name} className="w-8 h-8 rounded-full object-cover" />
            <span className="text-white font-bold">{selectedChat.name}</span>
          </div>

          <ScrollShadow className="flex-1 p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, idx) => {
                const isMe = msg.sender_id === (currentUser?.id || 1);
                return (
                  <motion.div 
                    key={msg.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] rounded-2xl p-3 ${isMe ? 'bg-purple-600 text-white rounded-tr-sm shadow-[0_0_15px_rgba(147,51,234,0.2)]' : 'bg-zinc-800 text-gray-200 rounded-tl-sm border border-white/5'}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-[10px] opacity-50 mt-1 block text-right">
                        {new Date(msg.sent_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </ScrollShadow>

          <div className="p-4 bg-zinc-900 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-purple-400 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <ImageIcon size={20} />
              </button>
              <input 
                placeholder="Canalize sua mensagem..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-white/5 border-none rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
              />
              <button 
                className="bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-xl transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                onClick={handleSend}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p>Selecione uma conversa para começar</p>
          </div>
        </div>
      )}
    </div>
  );
}
