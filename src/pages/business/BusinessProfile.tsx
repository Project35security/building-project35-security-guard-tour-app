import { useState } from 'react';
import {
  Store, Plus, Check, X, Trash2, Star, Copy, Globe, QrCode,
  CreditCard, Smartphone, FileText, TrendingUp, Download,
  Edit, Shield, ExternalLink, RefreshCw, Info, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { MOCK_BUSINESS, MOBILE_MONEY_PROVIDERS } from '@/data/businessData';
import { formatCurrency, formatDate, maskAccountNumber } from '@/lib/formatters';
import type { LinkedBankAccount, LinkedMobileMoney } from '@/types';
import { cn } from '@/lib/utils';

/* ── QR Code display for the business ── */
function BusinessQRCode({ businessName }: { businessName: string }) {
  const [copied, setCopied] = useState(false);
  const payLink = `https://pay.bridgeway.io/${MOCK_BUSINESS.paymentLinkSlug}`;

  const copy = () => {
    navigator.clipboard.writeText(payLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 space-y-5">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <QrCode className="w-4 h-4 text-blue-400" /> Business Payment QR Code
      </h3>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* QR visual */}
        <div className="w-48 h-48 bg-white rounded-2xl p-3 flex-shrink-0 shadow-lg">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect width="200" height="200" fill="white" />
            {/* Position markers */}
            <rect x="10" y="10" width="60" height="60" fill="none" stroke="black" strokeWidth="8" />
            <rect x="22" y="22" width="36" height="36" fill="black" />
            <rect x="130" y="10" width="60" height="60" fill="none" stroke="black" strokeWidth="8" />
            <rect x="142" y="22" width="36" height="36" fill="black" />
            <rect x="10" y="130" width="60" height="60" fill="none" stroke="black" strokeWidth="8" />
            <rect x="22" y="142" width="36" height="36" fill="black" />
            {/* Center logo placeholder */}
            <rect x="82" y="82" width="36" height="36" fill="black" rx="4" />
            <text x="100" y="106" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">B</text>
            {/* Data dots */}
            {[
              [80,10],[90,10],[100,10],[80,20],[100,20],[85,30],[95,30],[100,30],
              [130,80],[140,80],[155,80],[170,80],[130,90],[155,90],[130,100],[145,100],[165,100],
              [130,110],[155,110],[130,120],[145,120],[165,120],[180,120],
              [10,80],[25,80],[40,80],[55,80],[70,80],[10,90],[35,90],[55,90],[70,90],
              [10,100],[25,100],[45,100],[65,100],[10,110],[35,110],[55,110],
              [80,140],[95,140],[110,140],[80,150],[105,150],[80,160],[95,160],[115,160],
              [80,170],[90,170],[110,170],[130,145],[150,145],[170,145],
              [130,155],[145,155],[160,155],[130,165],[155,165],[170,165],
              [130,175],[140,175],[160,175],[180,175],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="8" height="8" fill="black" />
            ))}
          </svg>
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <div className="text-slate-400 text-xs mb-1">Business name shown to customers</div>
            <div className="text-white font-bold text-lg">{businessName}</div>
          </div>

          <div className="space-y-2">
            <div className="text-slate-400 text-xs">Payment link</div>
            <div className="flex items-center gap-2 p-3 bg-slate-700/60 rounded-xl">
              <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-blue-400 text-sm font-medium flex-1 truncate">{payLink}</span>
              <button onClick={copy} className="p-1.5 rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 flex-1">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download QR
            </Button>
            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 flex-1">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Share Link
            </Button>
          </div>

          <div className="text-slate-500 text-xs flex items-start gap-1.5">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            Customers can scan this QR code with any Bridgeway app or standard QR reader to pay instantly.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Add bank account dialog ── */
function AddBankDialog({ onAdd }: { onAdd: (acct: LinkedBankAccount) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ bankName: '', accountName: '', accountNumber: '', routingNumber: '', swiftCode: '', currency: 'USD', country: '' });

  const handleAdd = async () => {
    if (!form.bankName || !form.accountNumber || !form.accountName) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    onAdd({
      id: `ba_${Date.now()}`,
      bankName: form.bankName,
      accountName: form.accountName,
      accountNumber: form.accountNumber,
      routingNumber: form.routingNumber,
      swiftCode: form.swiftCode,
      currency: form.currency as 'USD',
      country: form.country,
      isPrimary: false,
      verified: false,
      addedAt: new Date().toISOString(),
    });
    setLoading(false);
    setDone(true);
  };

  return (
    <>
      <Button onClick={() => { setOpen(true); setDone(false); }} className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0">
        <Plus className="w-4 h-4 mr-2" /> Add Bank Account
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader><DialogTitle>Link Bank Account</DialogTitle></DialogHeader>
          {done ? (
            <div className="text-center py-6">
              <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold">{form.bankName} linked!</p>
              <p className="text-slate-400 text-sm mt-1">A micro-deposit will be sent to verify the account within 2 business days.</p>
              <Button onClick={() => setOpen(false)} className="mt-4 w-full bg-blue-600 text-white border-0">Done</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Bank Name *', key: 'bankName', placeholder: 'e.g. Chase, GTBank, Barclays' },
                { label: 'Account Name *', key: 'accountName', placeholder: 'Name on the bank account' },
                { label: 'Account Number *', key: 'accountNumber', placeholder: 'Account number', mono: true },
                { label: 'Routing / Sort Code', key: 'routingNumber', placeholder: 'e.g. 021000021', mono: true },
                { label: 'SWIFT / BIC Code', key: 'swiftCode', placeholder: 'e.g. CHASUS33', mono: true },
              ].map(({ label, key, placeholder, mono }) => (
                <div key={key}>
                  <Label className="text-slate-300 text-xs mb-1">{label}</Label>
                  <Input
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className={cn('bg-slate-800 border-slate-700 text-white h-10', mono && 'font-mono')}
                  />
                </div>
              ))}
              <div>
                <Label className="text-slate-300 text-xs mb-1">Currency *</Label>
                <Select value={form.currency} onValueChange={v => setForm(prev => ({ ...prev, currency: v }))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {['USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'ZAR', 'AED', 'CAD'].map(c => (
                      <SelectItem key={c} value={c} className="text-white hover:bg-slate-700">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</Button>
                <Button onClick={handleAdd} disabled={loading || !form.bankName || !form.accountNumber || !form.accountName} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white border-0">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Link Account'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Add mobile money dialog ── */
function AddMobileMoneyDialog({ onAdd }: { onAdd: (mm: LinkedMobileMoney) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [providerId, setProviderId] = useState('');
  const [phone, setPhone] = useState('');

  const provider = MOBILE_MONEY_PROVIDERS.find(p => p.id === providerId);

  const handleAdd = async () => {
    if (!provider || !phone) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    onAdd({
      id: `mm_${Date.now()}`,
      provider: provider.name,
      providerLogo: provider.logo,
      providerColor: provider.color,
      phoneNumber: phone,
      accountName: 'Business Account',
      currency: provider.currencies[0],
      country: provider.countries[0],
      isPrimary: false,
      verified: false,
      addedAt: new Date().toISOString(),
    });
    setLoading(false);
    setDone(true);
  };

  return (
    <>
      <Button onClick={() => { setOpen(true); setDone(false); setProviderId(''); setPhone(''); }} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0">
        <Plus className="w-4 h-4 mr-2" /> Add Mobile Money
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader><DialogTitle>Link Mobile Money</DialogTitle></DialogHeader>
          {done ? (
            <div className="text-center py-6">
              <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold">{provider?.name} linked!</p>
              <p className="text-slate-400 text-sm mt-1">Awaiting OTP verification via {phone}</p>
              <Button onClick={() => setOpen(false)} className="mt-4 w-full bg-emerald-600 text-white border-0">Done</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300 text-sm mb-1.5">Select Provider</Label>
                <div className="grid grid-cols-3 gap-2">
                  {MOBILE_MONEY_PROVIDERS.slice(0, 9).map(p => (
                    <button
                      key={p.id}
                      onClick={() => setProviderId(p.id)}
                      className={cn('p-2.5 rounded-xl border text-center transition-all',
                        providerId === p.id ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-700 hover:border-slate-600'
                      )}
                    >
                      <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br mx-auto mb-1 flex items-center justify-center text-sm', p.color)}>
                        {p.logo}
                      </div>
                      <div className="text-white text-[10px] font-medium leading-tight">{p.name.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>
              {provider && (
                <>
                  <div>
                    <Label className="text-slate-300 text-sm mb-1.5">Registered Phone Number</Label>
                    <Input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder={`${provider.countries[0]} number`}
                      className="bg-slate-800 border-slate-700 text-white h-11"
                    />
                  </div>
                  {provider.ussdCode && (
                    <div className="text-slate-500 text-xs flex items-center gap-1.5">
                      <span>Dial</span>
                      <code className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{provider.ussdCode}</code>
                      <span>to check your {provider.name} balance</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</Button>
                <Button onClick={handleAdd} disabled={loading || !provider || !phone} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white border-0">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Link'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ════════════════════════════════ Main Page ════════════════════════════════ */
export default function BusinessProfile() {
  const [business, setBusiness] = useState(MOCK_BUSINESS);
  const [paymentMethods, setPaymentMethods] = useState(
    new Set(MOCK_BUSINESS.acceptedPaymentMethods)
  );
  const [settlementFreq, setSettlementFreq] = useState(MOCK_BUSINESS.settlementFrequency);

  const docApproved = business.documents.filter(d => d.status === 'approved').length;
  const docTotal = business.documents.length;

  const VERIFICATION_BADGE = {
    draft: { label: 'Draft', cls: 'bg-slate-700 text-slate-400 border-slate-600' },
    pending: { label: 'Pending Review', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    in_review: { label: 'Under Review', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    approved: { label: '✓ Verified', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    rejected: { label: 'Rejected', cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  };

  const vBadge = VERIFICATION_BADGE[business.verificationStatus];

  const togglePaymentMethod = (method: typeof MOCK_BUSINESS.acceptedPaymentMethods[0]) => {
    setPaymentMethods(prev => {
      const next = new Set(prev);
      next.has(method) ? next.delete(method) : next.add(method);
      return next;
    });
  };

  const setPrimary = (type: 'bank' | 'mm', id: string) => {
    if (type === 'bank') {
      setBusiness(prev => ({
        ...prev,
        linkedBankAccounts: prev.linkedBankAccounts.map(a => ({ ...a, isPrimary: a.id === id })),
      }));
    } else {
      setBusiness(prev => ({
        ...prev,
        linkedMobileMoney: prev.linkedMobileMoney.map(m => ({ ...m, isPrimary: m.id === id })),
      }));
    }
  };

  const addBank = (acct: LinkedBankAccount) => {
    setBusiness(prev => ({ ...prev, linkedBankAccounts: [...prev.linkedBankAccounts, acct] }));
  };

  const addMM = (mm: LinkedMobileMoney) => {
    setBusiness(prev => ({ ...prev, linkedMobileMoney: [...prev.linkedMobileMoney, mm] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Store className="w-7 h-7 text-blue-400" /> Business Profile
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage your merchant account and payment settings</p>
        </div>
        <Badge className={cn('text-sm px-3 py-1', vBadge.cls)}>{vBadge.label}</Badge>
      </div>

      {/* Business Card */}
      <div className="bg-gradient-to-br from-blue-900/40 to-violet-900/40 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
            {business.businessName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-xl">{business.businessName}</h2>
            <div className="text-slate-400 text-sm mt-0.5">{business.industry} • {business.businessType.replace('_', ' ')}</div>
            {business.website && (
              <a href="#" className="text-blue-400 text-sm mt-1 flex items-center gap-1 hover:text-blue-300 w-fit">
                <Globe className="w-3 h-3" /> {business.website}
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-white/10">
          {[
            { label: 'Total Revenue', value: formatCurrency(business.totalRevenue, 'USD'), icon: '💰' },
            { label: 'Pending Settlement', value: formatCurrency(business.pendingSettlement, 'USD'), icon: '⏳' },
            { label: 'Documents', value: `${docApproved}/${docTotal} approved`, icon: '📄' },
            { label: 'Payment Methods', value: `${paymentMethods.size} active`, icon: '✅' },
          ].map(({ label, value, icon }) => (
            <div key={label}>
              <div className="text-slate-400 text-xs">{icon} {label}</div>
              <div className="text-white font-semibold text-sm mt-0.5">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="payments">
        <TabsList className="bg-slate-800 grid grid-cols-4 sm:grid-cols-5 w-full">
          <TabsTrigger value="payments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-xs">QR & Links</TabsTrigger>
          <TabsTrigger value="bank" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-xs">Bank</TabsTrigger>
          <TabsTrigger value="mobile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-xs">Mobile $</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-xs">Documents</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-xs hidden sm:flex">Settings</TabsTrigger>
        </TabsList>

        {/* QR & Payment Links Tab */}
        <TabsContent value="payments" className="mt-5 space-y-5">
          <BusinessQRCode businessName={business.businessName} />

          {/* Payment Methods Toggle */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" /> Accepted Payment Methods
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                { val: 'card', icon: '💳', label: 'Credit/Debit Card' },
                { val: 'bank_transfer', icon: '🏦', label: 'Bank Transfer' },
                { val: 'mobile_money', icon: '📱', label: 'Mobile Money' },
                { val: 'qr', icon: '📷', label: 'QR Code Scan' },
                { val: 'crypto', icon: '₿', label: 'Cryptocurrency' },
              ] as const).map(({ val, icon, label }) => (
                <button
                  key={val}
                  onClick={() => togglePaymentMethod(val)}
                  className={cn('flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                    paymentMethods.has(val)
                      ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                      : 'border-slate-700 text-slate-500 hover:border-slate-600'
                  )}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
                  {paymentMethods.has(val) && <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Bank Accounts Tab */}
        <TabsContent value="bank" className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Linked Bank Accounts</h3>
            <AddBankDialog onAdd={addBank} />
          </div>

          {business.linkedBankAccounts.map(acct => (
            <div key={acct.id} className={cn('bg-slate-800/60 border rounded-xl p-5 transition-all',
              acct.isPrimary ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-700/50'
            )}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-2xl">🏦</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{acct.bankName}</span>
                      {acct.isPrimary && <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-[10px]">Primary</Badge>}
                      <Badge className={cn('text-[10px]', acct.verified ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30')}>
                        {acct.verified ? '✓ Verified' : '⏳ Pending'}
                      </Badge>
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">{acct.accountName}</div>
                    <div className="text-slate-400 text-xs font-mono mt-0.5">{maskAccountNumber(acct.accountNumber)} • {acct.currency} • {acct.country}</div>
                    {acct.swiftCode && <div className="text-slate-500 text-xs mt-0.5">SWIFT: {acct.swiftCode}</div>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!acct.isPrimary && (
                    <Button size="sm" variant="outline" onClick={() => setPrimary('bank', acct.id)} className="border-slate-600 text-slate-300 hover:bg-slate-700 h-7 text-xs">
                      Set Primary
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-7 px-2">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              {acct.isPrimary && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <div className="text-slate-400 text-xs flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3" />
                      Settlement: <span className="text-white font-medium">{settlementFreq}</span> to this account
                    </div>
                    <button onClick={() => {}} className="ml-auto text-blue-400 text-xs hover:text-blue-300">Change</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Alert className="border-blue-500/20 bg-blue-500/5">
            <Info className="w-4 h-4 text-blue-400" />
            <AlertDescription className="text-blue-400/80 text-xs">
              Bank accounts require a micro-deposit verification. Settlement is made to your primary account based on your chosen frequency.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Mobile Money Tab */}
        <TabsContent value="mobile" className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Mobile Money Accounts</h3>
            <AddMobileMoneyDialog onAdd={addMM} />
          </div>

          {business.linkedMobileMoney.map(mm => (
            <div key={mm.id} className={cn('bg-slate-800/60 border rounded-xl p-5',
              mm.isPrimary ? 'border-emerald-500/30' : 'border-slate-700/50'
            )}>
              <div className="flex items-start gap-4">
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl flex-shrink-0', mm.providerColor)}>
                  {mm.providerLogo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold">{mm.provider}</span>
                    {mm.isPrimary && <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">Primary</Badge>}
                    <Badge className={cn('text-[10px]', mm.verified ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30')}>
                      {mm.verified ? '✓ Verified' : '⏳ OTP Pending'}
                    </Badge>
                  </div>
                  <div className="text-slate-400 text-sm mt-0.5">{mm.phoneNumber}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{mm.currency} • {mm.country}</div>
                </div>
                <div className="flex flex-col gap-2">
                  {!mm.isPrimary && (
                    <Button size="sm" variant="outline" onClick={() => setPrimary('mm', mm.id)} className="border-slate-600 text-slate-300 hover:bg-slate-700 h-7 text-xs">
                      Set Primary
                    </Button>
                  )}
                  {!mm.verified && (
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white border-0 h-7 text-xs">
                      Verify OTP
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-7 px-2">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {business.linkedMobileMoney.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Smartphone className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No mobile money accounts linked yet.</p>
            </div>
          )}

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <h4 className="text-white text-sm font-semibold mb-3">Supported Providers</h4>
            <div className="flex flex-wrap gap-2">
              {MOBILE_MONEY_PROVIDERS.map(p => (
                <div key={p.id} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700/60 rounded-full">
                  <span className="text-xs">{p.logo}</span>
                  <span className="text-slate-300 text-xs">{p.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Verification Documents</h3>
            <Badge className={cn(docApproved === docTotal ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30')}>
              {docApproved}/{docTotal} approved
            </Badge>
          </div>
          <Progress value={(docApproved / docTotal) * 100} className="h-1.5 bg-slate-700 mb-4" />

          {business.documents.map(doc => (
            <div key={doc.id} className="flex items-center gap-3 p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                doc.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400' :
                  doc.status === 'rejected' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'
              )}>
                {doc.status === 'approved' ? <Check className="w-5 h-5" /> :
                  doc.status === 'rejected' ? <X className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium">{doc.label}</div>
                <div className="text-slate-500 text-xs mt-0.5">{doc.fileName} • uploaded {formatDate(doc.uploadedAt, true)}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge className={cn('text-[10px]',
                  doc.status === 'approved' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                    doc.status === 'rejected' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
                      'bg-amber-500/15 text-amber-400 border-amber-500/30'
                )}>
                  {doc.status === 'approved' ? 'Approved' : doc.status === 'rejected' ? 'Rejected' : 'Pending'}
                </Badge>
                {doc.status === 'rejected' && (
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 h-7 text-xs">
                    Re-upload
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full border-dashed border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-800 h-11">
            <Plus className="w-4 h-4 mr-2" /> Upload Additional Document
          </Button>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-5 space-y-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-4">
            <h3 className="text-white font-semibold">Payment Settings</h3>

            <div className="space-y-3">
              {[
                { label: 'Settlement Frequency', value: settlementFreq },
                { label: 'Settlement Currency', value: business.settlementCurrency },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-300 text-sm">{label}</span>
                  <span className="text-white font-medium text-sm capitalize">{value}</span>
                </div>
              ))}

              {[
                { label: 'Instant settlement (fees apply)', key: 'instant' },
                { label: 'Webhook notifications', key: 'webhook' },
                { label: 'Email payment receipts', key: 'receipts' },
              ].map(({ label, key }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                  <span className="text-slate-300 text-sm">{label}</span>
                  <Switch className="data-[state=checked]:bg-blue-600" defaultChecked={key === 'receipts'} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-3">Business Info</h3>
            <div className="space-y-2 text-sm">
              {[
                ['Business ID', business.id],
                ['Registration No.', business.registrationNumber],
                ['Tax ID', business.taxId],
                ['Country', business.country],
                ['Member Since', formatDate(business.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-slate-700/50 last:border-0">
                  <span className="text-slate-400">{k}</span>
                  <span className="text-white font-medium font-mono text-xs">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 h-11">
            <AlertCircle className="w-4 h-4 mr-2" /> Suspend Business Account
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
