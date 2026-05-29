import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Send, Paperclip, Smile } from 'lucide-react';

interface DMModalProps {
  contact: any;
  onClose: () => void;
}

export function DMModal({ contact, onClose }: DMModalProps) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'them', text: 'Salve irmão, como foram os ritos ontem?' },
    { id: 2, sender: 'me', text: 'Tudo dentro do esperado. A egrégora respondeu bem forte.' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'me', text: input }]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0a0a0f] border border-white/10 rounded-2xl w-full max-w-lg relative z-10 overflow-hidden shadow-2xl flex flex-col h-[60vh]"
      >
        {/* Header */}
        <div className="h-16 border-b border-white/10 bg-white/5 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover border border-white/20"/>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]"></div>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{contact.name}</h3>
              <p className="text-xs text-gray-400">Conectado no Éter</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-black/20">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                msg.sender === 'me' 
                ? 'bg-purple-600 text-white rounded-br-sm' 
                : 'bg-white/10 text-gray-200 border border-white/5 rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white/5 border-t border-white/10 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors"><Paperclip size={20}/></button>
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Sussurrar no éter..." 
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors"><Smile size={20}/></button>
            <button type="submit" className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-colors"><Send size={18}/></button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
