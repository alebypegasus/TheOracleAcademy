import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AnimatedSidebarProps {
  links: SidebarLink[];
  onNavigate: (href: string) => void;
  currentPath: string;
  bottomContent?: React.ReactNode;
  headerContent?: React.ReactNode;
}

export const AnimatedSidebar = ({
  links,
  onNavigate,
  currentPath,
  bottomContent,
  headerContent
}: AnimatedSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className={cn(
        "h-full flex flex-col glass-panel border-r border-[#1e1b4b] dark:border-[#1e1b4b] z-50",
        isOpen ? "w-[240px]" : "w-[80px]"
      )}
      animate={{ width: isOpen ? 240 : 80 }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-4 flex items-center justify-center overflow-hidden h-20 shrink-0 border-b border-[#1e1b4b]">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full"
            >
              {headerContent}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {/* Collapsed Icon state could be here */}
              <div className="w-8 h-8 rounded-full bg-indigo-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto hide-scrollbar">
        {links.map((link) => {
          const isActive = currentPath.startsWith(link.href);
          
          return (
            <button
              key={link.href}
              onClick={() => onNavigate(link.href)}
              className={cn(
                "relative group flex items-center gap-4 rounded-2xl px-3 py-3 w-full transition-all duration-300",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill" 
                  className="absolute inset-0 rounded-2xl bg-indigo-500/20 border border-indigo-500/30" 
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                />
              )}
              
              <div className="relative z-10 flex items-center justify-center min-w-[24px]">
                {link.icon}
              </div>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 whitespace-nowrap text-sm font-medium"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {bottomContent && (
        <div className="p-4 border-t border-[#1e1b4b] overflow-hidden">
           {bottomContent}
        </div>
      )}
    </motion.div>
  );
};
