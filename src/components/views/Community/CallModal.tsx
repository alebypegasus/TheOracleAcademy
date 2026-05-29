import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, Settings, Maximize2 } from 'lucide-react';

interface CallModalProps {
  contactName: string;
  contactAvatar: string;
  type: 'voice' | 'video';
  onClose: () => void;
}

export function CallModal({ contactName, contactAvatar, type, onClose }: CallModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(type === 'voice');
  const [status, setStatus] = useState('Conectando no Éter...');
  const [callTime, setCallTime] = useState(0);

  useEffect(() => {
    // Simulando ringing -> connected
    const timer = setTimeout(() => {
      setStatus('Conexão Estabelecida');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === 'Conexão Estabelecida') {
      const interval = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Background blur */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`w-full max-w-4xl relative z-10 bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col ${type === 'video' ? 'h-[80vh]' : 'h-[50vh]'}`}
      >
        {/* Header da Call */}
        <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden">
                <img src={contactAvatar} alt={contactName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{contactName}</h3>
                <p className={`text-xs ${status === 'Conexão Estabelecida' ? 'text-emerald-400' : 'text-purple-400 animate-pulse'}`}>
                  {status === 'Conexão Estabelecida' ? formatTime(callTime) : status}
                </p>
              </div>
           </div>

           <div className="flex gap-2">
              <button className="p-2 rounded-xl bg-black/40 text-gray-400 hover:text-white transition-colors backdrop-blur-md">
                <Users size={18} />
              </button>
              <button className="p-2 rounded-xl bg-black/40 text-gray-400 hover:text-white transition-colors backdrop-blur-md">
                <Settings size={18} />
              </button>
              <button className="p-2 rounded-xl bg-black/40 text-gray-400 hover:text-white transition-colors backdrop-blur-md">
                <Maximize2 size={18} />
              </button>
           </div>
        </div>

        {/* Corpo (Vídeo ou Placeholder) */}
        <div className="flex-1 relative flex items-center justify-center bg-black">
          {!isVideoOff ? (
            <>
              {/* Mock Video do Contato */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200')] bg-cover bg-center opacity-80 mix-blend-luminosity"></div>
              {/* Nosso mock de video local */}
              <div className="absolute bottom-6 right-6 w-48 h-64 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400')] bg-cover bg-center rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden z-10"></div>
            </>
          ) : (
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/30 relative z-10">
                <img src={contactAvatar} alt={contactName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-purple-500 animate-ping opacity-20"></div>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="h-24 bg-[#0a0a0f] border-t border-white/5 flex items-center justify-center gap-6 px-6">
          
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'}`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isVideoOff ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'}`}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>

          <button 
            onClick={onClose}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-500 text-white transition-transform hover:scale-110 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          >
            <PhoneOff size={28} />
          </button>

        </div>

      </motion.div>
    </div>
  );
}
