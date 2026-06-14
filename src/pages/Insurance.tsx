import { useState } from 'react';
import { Shield, Check, Star, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@/contexts/WalletContext';
import { MOCK_INSURANCE_PLANS } from '@/data/mockData';
import { formatCurrency } from '@/lib/formatters';
import type { InsurancePlan } from '@/types';
import { cn } from '@/lib/utils';

const ACTIVE_POLICIES = [
  { planId: 'ins_001', plan: 'BlueCross Essential', type: 'health', premium: 89, startDate: '2026-01-01', renewDate: '2026-12-31', status: 'active', policyNo: 'BC-2026-00123' },
];

const TYPE_FILTERS = [
  { value: 'all', label: 'All Types' },
  { value: 'health', label: '❤️ Health' },
  { value: 'life', label: '🌿 Life' },
  { value: 'auto', label: '🚗 Auto' },
  { value: 'travel', label: '✈️ Travel' },
  { value: 'home', label: '🏠 Home' },
];

export default function Insurance() {
  const { payInsurance, isProcessing, wallets } = useWallet();
  const [filter, setFilter] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [error, setError] = useState('');

  const usdBalance = wallets.find(w => w.currency === 'USD')?.balance ?? 0;

  const filtered = MOCK_INSURANCE_PLANS.filter(p =>
    filter === 'all' || p.type === filter
  );

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    setError('');
    if (usdBalance < selectedPlan.monthlyPremium) {
      setError('Insufficient USD balance');
      return;
    }
    const result = await payInsurance(selectedPlan.id, selectedPlan.monthlyPremium);
    if (result.success) setPurchased(true);
    else setError(result.error ?? 'Payment failed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-7 h-7 text-pink-400" /> Insurance
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Protect what matters most</p>
      </div>

      <Tabs defaultValue="plans">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="plans" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-slate-400">Browse Plans</TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-slate-400">
            My Policies <Badge className="ml-1.5 bg-pink-500/20 text-pink-400 border-pink-500/30 text-[10px]">{ACTIVE_POLICIES.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-5 space-y-5">
          {/* Type Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TYPE_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  filter === f.value ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(plan => (
              <div
                key={plan.id}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 transition-all group"
              >
                <div className={`bg-gradient-to-br ${plan.color} p-4`}>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-2xl">
                      {plan.type === 'health' ? '❤️' : plan.type === 'life' ? '🌿' :
                        plan.type === 'auto' ? '🚗' : plan.type === 'travel' ? '✈️' : '🏠'}
                    </span>
                    <div className="flex items-center gap-1">
                      {plan.popular && <Badge className="bg-white/20 text-white border-white/30 text-[10px]">Popular</Badge>}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-white font-bold text-lg">{plan.name}</div>
                    <div className="text-white/70 text-xs">{plan.provider}</div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn('w-3 h-3', i < Math.floor(plan.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600')} />
                    ))}
                    <span className="text-slate-400 text-xs ml-1">{plan.rating}</span>
                  </div>

                  <p className="text-slate-400 text-xs mb-3 leading-relaxed">{plan.description}</p>

                  <div className="space-y-1.5 mb-4">
                    {plan.features.slice(0, 3).map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {f}
                      </div>
                    ))}
                    {plan.features.length > 3 && (
                      <div className="text-slate-500 text-xs ml-5">+{plan.features.length - 3} more benefits</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-700 pt-3">
                    <div>
                      <div className="text-white font-bold text-xl">{formatCurrency(plan.monthlyPremium, plan.currency)}</div>
                      <div className="text-slate-400 text-xs">/month</div>
                    </div>
                    <Button
                      onClick={() => { setSelectedPlan(plan); setDialogOpen(true); setPurchased(false); setError(''); }}
                      size="sm"
                      className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white border-0"
                    >
                      Get Plan
                    </Button>
                  </div>

                  <div className="mt-2 text-slate-500 text-[10px]">
                    Coverage up to {formatCurrency(plan.coverageAmount, plan.currency, true)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-5 space-y-4">
          {ACTIVE_POLICIES.map(policy => (
            <div key={policy.policyNo} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl">
                    ❤️
                  </div>
                  <div>
                    <div className="text-white font-semibold">{policy.plan}</div>
                    <div className="text-slate-400 text-xs">Policy #{policy.policyNo}</div>
                  </div>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">Active</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700/50">
                <div>
                  <div className="text-slate-400 text-xs">Monthly Premium</div>
                  <div className="text-white font-medium mt-0.5">{formatCurrency(policy.premium, 'USD')}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Start Date</div>
                  <div className="text-white font-medium mt-0.5">{policy.startDate}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Renewal Date</div>
                  <div className="text-white font-medium mt-0.5">{policy.renewDate}</div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">View Policy</Button>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">File Claim</Button>
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 ml-auto">Cancel</Button>
              </div>
            </div>
          ))}

          <div className="text-center py-8 text-slate-500 text-sm">
            Browse and subscribe to more protection plans above.
          </div>
        </TabsContent>
      </Tabs>

      {/* Subscription Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{purchased ? 'Policy Activated!' : 'Subscribe to Plan'}</DialogTitle>
          </DialogHeader>

          {purchased ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white font-semibold text-lg mb-1">{selectedPlan?.name}</p>
              <p className="text-slate-400 text-sm mb-4">Your policy is now active!</p>
              <p className="text-emerald-400 font-medium">{formatCurrency(selectedPlan?.monthlyPremium ?? 0, 'USD')} deducted</p>
              <Button onClick={() => setDialogOpen(false)} className="mt-5 w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white border-0">
                View My Policies
              </Button>
            </div>
          ) : selectedPlan && (
            <div className="space-y-4">
              <div className={`bg-gradient-to-br ${selectedPlan.color} rounded-xl p-4`}>
                <div className="text-white font-bold text-lg">{selectedPlan.name}</div>
                <div className="text-white/70 text-sm">{selectedPlan.provider}</div>
              </div>

              <div className="space-y-2">
                {selectedPlan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>

              <div className="bg-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Monthly Premium</span>
                  <span className="text-white font-bold">{formatCurrency(selectedPlan.monthlyPremium, selectedPlan.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Coverage</span>
                  <span className="text-white">{formatCurrency(selectedPlan.coverageAmount, selectedPlan.currency, true)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Your balance</span>
                  <span className={usdBalance >= selectedPlan.monthlyPremium ? 'text-emerald-400' : 'text-red-400'}>
                    {formatCurrency(usdBalance, 'USD')}
                  </span>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-blue-400/80 text-xs">Auto-renews monthly. Cancel anytime from My Policies.</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800">Cancel</Button>
                <Button
                  onClick={handleSubscribe}
                  disabled={isProcessing || usdBalance < selectedPlan.monthlyPremium}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white border-0"
                >
                  {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Subscribe Now'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
