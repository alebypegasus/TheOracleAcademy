import React, { useState, useMemo } from 'react';
import { Sun, Search, Filter, BookOpen, Star, Lock, Plus, Upload, Tag, Info, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionLock } from '../ui/SectionLock';

// Mock library data
const LIBRARY_ITEMS = [
  {
    id: 'lib-1',
    title: 'Arcanos Maiores',
    subtitle: 'Uma Jornada pelo Inconsciente',
    author: 'Aria Nova',
    category: 'Tarot',
    price: 0, // Free / Doado
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
    hashtags: ['#Tarot', '#Arcanos', '#Espiritualidade'],
    description: 'Explore o caminho do Louco através dos 22 Arcanos Maiores, um guia passo a passo para entender profundamente seu próprio ser.',
  },
  {
    id: 'lib-2',
    title: 'Lenormand Essencial',
    subtitle: 'Prática na Mesa Real',
    author: 'Mestre C.',
    category: 'Lenormand',
    price: 49.90,
    coverImage: 'https://images.unsplash.com/photo-1602498456745-e9503b3cc417?auto=format&fit=crop&q=80&w=400',
    hashtags: ['#Lenormand', '#MesaReal', '#Cartomancia'],
    description: 'Um tomo digital focado na prática diária do Baralho Cigano (Lenormand). Aprenda a interpretar combinações complexas.',
  },
  {
    id: 'lib-3',
    title: 'A Intuição do Oráculo',
    subtitle: 'Aterramento e Proteção',
    author: 'Lúcia R.',
    category: 'Oráculo',
    price: 25.00,
    coverImage: 'https://images.unsplash.com/photo-1602693680608-a1bf18685122?auto=format&fit=crop&q=80&w=400',
    hashtags: ['#Intuição', '#Proteção', '#Mediumnidade'],
    description: 'Práticas para conectar sua intuição antes de qualquer leitura. Essencial para manter o canal limpo.',
  },
  {
    id: 'lib-4',
    title: 'Kabbalah e Tarot',
    subtitle: 'Os Caminhos da Árvore',
    author: 'Eliphas Sol',
    category: 'Magia',
    price: 89.90,
    coverImage: 'https://images.unsplash.com/photo-1532054950961-002ab40dd324?auto=format&fit=crop&q=80&w=400',
    hashtags: ['#Kabbalah', '#Tarot', '#AltaMagia'],
    description: 'A profunda conexão entre a Kabbalah Hermética e o Tarot. Recomendado apenas para estudantes avançados.',
  },
  {
    id: 'lib-5',
    title: 'Astrologia Kármica',
    subtitle: 'O Nó Lunar',
    author: 'Aria Nova',
    category: 'Astrologia',
    price: 0,
    coverImage: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80&w=400',
    hashtags: ['#Astrologia', '#Karma', '#MapAstral'],
    description: 'Entenda como os nós lunares ditam os aprendizados passados e os objetivos de vida futuros na astrologia.',
  }
];

export function LibraryView({ currentUser }: { currentUser: any }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const isLocked = !currentUser?.isPaid;

  const filteredItems = useMemo(() => {
    let result = [...LIBRARY_ITEMS];
    if (filterCategory !== 'All') {
      result = result.filter(item => item.category === filterCategory);
    }
    if (searchQuery) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hashtags.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return result;
  }, [filterCategory, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 relative h-full flex flex-col">
      <SectionLock isPaid={currentUser?.isPaid} className="absolute top-10 right-4" />
      
      <div className="mb-12 text-center pt-8 shrink-0">
        <div className="flex items-center justify-center gap-4 mb-4 opacity-70">
          <div className="w-12 h-[1px] bg-amber-500/50" />
          <Sun className="w-5 h-5 text-amber-400" />
          <div className="w-12 h-[1px] bg-amber-500/50" />
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-slate-100 gold-text tracking-wider uppercase mb-3">Biblioteca Arcana</h2>
        <p className="text-indigo-300 tracking-widest text-sm md:text-base uppercase max-w-2xl mx-auto">
           A Grande Estante. Publique sua sabedoria, venda ou doe seu conhecimento com total autoria.
        </p>
      </div>
      
      {/* Featured Book Section */}
      {!searchQuery && filterCategory === 'All' && !isLocked && (
        <div className="w-full mb-16 relative overflow-hidden rounded-[2.5rem] border border-amber-500/30 glass-panel shadow-[0_0_40px_rgba(245,158,11,0.1)] group">
           <div className="absolute inset-0 bg-gradient-to-r from-[#120816] via-[#1a0f2e] to-[#0c0816]" />
           <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[80px]" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[80px]" />
           
           <div className="relative z-10 flex flex-col md:flex-row items-center p-8 md:p-12 gap-10">
              <div className="w-full md:w-1/3 shrink-0 perspective-1000">
                 <div className="w-full max-w-[280px] mx-auto aspect-[2/3] mx-auto rounded-r-2xl rounded-l-md shadow-2xl border-l-8 border-l-black/80 border border-white/20 transform rotate-y-[-10deg] group-hover:rotate-y-[0deg] transition-all duration-700">
                    <img src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover rounded-r-2xl mix-blend-luminosity brightness-75 hover:mix-blend-normal hover:brightness-100 transition-all" alt="Grimório Destaque" />
                 </div>
              </div>
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                 <span className="text-xs text-amber-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-2 border border-amber-500/30 px-3 py-1 rounded-full"><Star className="w-3 h-3" /> Manuscrito em Destaque</span>
                 <h3 className="text-4xl md:text-5xl font-serif text-white mb-2 leading-tight">O Grimório de Thoth</h3>
                 <p className="text-xl text-purple-300 font-serif mb-6 italic">Sabedoria Oculta das Areias do Tempo</p>
                 <p className="text-slate-400 mb-8 max-w-xl leading-relaxed text-sm md:text-base">
                    Um estudo avançado sobre os princípios herméticos, combinando magia ritualística, correspondências astrológicas e os Mistérios de Thoth. Recomendado apenas para membros de Alto Grau.
                 </p>
                 <div className="flex flex-wrap items-center gap-4">
                    <button className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold uppercase tracking-wider rounded-xl transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                       Adquirir Tomo (R$ 150)
                    </button>
                    <button className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium uppercase tracking-wider rounded-xl transition-colors border border-white/20">
                       Ler Prefácio
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
      
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 relative z-20">
        <button 
          onClick={() => setShowUploadModal(true)}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
           <Upload className="w-4 h-4" /> Publicar Livro
        </button>

        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto hide-scrollbar">
          <div className="glass-panel px-4 py-2.5 rounded-xl flex items-center min-w-[200px] border border-white/10 shrink-0">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Buscar título ou autor..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-200 w-full"
            />
          </div>
          
          <div className="glass-panel px-3 py-2.5 rounded-xl flex items-center border border-white/10 bg-black/20 shrink-0">
            <Filter className="w-4 h-4 text-slate-400 mr-2" />
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-200 cursor-pointer"
            >
              <option value="All">Todas Categorias</option>
              <option value="Tarot">Tarot</option>
              <option value="Lenormand">Lenormand</option>
              <option value="Astrologia">Astrologia</option>
              <option value="Magia">Magia</option>
              <option value="Oráculo">Oráculo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative flex-1">
        {isLocked && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center rounded-[3rem] border border-amber-500/20">
             <Lock className="w-12 h-12 text-amber-400 mb-4" />
             <h3 className="text-2xl font-serif text-slate-200 mb-2">Acesso Restrito ao Acervo</h3>
             <p className="text-slate-400 mb-6 text-center max-w-sm">Para retirar e publicar obras na Biblioteca Arcana, torne-se um membro Premium.</p>
             <button className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-xl uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform">
               Assinar Agora
             </button>
          </div>
        )}

        {/* Bookshelf Layout */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 pb-20 ${isLocked ? 'pointer-events-none blur-[2px]' : ''}`}>
           {filteredItems.map(book => (
             <BookCard key={book.id} book={book} />
           ))}
        </div>
        
        {/* Decorative shelf lines - visual only */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mt-[380px]" />
           ))}
        </div>
      </div>

      <AnimatePresence>
        {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function BookCard({ book }: { book: any }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col h-full perspective-1000 group">
       <div 
         className={`relative w-full aspect-[2/3] preserve-3d transition-transform duration-700 cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
         onClick={() => setIsFlipped(!isFlipped)}
       >
         {/* Front of the book */}
         <div className="absolute inset-0 backface-hidden rounded-r-xl rounded-l-md shadow-2xl overflow-hidden border-l-4 border-l-black/60 border border-white/10">
           <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover opacity-80 mix-blend-luminosity brightness-75 group-hover:brightness-100 transition-all duration-500" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#090514]/90 via-black/20 to-transparent" />
           
           <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">{book.category}</span>
              <h3 className="text-xl font-serif text-slate-100 leading-tight mt-1">{book.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{book.subtitle}</p>
              
              <div className="flex justify-between items-end mt-4">
                 <p className="text-[10px] text-slate-400">Por {book.author}</p>
                 <span className={`text-xs font-bold px-2 py-1 rounded-md ${book.price === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-300'}`}>
                   {book.price === 0 ? 'Doação (Gratuito)' : `R$ ${book.price.toFixed(2)}`}
                 </span>
              </div>
           </div>
         </div>

         {/* Back of the book */}
         <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-l-xl rounded-r-md shadow-2xl overflow-hidden border-r-4 border-r-black/60 border border-white/10 bg-[#0c0818] p-5 flex flex-col">
            <h4 className="text-lg font-serif text-amber-400 mb-2">{book.title}</h4>
            <p className="text-xs text-slate-300 text-center italic mb-4 leading-relaxed">"{book.description}"</p>
            
            <div className="flex flex-wrap gap-1 mb-4 justify-center">
              {book.hashtags.map((tag: string) => (
                <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-white/5 text-slate-400 rounded-full">{tag}</span>
              ))}
            </div>

            <div className="mt-auto space-y-2">
               <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2">
                 {book.price === 0 ? <BookOpen className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                 {book.price === 0 ? 'Abrir e Ler' : 'Adquirir Obra'}
               </button>
            </div>
         </div>
       </div>
       
       {/* Shadow underneath */}
       <div className="w-3/4 mx-auto h-2 bg-black/60 blur-md mt-2 rounded-full" />
    </div>
  );
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleOverlayClick}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-3xl glass-panel border border-indigo-500/30 rounded-3xl overflow-hidden flex flex-col md:flex-row relative"
      >
         <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-20">✕</button>
         
         <div className="md:w-1/3 bg-indigo-900/20 p-8 flex flex-col items-center justify-center border-r border-white/5 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.1)_0%,transparent_70%)]" />
            <BookOpen className="w-16 h-16 text-indigo-400 mb-6 relative z-10" />
            <h3 className="text-xl font-serif text-slate-200 text-center mb-4 relative z-10">Compartilhe sua Obra</h3>
            <p className="text-xs text-slate-400 text-center leading-relaxed relative z-10">
              Certifique-se de que o material anexado é 100% autoral. Ao publicar, você atesta a ausência de direitos autorais de terceiros.
            </p>
         </div>

         <div className="md:w-2/3 p-8">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Obra enviada para moderação!"); onClose(); }}>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 block">Título da Obra</label>
                    <input type="text" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 block">Subtítulo</label>
                    <input type="text" className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
                  </div>
               </div>

               <div>
                 <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 block">Sinopse (Descrição curta)</label>
                 <textarea required className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50 h-20 resize-none" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 block">Preço (R$ 0 para Doação)</label>
                    <input type="number" min="0" step="0.01" required className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50" defaultValue={0} />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 block">Hashtags (separadas por vírgula)</label>
                    <input type="text" placeholder="#tarot, #magia" className="w-full bg-black/30 border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-indigo-500/50" />
                  </div>
               </div>

               <div>
                 <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 block flex items-center justify-between">
                   Capa da Obra
                   <span className="text-[9px] text-indigo-400">Recomendado: 400x600</span>
                 </label>
                 <div className="w-full py-4 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                    <Upload className="w-5 h-5 text-indigo-400 mb-2" />
                    <span className="text-xs text-slate-400">Fazer upload de imagem (.JPG, .PNG)</span>
                 </div>
               </div>
               
               <div>
                 <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 block flex items-center justify-between">
                   Arquivo Digital do Livro
                 </label>
                 <div className="w-full py-4 border border-dashed border-emerald-500/30 bg-emerald-900/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-500/5 transition-colors">
                    <BookOpen className="w-5 h-5 text-emerald-400 mb-2" />
                    <span className="text-xs text-emerald-400">Fazer upload de PDF / EPUB</span>
                 </div>
               </div>

               <div className="flex items-start gap-2 mt-4 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-200/80 leading-tight">
                    Declaro que esta obra é de minha inteira autoria, isenta de direitos de terceiros. A Oracle Academy não se responsabiliza por infrações de copyright, estando o publicador sujeito a banimento em caso de plágio.
                  </p>
               </div>

               <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/20 mt-4">
                 Aceitar Termos e Publicar
               </button>
            </form>
         </div>
      </motion.div>
    </div>
  );
}

