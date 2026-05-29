import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Book, ChevronRight, ChevronDown, Calendar, Filter, ArrowUpDown, Lock, Sparkles, Plus, Image as ImageIcon, FileText, File, Moon, BookOpen, ScrollText, CalendarDays, X, PenTool, Trash2, Edit2, Sparkle, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { SectionLock } from './ui/SectionLock';
import { AdBanner } from './AdBanner';

const GRIMOIRE_CATEGORIES = [
  { id: 'all', label: 'Tudo', icon: Book },
  { id: 'reading', label: 'Leituras Oraculares', icon: Sparkles },
  { id: 'spell', label: 'Feitiços e Rituais', icon: PenTool },
  { id: 'dream', label: 'Diário de Sonhos', icon: Moon },
  { id: 'diary', label: 'Diário Pessoal', icon: BookOpen },
  { id: 'event', label: 'Eventos e Datas', icon: CalendarDays },
  { id: 'note', label: 'Anotações Diversas', icon: ScrollText },
];

export function GrimoireView({ 
  entries, 
  addEntry, 
  updateEntry, 
  deleteEntry, 
  currentUser 
}: { 
  entries: any[], 
  addEntry?: (e: any) => void, 
  updateEntry?: (id: string, f: any) => void, 
  deleteEntry?: (id: string) => void, 
  currentUser: any 
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Google sync states
  const [syncToGoogle, setSyncToGoogle] = useState(false);
  const [exportFormat, setExportFormat] = useState<'gdoc' | 'txt'>('gdoc');
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<Record<string, { status: string, link?: string }>>({});

  // AI Real-time analyzer states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    correctedText: string;
    grammarIssues: string[];
    refinementTips: string[];
    mysticalResonance: string;
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { getAccessToken } = await import('../lib/firebase');
        const t = await getAccessToken();
        setGoogleToken(t);
      } catch (error) {
        console.error("Could not load login state:", error);
      }
    };
    fetchToken();
  }, [entries]);

  const syncToDocs = async (title: string, htmlContent: string, entryId: string, format: 'gdoc' | 'txt' = 'gdoc') => {
    try {
      setIsSyncing(entryId);
      const { getAccessToken } = await import('../lib/firebase');
      const token = await getAccessToken();
      if (!token) {
        alert("Sua sessão do Google Workspace expirou. Por favor, conecte-se novamente na aba Workspace.");
        setIsSyncing(null);
        return;
      }

      const cleanText = htmlContent.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n').trim() || "Sem descrição.";
      const rawText = `${title}\n\nSincronizado via Grimório da Oracle Academy\nData: ${new Date().toLocaleDateString('pt-BR')}\n\n${cleanText}`;

      if (format === 'txt') {
        // Create standard plain text file metadata on Google Drive
        const boundary = 'foo_bar_boundary';
        const metadata = {
          name: `${title} - Grimório.txt`,
          mimeType: 'text/plain'
        };

        const multipartBody = 
          `\r\n--${boundary}\r\n` +
          `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
          JSON.stringify(metadata) +
          `\r\n--${boundary}\r\n` +
          `Content-Type: text/plain; charset=UTF-8\r\n\r\n` +
          rawText +
          `\r\n--${boundary}--`;

        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: multipartBody
        });

        if (res.ok) {
          const fileData = await res.json();
          setSyncFeedback(prev => ({
            ...prev,
            [entryId]: {
              status: 'success',
              link: `https://drive.google.com/file/d/${fileData.id}/view`
            }
          }));
        } else {
          throw new Error('Falha ao exportar em formato .txt');
        }
      } else {
        // 1. Create a Google Doc
        const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: `${title} - Grimório`,
            mimeType: 'application/vnd.google-apps.document'
          })
        });

        if (!createRes.ok) {
          throw new Error('Falha ao criar arquivo no Google Drive');
        }

        const fileData = await createRes.json();
        const fileId = fileData.id;

        // 2. Upload content
        const uploadRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/plain; charset=UTF-8'
          },
          body: rawText
        });

        if (uploadRes.ok) {
          setSyncFeedback(prev => ({
            ...prev,
            [entryId]: {
              status: 'success',
              link: `https://docs.google.com/document/d/${fileId}/edit`
            }
          }));
        } else {
          throw new Error('Falha ao enviar conteúdo do documento');
        }
      }
    } catch (err: any) {
      console.error(err);
      setSyncFeedback(prev => ({
        ...prev,
        [entryId]: { status: 'error' }
      }));
    } finally {
      setIsSyncing(null);
    }
  };
  
  // New Entry state
  const [isCreating, setIsCreating] = useState(false);
  const [newEntryType, setNewEntryType] = useState('diary');
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<{name: string, type: string, url: string}[]>([]);

  const isLocked = false; // Always unlocked now since they said premium is unlocked

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

  // AI note grammar and refinement checking in real-time
  const analyzeWithAI = async () => {
    if (!newEntryTitle.trim() && !newEntryContent.replace(/<[^>]*>/g, '').trim()) {
      setAiError("Escreva algo no título ou na anotação antes de sintonizar o mentor.");
      return;
    }
    setIsAnalyzing(true);
    setAiError(null);
    setAiResult(null);
    try {
      const cleanText = newEntryContent.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n').trim();
      const res = await fetch('/api/ai/analyze-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newEntryTitle,
          content: cleanText || newEntryContent,
          type: newEntryType
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data);
      } else {
        throw new Error("O canal com o mentor hermético foi rompido temporariamente.");
      }
    } catch (err: any) {
      setAiError(err.message || "Erro de conexão astral com a inteligência cósmica.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Replace active contents with AI polished content
  const applyAICorrection = () => {
    if (!aiResult?.correctedText) return;
    const text = aiResult.correctedText;
    
    // Convert text back to draft editor structure safely
    const blocksFromHtml = htmlToDraft(text);
    if (blocksFromHtml) {
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
      setNewEntryContent(draftToHtml(convertToRaw(newEditorState.getCurrentContent())));
      setNewEntryTitle(newEntryTitle || "Anotação Refinada por IA");
    }
    setAiResult(null);
  };

  const handleEditEntry = (entry: any) => {
    setIsCreating(true);
    setEditingId(entry.id);
    setNewEntryType(entry.type || 'diary');
    setNewEntryTitle(entry.title || entry.question || '');
    setNewEntryContent(entry.content || entry.interpretation || '');
    setAttachments(entry.attachments || []);

    const content = entry.content || entry.interpretation || '';
    const blocksFromHtml = htmlToDraft(content);
    if (blocksFromHtml) {
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
    }
  };

  const handleDeleteEntry = (id: string, title: string) => {
    const confirmed = window.confirm(`Deseja realmente dissipar "${title}" para sempre de seu grimório?`);
    if (!confirmed) return;
    if (deleteEntry) {
      deleteEntry(id);
    }
  };

  const handleSaveEntry = async () => {
    if (!newEntryTitle.trim()) return;

    const entryId = editingId || Date.now().toString();
    const entryPayload = {
      id: entryId,
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
    };

    if (editingId) {
      if (updateEntry) {
        updateEntry(editingId, entryPayload);
      }
    } else {
      if (addEntry) {
        addEntry(entryPayload);
      }
    }

    if (syncToGoogle && googleToken) {
      await syncToDocs(newEntryTitle, newEntryContent, entryId, exportFormat);
    }

    setIsCreating(false);
    setEditingId(null);
    setNewEntryTitle('');
    setNewEntryContent('');
    setEditorState(EditorState.createEmpty());
    setAttachments([]);
    setSyncToGoogle(false);
    setAiResult(null);
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
    <div className="w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 relative h-full flex flex-col">
      <SectionLock isPaid={currentUser?.isPaid} className="absolute top-8 right-8 z-50" />
      
      <div className="mb-8 pt-8">
        <h2 className="text-4xl font-serif text-slate-100 gold-text tracking-wider uppercase mb-2">Meu Grimório</h2>
        <p className="text-slate-400">Seu registro pessoal de leituras, feitiços, sonhos e sabedoria.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Sidebar */}
        <div className="lg:col-span-1 border-r border-[#1e1b4b] pr-4 flex flex-col gap-2">
          {GRIMOIRE_CATEGORIES.map(category => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => { setActiveCategory(category.id); setIsCreating(false); }}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left w-full
                  ${isActive 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase tracking-widest text-xs shadow-md shadow-indigo-500/10' 
                    : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200 border border-transparent font-semibold uppercase tracking-wider text-[11px]'
                  }`}
              >
                <motion.div animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}} transition={{ repeat: isActive ? Infinity : 0, duration: 2, ease: "easeInOut" }}>
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                </motion.div>
                <span>{category.label}</span>
              </button>
            )
          })}
          
          <div className="mt-8">
            <AdBanner placement="grimoire" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 relative">
          {isLocked && (
            <div className="absolute inset-0 z-30 bg-[#080510]/80 backdrop-blur-sm flex flex-col items-center justify-center border border-rose-500/20 rounded-3xl min-h-[500px]">
               <Lock className="w-12 h-12 text-rose-400 mb-4 opacity-80" />
               <h3 className="text-xl font-serif text-slate-200 mb-2">Grimório Pessoal Restrito</h3>
               <p className="text-sm text-slate-400 mb-6 text-center max-w-xs">Destrave todas as seções do seu Grimório para registrar magias, sonhos e anotações adquirindo a assinatura Premium.</p>
               <button onClick={() => document.dispatchEvent(new CustomEvent('OPEN_SUBSCRIPTION_MODAL'))} className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bold rounded-full text-sm uppercase tracking-wider shadow-lg hover:shadow-amber-500/25 transition-all">
                 Assinar Plano
               </button>
            </div>
          )}

          <div className={`${isLocked ? 'opacity-30 pointer-events-none' : ''}`}>
            
            <div className="flex justify-between items-center mb-6">
              <div className="glass-panel px-3 py-2 rounded-xl flex items-center border border-[#1e1b4b] bg-black/20">
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
                  className="glass-panel rounded-3xl p-6 border border-[#1e1b4b]"
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
                        className="w-full bg-black/20 border border-[#1e1b4b] rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
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
                        className="w-full bg-black/20 border border-[#1e1b4b] rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Anotações / Descrição</label>
                      <div className="rounded-xl overflow-hidden border border-[#1e1b4b] bg-black/30 focus-within:border-indigo-500/50 transition-colors">
                        <Editor
                          editorState={editorState}
                          onEditorStateChange={(newState) => {
                            setEditorState(newState);
                            setNewEntryContent(draftToHtml(convertToRaw(newState.getCurrentContent())));
                          }}
                          wrapperClassName="demo-wrapper"
                          editorClassName="demo-editor px-5 py-4 min-h-[250px] text-slate-200 text-sm"
                          toolbarClassName="!bg-black/40 !border-b !border-[#1e1b4b] !border-x-0 !border-t-0 text-slate-300"
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
                      
                      {/* AI Mentor Integration panel */}
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-[11px] text-slate-500 font-light flex items-center gap-1">🔮 Use a Centelha Cósmica para polir e corrigir suas anotações oraculares de forma profissional.</p>
                        <button
                          type="button"
                          onClick={analyzeWithAI}
                          disabled={isAnalyzing}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-semibold transition-all disabled:opacity-50 active:scale-95"
                        >
                          {isAnalyzing ? (
                            <>
                              <RefreshCw className="w-3" /> Analisando Éter...
                            </>
                          ) : (
                            <>
                              <Sparkle className="w-3 h-3 text-indigo-400 animate-pulse" /> Sintonizar Mentor IA
                            </>
                          )}
                        </button>
                      </div>

                      <AnimatePresence>
                        {aiError && (
                          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" /> {aiError}
                          </motion.div>
                        )}
                        {aiResult && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 p-4 rounded-2xl bg-indigo-950/25 border border-indigo-500/30 text-xs relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                              <Sparkles className="w-16 h-16 text-indigo-400" />
                            </div>

                            <div className="flex items-center justify-between gap-4 border-b border-indigo-500/15 pb-2 mb-3">
                              <span className="font-serif text-indigo-300 font-semibold flex items-center gap-1.5">🔮 Mentor Hermético da Oracle Academy</span>
                              <span className="bg-indigo-500/15 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-indigo-300 border border-[#312e81]">Modulação: {aiResult.mysticalResonance}</span>
                            </div>

                            <div className="space-y-3 font-light text-slate-300 leading-relaxed">
                              {aiResult.grammarIssues && aiResult.grammarIssues.length > 0 && (
                                <div>
                                  <h5 className="font-semibold text-slate-200 flex items-center gap-1 mt-1 text-[11px]">✓ Purificação Gramatical</h5>
                                  <ul className="list-disc list-inside pl-1 text-[11px] text-zinc-400 space-y-0.5">
                                    {aiResult.grammarIssues.map((issue, idx) => (
                                      <li key={idx}>{issue}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {aiResult.refinementTips && aiResult.refinementTips.length > 0 && (
                                <div>
                                  <h5 className="font-semibold text-slate-200 flex items-center gap-1 text-[11px]">🔮 Elevação e Aprimoramento Místico</h5>
                                  <ul className="list-disc list-inside pl-1 text-[11px] text-slate-400 space-y-0.5">
                                    {aiResult.refinementTips.map((tip, idx) => (
                                      <li key={idx}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="pt-2 border-t border-[#1e1b4b] flex flex-col gap-1">
                                <span className="text-[10px] text-indigo-300 font-medium">Visualização da Escrita Refinada:</span>
                                <div className="italic p-3 rounded-lg bg-black/40 border border-[#1e1b4b] text-slate-300 leading-relaxed text-[11px]" dangerouslySetInnerHTML={{ __html: aiResult.correctedText }} />
                              </div>

                              <div className="flex justify-end gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setAiResult(null)}
                                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] font-medium transition-all"
                                >
                                  Dispensar
                                </button>
                                <button
                                  type="button"
                                  onClick={applyAICorrection}
                                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold flex items-center gap-1 transition-all shadow-md active:scale-95"
                                >
                                  <Check className="w-3 h-3 text-indigo-200" /> Incorporar Escrita Refinada
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">Anexos (Imagem, Vídeo, Áudio ou Foto)</label>
                      <div className="flex flex-wrap gap-3 mb-3">
                        {attachments.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 bg-white/5 border border-[#1e1b4b] rounded-lg px-3 py-1.5 pr-1">
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
                          accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.txt"
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-[#1e1b4b] rounded-lg text-xs text-slate-200 transition-colors"
                        >
                          <ImageIcon className="w-4 h-4 text-indigo-400" /> Imagem / Foto
                        </button>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-[#1e1b4b] rounded-lg text-xs text-slate-200 transition-colors"
                        >
                          <File className="w-4 h-4 text-emerald-400" /> Documento / Áudio / Vídeo
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1e1b4b]">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="syncToggle"
                            checked={syncToGoogle}
                            onChange={(e) => setSyncToGoogle(e.target.checked)}
                            disabled={!googleToken}
                            className="w-4 h-4 rounded text-indigo-600 bg-black/40 border-[#1e1b4b] focus:ring-indigo-500/50 cursor-pointer disabled:cursor-not-allowed"
                          />
                          <label htmlFor="syncToggle" className={`text-xs cursor-pointer select-none ${googleToken ? 'text-indigo-300 font-medium' : 'text-slate-500'}`}>
                            {googleToken ? 'Exportação automática para o Google Drive ao salvar' : 'Conecte-se ao Google Workspace para sincronizar automaticamente'}
                          </label>
                        </div>
                        
                        {/* Auto-export format pills */}
                        {syncToGoogle && (
                          <div className="flex items-center gap-2 bg-black/40 border border-[#1e1b4b] px-3 py-1 text-xs rounded-xl w-fit mt-1">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Formato:</span>
                            <button
                              type="button"
                              onClick={() => setExportFormat('gdoc')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${exportFormat === 'gdoc' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                              Documento (.gdoc)
                            </button>
                            <button
                              type="button"
                              onClick={() => setExportFormat('txt')}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${exportFormat === 'txt' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                              Texto (.txt)
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => { setIsCreating(false); setEditingId(null); setAiResult(null); }}
                          className="px-4 py-2 hover:bg-white/5 text-slate-300 rounded-lg text-sm transition-colors"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={handleSaveEntry}
                          disabled={!newEntryTitle.trim()}
                          className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                          {editingId ? 'Atualizar Registro' : 'Salvar no Grimório'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {filteredAndSortedEntries.length === 0 ? (
                    <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center border-dashed border-[#312e81] min-h-[400px]">
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
                        <div key={entry.id} className="glass-panel rounded-2xl border border-[#1e1b4b] hover:border-indigo-500/30 transition-all overflow-hidden bg-black/10">
                          <div 
                            className="p-5 cursor-pointer flex flex-col md:flex-row justify-between md:items-center gap-4"
                            onClick={() => toggleExpand(entry.id)}
                          >
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-slate-200 line-clamp-1">{entry.title || entry.question}</h3>
                              {entry.cards && entry.cards.length > 0 && (
                                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 hide-scrollbar">
                                  {entry.cards.map((card: string, i: number) => (
                                    <span key={i} className="whitespace-nowrap px-2 py-1 bg-indigo-500/10 border border-[#312e81] rounded-md text-indigo-300 text-[10px]">
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
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditEntry(entry);
                                  }}
                                  className="text-indigo-400 hover:text-indigo-300 p-2 rounded-lg hover:bg-white/5 transition-all"
                                  title="Editar Registro"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEntry(entry.id, entry.title || entry.question);
                                  }}
                                  className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-white/5 transition-all"
                                  title="Excluir Registro"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <button className="text-indigo-400 hover:text-indigo-300 p-2 rounded-lg hover:bg-white/5 transition-all">
                                  {expandedId === entry.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {expandedId === entry.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-[#1e1b4b]"
                              >
                                <div className="p-6 bg-black/30 text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none">
                                  {/<[a-z][\s\S]*>/i.test(entry.content || entry.interpretation || '') ? (
                                    <div dangerouslySetInnerHTML={{ __html: entry.content || entry.interpretation || '' }} className="tinymce-content html-output" />
                                  ) : (
                                    <Markdown>{entry.content || entry.interpretation}</Markdown>
                                  )}
                                  
                                  {entry.attachments && entry.attachments.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-[#1e1b4b]">
                                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Anexos</h4>
                                      <div className="flex flex-wrap gap-4">
                                        {entry.attachments.map((file: any, i: number) => (
                                          <div key={i}>
                                            {file.type === 'image' ? (
                                              <div className="rounded-lg overflow-hidden border border-[#1e1b4b] max-w-[200px]">
                                                <img src={file.url} alt={file.name} className="w-full h-auto object-cover" />
                                                <div className="bg-black/50 p-2 text-[10px] text-slate-400 truncate" title={file.name}>{file.name}</div>
                                              </div>
                                            ) : (
                                              <a href={file.url} download={file.name} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-[#1e1b4b] rounded-lg text-xs text-indigo-300 transition-colors">
                                                <FileText className="w-4 h-4" /> <span className="max-w-[120px] truncate" title={file.name}>{file.name}</span>
                                              </a>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Google Docs/Text Export Section */}
                                  <div className="mt-6 pt-4 border-t border-indigo-500/15 flex flex-wrap items-center justify-between gap-4">
                                    <div className="text-xs text-slate-500">
                                      {syncFeedback[entry.id]?.status === 'success' ? (
                                        <span className="text-emerald-400 font-medium flex items-center gap-1">✓ Sincronizado com sucesso com o seu Google Drive</span>
                                      ) : syncFeedback[entry.id]?.status === 'error' ? (
                                        <span className="text-rose-400">Falha ao salvar no Google Drive</span>
                                      ) : (
                                        'Google Workspace Integration'
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      {syncFeedback[entry.id]?.link ? (
                                        <a
                                          href={syncFeedback[entry.id].link}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-500/30 transition-all flex items-center gap-1"
                                        >
                                          ✓ Abrir no Drive
                                        </a>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => syncToDocs(entry.title || entry.question, entry.content || entry.interpretation, entry.id, 'gdoc')}
                                            disabled={isSyncing === entry.id}
                                            className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
                                          >
                                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                            {isSyncing === entry.id ? 'Salvando...' : 'Exportar Doc (.gdoc)'}
                                          </button>
                                          <button
                                            onClick={() => syncToDocs(entry.title || entry.question, entry.content || entry.interpretation, entry.id, 'txt')}
                                            disabled={isSyncing === entry.id}
                                            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
                                          >
                                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                                            {isSyncing === entry.id ? 'Salvando...' : 'Exportar Texto (.txt)'}
                                          </button>
                                          <button
                                            onClick={() => {
                                              import("jspdf").then(({ jsPDF }) => {
                                                const doc = new jsPDF();
                                                doc.setFont("helvetica", "bold");
                                                doc.text(entry.title || entry.question || "Grimoire Entry", 20, 20);
                                                doc.setFont("helvetica", "normal");
                                                const cleanText = (entry.content || entry.interpretation || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
                                                const lines = doc.splitTextToSize(cleanText, 170);
                                                doc.text(lines, 20, 30);
                                                doc.save(`${(entry.title || entry.question || "entry").replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
                                              });
                                            }}
                                            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                                          >
                                            <FileText className="w-3.5 h-3.5 text-rose-400" />
                                            Baixar PDF
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
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

