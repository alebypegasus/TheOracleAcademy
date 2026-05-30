import React from 'react';
import { Shield, Lock, Users, Crown, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function EgregoraHeader({ 
  egregora, 
  currentUser, 
  onBack, 
  onManage 
}: { 
  egregora: any; 
  currentUser: any; 
  onBack: () => void;
  onManage?: () => void;
}) {
  const isOwner = egregora.ownerId === currentUser.id;
  const isAdmin = isOwner || (egregora.admins && egregora.admins.includes(currentUser.id));

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#1e1b4b] bg-indigo-950/20 mb-8">
      {/* Background Cover */}
      <div className="absolute inset-0 h-32 bg-gradient-to-r from-indigo-900/40 to-purple-900/40" />
      
      <div className="relative z-10 p-6 md:p-8 pt-12">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Retornar
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mt-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-black border-4 border-[#1e1b4b] flex items-center justify-center text-4xl shadow-xl">
              🔮
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border bg-indigo-500/20 text-indigo-400 border-indigo-500/30 flex items-center gap-1">
                  {egregora.type === 'private' ? <Lock className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  {egregora.type}
                </span>
                {isOwner && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border bg-amber-500/20 text-amber-400 border-amber-500/30 flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Fundador
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-serif text-slate-100">{egregora.name}</h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">{egregora.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm text-slate-400 mr-4">
              <Users className="w-4 h-4" />
              {egregora.members?.length || 1} membros
            </div>
            {isAdmin && onManage && (
              <button 
                onClick={onManage}
                className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/20"
              >
                Gerenciar Egrégora
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
