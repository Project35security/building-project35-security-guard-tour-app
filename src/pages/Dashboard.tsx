import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, ArrowDownLeft, Plane, Smartphone,
  Shield, RefreshCw, CreditCard, TrendingUp, Eye, EyeOff,
  Plus, ChevronRight, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { formatCurrency, formatRelativeTime, getInitials } from '@/lib/formatters';
import { CURRENCY_FLAGS, MOCK_SAVINGS_GOALS, MOCK_EXCHANGE_RATES } from '@/data/mockData';
import { cn } from '@/lib/utils';

const QUICK_ACTIONS = [
  { icon: ArrowUpRight, label: 'Send', to: '/transfer', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/15', text: 'text-blue-400' },
  { icon: ArrowDownLeft, label: 'Receive', to: '/wallet?tab=receive', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  { icon: Plane, label: 'Travel', to: '/travel', color: 'from-violet-500 to-violet-600', bg: 'bg-violet-500/15', text: 'text-violet-400' },
  { icon: Smartphone, label: 'Airtime', to: '/airtime', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-500/15', text: 'text-orange-400' },
  { icon: Shield, label: 'Insurance', to: '/insurance', color: 'from-pink-500 to-pink-600', bg: 'bg-pink-500/15', text: 'text-pink-400' },
  { icon: RefreshCw, label: 'Subscribe', to: '/subscriptions', color: 'from-teal-500 to-teal-600', bg: 'bg-teal-500/15', text: 'text-teal-400' },
  { icon: CreditCard, label: 'Cards', to: '/cards', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-500/15', text: 'text-amber-400' },
  { icon: Plus, label: 'More', to: '/wallet', color: 'from-slate-500 to-slate-600', bg: 'bg-slate-700', text: 'text-slate-400' },
];

const TX_ICONS: Record<string, { icon: string; color: string }> = {
  transfer_in: { icon: '↙️', color: 'text-emerald-400' },
  transfer_out: { icon: '↗️', color: 'text-blue-400' },
  airtime: { icon: '📱', color: 'text-orange-400' },
  data: { icon: '📡', color: 'text-cyan-400' },
  insurance: { icon: '🛡️', color: 'text-pink-400' },
  subscription: { icon: '🔄', color: 'text-violet-400' },
  travel: { icon: '✈️', color: 'text-indigo-400' },
  card: { icon: '💳', color: 'text-amber-400' },
  deposit: { icon: '💰', color: 'text-emerald-400' },
  withdrawal: { icon: '🏧', color: 'text-red-400' },
  refund: { icon: '↩️', color: 'text-teal-400' },
  fee: { icon: '📋', color: 'text-slate-400' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { wallets, transactions, totalBalanceUSD } = useWallet();
  const navigate = useNavigate();
  const [hideBalance, setHideBalance] = useState(false);

  const recentTxns = transactions.slice(0, 5);
  const primaryWallet = wallets.find(w => w.isDefault) ?? wallets[0];

  const todayIncome = transactions
    .filter(t => t.type === 'credit' && new Date(t.createdAt).toDateString() === new Date().toDateString())
    .reduce((s, t) => s + t.amount, 0);

  const displayBalance = (amount: number, currency: string) =>
    hideBalance ? '••••••' : formatCurrency(amount, currency);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good morning, {user?.firstName}! 👋
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Here's your financial overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">All systems live</span>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 p-6 shadow-2xl shadow-blue-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-blue-200 text-sm font-medium">Total Portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setHideBalance(v => !v)} className="text-blue-200 hover:text-white transition-colors">
                {hideBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                Tier {user?.tier}
              </Badge>
            </div>
          </div>

          <div className="text-4xl font-bold text-white mb-1">
            {hideBalance ? '$ ••••••' : formatCurrency(totalBalanceUSD, 'USD')}
          </div>

          <div className="flex items-center gap-1.5 text-blue-200 text-sm mb-6">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-emerald-300">+$2,500.00</span>
            <span>received today</span>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/transfer')}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 h-10 text-sm backdrop-blur-sm"
            >
              <ArrowUpRight className="w-4 h-4 mr-1.5" /> Send
            </Button>
            <Button
              onClick={() => navigate('/wallet')}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 h-10 text-sm backdrop-blur-sm"
            >
              <ArrowDownLeft className="w-4 h-4 mr-1.5" /> Receive
            </Button>
            <Button
              onClick={() => navigate('/wallet')}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 h-10 text-sm backdrop-blur-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Money
            </Button>
          </div>
        </div>
      </div>

      {/* Wallet Balances */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">My Wallets</h2>
          <button onClick={() => navigate('/wallet')} className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-0.5">
            Manage <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {wallets.map(w => (
            <div
              key={w.id}
              onClick={() => navigate('/wallet')}
              className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:border-slate-600 hover:bg-slate-800 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{CURRENCY_FLAGS[w.currency] ?? '🌐'}</span>
                {w.isDefault && (
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full px-1.5 py-0.5">Default</span>
                )}
              </div>
              <div className="text-slate-400 text-xs mb-1">{w.currency}</div>
              <div className="text-white font-semibold text-sm">
                {displayBalance(w.balance, w.currency)}
              </div>
            </div>
          ))}
          <div
            onClick={() => navigate('/wallet?action=add')}
            className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-4 cursor-pointer hover:border-blue-500/50 hover:bg-slate-800/60 transition-all flex flex-col items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 text-slate-500" />
            <span className="text-slate-500 text-xs">Add Currency</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {QUICK_ACTIONS.map(({ icon: Icon, label, to, bg, text }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-800 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${text}`} />
              </div>
              <span className="text-slate-400 text-xs group-hover:text-slate-300 transition-colors">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">Recent Activity</h2>
            <button onClick={() => navigate('/transactions')} className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-0.5">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl divide-y divide-slate-700/50">
            {recentTxns.map(txn => {
              const meta = TX_ICONS[txn.category] ?? { icon: '💳', color: 'text-slate-400' };
              return (
                <div key={txn.id} className="flex items-center gap-3 p-4 hover:bg-slate-800/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-slate-700/60 flex items-center justify-center text-lg flex-shrink-0">
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{txn.description}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-slate-500 text-xs">{formatRelativeTime(txn.createdAt)}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                        txn.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
                          txn.status === 'pending' ? 'bg-amber-500/15 text-amber-400' :
                            'bg-red-500/15 text-red-400'
                      )}>
                        {txn.status}
                      </span>
                    </div>
                  </div>
                  <div className={cn('text-sm font-semibold flex-shrink-0',
                    txn.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'
                  )}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount, txn.currency)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Cards */}
        <div className="space-y-4">
          {/* Savings Goals */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Savings Goals</h3>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-3">
              {MOCK_SAVINGS_GOALS.map(goal => {
                const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span>{goal.icon}</span>
                        <span className="text-slate-300 text-xs">{goal.name}</span>
                      </div>
                      <span className="text-white text-xs font-medium">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5 bg-slate-700" />
                    <div className="flex justify-between mt-1">
                      <span className="text-slate-500 text-[10px]">{formatCurrency(goal.currentAmount, goal.currency, true)}</span>
                      <span className="text-slate-500 text-[10px]">{formatCurrency(goal.targetAmount, goal.currency, true)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exchange Rates */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Live Rates</h3>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5">Live</Badge>
            </div>
            <div className="space-y-2">
              {MOCK_EXCHANGE_RATES.slice(0, 5).map(rate => (
                <div key={`${rate.from}-${rate.to}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{CURRENCY_FLAGS[rate.to]}</span>
                    <span className="text-slate-400 text-xs">USD/{rate.to}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white text-xs font-medium">{rate.rate.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <button onClick={() => navigate('/transfer')} className="text-blue-400 text-xs mt-1 hover:text-blue-300">
                View all rates →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
