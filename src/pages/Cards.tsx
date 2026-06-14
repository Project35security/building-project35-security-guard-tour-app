import { useState } from 'react';
import { CreditCard, Eye, EyeOff, Snowflake, Lock, Trash2, Plus, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWallet } from '@/contexts/WalletContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

const QUICK_STATS = [
  { label: 'Monthly Spend', value: '$847.40', change: '+12%', up: true },
  { label: 'Pending', value: '$125.00', change: '3 txns', up: null },
  { label: 'Cashback Earned', value: '$18.40', change: '+$5 this month', up: true },
];

export default function Cards() {
  const { cards, toggleCardFreeze } = useWallet();
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});
  const [issueDialog, setIssueDialog] = useState(false);
  const [issued, setIssued] = useState(false);

  const toggleShowNumber = (id: string) => {
    setShowNumbers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const STATUS_CONFIG = {
    active: { label: 'Active', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    frozen: { label: 'Frozen', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    blocked: { label: 'Blocked', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
    expired: { label: 'Expired', color: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-amber-400" /> My Cards
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage your virtual and physical cards</p>
        </div>
        <Button
          onClick={() => { setIssueDialog(true); setIssued(false); }}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" /> Issue Card
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {QUICK_STATS.map(stat => (
          <div key={stat.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-xs mb-1">{stat.label}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className={cn('text-xs mt-0.5', stat.up === true ? 'text-emerald-400' : stat.up === false ? 'text-red-400' : 'text-slate-400')}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-6">
        {cards.map(card => {
          const show = showNumbers[card.id];
          const status = STATUS_CONFIG[card.status];
          const spendPct = Math.round((card.balance / card.spendingLimit) * 100);

          return (
            <div key={card.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
              {/* Card Visual */}
              <div className={`bg-gradient-to-br ${card.color} p-6 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-white/80" />
                      <span className="text-white/80 text-sm font-medium">Bridgeway</span>
                    </div>
                    <Badge className={cn('text-[10px]', status.color)}>{status.label}</Badge>
                  </div>

                  <div className="text-white text-lg font-mono tracking-widest mb-4">
                    {show
                      ? `4532 8834 9012 ${card.last4}`
                      : `•••• •••• •••• ${card.last4}`
                    }
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-white/60 text-[10px] uppercase tracking-wider">Card Holder</div>
                      <div className="text-white text-sm font-medium">Alex Morgan</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white/60 text-[10px] uppercase tracking-wider">Expires</div>
                      <div className="text-white text-sm">{card.expiryMonth}/{card.expiryYear}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 text-[10px] uppercase tracking-wider">Network</div>
                      <div className="text-white text-sm font-bold">{card.brand}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-white font-semibold">{card.nickname}</div>
                    <div className="text-slate-400 text-xs mt-0.5">Virtual • {card.currency}</div>
                  </div>
                  <button onClick={() => toggleShowNumber(card.id)} className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:text-white">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Spending limit used</span>
                    <span className="text-white">{formatCurrency(card.balance, card.currency)} / {formatCurrency(card.spendingLimit, card.currency)}</span>
                  </div>
                  <Progress value={spendPct} className="h-2 bg-slate-700" />
                  <div className="text-slate-500 text-xs mt-1">{100 - spendPct}% remaining</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => toggleCardFreeze(card.id)}
                    variant="outline"
                    size="sm"
                    className={cn(
                      'border h-9',
                      card.status === 'frozen'
                        ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'
                    )}
                  >
                    <Snowflake className="w-3.5 h-3.5 mr-1.5" />
                    {card.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 h-9"
                  >
                    <Lock className="w-3.5 h-3.5 mr-1.5" /> Set Limit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 h-9"
                  >
                    📋 Copy Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-9"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Issue Card Dialog */}
      <Dialog open={issueDialog} onOpenChange={setIssueDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Issue New Virtual Card</DialogTitle>
          </DialogHeader>
          {issued ? (
            <div className="text-center py-6">
              <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold text-lg">Card Issued!</p>
              <p className="text-slate-400 text-sm mt-1">Your new virtual card is ready to use.</p>
              <Button onClick={() => setIssueDialog(false)} className="mt-4 w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0">Done</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm">Create a new virtual card for secure online shopping.</p>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Card type', value: 'Virtual Visa' },
                  { label: 'Currency', value: 'USD' },
                  { label: 'Default limit', value: '$5,000/month' },
                  { label: 'Issuance fee', value: 'Free' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIssueDialog(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">Cancel</Button>
                <Button onClick={() => setIssued(true)} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0">
                  Issue Card
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
