import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, ArrowUpRight, CheckCircle, Package, Edit, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';
import { Product } from './MarketplaceTypes';
import { api } from '../../../../services/api';

export function SellerDashboard({
  currentUser,
  products,
  onEdit,
  onDelete,
  onNewProduct
}: {
  currentUser: any;
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onNewProduct: () => void;
}) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const balance = currentUser?.balance || 0;
  const myProducts = products.filter(p => p.userId === currentUser?.id);
  const totalSales = myProducts.length * 3; // Mock
  const totalRevenue = myProducts.reduce((acc, p) => acc + (p.price * 2), 0); // Mock

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawStatus({ type: 'error', message: 'Valor inválido.' });
      return;
    }
    if (amountNum > balance) {
      setWithdrawStatus({ type: 'error', message: 'Saldo insuficiente.' });
      return;
    }
    if (!pixKey.trim()) {
      setWithdrawStatus({ type: 'error', message: 'Insira uma chave PIX.' });
      return;
    }

    setWithdrawLoading(true);
    setWithdrawStatus(null);
    try {
      const res = await api.payment.withdraw(amountNum, pixKey);
      if (res && res.success) {
        setWithdrawStatus({ type: 'success', message: `Saque de R$ ${amountNum.toFixed(2)} solicitado com sucesso!` });
        setWithdrawAmount('');
      } else {
        throw new Error(res.error || 'Erro ao processar saque.');
      }
    } catch (err: any) {
      setWithdrawStatus({ type: 'error', message: err.message || 'Erro ao realizar saque.' });
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0a0a12]/80 border border-[#1e1b4b] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-16 h-16" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Saldo Disponível</h3>
          <p className="text-3xl font-serif font-bold text-emerald-400">R$ {balance.toFixed(2)}</p>
          <div className="mt-4 pt-4 border-t border-[#1e1b4b]">
            <p className="text-xs text-slate-500">Pronto para saque via PIX</p>
          </div>
        </div>

        <div className="bg-[#0a0a12]/80 border border-[#1e1b4b] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-16 h-16" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Total de Vendas</h3>
          <p className="text-3xl font-serif font-bold text-indigo-300">{totalSales}</p>
          <div className="mt-4 pt-4 border-t border-[#1e1b4b]">
            <p className="text-xs text-emerald-500 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +12% este mês</p>
          </div>
        </div>

        <div className="bg-[#0a0a12]/80 border border-[#1e1b4b] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Package className="w-16 h-16" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Meus Produtos</h3>
          <p className="text-3xl font-serif font-bold text-slate-200">{myProducts.length}</p>
          <div className="mt-4 pt-4 border-t border-[#1e1b4b]">
            <button onClick={onNewProduct} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              + Cadastrar Novo Item
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdraw Panel */}
        <div className="bg-[#0a0a12]/80 border border-[#312e81] rounded-2xl p-6">
          <h3 className="text-lg font-serif text-slate-100 flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-indigo-400" /> Solicitar Saque
          </h3>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">Valor do Saque</label>
              <input
                type="number"
                step="0.01"
                placeholder="R$ 0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full bg-black/40 text-slate-200 border border-[#1e1b4b] rounded-lg p-3 text-sm focus:border-indigo-500/50 outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">Chave PIX (CPF/E-mail/Telefone)</label>
              <input
                type="text"
                placeholder="Chave para transferência"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full bg-black/40 text-slate-200 border border-[#1e1b4b] rounded-lg p-3 text-sm focus:border-indigo-500/50 outline-none mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={withdrawLoading || !withdrawAmount || !pixKey}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <ArrowUpRight className="w-4 h-4" />
              {withdrawLoading ? 'Processando...' : 'Sacar para Conta PIX'}
            </button>
          </form>
          {withdrawStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                withdrawStatus.type === 'success' 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
                  : 'bg-red-500/10 border border-red-500/20 text-red-300'
              }`}
            >
              {withdrawStatus.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
              <span>{withdrawStatus.message}</span>
            </motion.div>
          )}
        </div>

        {/* My Products List */}
        <div className="lg:col-span-2 bg-[#0a0a12]/80 border border-[#1e1b4b] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[#1e1b4b] pb-4">
            <h3 className="text-lg font-serif text-slate-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-400" /> Meus Produtos
            </h3>
            <button onClick={onNewProduct} className="text-xs bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-lg border border-[#1e1b4b] transition-colors">
              Adicionar Novo
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {myProducts.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Package className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Você ainda não tem produtos cadastrados.</p>
              </div>
            ) : (
              myProducts.map(p => (
                <div key={p.id} className="flex items-center gap-4 bg-black/40 border border-[#1e1b4b] p-3 rounded-xl hover:border-[#312e81] transition-colors">
                  <img src={p.coverImage} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{p.title}</p>
                    <p className="text-xs text-indigo-400 font-bold mt-0.5">R$ {p.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(p)} className="p-2 text-slate-400 hover:text-indigo-400 transition-colors bg-white/5 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(p.id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors bg-white/5 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
