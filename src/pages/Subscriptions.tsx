import { useState } from 'react';
import { RefreshCw, Check, Pause, X, Plus, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useWallet } from '@/contexts/WalletContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { Subscription } from '@/types';
import { cn } from '@/lib/utils';

const AVAILABLE_SERVICES = [
  { service: 'HBO Max', plan: 'Standard', logo: '🎭', color: 'from-purple-600 to-purple-900', amount: 9.99, category: 'streaming' },
  { service: 'Apple TV+', plan: 'Premium', logo: '🍎', color: 'from-slate-600 to-slate-800', amount: 6.99, category: 'streaming' },
  { service: 'YouTube Premium', plan: 'Individual', logo: '▶️', color: 'from-red-600 to-red-800', amount: 13.99, category: 'streaming' },
  { service: 'Hulu', plan: 'With Ads', logo: '🟢', color: 'from-green-600 to-green-800', amount: 7.99, category: 'streaming' },
  { service: 'Google One', plan: '2TB', logo: '🔵', color: 'from-blue-600 to-blue-800', amount: 9.99, category: 'cloud' },
  { service: 'Dropbox Plus', plan: '2TB', logo: '💧', color: 'from-blue-500 to-blue-700', amount: 11.99, category: 'cloud' },
  { service: 'Adobe Creative', plan: 'All Apps', logo: '🎨', color: 'from-red-700 to-red-900', amount: 54.99, category: 'productivity' },
  { service: 'Duolingo Plus', plan: 'Annual', logo: '🦉', color: 'from-green-500 to-green-700', amount: 6.99, category: 'other' },
];

const CATEGORIES = ['all', 'streaming', 'music', 'cloud', 'productivity', 'gaming', 'other'];

export default function Subscriptions() {
  const { subscriptions, paySubscription, cancelSubscription, isProcessing, wallets } = useWallet();
  const [filter, setFilter] = useState('all');
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [addingService, setAddingService] = useState<typeof AVAILABLE_SERVICES[0] | null>(null);
  const [purchased, setPurchased] = useState(false);

  const usdBalance = wallets.find(w => w.currency === 'USD')?.balance ?? 0;

  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const monthlyTotal = activeSubs.reduce((s, sub) => {
    if (sub.billingCycle === 'annual') return s + sub.amount / 12;
    return s + sub.amount;
  }, 0);

  const filtered = subscriptions.filter(s => filter === 'all' || s.category === filter);

  const daysUntilRenewal = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  const handleAddService = async () => {
    if (!addingService) return;
    const result = await paySubscription('new', addingService.amount);
    if (result.success) setPurchased(true);
  };

  const STATUS_COLORS = {
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    paused: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <RefreshCw className="w-7 h-7 text-teal-400" /> Subscriptions
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage all your digital subscriptions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <div className="text-slate-400 text-xs mb-1">Active</div>
          <div className="text-2xl font-bold text-white">{activeSubs.length}</div>
          <div className="text-slate-400 text-xs">subscriptions</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <div className="text-slate-400 text-xs mb-1">Monthly Cost</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(monthlyTotal, 'USD')}</div>
          <div className="text-slate-400 text-xs">per month</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <div className="text-slate-400 text-xs mb-1">Annual Cost</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(monthlyTotal * 12, 'USD', true)}</div>
          <div className="text-slate-400 text-xs">per year</div>
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="active" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-400">My Subscriptions</TabsTrigger>
          <TabsTrigger value="browse" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-slate-400">Browse Services</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-5 space-y-4">
          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap capitalize transition-all',
                  filter === cat ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(sub => {
              const days = daysUntilRenewal(sub.nextBillingDate);
              const urgent = days <= 3;
              return (
                <div key={sub.id} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sub.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {sub.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{sub.service}</span>
                        <Badge className={cn('text-[10px] px-1.5', STATUS_COLORS[sub.status])}>
                          {sub.status}
                        </Badge>
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5">{sub.plan} • {sub.billingCycle}</div>
                      <div className={cn('flex items-center gap-1 mt-1 text-xs', urgent ? 'text-amber-400' : 'text-slate-500')}>
                        <Calendar className="w-3 h-3" />
                        Renews {formatDate(sub.nextBillingDate, true)} ({days} days)
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-white font-bold">
                        {formatCurrency(sub.amount, sub.currency)}
                        <span className="text-slate-400 text-xs font-normal">/{sub.billingCycle === 'annual' ? 'yr' : sub.billingCycle === 'weekly' ? 'wk' : 'mo'}</span>
                      </div>
                    </div>
                  </div>

                  {sub.status === 'active' && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs border-slate-600 text-slate-400 hover:bg-slate-700 h-7">
                        <Pause className="w-3 h-3 mr-1" /> Pause
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setSelectedSub(sub); setCancelDialog(true); }}
                        className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 h-7 ml-auto"
                      >
                        <X className="w-3 h-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="browse" className="mt-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AVAILABLE_SERVICES.map(svc => (
              <div
                key={svc.service}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 transition-all cursor-pointer"
                onClick={() => { setAddingService(svc); setAddDialog(true); setPurchased(false); }}
              >
                <div className={`bg-gradient-to-br ${svc.color} p-4 flex items-center justify-center`}>
                  <span className="text-4xl">{svc.logo}</span>
                </div>
                <div className="p-3">
                  <div className="text-white font-semibold text-sm">{svc.service}</div>
                  <div className="text-slate-400 text-xs">{svc.plan}</div>
                  <div className="text-white font-bold mt-2">{formatCurrency(svc.amount, 'USD')}<span className="text-slate-400 text-xs font-normal">/mo</span></div>
                  <Button size="sm" className="mt-2 w-full bg-teal-600 hover:bg-teal-500 text-white border-0 h-7 text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Subscribe
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
          </DialogHeader>
          {selectedSub && (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm">
                Are you sure you want to cancel <span className="text-white font-medium">{selectedSub.service}</span>? You'll lose access at the end of your billing period.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setCancelDialog(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">Keep</Button>
                <Button
                  onClick={() => { cancelSubscription(selectedSub.id); setCancelDialog(false); }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white border-0"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Service Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>{purchased ? 'Subscribed!' : 'Subscribe to Service'}</DialogTitle>
          </DialogHeader>
          {purchased ? (
            <div className="text-center py-4">
              <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold">{addingService?.service} activated!</p>
              <p className="text-slate-400 text-sm mt-1">First payment of {formatCurrency(addingService?.amount ?? 0, 'USD')} charged.</p>
              <Button onClick={() => setAddDialog(false)} className="mt-4 w-full bg-teal-600 text-white border-0">Done</Button>
            </div>
          ) : addingService && (
            <div className="space-y-4">
              <div className={`bg-gradient-to-br ${addingService.color} rounded-xl p-4 flex items-center gap-3`}>
                <span className="text-3xl">{addingService.logo}</span>
                <div>
                  <div className="text-white font-bold">{addingService.service}</div>
                  <div className="text-white/70 text-sm">{addingService.plan}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Monthly cost</span><span className="text-white font-medium">{formatCurrency(addingService.amount, 'USD')}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">First payment</span><span className="text-white font-medium">Today</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Your balance</span><span className="text-emerald-400">{formatCurrency(usdBalance, 'USD')}</span></div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setAddDialog(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">Cancel</Button>
                <Button
                  onClick={handleAddService}
                  disabled={isProcessing}
                  className="flex-1 bg-teal-600 hover:bg-teal-500 text-white border-0"
                >
                  {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Subscribe'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
