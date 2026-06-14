import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet as WalletIcon, Plus, Eye, EyeOff, Copy, Check,
  ArrowUpRight, ArrowDownLeft, QrCode, Building, ChevronRight,
  RefreshCw, TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/contexts/WalletContext';
import { formatCurrency, maskAccountNumber, formatDate } from '@/lib/formatters';
import { CURRENCY_FLAGS, CURRENCY_SYMBOLS } from '@/data/mockData';
import { cn } from '@/lib/utils';

const AVAILABLE_CURRENCIES = [
  'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'ZAR', 'JPY', 'CAD', 'AUD', 'INR', 'BRL', 'SGD', 'AED', 'CHF', 'CNY',
];

function QRPattern() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* QR Code simulation pattern */}
      <rect width="200" height="200" fill="white" />
      {/* Top-left position marker */}
      <rect x="10" y="10" width="60" height="60" fill="none" stroke="black" strokeWidth="8" />
      <rect x="22" y="22" width="36" height="36" fill="black" />
      {/* Top-right position marker */}
      <rect x="130" y="10" width="60" height="60" fill="none" stroke="black" strokeWidth="8" />
      <rect x="142" y="22" width="36" height="36" fill="black" />
      {/* Bottom-left position marker */}
      <rect x="10" y="130" width="60" height="60" fill="none" stroke="black" strokeWidth="8" />
      <rect x="22" y="142" width="36" height="36" fill="black" />
      {/* Data modules simulation */}
      {[
        [80, 10], [90, 10], [100, 10], [80, 20], [100, 20],
        [80, 30], [85, 30], [95, 30], [100, 30], [80, 40],
        [90, 40], [80, 50], [85, 50], [90, 50], [100, 50],
        [130, 80], [140, 80], [150, 80], [160, 80], [170, 80], [180, 80],
        [130, 90], [150, 90], [170, 90], [130, 100], [140, 100], [160, 100], [180, 100],
        [130, 110], [150, 110], [130, 120], [140, 120], [150, 120], [160, 120], [180, 120],
        [10, 80], [20, 80], [30, 80], [40, 80], [50, 80], [60, 80], [70, 80],
        [10, 90], [30, 90], [50, 90], [70, 90], [10, 100], [20, 100], [40, 100], [60, 100],
        [10, 110], [30, 110], [50, 110], [70, 110], [10, 120], [20, 120], [30, 120], [60, 120],
        [80, 80], [90, 80], [100, 80], [110, 80], [120, 80],
        [80, 90], [110, 90], [80, 100], [90, 100], [100, 100], [110, 100], [120, 100],
        [80, 130], [90, 130], [100, 130], [120, 130], [80, 140], [100, 140], [110, 140],
        [80, 150], [90, 150], [80, 160], [100, 160], [110, 160], [120, 160],
        [80, 170], [90, 170], [100, 170], [110, 170],
        [130, 140], [150, 140], [170, 140], [180, 140],
        [130, 150], [140, 150], [160, 150], [130, 160], [150, 160], [170, 160],
        [130, 170], [140, 170], [150, 170], [160, 170], [180, 170],
        [130, 180], [150, 180], [170, 180],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="8" height="8" fill="black" />
      ))}
    </svg>
  );
}

function AddCurrencyDialog({ onAdd }: { onAdd: (currency: string) => void }) {
  const { wallets } = useWallet();
  const [currency, setCurrency] = useState('');

  const available = AVAILABLE_CURRENCIES.filter(c => !wallets.some(w => w.currency === c));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0">
          <Plus className="w-4 h-4 mr-2" /> Add Currency
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Add New Currency Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {available.map(c => (
                <SelectItem key={c} value={c} className="text-white hover:bg-slate-700">
                  {CURRENCY_FLAGS[c]} {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => { if (currency) { onAdd(currency); setCurrency(''); } }}
            disabled={!currency}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0"
          >
            Add Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FundDialog({ walletId, currency }: { walletId: string; currency: string }) {
  const { fundWallet, isProcessing } = useWallet();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [done, setDone] = useState(false);

  const handleFund = async () => {
    const result = await fundWallet(walletId, parseFloat(amount), method);
    if (result.success) setDone(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8">
          <Plus className="w-3.5 h-3.5 mr-1" /> Fund
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Fund {currency} Wallet</DialogTitle>
        </DialogHeader>
        {done ? (
          <div className="text-center py-6">
            <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Wallet funded successfully!</p>
            <p className="text-slate-400 text-sm mt-1">{CURRENCY_SYMBOLS[currency]}{parseFloat(amount).toFixed(2)} added</p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-slate-300 text-sm mb-1.5">Amount ({currency})</Label>
              <Input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-slate-800 border-slate-700 text-white h-11"
              />
            </div>
            <div>
              <Label className="text-slate-300 text-sm mb-1.5">Payment method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="bank" className="text-white hover:bg-slate-700">🏦 Bank Transfer</SelectItem>
                  <SelectItem value="card" className="text-white hover:bg-slate-700">💳 Debit Card</SelectItem>
                  <SelectItem value="crypto" className="text-white hover:bg-slate-700">₿ Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleFund}
              disabled={isProcessing || !amount || parseFloat(amount) <= 0}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0 h-11"
            >
              {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Fund ${currency} Wallet`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Wallet() {
  const navigate = useNavigate();
  const { wallets, totalBalanceUSD, addWallet } = useWallet();
  const [hideBalances, setHideBalances] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const primaryWallet = wallets.find(w => w.isDefault) ?? wallets[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <WalletIcon className="w-7 h-7 text-blue-400" /> My Wallets
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage your multi-currency balances</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setHideBalances(v => !v)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
            {hideBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <AddCurrencyDialog onAdd={addWallet} />
        </div>
      </div>

      {/* Total Balance */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-6">
        <div className="text-blue-200 text-sm mb-1">Total Portfolio Value</div>
        <div className="text-4xl font-bold text-white mb-1">
          {hideBalances ? '$ ••••••' : formatCurrency(totalBalanceUSD, 'USD')}
        </div>
        <div className="flex items-center gap-2 text-blue-200 text-sm">
          <TrendingUp className="w-4 h-4 text-emerald-300" />
          <span className="text-emerald-300">+2.34%</span> vs. last month
        </div>
      </div>

      {/* Wallet Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {wallets.map(wallet => (
          <div
            key={wallet.id}
            className={cn(
              'bg-slate-800/60 border rounded-2xl p-5 transition-all',
              wallet.isDefault ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-700/50 hover:border-slate-600'
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{CURRENCY_FLAGS[wallet.currency] ?? '🌐'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{wallet.currency}</span>
                    {wallet.isDefault && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] px-1.5">Default</Badge>
                    )}
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">
                    A/C: {maskAccountNumber(wallet.accountNumber)}
                    <button
                      onClick={() => copy(wallet.accountNumber.replace(/-/g, ''), `acc_${wallet.id}`)}
                      className="ml-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {copiedField === `acc_${wallet.id}` ? <Check className="w-3 h-3 inline" /> : <Copy className="w-3 h-3 inline" />}
                    </button>
                  </div>
                </div>
              </div>
              <FundDialog walletId={wallet.id} currency={wallet.currency} />
            </div>

            <div className="mb-4">
              <div className="text-slate-400 text-xs mb-0.5">Available Balance</div>
              <div className="text-2xl font-bold text-white">
                {hideBalances ? '••••••' : formatCurrency(wallet.balance, wallet.currency)}
              </div>
              {wallet.lockedBalance > 0 && (
                <div className="text-amber-400 text-xs mt-0.5">
                  {formatCurrency(wallet.lockedBalance, wallet.currency)} locked
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => navigate('/transfer')}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-500/20 border h-8 text-xs"
                variant="outline"
              >
                <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Send
              </Button>
              <Button
                size="sm"
                onClick={() => {}}
                className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/20 border h-8 text-xs"
                variant="outline"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 mr-1" /> Receive
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-400 hover:bg-slate-700 h-8 px-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Receive / Account Details */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
          <ArrowDownLeft className="w-5 h-5 text-emerald-400" /> Receive Money
        </h2>
        <Tabs defaultValue="account">
          <TabsList className="bg-slate-700/50 mb-5">
            <TabsTrigger value="account" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-400">
              <Building className="w-3.5 h-3.5 mr-1.5" /> Bank Details
            </TabsTrigger>
            <TabsTrigger value="qr" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-400">
              <QrCode className="w-3.5 h-3.5 mr-1.5" /> QR Code
            </TabsTrigger>
            <TabsTrigger value="link" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-400">
              🔗 Payment Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <div className="grid md:grid-cols-2 gap-6">
              {[primaryWallet, ...wallets.filter(w => !w.isDefault).slice(0, 1)].map(w => (
                <div key={w.id} className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{CURRENCY_FLAGS[w.currency]}</span>
                    <span className="text-white font-medium">{w.currency} Account Details</span>
                  </div>
                  {[
                    { label: 'Account Number', value: w.accountNumber, key: `an_${w.id}` },
                    ...(w.iban ? [{ label: 'IBAN', value: w.iban, key: `iban_${w.id}` }] : []),
                    ...(w.swiftCode ? [{ label: 'SWIFT/BIC', value: w.swiftCode, key: `swift_${w.id}` }] : []),
                    ...(w.routingNumber ? [{ label: 'Routing Number', value: w.routingNumber, key: `rtn_${w.id}` }] : []),
                  ].map(({ label, value, key }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
                      <div>
                        <div className="text-slate-400 text-xs">{label}</div>
                        <div className="text-white text-sm font-mono font-medium mt-0.5">{value}</div>
                      </div>
                      <button onClick={() => copy(value, key)} className="p-1.5 rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors text-slate-300">
                        {copiedField === key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="qr">
            <div className="flex flex-col items-center gap-5">
              <div className="w-56 h-56 border-4 border-white rounded-xl overflow-hidden bg-white p-2">
                <QRPattern />
              </div>
              <div className="text-center">
                <p className="text-white font-medium mb-1">Scan to Pay</p>
                <p className="text-slate-400 text-sm">Share this QR code to receive payments in any currency</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Download QR
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Share
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link">
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded-xl">
                <div className="text-slate-400 text-xs mb-1">Your Payment Link</div>
                <div className="text-blue-400 text-sm font-medium break-all">
                  https://pay.bridgeway.io/alex.morgan
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => copy('https://pay.bridgeway.io/alex.morgan', 'paylink')}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  {copiedField === 'paylink' ? <><Check className="w-4 h-4 mr-2 text-emerald-400" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy Link</>}
                </Button>
                <Button variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                  Share
                </Button>
              </div>
              <div className="text-slate-400 text-xs">
                Recipients can pay you using this link with any payment method available on Bridgeway.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
