import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus } from 'lucide-react';

export interface AccordionItemData {
  value: string;
  title: string;
  content: React.ReactNode;
}

interface WatermelonAccordionProps {
  items: AccordionItemData[];
  defaultExpanded?: string[];
  multiple?: boolean;
}

export function WatermelonAccordion({ items, defaultExpanded = [], multiple = true }: WatermelonAccordionProps) {
  const [expanded, setExpanded] = useState<string[]>(() => {
    if (defaultExpanded.length > 0) return defaultExpanded;
    if (items && items.length > 0 && items[0]?.value) return [items[0].value];
    return [];
  });

  const toggleItem = (value: string) => {
    setExpanded(prev => {
      const isCurrentlyExpanded = prev.includes(value);
      if (isCurrentlyExpanded) {
        return prev.filter(v => v !== value);
      } else {
        if (!multiple) return [value];
        return [...prev, value];
      }
    });
  };

  return (
    <div className="w-full rounded-2xl border border-[#312e81] bg-[#0a0a0a]/60 overflow-hidden shadow-xl">
      {items.map((item, index) => {
        const isExpanded = expanded.includes(item.value);

        return (
          <div 
            key={item.value || index} 
            className={`transition-colors ${index !== items.length - 1 ? 'border-b border-[#1e1b4b]' : ''} ${isExpanded ? 'bg-indigo-950/20' : ''}`}
          >
            <button
              onClick={() => toggleItem(item.value)}
              className="flex w-full flex-1 items-center justify-between gap-4 px-6 py-5 text-left text-[15px] font-bold outline-none transition-all hover:bg-white/5 focus-visible:bg-white/5"
            >
              <span className={isExpanded ? 'text-indigo-400' : 'text-slate-200'}>
                {item.title}
              </span>
              <span className="relative size-5 shrink-0 text-slate-500">
                <Plus className={`absolute inset-0 size-5 transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`} />
                <Minus className={`absolute inset-0 size-5 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-slate-300">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
