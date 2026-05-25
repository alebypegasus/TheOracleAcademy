const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/views/LibraryView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const startString = '{/* Transaction Bottom Bar */}';
const startIndex = content.indexOf(startString);

const searchStr = '<ShoppingCart className="w-4 h-4" /> Carrinho';
const cartIndex = content.indexOf(searchStr, startIndex);
if (startIndex === -1 || cartIndex === -1) {
    console.error("Boundaries not found");
    process.exit(1);
}

const endOfBlockStr = '</div>\\n                      </div>';
// Since \n might be \r\n, it's safer to use regex to find the end
const remainingContent = content.substring(cartIndex);
const closingMatch = remainingContent.match(/<\\/button>[\\s\\S]*?<\\/div>[\\s\\S]*?<\\/div>/);

let endIndex = cartIndex + closingMatch.index + closingMatch[0].length;

const replacement = `{/* Animated Transaction Bottom Bar (Watermelon Add-Cash-Disclosure inspired) */}
                      <div className="pt-5 border-t border-indigo-500/10 mt-6 relative">
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0a0715] p-5 rounded-2xl border border-indigo-500/20 shadow-inner gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest font-mono">Resumo Financeiro</span>
                            <span className="text-xl font-black font-mono text-emerald-400">
                               {selectedItem.price > 0 ? \`R$ \${selectedItem.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\` : 'Gratuito'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-xl border border-white/5 w-full sm:w-auto">
                             <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                               <Wallet className="w-4 h-4" />
                             </div>
                             <div>
                               <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest font-mono">Seu Saldo Astral</p>
                               <p className="text-sm font-bold text-slate-300 font-mono">
                                 R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                               </p>
                             </div>
                          </div>
                        </div>

                        {/* Animated Processing / Action Button */}
                        <div className="mt-5 relative z-10 flex flex-col gap-3">
                          {selectedItem.price > 0 && balance < selectedItem.price ? (
                            <div className="flex flex-col bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl gap-3">
                               <div className="flex items-center gap-2 text-rose-300 text-xs">
                                 <AlertCircle className="w-4 h-4 text-rose-400" />
                                 <span className="font-bold">Saldo Insuficiente. Adicione fundos para prosseguir.</span>
                               </div>
                               <div className="flex gap-2">
                                 {[50, 100, 200].map(amount => (
                                    <button
                                      key={amount}
                                      onClick={() => {
                                         // Mocking adding funds for the sake of the UI showcase
                                         setBalance(b => b + amount);
                                      }}
                                      className="flex-1 py-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-colors"
                                    >
                                      + R$ {amount}
                                    </button>
                                 ))}
                               </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                              <motion.button
                                layoutId="purchase-btn"
                                onClick={handlePurchase}
                                disabled={isPurchasing}
                                className="relative overflow-hidden flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-900/30 flex justify-center items-center gap-2 transition-colors group"
                              >
                                <AnimatePresence mode="popLayout">
                                  {isPurchasing ? (
                                    <motion.div
                                      key="processing"
                                      className="absolute inset-0 flex items-center bg-indigo-900"
                                    >
                                      <motion.div
                                        className="h-full bg-indigo-400"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                                      />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      key="idle"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="flex items-center gap-2 relative z-10 group-hover:scale-105 transition-transform"
                                    >
                                      <ShoppingBag className="w-4 h-4" />
                                      {selectedItem.price > 0 ? 'Concluir Compra' : 'Obter Gratuitamente'}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.button>

                              {selectedItem.price > 0 && (
                                <button
                                  onClick={() => {
                                    const inCart = cartItems.some(i => i.id === Number(selectedItem.id));
                                    if (!inCart) {
                                      addToCart({
                                        id: Number(selectedItem.id),
                                        title: selectedItem.title,
                                        subtitle: selectedItem.subtitle,
                                        price: selectedItem.price,
                                        category: selectedItem.category,
                                        cover_image: selectedItem.coverImage,
                                        author_name: selectedItem.authorName
                                      });
                                    }
                                    setIsDetailModalOpen(false);
                                    navigate('/cart');
                                  }}
                                  className="flex-1 sm:flex-none sm:px-6 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black text-xs uppercase tracking-widest rounded-xl transition-all flex justify-center items-center gap-2"
                                >
                                  <ShoppingCart className="w-4 h-4" /> Carrinho
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        
                      </div>`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Checkout remodeled');
