import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ListTodo, 
  TableProperties, 
  Presentation, 
  MessageSquare, 
  StickyNote, 
  Users2, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Share2, 
  Send,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { googleSignIn, googleLogout, getAccessToken } from '../../lib/firebase';

interface WorkspaceViewProps {
  currentUser: any;
}

export function WorkspaceView({ currentUser }: WorkspaceViewProps) {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'tasks' | 'sheets' | 'slides' | 'chat' | 'keep' | 'contacts' | 'meet' | 'gmail' | 'forms'>('calendar');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // API Data states
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [spreadsheets, setSpreadsheets] = useState<any[]>([]);
  const [presentations, setPresentations] = useState<any[]>([]);
  const [chatSpaces, setChatSpaces] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [formUrl, setFormUrl] = useState<string | null>(null);
  
  // Local Google Keep-style notes backup synced as Google Docs on Drive
  const [notes, setNotes] = useState<any[]>([
    { id: '1', title: 'Ritos Iniciáticos', content: 'Preparar incenso de alecrim e vela azul para meditação no próximo alinhamento solar.', color: 'bg-amber-500/10 border-amber-500/30' },
    { id: '2', title: 'Equações da Alma', content: 'As estrelas não determinam o destino, elas apenas sugerem o fluxo cósmico.', color: 'bg-purple-500/10 border-purple-500/30' }
  ]);

  // Form input states
  const [newEvent, setNewEvent] = useState({ summary: '', description: '', date: '', time: '' });
  const [newTask, setNewTask] = useState({ title: '' });
  const [newNote, setNewNote] = useState({ title: '', content: '', color: 'rose' });
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState('');
  const [sheetLog, setSheetLog] = useState({ activity: 'Meditação Terrena', xpGained: '25', notes: '' });
  const [newPresentationTitle, setNewPresentationTitle] = useState('Grimório Celeste de ' + (currentUser?.name || 'Buscador'));
  const [chatMessage, setChatMessage] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('');
  const [emailForm, setEmailForm] = useState({ to: '', subject: '', body: '' });
  const [formTitle, setFormTitle] = useState('');

  // Validate authenticated status on load (or recover token)
  useEffect(() => {
    getAccessToken().then(tk => {
      if (tk) {
        setToken(tk);
        loadInitialData(tk);
      }
    });
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setSuccessMessage('Sua conta foi sintonizada com o Google Workspace!');
        loadInitialData(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Falha ao autenticar com o Google.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('Deseja desconectar sua conta dorg Google Workspace?');
    if (!confirmed) return;
    await googleLogout();
    setToken(null);
    setEvents([]);
    setTasks([]);
    setSpreadsheets([]);
    setPresentations([]);
    setContacts([]);
    setSuccessMessage('Sessão do Google desconectada com sucesso.');
  };

  const loadInitialData = (accessToken: string) => {
    fetchCalendarEvents(accessToken);
    fetchGoogleTasks(accessToken);
    fetchDriveSpreadsheets(accessToken);
    fetchDrivePresentations(accessToken);
    fetchGoogleContacts(accessToken);
    fetchChatSpaces(accessToken);
  };

  const showNotification = (msg: string, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  // ==================== GOOGLE CALENDAR API ====================
  const fetchCalendarEvents = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const minDate = new Date().toISOString();
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=8&orderBy=startTime&singleEvents=true&timeMin=${minDate}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.items || []);
      } else {
        console.warn("Calendar API returned non-OK status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!newEvent.summary || !newEvent.date || !newEvent.time) {
      showNotification('Preencha os campos obrigatórios do item da agenda.', false);
      return;
    }

    const startDateTime = `${newEvent.date}T${newEvent.time}:00`;
    const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString(); // 1 hour duration

    const confirmed = window.confirm(`Deseja agendar "${newEvent.summary}" no seu Google Calendar oficial?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: newEvent.summary,
          description: newEvent.description || 'Criado diretamente via Oracle Platform',
          start: { dateTime: new Date(startDateTime).toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
          end: { dateTime: endDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }
        })
      });

      if (res.ok) {
        showNotification('Evento celestial agendado com sucesso!');
        setNewEvent({ summary: '', description: '', date: '', time: '' });
        fetchCalendarEvents(token);
      } else {
        showNotification('Erro ao criar evento na agenda externa.', false);
      }
    } catch (err) {
      console.error(err);
      showNotification('Erro de rede ao sintonizar a agenda celestial.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, summary: string) => {
    const confirmed = window.confirm(`Remover "${summary}" permanentemente da sua agenda Google?`);
    if (!confirmed) return;
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showNotification('Evento astral excluído com sucesso.');
        fetchCalendarEvents(token);
      } else {
        showNotification('Ocorreu um erro ao excluir da agenda externa.', false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== GOOGLE TASKS API ====================
  const fetchGoogleTasks = async (accessToken: string) => {
    try {
      const res = await fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks?maxResults=10', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.items || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newTask.title.trim()) return;

    const confirmed = window.confirm(`Adicionar tarefa "${newTask.title}" na sua lista oficial do Google Tasks?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const res = await fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTask.title,
          notes: 'Gerado pela Oracle Platform - Integração Celestial'
        })
      });

      if (res.ok) {
        showNotification('Tarefa criada com sucesso!');
        setNewTask({ title: '' });
        fetchGoogleTasks(token);
      } else {
        showNotification('Erro ao criar tarefa no Google Tasks.', false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string, title: string) => {
    if (!token) return;
    const nextStatus = currentStatus === 'completed' ? 'needsAction' : 'completed';

    const confirmed = window.confirm(`Marcar "${title}" como ${nextStatus === 'completed' ? 'Concluída' : 'Pendente'} no Google Tasks?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: nextStatus,
          completed: nextStatus === 'completed' ? new Date().toISOString() : null
        })
      });

      if (res.ok) {
        showNotification('Status da tarefa espiritual atualizado!');
        fetchGoogleTasks(token);
      } else {
        showNotification('Erro ao atualizar status do serviço.', false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== GOOGLE SHEETS API ====================
  const fetchDriveSpreadsheets = async (accessToken: string) => {
    try {
      // Find spreadsheets in Drive
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSpreadsheets(data.files || []);
        if (data.files && data.files.length > 0) {
          setSelectedSpreadsheet(data.files[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAppendToSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedSpreadsheet) return;

    const confirmed = window.confirm('Deseja registrar essa linha de dados celestial na tabela do Google Sheets selecionada?');
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const values = [
        [
          new Date().toLocaleDateString(),
          sheetLog.activity,
          sheetLog.xpGained + ' XP',
          sheetLog.notes || 'Sem comentários adicionais.'
        ]
      ];

      // Append row to active sheet using Sheets API v4
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${selectedSpreadsheet}/values/A1:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: 'A1',
          majorDimension: 'ROWS',
          values: values
        })
      });

      if (res.ok) {
        showNotification('Seus estudos cósmicos foram registrados com sucesso no Sheets!');
        setSheetLog({ activity: 'Meditação Terrena', xpGained: '25', notes: '' });
      } else {
        showNotification('Falha ao escrever dados. Verifique se a planilha possui abas válidas.', false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== GOOGLE SLIDES API ====================
  const fetchDrivePresentations = async (accessToken: string) => {
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.presentation'&fields=files(id,name)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPresentations(data.files || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newPresentationTitle.trim()) return;

    const confirmed = window.confirm(`Deseja criar uma apresentação do Google Slides intitulada "${newPresentationTitle}" em seu Google Drive?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      // 1. Create presentation on Sheets/Slides REST API
      const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newPresentationTitle
        })
      });

      if (createRes.ok) {
        const presentationData = await createRes.json();
        showNotification(`Apresentação "${newPresentationTitle}" criada com êxito!`);
        fetchDrivePresentations(token);
        
        // Let's add an initial slide template using batchUpdate
        await fetch(`https://slides.googleapis.com/v1/presentations/${presentationData.presentationId}:batchUpdate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requests: [
              {
                createSlide: {
                  insertionIndex: '1',
                  slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' }
                }
              }
            ]
          })
        });
      } else {
        showNotification('Erro ao inicializar o Google Slides no projeto.', false);
      }
    } catch (err) {
      console.error(err);
      showNotification('Erro de comunicação mística.', false);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== GOOGLE CHAT INTEGRATION ====================
  const fetchChatSpaces = async (accessToken: string) => {
    try {
      const res = await fetch('https://chat.googleapis.com/v1/spaces', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChatSpaces(data.spaces || []);
        if (data.spaces && data.spaces.length > 0) {
          setSelectedSpace(data.spaces[0].name);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !chatMessage.trim()) return;

    const spaceLabel = chatSpaces.find(s => s.name === selectedSpace)?.displayName || 'Espaço Selecionado';
    const confirmed = window.confirm(`Enviar mensagem celestial para o espaço "${spaceLabel}" no Google Chat?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const res = await fetch(`https://chat.googleapis.com/v1/${selectedSpace}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: `🌌 *Transmissão Astral* 🌌\n\n"${chatMessage}"`
        })
      });

      if (res.ok) {
        showNotification('Sua transmissão divina foi decolada para o Google Chat!');
        setChatMessage('');
      } else {
        showNotification('Não foi possível enviar para o Chat. Verifique as permissões do robô no Espaço.', false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== PEOPLE API (CONTACTS) ====================
  const fetchGoogleContacts = async (accessToken: string) => {
    try {
      const res = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,photos', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data.connections || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==================== GOOGLE DOCUMENT EXPORT (FOR KEEP) ====================
  const handleAddLocalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;

    const colorClasses = [
      'bg-amber-500/10 border-amber-500/30 text-amber-300',
      'bg-blue-500/10 border-blue-500/30 text-cyan-300',
      'bg-rose-500/10 border-rose-500/30 text-rose-300',
      'bg-purple-500/10 border-purple-500/30 text-purple-300'
    ];
    
    let chosenColor = colorClasses[0];
    if (newNote.color === 'blue') chosenColor = colorClasses[1];
    if (newNote.color === 'rose') chosenColor = colorClasses[2];
    if (newNote.color === 'purple') chosenColor = colorClasses[3];

    const note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      color: chosenColor
    };

    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', color: 'amber' });
    showNotification('Insight guardado com sucesso.');
  };

  const handleExportNoteToDriveDocs = async (title: string, content: string) => {
    if (!token) {
      showNotification('Você precisa estar sintonizado ao Google para fazer isso.', false);
      return;
    }

    const confirmed = window.confirm(`Deseja exportar o insight "${title}" como um Google Document em seu Drive celestial?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${title} - Grimório Insight`,
          mimeType: 'application/vnd.google-apps.document'
        })
      });

      if (res.ok) {
        const file = await res.json();
        
        // Try uploading note content to this document
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${file.id}?uploadType=media`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain'
          },
          body: `${title}\n\n${content}\n\nDocumento exportado misticamente via Oracle Platforms.`
        });

        showNotification('Nota exportada e sincronizada como Google Doc com sucesso!');
      } else {
        showNotification('Não foi possível inicializar a sincronização de arquivos.', false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== GOOGLE MEET API ====================
  const handleCreateMeet = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('https://meet.googleapis.com/v2/spaces', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        setMeetLink(data.meetingUri);
        showNotification('Sala do Google Meet criada com sucesso!');
      } else {
        showNotification('Erro ao criar sala do Meet.', false);
      }
    } catch (e) {
       console.error(e);
    } finally {
       setIsLoading(false);
    }
  };

  // ==================== GMAIL API ====================
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const confirmed = window.confirm(`Deseja enviar este email para ${emailForm.to}?`);
    if (!confirmed) return;
    setIsLoading(true);
    try {
      const rawMsg = `To: ${emailForm.to}\nSubject: ${emailForm.subject}\n\n${emailForm.body}`;
      const encoded = btoa(unescape(encodeURIComponent(rawMsg))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw: encoded })
      });
      if (res.ok) {
        showNotification('Mensagem astral enviada via Gmail com sucesso!');
        setEmailForm({ to: '', subject: '', body: '' });
      } else {
        showNotification('Erro ao enviar email.', false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== GOOGLE FORMS API ====================
  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const confirmed = window.confirm(`Criar um novo Google Form intitulado "${formTitle}"?`);
    if (!confirmed) return;
    setIsLoading(true);
    try {
      const res = await fetch('https://forms.googleapis.com/v1/forms', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ info: { title: formTitle, documentTitle: formTitle } })
      });
      if (res.ok) {
        const data = await res.json();
        setFormUrl(`https://docs.google.com/forms/d/${data.formId}/edit`);
        showNotification('Formulário criado com sucesso!');
        setFormTitle('');
      } else {
        showNotification('Erro ao criar formulário.', false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 md:px-8 bg-[#050505] text-slate-100 rounded-[3rem] border border-white/5 relative overflow-hidden">
      
      {/* Background radial effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[110px] pointer-events-none z-0" />

      {/* Hero Header */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-16 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-3 text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[0.25em]">Portal de Sincronia</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-100 tracking-tight">
            Santuário e Google Workspace
          </h1>
          <p className="text-slate-400 font-light mt-2 max-w-xl text-sm md:text-base leading-relaxed">
            Sintonize seus rituais, rotinas de estudos espirituais e registros áuricos mundos afora conectando-os aos seus aplicativos favoritos do Google Workspace em tempo real.
          </p>
        </div>

        {/* Auth status box */}
        <div className="flex-shrink-0">
          {token ? (
            <div className="p-4 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-400/20 rounded-3xl flex items-center gap-4 transition-all max-w-xs shadow-2xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">WORKSPACE SINTONIZADO</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-300 font-medium truncate max-w-[120px]">{currentUser?.name || 'Buscador'}</span>
                  <button onClick={handleLogout} className="p-1 rounded-md text-rose-400 hover:bg-rose-500/20 transition-all ml-2" title="Desconectar do Google">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="px-6 py-4 rounded-3xl bg-indigo-600 hover:bg-indigo-500 font-medium text-white shadow-[0_15px_35px_rgba(99,102,241,0.4)] transition-all flex items-center gap-3 border border-indigo-400/20"
            >
              {isLoggingIn ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4" style={{ display: "block" }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
              )}
              {isLoggingIn ? 'Conectando...' : 'Sintonizar com o Google'}
            </motion.button>
          )}
        </div>
      </div>

      {/* Notifications bar */}
      <AnimatePresence>
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {successMessage}
            </div>
            <button className="text-xs" onClick={() => setSuccessMessage(null)}>fechar</button>
          </motion.div>
        )}
        {errorMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {errorMessage}
            </div>
            <button className="text-xs" onClick={() => setErrorMessage(null)}>fechar</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace App Layout */}
      {!token ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-serif text-slate-300">Conexão Necessária</h2>
          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed font-light">
            Para iniciar o alinhamento de rituais com o Google Workspace, conecte sua conta Google no topo superior direito da página. Isso sincronizará automaticamente suas agendas, planilhas e pendências espirituais.
          </p>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tabs Menu Column (Left) */}
          <div className="lg:col-span-3 flex flex-col gap-2 bg-white/[0.02] border border-white/5 p-4 rounded-3xl">
            {[
              { id: 'calendar', label: 'Calendário', icon: CalendarIcon, color: 'text-blue-400' },
              { id: 'tasks', label: 'Google Tasks', icon: ListTodo, color: 'text-indigo-400' },
              { id: 'sheets', label: 'Planilhas (Sheets)', icon: TableProperties, color: 'text-emerald-400' },
              { id: 'slides', label: 'Google Slides', icon: Presentation, color: 'text-yellow-400' },
              { id: 'contacts', label: 'Contatos', icon: Users2, color: 'text-rose-400' },
              { id: 'chat', label: 'Chats Espaciais', icon: MessageSquare, color: 'text-cyan-400' },
              { id: 'keep', label: 'Bloco Keep & Docs', icon: StickyNote, color: 'text-amber-400' },
              { id: 'meet', label: 'Videochamadas (Meet)', icon: UserCheck, color: 'text-emerald-300' },
              { id: 'gmail', label: 'Mensageiro (Gmail)', icon: Send, color: 'text-rose-300' },
              { id: 'forms', label: 'Pesquisas (Forms)', icon: CheckCircle2, color: 'text-purple-400' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600/20 text-indigo-200 border-l-4 border-indigo-500 font-bold tracking-widest uppercase text-xs shadow-md' 
                      : 'text-slate-400 hover:bg-white/[0.02] hover:text-slate-200 uppercase text-[11px] tracking-wider font-semibold'
                  }`}
                >
                  <motion.div animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}} transition={{ repeat: isActive ? Infinity : 0, duration: 2, ease: "easeInOut" }}>
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${tab.color}`} />
                  </motion.div>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Workspace Panel (Right Column) */}
          <div className="lg:col-span-9 bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 min-h-[500px]">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
                <p className="text-xs text-slate-500 font-mono">Processando com a nuvem do Google...</p>
              </div>
            )}

            {!isLoading && (
              <AnimatePresence mode="wait">
                
                {/* CALENDAR VIEW */}
                {activeTab === 'calendar' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div>
                      <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-blue-400" /> Agenda Astral Ativa
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-light">Sua agenda do Google calendar sincronizada de forma transparente.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {/* Events list */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Eventos Vindo Por Aí</h4>
                        {events.length === 0 ? (
                          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] text-center">
                            <p className="text-xs text-slate-500">Nenhum evento agendado nos próximos dias.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {events.map((evt) => {
                              const dt = new Date(evt.start?.dateTime || evt.start?.date);
                              return (
                                <div key={evt.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex items-center justify-between gap-4 group">
                                  <div className="min-w-0">
                                    <h5 className="text-sm font-medium text-slate-200 truncate">{evt.summary}</h5>
                                    <p className="text-xs text-slate-500 mt-1">{dt.toLocaleDateString()} às {dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    {evt.description && <p className="text-[10px] text-slate-600 mt-1 truncate">{evt.description}</p>}
                                  </div>
                                  <button onClick={() => handleDeleteEvent(evt.id, evt.summary)} className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all opacity-0 group-hover:opacity-100" title="Apagar Evento">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Add Event Form */}
                      <form onSubmit={handleCreateEvent} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Agendar Novo Evento Celestial</h4>
                        
                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Título do Evento</label>
                          <input 
                            type="text" 
                            value={newEvent.summary} 
                            placeholder="Ex: Meditação Alinhamento Solar"
                            onChange={(e) => setNewEvent({...newEvent, summary: e.target.value})}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Descrição</label>
                          <textarea 
                            value={newEvent.description} 
                            placeholder="Insira detalhes adicionais do rito ou curso..."
                            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-blue-500 h-20 resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Data</label>
                            <input 
                              type="date" 
                              value={newEvent.date} 
                              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Horário</label>
                            <input 
                              type="time" 
                              value={newEvent.time} 
                              onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all font-medium text-xs tracking-wider uppercase text-white flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(59,130,246,0.3)]">
                          <Plus className="w-4 h-4" /> Agendar com Google
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}


                {/* TASKS VIEW */}
                {activeTab === 'tasks' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div>
                      <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                        <ListTodo className="w-5 h-5 text-indigo-400" /> Tarefas Globais (Google Tasks)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-light">Sua lista de pendências e estudos no Google Tasks.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {/* Tasks List */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Minhas Descobertas e Pendências</h4>
                        {tasks.length === 0 ? (
                          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] text-center">
                            <p className="text-xs text-slate-500">Nenhuma tarefa pendente no Google Tasks.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {tasks.map((task) => (
                              <div key={task.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                  <input 
                                    type="checkbox" 
                                    checked={task.status === 'completed'} 
                                    onChange={() => handleToggleTask(task.id, task.status, task.title)}
                                    className="w-4 h-4 border-2 border-white/10 rounded-md bg-transparent focus:ring-0 text-indigo-500 cursor-pointer"
                                  />
                                  <span className={`text-sm tracking-wide truncate ${task.status === 'completed' ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                                    {task.title}
                                  </span>
                                </div>
                                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-600 mt-0.5">
                                  {task.status === 'completed' ? 'CONCLUÍDO' : 'PENDENTE'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Create Task Box */}
                      <form onSubmit={handleCreateTask} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Adicionar Compromisso ou Rota</h4>
                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Nome do Item</label>
                          <input 
                            type="text" 
                            value={newTask.title} 
                            placeholder="Ex: Terminar leitura do livro místico de Cagliostro"
                            onChange={(e) => setNewTask({ title: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500"
                          />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all font-medium text-xs tracking-wider uppercase text-white flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(99,102,241,0.3)]">
                          <Plus className="w-4 h-4" /> Cadastrar no Google Tasks
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}


                {/* SHEETS VIEW */}
                {activeTab === 'sheets' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div>
                      <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                        <TableProperties className="w-5 h-5 text-emerald-400" /> Registro de Estudos com Google Sheets
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-light">Exporte seus logs diretamente do templo digital para tabelas externas.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {/* Log Input */}
                      <form onSubmit={handleAppendToSheet} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 font-serif">Inserir Linha de Log Cósmico</h4>
                        
                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Selecione uma Planilha de Destino</label>
                          {spreadsheets.length === 0 ? (
                            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                              <p className="text-xs text-slate-600">Nenhuma planilha encontrada no seu Drive. Crie uma planilha no Sheets antes de exportar rituais.</p>
                            </div>
                          ) : (
                            <select 
                              value={selectedSpreadsheet} 
                              onChange={(e) => setSelectedSpreadsheet(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              {spreadsheets.map(s => (
                                <option key={s.id} value={s.id} className="bg-[#050505] text-slate-200">{s.name}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Rito / Atividade Praticada</label>
                          <input 
                            type="text" 
                            value={sheetLog.activity} 
                            onChange={(e) => setSheetLog({ ...sheetLog, activity: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Pontos de XP Obtidos</label>
                          <input 
                            type="number" 
                            value={sheetLog.xpGained} 
                            onChange={(e) => setSheetLog({ ...sheetLog, xpGained: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Comentários (Notas)</label>
                          <textarea 
                            value={sheetLog.notes} 
                            placeholder="Adicione insights colhidos neste log ..."
                            onChange={(e) => setSheetLog({ ...sheetLog, notes: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-emerald-500 h-16 resize-none"
                          />
                        </div>

                        <button 
                          type="submit" 
                          disabled={!selectedSpreadsheet}
                          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-all font-medium text-xs tracking-wider uppercase text-white flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(16,185,129,0.3)] disabled:opacity-40 disabled:pointer-events-none"
                        >
                          <Plus className="w-4 h-4" /> Gravar Registro
                        </button>
                      </form>

                      {/* Display worksheets info */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Planilhas Ativas no Drive</h4>
                        {spreadsheets.length === 0 ? (
                          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] text-center">
                            <p className="text-xs text-slate-500">Nenhuma Planilha mapeada no Google Drive.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {spreadsheets.map((sheet) => (
                              <div key={sheet.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <TableProperties className="w-4 h-4 text-emerald-400" />
                                  <span className="text-sm tracking-wide text-slate-200">{sheet.name}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-600 truncate max-w-[120px]">{sheet.id}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}


                {/* SLIDES VIEW */}
                {activeTab === 'slides' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div>
                      <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                        <Presentation className="w-5 h-5 text-yellow-400" /> Tomos Visuais (Google Slides)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-light">Crie e visualize apresentações de conhecimento do templo místico.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {/* Left: Create Presentation */}
                      <form onSubmit={handleCreatePresentation} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Nova Apresentação de Aprendizados</h4>
                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Título do Slide Deck</label>
                          <input 
                            type="text" 
                            value={newPresentationTitle} 
                            placeholder="Ex: Conexões Zodiacais de Outono"
                            onChange={(e) => setNewPresentationTitle(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-yellow-500"
                          />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 transition-all font-medium text-xs tracking-wider uppercase text-white flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(234,179,8,0.3)]">
                          <Plus className="w-4 h-4" /> Criar no Google Slides
                        </button>
                      </form>

                      {/* Right Presentation list */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Minhas Apresentações no Drive</h4>
                        {presentations.length === 0 ? (
                          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] text-center">
                            <p className="text-xs text-slate-500">Nenhum slide localizado no seu ecossistema Drive.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {presentations.map((pres) => (
                              <div key={pres.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center gap-3">
                                <Presentation className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm tracking-wide text-slate-200 truncate">{pres.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}


                {/* CONTACTS VIEW */}
                {activeTab === 'contacts' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div>
                      <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                        <Users2 className="w-5 h-5 text-rose-400" /> Conexões & Devotos (Google Contacts)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-light">Seu círculo de confiança e mentores do Google People API.</p>
                    </div>

                    {contacts.length === 0 ? (
                      <div className="p-10 rounded-2xl border border-white/5 bg-white/[0.01] text-center max-w-lg mx-auto">
                        <p className="text-sm text-slate-500">Nenhum contato encontrado no seu Google Contacts.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contacts.map((contact, i) => {
                          const name = contact.names?.[0]?.displayName || 'Contato Sem Nome';
                          const email = contact.emailAddresses?.[0]?.value || 'Sem e-mail cadastrado';
                          const photoUrl = contact.photos?.[0]?.url;
                          return (
                            <div key={i} className="p-5 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent flex items-center gap-4 hover:border-rose-500/30 transition-all duration-300">
                              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
                                {photoUrl ? (
                                  <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-rose-400 font-serif text-lg font-bold">
                                    {name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-medium text-slate-200 truncate">{name}</h4>
                                <p className="text-xs text-slate-500 truncate mt-0.5">{email}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}


                {/* CHAT VIEW */}
                {activeTab === 'chat' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div>
                      <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-cyan-400" /> Transmissões no Google Chat
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-light">Envie insights zodiacais de forma consolidada para espaços do Google Chat.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {/* Space Selector & Message Form */}
                      <form onSubmit={handleSendChatMessage} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Nova Mensagem Celestial</h4>
                        
                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Selecione o Canal / Espaço</label>
                          {chatSpaces.length === 0 ? (
                            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                              <p className="text-xs text-slate-600">Nenhum canal/espaço oficial listado. Verifique se o app é membro de canais externos.</p>
                            </div>
                          ) : (
                            <select 
                              value={selectedSpace} 
                              onChange={(e) => setSelectedSpace(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
                            >
                              {chatSpaces.map(s => (
                                <option key={s.name} value={s.name} className="bg-[#050505] text-slate-200">{s.displayName || s.name}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Mensagem a Transmitir</label>
                          <textarea 
                            value={chatMessage} 
                            placeholder="Escreva seu insight espiritual ..."
                            onChange={(e) => setChatMessage(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-cyan-500 h-28 resize-none"
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 transition-all font-medium text-xs tracking-wider uppercase text-white flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(6,182,212,0.3)]"
                        >
                          <Send className="w-4 h-4" /> Disparar Mensagem
                        </button>
                      </form>

                      {/* Info guides */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Notificações e Integração</h4>
                        <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-4">
                          <p className="text-xs text-slate-400 leading-relaxed font-light">
                            Ao integrar com o Google Chat, o sistema poderá repassar atualizações de progresso de auto-estudo e novas orientações do oráculo do dia diretamente para as suas conversas em grupo de estudos e amigos.
                          </p>
                          <div className="h-px bg-white/5" />
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#10b981]">Conector Ativo no Éter</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}


                {/* KEEP & DOCS VIEW */}
                {activeTab === 'keep' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div>
                      <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                        <StickyNote className="w-5 h-5 text-amber-400" /> Bloco de Insights (Keep-style)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-light">Documente pensamentos místico-científicos em quadros rápidos e sincronize como Google Docs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                      {/* Add note panel */}
                      <form onSubmit={handleAddLocalNote} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4 md:col-span-1">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Nova Nota Cópia Keep</h4>
                        
                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Título</label>
                          <input 
                            type="text" 
                            value={newNote.title} 
                            placeholder="Ex: Nota Importante Gnose"
                            onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Texto</label>
                          <textarea 
                            value={newNote.content} 
                            placeholder="Anote aqui..."
                            onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-amber-500 h-28 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Cores Sagradas (Tema)</label>
                          <div className="flex gap-2">
                            {['amber', 'blue', 'rose', 'purple'].map(col => (
                              <button 
                                key={col} 
                                type="button" 
                                onClick={() => setNewNote({ ...newNote, color: col })}
                                className={`w-6 h-6 rounded-full border transition-all ${
                                  newNote.color === col ? 'ring-2 ring-white scale-110' : 'border-white/20'
                                }`}
                                style={{
                                  backgroundColor: 
                                    col === 'amber' ? '#f59e0b' :
                                    col === 'blue' ? '#3b82f6' :
                                    col === 'rose' ? '#f43f5e' : '#a855f7'
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        <button type="submit" className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 transition-all font-medium text-xs tracking-wider uppercase text-white flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(245,158,11,0.3)]">
                          Guardar Nota
                        </button>
                      </form>

                      {/* Bento Notes Grid */}
                      <div className="md:col-span-2 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Notas Locais e Backup em Docs</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {notes.map((note) => (
                            <div key={note.id} className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[160px] ${note.color}`}>
                              <div>
                                <h5 className="text-sm font-bold font-serif mb-2">{note.title}</h5>
                                <p className="text-xs text-slate-300 font-light leading-relaxed whitespace-pre-wrap">{note.content}</p>
                              </div>
                              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[9px] font-mono text-slate-500 uppercase">Bloco Local</span>
                                <button 
                                  onClick={() => handleExportNoteToDriveDocs(note.title, note.content)}
                                  className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider border border-indigo-500/20"
                                  title="Exportar como documento oficial do Google Docs"
                                >
                                  <Share2 className="w-3 h-3" /> Exportar para Docs
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* MEET VIEW */}
                {activeTab === 'meet' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div>
                      <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                        <UserCheck className="w-5 h-5 text-emerald-400" /> Sala de Reflexão (Google Meet)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-light">Gere links instantâneos para encontros astrais online.</p>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                      {meetLink ? (
                        <div className="text-center py-6 space-y-4">
                          <p className="text-sm text-slate-300">Sua sala cósmica está pronta:</p>
                          <a href={meetLink} target="_blank" rel="noopener noreferrer" className="block text-emerald-400 text-lg font-bold hover:underline">
                            {meetLink}
                          </a>
                          <button onClick={() => setMeetLink(null)} className="text-xs text-slate-500 hover:text-slate-300">Gerar nova sala</button>
                        </div>
                      ) : (
                        <div className="text-center py-6 space-y-6">
                          <p className="text-sm text-slate-400">Clique no botão abaixo para criar um portal de comunicação em vídeo místico.</p>
                          <button onClick={handleCreateMeet} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-all font-medium text-xs tracking-wider uppercase text-white shadow-[0_10px_20px_rgba(16,185,129,0.3)]">
                            Criar Portal Meet
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* GMAIL VIEW */}
                {activeTab === 'gmail' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div>
                      <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                        <Send className="w-5 h-5 text-rose-400" /> Transmissões (Gmail)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-light">Envie mensagens diretamente do seu endereço conectado.</p>
                    </div>

                    <form onSubmit={handleSendEmail} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4 max-w-2xl mx-auto">
                      <div>
                        <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Destinatário</label>
                        <input type="email" required value={emailForm.to} onChange={e => setEmailForm({...emailForm, to: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-rose-500" placeholder="oraculo@exemplo.com" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Assunto</label>
                        <input type="text" required value={emailForm.subject} onChange={e => setEmailForm({...emailForm, subject: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-rose-500" placeholder="Novas reflexões" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Mensagem</label>
                        <textarea required value={emailForm.body} onChange={e => setEmailForm({...emailForm, body: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-rose-500 h-32 resize-none" placeholder="Escreva os ensinamentos..." />
                      </div>
                      <button type="submit" className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 transition-all font-medium text-xs tracking-wider uppercase text-white shadow-[0_10px_20px_rgba(225,29,72,0.3)]">
                        Enviar Transmissão
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* FORMS VIEW */}
                {activeTab === 'forms' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div>
                      <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-400" /> Pesquisas (Google Forms)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-light">Crie questionários celestiais rapidamente.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <form onSubmit={handleCreateForm} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">Novo Formulário</h4>
                        <div>
                          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Título da Pesquisa</label>
                          <input type="text" required value={formTitle} onChange={e => setFormTitle(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-purple-500" placeholder="Questionário de Iniciação" />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition-all font-medium text-xs tracking-wider uppercase text-white shadow-[0_10px_20px_rgba(147,51,234,0.3)]">
                          Criar Pesquisa
                        </button>
                      </form>

                      {formUrl && (
                        <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-500/10 text-center space-y-4">
                          <p className="text-sm text-slate-200">Formulário gerado com sucesso!</p>
                          <a href={formUrl} target="_blank" rel="noopener noreferrer" className="block text-purple-400 text-sm font-medium hover:underline">
                            Visualizar e Editar no Google Forms
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
