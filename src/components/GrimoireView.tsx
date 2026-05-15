import React, { useState, useMemo, useRef } from 'react';
import { Book, ChevronRight, ChevronDown, Calendar, Filter, ArrowUpDown, Lock, Sparkles, Plus, Image as ImageIcon, FileText, File, Moon, BookOpen, ScrollText, CalendarDays, X, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { SectionLock } from './ui/SectionLock';

const GRIMOIRE_CATEGORIES = [
  { id: 'all', label: 'Tudo', icon: Book },
  { id: 'reading', label: 'Leituras Oraculares', icon: Sparkles },
  { id: 'spell', label: 'Feitiços e Rituais', icon: PenTool },
  { id: 'dream', label: 'Diário de Sonhos', icon: Moon },
  { id: 'diary', label: 'Diário Pessoal', icon: BookOpen },
  { id: 'event', label: 'Eventos e Datas', icon: CalendarDays },
  { id: 'note', label: 'Anotações Diversas', icon: ScrollText },
];

export function GrimoireView({ entries, addEntry, currentUser }: { entries: any[], addEntry?: (e: any) => void, currentUser: any }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // New Entry state
  const [isCreating, setIsCreating] = useState(false);
  const [newEntryType, setNewEntryType] = useState('diary');
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<{name: string, type: string, url: string}[]>([]);

  const isLocked = !currentUser?.isPaid;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file) // For prototype purposes
      }));
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleSaveEntry = () => {
    if (!newEntryTitle.trim() || !addEntry) return;

    addEntry({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: newEntryType,
      title: newEntryTitle,
      content: newEntryContent,
      attachments: attachments,
      // For compatibility if needed
      question: newEntryTitle,
      interpretation: newEntryContent,
      cards: [],
      spreadType: GRIMOIRE_CATEGORIES.find(c => c.id === newEntryType)?.label || 'Anotação',
    });

    setIsCreating(false);
    setNewEntryTitle('');
    setNewEntryContent('');
    setEditorState(EditorState.createEmpty());
    setAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredAndSortedEntries = useMemo(() => {
    let result = [...entries];
    
    if (activeCategory !== 'all') {
      result = result.filter(e => {
        if (activeCategory === 'reading') {
          return !['spell', 'dream', 'diary', 'event', 'note'].includes(e.type);
        }
        return e.type === activeCategory || (activeCategory === 'event' && e.spreadType === 'Evento');
      });
    }
    
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'date_desc' ? dateB - dateA : dateA - dateB;
    });
    
    return result;
  }, [entries, activeCategory, sortBy]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative h-full flex flex-col">
      <SectionLock isPaid={currentUser?.isPaid} className="absolute top-8 right-8 z-50" />
      
      <div className="mb-8 pt-8">
        <h2 className="text-4xl font-serif text-slate-100 gold-text tracking-wider uppercase mb-2">Meu Grimório</h2>
        <p className="text-slate-400">Seu registro pessoal de leituras, feitiços, sonhos e sabedoria.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Sidebar */}
        <div className="lg:col-span-1 border-r border-white/5 pr-4 flex flex-col gap-2">
          {GRIMOIRE_CATEGORIES.map(category => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => { setActiveCategory(category.id); setIsCreating(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left w-full
                  ${isActive 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium' 
                    : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200 border border-transparent'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="text-sm">{category.label}</span>
              </button>
            )
          })}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 relative">
          {isLocked && (
            <div className="absolute inset-0 z-30 bg-[#080510]/80 backdrop-blur-sm flex flex-col items-center justify-center border border-rose-500/20 rounded-3xl min-h-[500px]">
               <Lock className="w-12 h-12 text-rose-400 mb-4 opacity-80" />
               <h3 className="text-xl font-serif text-slate-200 mb-2">Grimório Pessoal Restrito</h3>
               <p className="text-sm text-slate-400 mb-6 text-center max-w-xs">Destrave todas as seções do seu Grimório para registrar magias, sonhos e anotações adquirindo a assinatura Premium.</p>
               <button className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-full text-sm uppercase tracking-wider shadow-lg hover:shadow-amber-500/25 transition-all">
                 Assinar Plano
               </button>
            </div>
          )}

          <div className={`${isLocked ? 'opacity-30 pointer-events-none' : ''}`}>
            
            <div className="flex justify-between items-center mb-6">
              <div className="glass-panel px-3 py-2 rounded-xl flex items-center border border-white/5 bg-black/20">
                <ArrowUpDown className="w-4 h-4 text-slate-400 mr-2" />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-slate-200 cursor-pointer focus:ring-0"
                >
                  <option value="date_desc">Mais Recentes</option>
                  <option value="date_asc">Mais Antigos</option>
                </select>
              </div>

              {!isCreating && (
                <button 
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 text-indigo-200 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" /> Novo Registro
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isCreating ? (
                <motion.div
                  key="create-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel rounded-3xl p-6 border border-white/10"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif text-slate-200">Adicionar ao Grimório</h3>
                    <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-200">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Categoria</label>
                      <select 
                        value={newEntryType}
                        onChange={(e) => setNewEntryType(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                      >
                        {GRIMOIRE_CATEGORIES.filter(c => c.id !== 'all' && c.id !== 'reading').map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Título</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Sonho com o Lobo de Prata..." 
                        value={newEntryTitle}
                        onChange={(e) => setNewEntryTitle(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Anotações / Descrição</label>
                      <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30 focus-within:border-indigo-500/50 transition-colors">
                        <Editor
                          editorState={editorState}
                          onEditorStateChange={(newState) => {
                            setEditorState(newState);
                            setNewEntryContent(draftToHtml(convertToRaw(newState.getCurrentContent())));
                          }}
                          wrapperClassName="demo-wrapper"
                          editorClassName="demo-editor px-5 py-4 min-h-[300px] text-slate-200 text-sm"
                          toolbarClassName="!bg-black/40 !border-b !border-white/10 !border-x-0 !border-t-0 text-slate-300"
                          toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                            inline: { inDropdown: false },
                            list: { inDropdown: true },
                            textAlign: { inDropdown: true },
                            link: { inDropdown: true },
                            history: { inDropdown: false },
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">Anexos</label>
                      <div className="flex flex-wrap gap-3 mb-3">
                        {attachments.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 pr-1">
                            {file.type === 'image' ? <ImageIcon className="w-3 h-3 text-indigo-400" /> : <FileText className="w-3 h-3 text-emerald-400" />}
                            <span className="text-xs text-slate-300 max-w-[100px] truncate">{file.name}</span>
                            <button 
                              onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                              className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-rose-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <input 
                          type="file" 
                          multiple
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*,application/pdf,.doc,.docx,.txt"
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-slate-300 transition-colors"
                        >
                          <ImageIcon className="w-4 h-4 text-slate-400" /> Imagem / Foto
                        </button>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-slate-300 transition-colors"
                        >
                          <File className="w-4 h-4 text-slate-400" /> Documento / PDF
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button 
                        onClick={handleSaveEntry}
                        disabled={!newEntryTitle.trim()}
                        className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        Salvar no Grimório
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {filteredAndSortedEntries.length === 0 ? (
                    <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center border-dashed border-white/20 min-h-[400px]">
                      <ScrollText className="w-16 h-16 text-slate-600 mb-4 opacity-50" />
                      <h3 className="text-xl font-serif text-slate-300 mb-2">Nenhum registro encontrado</h3>
                      <p className="text-slate-500 max-w-sm">
                        {activeCategory === 'all' 
                          ? "Seu Grimório está vazio. Consulte o Oráculo ou crie uma nova anotação."
                          : "Categoria vazia. Clique em 'Novo Registro' para adicionar."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredAndSortedEntries.map((entry) => (
                        <div key={entry.id} className="glass-panel rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all overflow-hidden bg-black/10">
                          <div 
                            className="p-5 cursor-pointer flex flex-col md:flex-row justify-between md:items-center gap-4"
                            onClick={() => toggleExpand(entry.id)}
                          >
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-slate-200 line-clamp-1">{entry.title || entry.question}</h3>
                              {entry.cards && entry.cards.length > 0 && (
                                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 hide-scrollbar">
                                  {entry.cards.map((card: string, i: number) => (
                                    <span key={i} className="whitespace-nowrap px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-300 text-[10px]">
                                      {card}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto w-full">
                              <div className="flex flex-col items-start md:items-end gap-1 text-sm text-slate-400 font-mono">
                                <span className="bg-white/5 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">{entry.spreadType || entry.type || 'Anotação'}</span>
                                <span className="flex items-center gap-1 text-xs"><Calendar className="w-3 h-3"/> {new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                              </div>
                              <button className="text-indigo-400 hover:text-indigo-300 p-1.5 rounded-full hover:bg-white/10 transition-colors">
                                {expandedId === entry.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {expandedId === entry.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-white/5"
                              >
                                <div className="p-6 bg-black/30 text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none">
                                  {/<[a-z][\s\S]*>/i.test(entry.content || entry.interpretation || '') ? (
                                    <div dangerouslySetInnerHTML={{ __html: entry.content || entry.interpretation || '' }} className="tinymce-content" />
                                  ) : (
                                    <Markdown>{entry.content || entry.interpretation}</Markdown>
                                  )}
                                  
                                  {entry.attachments && entry.attachments.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-white/5">
                                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Anexos</h4>
                                      <div className="flex flex-wrap gap-4">
                                        {entry.attachments.map((file: any, i: number) => (
                                          <div key={i}>
                                            {file.type === 'image' ? (
                                              <div className="rounded-lg overflow-hidden border border-white/10 max-w-[200px]">
                                                <img src={file.url} alt={file.name} className="w-full h-auto object-cover" />
                                                <div className="bg-black/50 p-2 text-[10px] text-slate-400 truncate" title={file.name}>{file.name}</div>
                                              </div>
                                            ) : (
                                              <a href={file.url} download={file.name} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-indigo-300 transition-colors">
                                                <FileText className="w-4 h-4" /> <span className="max-w-[120px] truncate" title={file.name}>{file.name}</span>
                                              </a>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

