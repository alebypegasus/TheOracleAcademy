import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, CalendarPlus, ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';

const esotericEvents: Record<string, { title: string; desc: string; type: 'wicca' | 'orixa' | 'exu' | 'caboclo' | 'preto_velho' | 'ocultismo' | 'daemon' | 'astrologia' }> = {
  // Wicca / Roda do Ano
  "02-02": { title: "Lammas (Lughnasadh)", desc: "Primeira colheita. Fartura.", type: "wicca" },
  "03-21": { title: "Mabon (Equinócio)", desc: "Segunda colheita. Equilíbrio de luz e trevas.", type: "wicca" },
  "05-01": { title: "Samhain", desc: "Ano novo bruxo. O véu está fino.", type: "wicca" },
  "06-21": { title: "Yule (Solstício)", desc: "Renascimento do Sol no ápice da escuridão.", type: "wicca" },
  "08-01": { title: "Imbolc", desc: "Festival do Fogo. Purificação.", type: "wicca" },
  "09-21": { title: "Ostara (Equinócio)", desc: "Renovação e fertilidade.", type: "wicca" },
  "10-31": { title: "Beltane", desc: "Festival do fogo e da vida. Fogueiras e paixão.", type: "wicca" },
  "12-21": { title: "Litha (Solstício)", desc: "Poder do Sol. Magia feérica.", type: "wicca" },

  // Orixás
  "02-02-iemanja": { title: "Dia de Iemanjá", desc: "Rainha do mar, mãe das águas.", type: "orixa" },
  "04-23": { title: "Dia de Ogum", desc: "Senhor dos caminhos, do ferro e da forja.", type: "orixa" },
  "07-26": { title: "Dia de Nanã", desc: "A anciã sábia das lamas primordiais.", type: "orixa" },
  "09-27": { title: "Cosme e Damião (Ibeji)", desc: "Alegria e doçura infantil.", type: "orixa" },
  "12-04": { title: "Dia de Iansã", desc: "Senhora dos ventos, tempestades e raios.", type: "orixa" },
  "12-08": { title: "Dia de Oxum", desc: "Rainha das águas doces, ouro e amor.", type: "orixa" },

  // Caboclos e Encantados
  "01-20": { title: "Festa de Oxóssi e Caboclos", desc: "Rei das matas, fartura e falanges de Caboclos.", type: "caboclo" },
  "07-02": { title: "Caboclo Tupinambá", desc: "Celebração das falanges indígenas e independência.", type: "caboclo" },
  "09-20": { title: "Caboclo Juremeiro", desc: "Força da Jurema Sagrada e pajelança.", type: "caboclo" },

  // Pretos Velhos
  "05-13": { title: "Dia dos Pretos Velhos", desc: "Ancestralidade, sabedoria, cura e humildade com as Almas.", type: "preto_velho" },

  // Povo de Rua (Exu e Pombagira)
  "03-08": { title: "Dia das Pombagiras", desc: "Celebração do sagrado feminino nas ruas e força das Senhoras.", type: "exu" },
  "06-13-exu": { title: "Dia de Exu", desc: "Senhor das encruzilhadas, o comunicador (Sinc. Santo Antônio).", type: "exu" },
  "08-24": { title: "Exu Tiriri / Povo do Cemitério", desc: "Festa para falanges guardiãs dos portais.", type: "exu" },

  // Demonologia / Caminho da Mão Esquerda (LHP)
  "02-15": { title: "Lupercália / Ritual de Pã", desc: "Celebração à força dracônica, instintos e a Baphomet.", type: "daemon" },
  "04-30": { title: "Noite de Walpurgis", desc: "O Grande Sabá. Elevação das chamas infernais e pactos.", type: "daemon" },
  "07-25": { title: "Noite dos Daemons", desc: "Portal forte para alta magia goética e invocação demoníaca.", type: "daemon" },
  "10-31-daemon": { title: "Halloween (Satanismo)", desc: "Apogeu do poder pessoal na doutrina de LaVey.", type: "daemon" },

  // Astrologia / Hermetismo
  "03-20": { title: "Ano Novo Astrológico", desc: "O Sol ingressa em Áries. Ignição da Vontade Mágica.", type: "astrologia" },
  "08-08": { title: "Portal de Lion's Gate", desc: "Abertura cósmica de Sirius. Alta magia hermética e ascensão.", type: "astrologia" },

  // Ocultismo Geral
  "10-12": { title: "Nascimento de Aleister Crowley", desc: "Celebração do mestre Thelemita.", type: "ocultismo" },
};

export function EsotericCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Gera dias do mês em grade (Grid de Calendário)
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonthDays = getDaysInMonth(year, month - 1);
  const days = [];

  // Dias do mês anterior
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
  }

  // Dias do mês atual
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
  }

  // Completa as 6 semanas (42 espaços num calendário clássico) ou 5 semanas
  const remainingSlots = 42 - days.length;
  for (let i = 1; i <= remainingSlots; i++) {
    days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Cálculo básico da fase lunar para a *Data Selecionada*
  const getMoonPhase = (date: Date) => {
    const synodic = 29.53058867;
    const baseDate = new Date("2000-01-06T18:14:00Z");
    const diff = (date.getTime() - baseDate.getTime()) / 86400000;
    const phase = (diff % synodic) / synodic;
    
    if (phase < 0.03 || phase > 0.97) return { icon: '🌑', name: 'Nova' };
    if (phase < 0.22) return { icon: '🌒', name: 'Crescente' };
    if (phase < 0.28) return { icon: '🌓', name: 'Quarto Crescente' };
    if (phase < 0.47) return { icon: '🌔', name: 'Gibosa Crescente' };
    if (phase < 0.53) return { icon: '🌕', name: 'Cheia' };
    if (phase < 0.72) return { icon: '🌖', name: 'Gibosa Minguante' };
    if (phase < 0.78) return { icon: '🌗', name: 'Quarto Minguante' };
    return { icon: '🌘', name: 'Minguante' };
  };

  const selectedStr = `${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  
  // Tratamento para datas com múltiplas festividades (fallback rápido usando hífen)
  const selectedEvent = esotericEvents[selectedStr] || esotericEvents[selectedStr + '-iemanja'] || esotericEvents[selectedStr + '-exu'] || esotericEvents[selectedStr + '-daemon'];
  const selectedMoon = getMoonPhase(selectedDate);

  // Link para Adicionar ao Google Calendar Instantaneamente (Sem API Key / Usando web link)
  const addToGoogleCalendar = (eventData: any, date: Date) => {
    const startStr = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endStr = new Date(date.getTime() + 86400000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // Duração de 1 dia inteiro
    const url = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent("Festival: " + eventData.title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(eventData.desc + "\\n\\nAdicionado via The Oracle Academy.")}&location=Astral`;
    window.open(url, '_blank');
  };

  const hasEvent = (date: Date) => {
    const str = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return !!(esotericEvents[str] || esotericEvents[str + '-iemanja'] || esotericEvents[str + '-exu'] || esotericEvents[str + '-daemon']);
  };

  return (
    <div className="bg-[#0f0e1a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl group flex flex-col mb-10 pb-2">
      
      {/* Header Watermelon Style */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2 text-indigo-300">
          <CalendarIcon size={18} />
          <span className="font-bold text-sm tracking-widest">{monthNames[month]} {year}</span>
        </div>
        <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
          <button onClick={prevMonth} className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><ChevronLeft size={16}/></button>
          <button onClick={nextMonth} className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"><ChevronRight size={16}/></button>
        </div>
      </div>

      {/* Subscription Calendar Grid */}
      <div className="p-4">
        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((d, i) => (
            <div key={i} className="text-center text-xs font-bold text-gray-500">{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const isSelected = selectedDate.getDate() === d.date.getDate() && selectedDate.getMonth() === d.date.getMonth();
            const isToday = new Date().getDate() === d.date.getDate() && new Date().getMonth() === d.date.getMonth();
            const eventExists = hasEvent(d.date);

            return (
              <button 
                key={i}
                onClick={() => setSelectedDate(d.date)}
                className={`
                  relative h-9 rounded-xl flex items-center justify-center text-xs font-medium transition-all
                  ${!d.isCurrentMonth ? 'text-gray-600' : 'text-gray-300 hover:bg-white/10'}
                  ${isSelected ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400/50' : 'border border-transparent'}
                  ${isToday && !isSelected ? 'border-white/20 bg-white/5' : ''}
                `}
              >
                {d.day}
                {eventExists && (
                  <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.8)]'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Insight (Watermelon Disclosure Block) */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedDate.toISOString()}
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pt-4 mt-2 bg-black/40 border-t border-white/5 flex flex-col gap-3 rounded-b-3xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-200">
              {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
            </span>
          </div>

          <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-3 flex items-center gap-4">
             <div className="text-3xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                {selectedMoon.icon}
             </div>
             <div>
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Fase da Lua na Data</p>
                <p className="text-sm text-white font-medium">Lua {selectedMoon.name}</p>
             </div>
          </div>

          {selectedEvent ? (
            <div className="flex flex-col gap-3 pb-4 mt-1">
              <div>
                <p className={`text-sm font-bold mb-1 ${
                  selectedEvent.type === 'wicca' ? 'text-emerald-400' : 
                  selectedEvent.type === 'orixa' ? 'text-blue-400' : 
                  selectedEvent.type === 'exu' ? 'text-red-500' :
                  selectedEvent.type === 'caboclo' ? 'text-green-500' :
                  selectedEvent.type === 'preto_velho' ? 'text-gray-300' : 
                  selectedEvent.type === 'daemon' ? 'text-rose-600 drop-shadow-[0_0_10px_rgba(225,29,72,0.6)]' :
                  selectedEvent.type === 'astrologia' ? 'text-cyan-400' : 'text-amber-400'
                }`}>
                  {selectedEvent.title}
                </p>
                <p className="text-xs text-gray-400 leading-snug">{selectedEvent.desc}</p>
              </div>
              
              <button 
                onClick={() => addToGoogleCalendar(selectedEvent, selectedDate)}
                className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg mt-1"
              >
                <CalendarPlus size={14} /> 
                Adicionar ao Workspace
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center opacity-70 pb-4 mt-2">
              <p className="text-xs text-gray-400">Nenhum evento magístico registrado para esta data. Mas a Lua está ativa.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
