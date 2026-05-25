const fs = require('fs');

const file = 'c:/Users/alera/OneDrive/Documentos/Trabalhos/Desenvolvimentos/TheOracleAcademy/src/components/views/LandingPage.tsx';
const content = fs.readFileSync(file, 'utf-8');

const lines = content.split(/\r?\n/);

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{/* --- SMS MFA STEP --- */}')) {
    startIndex = i;
  }
  if (startIndex !== -1 && i > startIndex && lines[i].includes('</motion.div>')) {
    // Wait, </motion.div> is at line 990
    if (lines[i-1] && lines[i-1].includes('</div>') && lines[i-2] && lines[i-2].includes('</button>')) {
      endIndex = i; // Up to </motion.div> (exclusive)
      break;
    }
  }
}

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find boundaries", startIndex, endIndex);
  process.exit(1);
}

const newAuthBlock = `              {/* Watermelon UI Swap Form Toggle */}
              <div className="flex justify-center mb-6 relative z-10">
                {!mfaStep && (
                  <div className="flex bg-black/40 border border-white/10 rounded-2xl p-1 w-full max-w-xs relative overflow-hidden shadow-inner">
                    <div 
                      className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      style={{ left: isRegistering ? 'calc(50% + 2px)' : '4px' }}
                    />
                    <button 
                      type="button"
                      onClick={() => { setIsRegistering(false); setError(''); }}
                      className={\`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider relative z-10 transition-colors duration-300 \${!isRegistering ? 'text-indigo-300' : 'text-slate-400 hover:text-slate-200'}\`}
                    >
                      Entrar
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setIsRegistering(true); setError(''); }}
                      className={\`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider relative z-10 transition-colors duration-300 \${isRegistering ? 'text-indigo-300' : 'text-slate-400 hover:text-slate-200'}\`}
                    >
                      Registro
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 text-rose-400 text-xs bg-rose-500/10 p-3.5 rounded-2xl border border-rose-500/20 leading-relaxed font-light relative z-10">
                  {error}
                </div>
              )}

              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {mfaStep ? (
                    <motion.div 
                      key="mfa" 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95, y: -10 }} 
                      transition={{ duration: 0.3 }} 
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Shield className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-serif text-slate-200 tracking-wide">Segunda Etapa de Segurança</h3>
                        <p className="text-xs text-indigo-300 uppercase tracking-widest font-mono mt-1">Autenticação por SMS</p>
                        <p className="text-xs text-slate-400 mt-3 max-w-xs mx-auto leading-relaxed">
                          Sua egrégora exige proteção adicional. Um código de 6 dígitos foi enviado via SMS para o seu smartphone.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold text-center">Código de Confirmação</label>
                          <input 
                            type="text" 
                            maxLength={6}
                            value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 text-center text-lg tracking-[0.5em] font-mono text-amber-400 outline-none focus:border-amber-500/60 focus:bg-black/60 transition-all font-bold placeholder-indigo-900"
                            placeholder="000000"
                          />
                        </div>

                        <button 
                          onClick={() => handleMfaVerifyOtp(mfaCode)}
                          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-550 hover:from-amber-550 hover:to-amber-550 text-slate-950 rounded-2xl text-xs font-black tracking-widest uppercase transition-all shadow-xl shadow-amber-500/15 flex items-center justify-center gap-2"
                        >
                          CONFIRMAR EXPEDIÇÃO <ShieldCheck className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => { setMfaStep(false); setError(''); }}
                          className="w-full py-2 text-xs text-indigo-400 hover:text-indigo-300 underline font-medium transition-colors font-mono"
                        >
                          Voltar para o Login
                        </button>
                      </div>
                    </motion.div>

                  ) : isRegistering ? (
                    <motion.div 
                      key="register" 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }} 
                      transition={{ duration: 0.3, ease: "easeInOut" }} 
                      className="space-y-4"
                    >
                      <div className="text-center mb-6">
                        <div className="w-14 h-14 mb-3 opacity-90 theme-logo-image mx-auto filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                        <h2 className="text-2xl font-serif text-slate-100 tracking-wider">
                          Registro Iniciático ({registerStep}/3)
                        </h2>
                        <div className="flex gap-2 justify-center mt-4 w-full max-w-xs mx-auto">
                          <div className={\`h-1 flex-1 rounded-full \${registerStep >= 1 ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]' : 'bg-slate-800'}\`} />
                          <div className={\`h-1 flex-1 rounded-full \${registerStep >= 2 ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]' : 'bg-slate-800'}\`} />
                          <div className={\`h-1 flex-1 rounded-full \${registerStep >= 3 ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]' : 'bg-slate-800'}\`} />
                        </div>
                      </div>

                      <form onSubmit={handleLoginSubmit} className="space-y-6">
                        {registerStep === 1 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div>
                              <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Nome Verdadeiro / Místico</label>
                              <div className="relative font-light">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                <input 
                                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all"
                                  placeholder="Como deseja ser chamado"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">E-mail Contato</label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                <input 
                                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all font-light"
                                  placeholder="buscador@exemplo.com"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Escolha sua Senha</label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                <input 
                                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all"
                                  placeholder="Mínimo 6 caracteres"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {registerStep === 2 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Apelido (@nick)</label>
                                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all" placeholder="ex: serena_moon" />
                              </div>
                              <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Localização</label>
                                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-xs text-slate-200 outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all h-[46px]">
                                  <option value="Santuário Sagrado">Santuário Sagrado (Astral)</option>
                                  <option value="Oráculo do Éter">Oráculo do Éter (SP)</option>
                                  <option value="Templo das Plêiades">Templo das Plêiades (Tech)</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Seu Título</label>
                              <div className="grid grid-cols-2 gap-2">
                                {[{ id: 'Busca-Caminhos', t: 'Busca-Caminhos', desc: 'Explorador Geral' }, { id: 'Sacerdote Solstício', t: 'Sacerdote', desc: 'Alta Magia Lunar' }, { id: 'Alquimista Mental', t: 'Alquimista Mental', desc: 'Ocultismo Hermético' }, { id: 'Cartomante Prático', t: 'Cartomante', desc: 'Tarot e Lenormand' }].map(item => (
                                  <button key={item.id} type="button" onClick={() => setAuthorTitle(item.id)} className={\`p-2.5 rounded-xl text-left border \${authorTitle === item.id ? 'border-amber-500 bg-amber-500/10 text-amber-300' : 'border-white/5 bg-white/[0.02] text-slate-400'} transition-all\`}>
                                    <div className="text-xs font-bold truncate">{item.t}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Biografia Mística</label>
                              <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200} className="w-full bg-black/40 border border-white/10 rounded-2xl py-2.5 px-4 text-xs text-slate-200 outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all h-16 resize-none font-light" placeholder="Conte um pouco sobre suas afinidades espirituais..." />
                            </div>
                          </motion.div>
                        )}

                        {registerStep === 3 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div>
                              <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold text-center">Avatar de Partida</label>
                              <div className="grid grid-cols-4 gap-3 py-1">
                                {avatarPresets.map((pr, index) => (
                                  <button key={index} type="button" onClick={() => setAvatar(pr.url)} className={\`relative group w-full aspect-square rounded-full overflow-hidden border-2 transition-all \${avatar === pr.url ? 'border-amber-400 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.55)]' : 'border-white/15 hover:border-indigo-400'}\`}>
                                    <img src={pr.url} alt={pr.label} className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block font-bold text-slate-400">Instagram Místico</label>
                                <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-amber-500/40" placeholder="@seu_instagram" />
                              </div>
                              <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block font-bold text-slate-400">WhatsApp / Celular</label>
                                <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-amber-500/40" placeholder="(11) 99999-9999" />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div className="pt-2 flex gap-4">
                          {registerStep > 1 && (
                            <button type="button" onClick={() => setRegisterStep(prev => prev - 1)} className="px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors">Voltar</button>
                          )}
                          <button type="submit" className="flex-1 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-2xl text-xs font-black tracking-widest uppercase transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2">
                            {registerStep < 3 ? 'Continuar Rito' : 'Abençoar e Entrar'} <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </form>
                    </motion.div>

                  ) : (
                    <motion.div 
                      key="login" 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: 20 }} 
                      transition={{ duration: 0.3, ease: "easeInOut" }} 
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <div className="w-14 h-14 mb-3 opacity-90 theme-logo-image mx-auto filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                        <h2 className="text-2xl font-serif text-slate-100 tracking-wider">Acesse o Santuário</h2>
                        <p className="text-xs text-indigo-300 mt-1 uppercase tracking-widest font-mono">Entre para consultar os oráculos e seções de estudo</p>
                      </div>

                      <div className="flex p-1 bg-black/40 border border-white/5 rounded-2xl mb-6">
                        <button type="button" onClick={() => { setAuthMethod('email'); setError(''); }} className={\`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all \${authMethod === 'email' ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300' : 'text-slate-400 hover:text-slate-200'}\`}>E-mail</button>
                        <button type="button" onClick={() => { setAuthMethod('phone'); setError(''); setPhoneStep('input'); }} className={\`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all \${authMethod === 'phone' ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300' : 'text-slate-400 hover:text-slate-200'}\`}>Celular / SMS</button>
                      </div>

                      <form onSubmit={handleLoginSubmit} className="space-y-6">
                        {authMethod === 'email' ? (
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">E-mail de Buscador</label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:bg-black/60 transition-all font-light" placeholder="seuemail@exemplo.com" />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Chave Mística (Senha)</label>
                              <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-11 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:bg-black/60 transition-all" placeholder="•••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl text-sm font-bold tracking-widest uppercase transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 mt-2">
                               ENTRAR NO TEMPLO <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {phoneStep === 'input' ? (
                              <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Número de Smartphone</label>
                                <div className="relative">
                                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                                  <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:bg-black/60 transition-all font-light font-mono" placeholder="+55 (11) 99999-9999" />
                                </div>
                              </div>
                            ) : (
                              <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest mb-1.5 block font-bold text-center">Código SMS de Entrada</label>
                                <div className="relative">
                                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                  <input type="text" required maxLength={6} value={phoneVerificationCode} onChange={(e) => setPhoneVerificationCode(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-center text-md tracking-[0.2em] font-mono text-amber-300 outline-none focus:border-indigo-500/60 focus:bg-black/60 transition-all" placeholder="000000" />
                                </div>
                                <button type="button" onClick={() => setPhoneStep('input')} className="text-[10px] text-indigo-400 hover:text-indigo-300 mt-2 block underline">Alterar Telefone</button>
                              </div>
                            )}
                            <button type="submit" disabled={phoneVerifying} className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 mt-2">
                              {phoneVerifying ? <span className="animate-pulse">CONFIRMANDO SINTONIA...</span> : phoneStep === 'input' ? <>SOLICITAR CÓDIGO SMS <ArrowRight className="w-4 h-4" /></> : <>AUTENTICAR CELULAR <ShieldCheck className="w-4 h-4" /></>}
                            </button>
                          </div>
                        )}
                      </form>

                      <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className="h-px bg-white/5 flex-1" />
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Ou Sintonize Via</span>
                          <span className="h-px bg-white/5 flex-1" />
                        </div>
                        <button type="button" onClick={handleGoogleLogin} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-2xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-3">
                          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                          Conectar com Google
                        </button>
                      </div>
                      <div id="recaptcha-container" className="hidden"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>\n`;

const part1 = lines.slice(0, startIndex).join('\n') + '\n';
const part2 = lines.slice(endIndex).join('\n'); // Starts at </motion.div>

fs.writeFileSync(file, part1 + newAuthBlock + part2);
console.log("Replaced successfully!");
