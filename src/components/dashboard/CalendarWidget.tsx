import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X, Star, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tooltip } from '../ui/Tooltip';

export function CalendarWidget({ grimoireEntries = [], addGrimoireEntry }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());
  
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // Google syncing states
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [syncToGoogle, setSyncToGoogle] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { getAccessToken } = await import('../../lib/firebase');
        const token = await getAccessToken();
        setGoogleToken(token);
        if (token) setSyncToGoogle(true);
      } catch (err) {
        console.error(err);
      }
    };
    fetchToken();
  }, [isAddingEvent]);

  const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
    setIsAddingEvent(false);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
    setIsAddingEvent(false);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return (day > 0 && day <= daysInCurrentMonth) ? day : null;
  });

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const activeStudyDays = useMemo(() => {
    const days = new Set<number>();
    // Simulating some study days for the current month if grimoire is empty
    if (grimoireEntries.length === 0) {
      const today = new Date().getDate();
      for(let i = 0; i < 7; i++) {
        const d = today - i;
        if (d > 0) days.add(d);
      }
    } else {
      const currentMonthEntries = grimoireEntries.filter((entry: any) => {
        if (!entry.date) return false;
        const d = new Date(entry.date);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      
      currentMonthEntries.forEach((entry: any) => {
        days.add(new Date(entry.date).getDate());
      });
    }
    return days;
  }, [grimoireEntries, year, month]);

  const holidays: Record<string, string> = {
    '1-1': 'Ano Novo',
    '3-20': 'Equinócio (Outono Sul/Primavera Norte)',
    '5-1': 'Beltane / Samhain',
    '6-21': 'Solstício (Inverno Sul/Verão Norte)',
    '9-22': 'Equinócio (Primavera Sul/Outono Norte)',
    '10-31': 'Samhain / Beltane',
    '12-21': 'Solstício (Verão Sul/Inverno Norte)',
    '12-25': 'Natal',
  };

  const getHolidayForDay = (day: number) => {
    return holidays[`${month + 1}-${day}`];
  };

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return grimoireEntries.filter((entry: any) => {
      if (!entry.date) return false;
      const d = new Date(entry.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDate;
    });
  }, [grimoireEntries, selectedDate, year, month]);

  const handleAddEvent = async () => {
    if (!eventTitle.trim() || !selectedDate) return;
    
    setIsSyncing(true);
    const selectedDateObj = new Date(year, month, selectedDate);
    const entryId = Date.now().toString();
    
    addGrimoireEntry({
      id: entryId,
      date: selectedDateObj.toISOString(),
      question: `Evento: ${eventTitle}`, 
      interpretation: eventDescription || 'Sem detalhes.', 
      cards: ['Calendário'], 
      spreadType: 'Evento',
    });

    if (syncToGoogle && googleToken) {
      try {
        const yearStr = selectedDateObj.getFullYear();
        const monthStr = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
        const dayStr = String(selectedDateObj.getDate()).padStart(2, '0');
        const dateStr = `${yearStr}-${monthStr}-${dayStr}`;

        await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary: eventTitle,
            description: eventDescription || 'Sintonizado via Oracle Academy.',
            start: { date: dateStr },
            end: { date: dateStr }
          })
        });
      } catch (err) {
        console.error("Erro sincronizando com calendário Google:", err);
      }
    }
    
    setEventTitle('');
    setEventDescription('');
    setIsAddingEvent(false);
    setIsSyncing(false);
  };

  return (
    <div className="h-full w-full p-6 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 theme-bg-gradient blur-[60px] pointer-events-none" />
      <div className="flex w-full items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2 text-slate-200">
          <CalendarIcon className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-medium capitalize">
            {monthNames[month]} {year}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] font-bold text-orange-300">7 DIAS</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleNextMonth} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((d, i) => (
            <div key={i} className="text-center text-xs font-bold text-slate-500 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {calendarDays.map((day, i) => {
             const today = day ? isToday(day) : false;
             const isSelected = day === selectedDate;
             const isStudyDay = day ? activeStudyDays.has(day) : false;
             const holiday = day ? getHolidayForDay(day) : null;
             
             return (
               <div 
                 key={i} 
                 onClick={() => {
                   if (day) {
                     setSelectedDate(day);
                     setIsAddingEvent(false);
                   }
                 }}
                 className={`relative aspect-square flex items-center justify-center rounded-lg text-sm transition-all duration-200
                   ${!day ? 'opacity-0 cursor-default' : 'hover:bg-white/10 cursor-pointer'} 
                   ${today && !isSelected ? 'text-indigo-400 font-bold border border-indigo-500/30' : ''}
                   ${isSelected ? 'bg-indigo-500 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105 z-10' : 
                     (day && !isSelected && !today ? 'text-slate-300' : '')}
                 `}
                >
                 {day || ''}

                 {/* Indicators */}
                 {day && (
                   <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                     {isStudyDay && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-400'}`} />}
                     {holiday && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-400'}`} />}
                   </div>
                 )}
                 
                 {/* Holiday Tooltip (if not selected) */}
                 {holiday && !isSelected && (
                   <div className="absolute inset-0 z-20 tooltip-trigger" title={holiday} />
                 )}
               </div>
             )
          })}
        </div>
        
        {/* Selected Date Details */}
        <AnimatePresence mode="wait">
          {selectedDate && !isAddingEvent && (
            <motion.div 
              key="details"
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[#1e1b4b] pt-4 text-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300 font-medium">
                  {selectedDate} de {monthNames[month]}
                </span>
                <button 
                  onClick={() => setIsAddingEvent(true)}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              </div>

              {getHolidayForDay(selectedDate) && (
                <div className="flex items-start gap-2 mb-3 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                  <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-amber-200/90 text-xs">{getHolidayForDay(selectedDate)}</span>
                </div>
              )}

              {selectedDateEvents.length > 0 ? (
                <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                  {selectedDateEvents.map((evt: any) => (
                    <div key={evt.id} className="bg-white/5 border border-[#1e1b4b] p-2.5 rounded-lg">
                      <div className="text-slate-200 text-xs font-medium mb-1 line-clamp-1">{evt.question.replace('Evento: ', '')}</div>
                      <div className="text-slate-500 text-[10px] line-clamp-2">{evt.interpretation}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs italic">Nenhum estudo ou evento neste dia.</p>
              )}
            </motion.div>
          )}

          {selectedDate && isAddingEvent && (
            <motion.div 
              key="adding"
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[#1e1b4b] pt-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300 font-medium text-sm">
                  Novo Evento ({selectedDate})
                </span>
                <button 
                  onClick={() => setIsAddingEvent(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Título do evento ou estudo..." 
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
                  autoFocus
                />
                <textarea 
                  placeholder="Notas detalhadas..." 
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full bg-black/20 border border-[#1e1b4b] rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500/50 min-h-[60px] resize-none"
                />
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="calendarSyncToggle"
                    checked={syncToGoogle}
                    onChange={(e) => setSyncToGoogle(e.target.checked)}
                    disabled={!googleToken}
                    className="w-3.5 h-3.5 rounded text-indigo-600 bg-black/40 border-[#1e1b4b] focus:ring-indigo-500/50 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <label htmlFor="calendarSyncToggle" className={`text-[10px] cursor-pointer select-none ${googleToken ? 'text-indigo-400 font-medium' : 'text-slate-500'}`}>
                    {googleToken ? 'Sincronizar no Google Agenda' : 'Google Agenda desconectado'}
                  </label>
                </div>

                <button 
                  onClick={handleAddEvent}
                  disabled={!eventTitle.trim() || isSyncing}
                  className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-medium py-2 rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSyncing ? 'Sincronizando...' : 'Salvar no Grimório'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
