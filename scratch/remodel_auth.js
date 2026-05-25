const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/views/LandingPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the start of the modal
const startString = '{showLogin && (';
const startIndex = content.indexOf(startString);

// Find the end of the modal (it ends before {/* SMS TRANSACTION TOAST)
const endString = '{/* SMS TRANSACTION TOAST / PUSH NOTIFICATION SIMULATOR */}';
const endIndex = content.indexOf(endString);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find modal boundaries.");
    process.exit(1);
}

const replacement = `{showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm sm:max-w-md bg-[#090615] shadow-[0_10px_40px_rgba(99,102,241,0.15)] rounded-[32px] overflow-hidden border-[1.5px] border-indigo-500/20 transition-all my-8 relative"
            >
              <button 
                onClick={() => {
                  setShowLogin(false);
                  setIsRegistering(false);
                  setRegisterStep(1);
                  setMfaStep(false);
                  setError('');
                }}
                className="absolute top-5 right-5 z-20 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 pb-8 sm:pb-10 border-b-[1.2px] bg-[#0c081c] border-indigo-500/10 rounded-b-[28px]">
                <div className="w-12 h-12 mb-4 theme-logo-image filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] mx-auto sm:mx-0" />
                
                <h2 className="text-2xl sm:text-3xl font-serif text-slate-100 mb-1.5 sm:mb-2 text-center sm:text-left">
                  {isRegistering ? 'Criação de Vínculo' : 'Acesso ao Templo'}
                </h2>
                
                <p className="text-indigo-300/80 text-[13px] sm:text-[14px] mb-4 sm:mb-6 text-center sm:text-left font-light">
                  {isRegistering ? 'Apenas mais um passo para iniciar.' : 'Saudações, buscador! Sintonize sua aura.'}
                </p>

                {error && (
                  <div className="mb-6 text-rose-400 text-xs bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/20 leading-relaxed font-light relative z-10">
                    {error}
                  </div>
                )}

                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    {mfaStep ? (
                       <motion.div 
                         key="mfa" 
                         initial={{ opacity: 0, y: 10 }} 
                         animate={{ opacity: 1, y: 0 }} 
                         exit={{ opacity: 0, y: -10 }} 
                         className="space-y-6"
                       >
                         <div className="text-center">
                           <Shield className="w-10 h-10 text-amber-500 mx-auto mb-3 animate-pulse" />
                           <p className="text-[11px] text-amber-400 uppercase tracking-widest font-mono">Autenticação SMS</p>
                         </div>
                         <div>
                           <input 
                             type="text" 
                             maxLength={6}
                             value={mfaCode}
                             onChange={(e) => setMfaCode(e.target.value)}
                             className="w-full bg-black/40 border-[1.2px] border-indigo-500/20 rounded-xl py-3.5 text-center text-lg tracking-[0.5em] font-mono text-amber-400 outline-none focus:border-amber-500/60 transition-all font-bold placeholder-indigo-900"
                             placeholder="000000"
                           />
                         </div>
                         <button 
                           onClick={() => handleMfaVerifyOtp(mfaCode)}
                           className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 rounded-xl font-bold tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
                         >
                           Confirmar Expedição <ShieldCheck className="w-4 h-4" />
                         </button>
                         <button onClick={() => { setMfaStep(false); setError(''); }} className="w-full text-xs text-indigo-400 hover:text-indigo-300 underline text-center">Voltar</button>
                       </motion.div>
                    ) : (
                      <motion.div 
                         key={isRegistering ? "signup" : "signin"}
                         initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                         animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                         exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                         transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
                         className="space-y-5"
                      >
                         <div className="space-y-3">
                           <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 px-4 border-[1.2px] border-indigo-500/20 rounded-xl font-medium text-slate-200 bg-black/40 hover:bg-black/60 transition-colors text-[13px] sm:text-sm shadow-sm">
                             <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                             Sincronizar com Google
                           </button>
                         </div>

                         <div className="relative my-5">
                             <div className="absolute inset-0 flex items-center">
                                 <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                             </div>
                             <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                                 <span className="bg-[#0c081c] px-3 text-slate-500 font-mono">Ou E-mail</span>
                             </div>
                         </div>

                         <form onSubmit={handleLoginSubmit} className="space-y-4">
                           {isRegistering && (
                             <div>
                               <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-widest">Nome Místico</label>
                               <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border-[1.2px] border-indigo-500/20 bg-black/40 focus:border-indigo-500/60 outline-none text-[14px] text-slate-200" placeholder="Ex: Iniciado Asteca" />
                             </div>
                           )}
                           <div>
                             <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-widest">E-mail</label>
                             <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border-[1.2px] border-indigo-500/20 bg-black/40 focus:border-indigo-500/60 outline-none text-[14px] text-slate-200 font-light" placeholder="nome@exemplo.com" />
                           </div>
                           <div>
                             <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-widest">Senha de Acesso</label>
                             <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border-[1.2px] border-indigo-500/20 bg-black/40 focus:border-indigo-500/60 outline-none text-[14px] text-slate-200" placeholder="••••••••" />
                           </div>
                           <div className="pt-2">
                             <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold tracking-widest text-[12px] uppercase shadow-lg shadow-indigo-500/20">
                               {isRegistering ? 'Criar Egrégora' : 'Entrar no Templo'}
                             </motion.button>
                           </div>
                         </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="bg-[#090615] py-4 text-center">
                  <p className="text-slate-500 text-[12px] sm:text-[13px]">
                      {isRegistering ? 'Já possui um vínculo ativo?' : 'Ainda não é um buscador?'}
                      <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="ml-1.5 font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                          {isRegistering ? 'Sintonize aqui' : 'Crie sua Egrégora'}
                      </button>
                  </p>
              </div>
              <div id="recaptcha-container" className="hidden"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      `;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Modal replaced!");
