import React, { useRef, useState } from 'react';
import { OracleEditor } from '../../ui/OracleEditor';
import { Send, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface RichPostEditorProps {
  currentUser: any;
  onSubmit: (content: string, coven: string) => void;
}

export function RichPostEditor({ currentUser, onSubmit }: RichPostEditorProps) {
  const [content, setContent] = useState('');
  const [coven, setCoven] = useState('Eter');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!content || content === '' || content === '<p></p>') return;
    setIsSubmitting(true);
    onSubmit(content, coven);
    setContent('');
    setIsSubmitting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-8 shadow-xl"
    >
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'} 
          alt="Avatar" 
          className="w-10 h-10 rounded-full border border-purple-500/50"
        />
        <select 
          value={coven}
          onChange={(e) => setCoven(e.target.value)}
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-purple-300 focus:outline-none focus:border-purple-500/50"
        >
          <option value="Eter">Feed Global (Éter)</option>
          <option value="Astrologia">Astrologia Kármica</option>
          <option value="Magia Natural">Magia Natural</option>
          <option value="Tarot">Oraculistas</option>
        </select>
        <span className="ml-auto text-xs text-gray-400 flex items-center gap-1"><Sparkles size={14}/> Compartilhe sua sabedoria</span>
      </div>

      <div className="mb-4">
        <OracleEditor 
          value={content}
          onChange={setContent}
          placeholder="O que os astros sussurraram para você hoje?"
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-white/5 rounded-lg transition-colors">
            <ImageIcon size={18} />
          </button>
          {/* Add more custom attachment buttons if needed */}
        </div>
        <button 
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {!isSubmitting && <Send size={16} />}
          {isSubmitting ? 'Canalizando...' : 'Canalizar Mensagem'}
        </button>
      </div>
    </motion.div>
  );
}
