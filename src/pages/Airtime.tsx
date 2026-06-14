import { useState } from 'react';
import { Smartphone, Check, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { MOCK_NETWORKS } from '@/data/mockData';
import { formatCurrency } from '@/lib/formatters';
import type { Network, DataPlan } from '@/types';
import { cn } from '@/lib/utils';

export default function Airtime() {
  const { buyAirtime, isProcessing, wallets } = useWallet();
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [airtimeAmount, setAirtimeAmount] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('airtime');

  const usdBalance = wallets.find(w => w.currency === 'USD')?.balance ?? 0;

  const handlePurchase = async (type: 'airtime' | 'data') => {
    setError('');
    const amount = type === 'airtime' ? airtimeAmount : selectedPlan?.price;
    if (!selectedNetwork || !phoneNumber || !amount) {
      setError('Please fill all required fields');
      return;
    }
    if (usdBalance < amount) {
      setError('Insufficient USD balance');
      return;
    }
    const result = await buyAirtime({
      networkId: selectedNetwork.id,
      phoneNumber,
      amount,
      type,
      planId: selectedPlan?.id,
    });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedNetwork(null);
        setPhoneNumber('');
        setAirtimeAmount(null);
        setSelectedPlan(null);
      }, 3000);
    } else {
      setError(result.error ?? 'Purchase failed');
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
          <Check className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {activeTab === 'airtime' ? 'Airtime' : 'Data'} Sent!
        </h2>
        <p className="text-slate-400 mb-2">
          {activeTab === 'airtime'
            ? `${formatCurrency(airtimeAmount ?? 0, 'USD')} airtime`
            : `${selectedPlan?.data} data plan`} sent to {phoneNumber}
        </p>
        <p className="text-slate-500 text-sm">via {selectedNetwork?.name}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Smartphone className="w-7 h-7 text-orange-400" /> Airtime &amp; Data
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Buy airtime or data for any number worldwide</p>
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl">
        <span className="text-slate-400 text-sm">USD Balance:</span>
        <span className="text-white font-semibold">{formatCurrency(usdBalance, 'USD')}</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 w-full">
          <TabsTrigger value="airtime" className="flex-1 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-slate-400">
            <Zap className="w-3.5 h-3.5 mr-1.5" /> Airtime
          </TabsTrigger>
          <TabsTrigger value="data" className="flex-1 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-slate-400">
            📡 Data Plans
          </TabsTrigger>
        </TabsList>

        {(['airtime', 'data'] as const).map(tabVal => (
          <TabsContent key={tabVal} value={tabVal} className="space-y-5 mt-5">
            {/* Step 1: Select Network */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-white font-semibold mb-4">1. Select Network</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MOCK_NETWORKS.map(network => (
                  <button
                    key={network.id}
                    onClick={() => setSelectedNetwork(network)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                      selectedNetwork?.id === network.id
                        ? 'border-orange-500/50 bg-orange-500/10'
                        : 'border-slate-700 hover:border-slate-600 hover:bg-slate-700/50'
                    )}
                  >
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${network.color} flex items-center justify-center text-lg flex-shrink-0`}>
                      {network.logo}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{network.name}</div>
                      <div className="text-slate-400 text-xs">{network.code}</div>
                    </div>
                    {selectedNetwork?.id === network.id && (
                      <Check className="w-4 h-4 text-orange-400 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Phone Number */}
            {selectedNetwork && (
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-white font-semibold mb-4">2. Phone Number</h2>
                <div>
                  <Label className="text-slate-300 text-sm mb-1.5">
                    Number ({selectedNetwork.code})
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm">
                      {selectedNetwork.code}
                    </div>
                    <Input
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Phone number"
                      className="flex-1 bg-slate-700 border-slate-600 text-white h-11 placeholder:text-slate-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Amount / Data Plan */}
            {selectedNetwork && phoneNumber.length >= 7 && (
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-white font-semibold mb-4">
                  3. {tabVal === 'airtime' ? 'Select Amount' : 'Select Data Plan'}
                </h2>

                {tabVal === 'airtime' ? (
                  <div>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {selectedNetwork.airtimeDenominations.map(amount => (
                        <button
                          key={amount}
                          onClick={() => setAirtimeAmount(amount)}
                          className={cn(
                            'py-2.5 px-2 rounded-xl text-sm font-medium border transition-all',
                            airtimeAmount === amount
                              ? 'bg-orange-600 text-white border-orange-500'
                              : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'
                          )}
                        >
                          {selectedNetwork.currency === 'USD' ? '$' : ''}{amount}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Label className="text-slate-400 text-xs mb-1.5">Or enter custom amount</Label>
                      <Input
                        type="number"
                        value={airtimeAmount ?? ''}
                        onChange={e => setAirtimeAmount(parseFloat(e.target.value))}
                        placeholder="Custom amount"
                        className="bg-slate-700 border-slate-600 text-white h-10 focus:border-orange-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedNetwork.dataPlans.map(plan => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={cn(
                          'w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left',
                          selectedPlan?.id === plan.id
                            ? 'border-orange-500/50 bg-orange-500/10'
                            : 'border-slate-700 hover:border-slate-600 bg-slate-700/30'
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">{plan.data}</span>
                            {plan.popular && <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">Popular</Badge>}
                          </div>
                          <div className="text-slate-400 text-xs mt-0.5">{plan.name} • Valid {plan.validity}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{selectedNetwork.currency === 'USD' ? '$' : ''}{plan.price}</div>
                          {selectedPlan?.id === plan.id && <Check className="w-4 h-4 text-orange-400 ml-auto mt-1" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Purchase Button */}
            {selectedNetwork && phoneNumber && (tabVal === 'airtime' ? airtimeAmount : selectedPlan) && (
              <div className="space-y-3">
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Network</span>
                    <span className="text-white">{selectedNetwork.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Number</span>
                    <span className="text-white">{selectedNetwork.code} {phoneNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{tabVal === 'airtime' ? 'Amount' : 'Plan'}</span>
                    <span className="text-white font-semibold">
                      {tabVal === 'airtime'
                        ? formatCurrency(airtimeAmount ?? 0, 'USD')
                        : `${selectedPlan?.data} (${selectedPlan?.validity})`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-700 pt-2">
                    <span className="text-slate-400">Total</span>
                    <span className="text-white font-bold">
                      {formatCurrency(
                        tabVal === 'airtime' ? (airtimeAmount ?? 0) : (selectedPlan?.price ?? 0),
                        'USD'
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handlePurchase(tabVal)}
                  disabled={isProcessing}
                  className="w-full h-12 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white border-0 font-medium text-base"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      Buy {tabVal === 'airtime' ? 'Airtime' : 'Data'} <ChevronRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
