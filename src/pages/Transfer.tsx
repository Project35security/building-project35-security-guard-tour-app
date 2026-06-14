import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowUpRight, Search, Clock, Check, AlertCircle,
  ChevronRight, Globe, User as UserIcon, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/formatters';
import { MOCK_BENEFICIARIES, MOCK_EXCHANGE_RATES, CURRENCY_FLAGS, CURRENCY_SYMBOLS } from '@/data/mockData';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'ZAR', 'JPY', 'CAD', 'AUD', 'INR', 'BRL', 'SGD', 'AED', 'CNY'];

const transferSchema = z.object({
  recipient: z.string().min(2, 'Recipient name required'),
  recipientEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  amount: z.string().min(1, 'Amount required').refine(v => parseFloat(v) > 0, 'Must be positive'),
  currency: z.string().min(1, 'Select currency'),
  toCurrency: z.string().min(1, 'Select target currency'),
  note: z.string().optional(),
});

type TransferForm = z.infer<typeof transferSchema>;

export default function Transfer() {
  const { wallets, sendMoney, isProcessing } = useWallet();
  const { verifyPin } = useAuth();
  const [step, setStep] = useState<'form' | 'pin' | 'success'>('form');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [error, setError] = useState('');
  const [txRef, setTxRef] = useState('');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<typeof MOCK_BENEFICIARIES[0] | null>(null);
  const [formData, setFormData] = useState<TransferForm | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: { currency: 'USD', toCurrency: 'NGN' },
  });

  const amount = parseFloat(watch('amount') || '0');
  const fromCurrency = watch('currency');
  const toCurrency = watch('toCurrency');

  const rate = MOCK_EXCHANGE_RATES.find(r => r.from === fromCurrency && r.to === toCurrency)?.rate
    ?? (fromCurrency === toCurrency ? 1 : 1.5);
  const fee = amount >= 500 ? 3.99 : amount >= 100 ? 1.99 : 0.99;
  const convertedAmount = (amount - fee) * rate;
  const fromWallet = wallets.find(w => w.currency === fromCurrency);

  const filteredBeneficiaries = MOCK_BENEFICIARIES.filter(b =>
    b.name.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  const onSubmit = (data: TransferForm) => {
    setError('');
    if (!fromWallet || fromWallet.balance < amount + fee) {
      setError('Insufficient balance in your wallet');
      return;
    }
    setFormData(data);
    setStep('pin');
  };

  const handlePinVerify = async () => {
    setPinError('');
    if (pin.length !== 4) { setPinError('Enter 4-digit PIN'); return; }
    const ok = await verifyPin(pin);
    if (!ok) { setPinError('Incorrect PIN. Use 1234 for demo.'); setPin(''); return; }
    if (!formData) return;

    const result = await sendMoney({
      recipientName: formData.recipient,
      recipientEmail: formData.recipientEmail,
      amount,
      currency: formData.currency,
      note: formData.note,
      fee,
    });

    if (!result.success) { setError(result.error ?? 'Transfer failed'); setStep('form'); return; }
    setTxRef(result.reference ?? '');
    setStep('success');
  };

  const selectBeneficiary = (b: typeof MOCK_BENEFICIARIES[0]) => {
    setSelectedBeneficiary(b);
    setValue('recipient', b.name);
    setValue('recipientEmail', b.email ?? '');
    setValue('currency', b.currency);
    setRecipientSearch('');
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h2>
        <p className="text-slate-400 mb-2">
          {formatCurrency(amount, fromCurrency)} sent to {formData?.recipient}
        </p>
        <p className="text-slate-500 text-sm mb-6">Reference: <span className="text-blue-400">{txRef}</span></p>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-left space-y-2 mb-6">
          {[
            ['Sent', formatCurrency(amount, fromCurrency)],
            ['Recipient receives', formatCurrency(convertedAmount, toCurrency)],
            ['Exchange rate', `1 ${fromCurrency} = ${rate} ${toCurrency}`],
            ['Transfer fee', formatCurrency(fee, fromCurrency)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-slate-400">{k}</span>
              <span className="text-white font-medium">{v}</span>
            </div>
          ))}
        </div>
        <Button onClick={() => setStep('form')} className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0 h-11">
          Make Another Transfer
        </Button>
      </div>
    );
  }

  if (step === 'pin') {
    return (
      <div className="max-w-sm mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔐</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Enter Transaction PIN</h2>
        <p className="text-slate-400 text-sm mb-6">Authorize this transfer of {formatCurrency(amount, fromCurrency)}</p>

        {pinError && (
          <Alert className="mb-4 border-red-500/30 bg-red-500/10 text-left">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">{pinError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center mb-6">
          <InputOTP maxLength={4} value={pin} onChange={setPin}>
            <InputOTPGroup>
              {Array.from({ length: 4 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} className="bg-slate-800 border-slate-700 text-white w-14 h-14 text-xl" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-slate-500 text-xs mb-4">Demo PIN: 1234</p>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('form')} className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 h-11">Cancel</Button>
          <Button
            onClick={handlePinVerify}
            disabled={isProcessing || pin.length !== 4}
            className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0 h-11"
          >
            {isProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ArrowUpRight className="w-7 h-7 text-blue-400" />
          Send Money
        </h1>
        <p className="text-slate-400 text-sm mt-1">Transfer funds globally in seconds</p>
      </div>

      {error && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Recipient */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-blue-400" /> Recipient
              </h2>

              {/* Beneficiary Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={recipientSearch}
                  onChange={e => setRecipientSearch(e.target.value)}
                  placeholder="Search saved beneficiaries..."
                  className="pl-9 bg-slate-700 border-slate-600 text-white h-10 placeholder:text-slate-500"
                />
              </div>

              {recipientSearch && filteredBeneficiaries.length > 0 && (
                <div className="mb-4 rounded-xl border border-slate-700 divide-y divide-slate-700 overflow-hidden">
                  {filteredBeneficiaries.map(b => (
                    <button key={b.id} type="button" onClick={() => selectBeneficiary(b)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-700 transition-colors text-left">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                        {b.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{b.name}</div>
                        <div className="text-slate-400 text-xs">{b.email ?? b.phone} • {b.country}</div>
                      </div>
                      <span className="text-slate-400 text-xs">{b.currency}</span>
                    </button>
                  ))}
                </div>
              )}

              {selectedBeneficiary && (
                <div className="mb-4 flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {selectedBeneficiary.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="text-white font-medium">{selectedBeneficiary.name}</div>
                    <div className="text-slate-400 text-xs">{selectedBeneficiary.email} • {selectedBeneficiary.country}</div>
                  </div>
                  <button type="button" onClick={() => setSelectedBeneficiary(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <Label className="text-slate-300 text-sm mb-1.5">Recipient name *</Label>
                  <Input placeholder="Full name" className="bg-slate-700 border-slate-600 text-white h-10 placeholder:text-slate-500 focus:border-blue-500" {...register('recipient')} />
                  {errors.recipient && <p className="text-red-400 text-xs mt-1">{errors.recipient.message}</p>}
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-1.5">Recipient email</Label>
                  <Input type="email" placeholder="recipient@email.com" className="bg-slate-700 border-slate-600 text-white h-10 placeholder:text-slate-500 focus:border-blue-500" {...register('recipientEmail')} />
                </div>
              </div>
            </div>

            {/* Amount & Currency */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" /> Amount & Currency
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-300 text-sm mb-1.5">You send</Label>
                    <Select value={fromCurrency} onValueChange={v => setValue('currency', v)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {wallets.map(w => (
                          <SelectItem key={w.currency} value={w.currency} className="text-white hover:bg-slate-700">
                            {CURRENCY_FLAGS[w.currency]} {w.currency} ({formatCurrency(w.balance, w.currency, true)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300 text-sm mb-1.5">Recipient gets</Label>
                    <Select value={toCurrency} onValueChange={v => setValue('toCurrency', v)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {CURRENCIES.map(c => (
                          <SelectItem key={c} value={c} className="text-white hover:bg-slate-700">
                            {CURRENCY_FLAGS[c]} {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-1.5">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                      {CURRENCY_SYMBOLS[fromCurrency]}
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      className="pl-8 bg-slate-700 border-slate-600 text-white h-12 text-lg font-semibold placeholder:text-slate-500 focus:border-blue-500"
                      {...register('amount')}
                    />
                  </div>
                  {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>}
                  {fromWallet && (
                    <p className="text-slate-500 text-xs mt-1">
                      Available: {formatCurrency(fromWallet.balance, fromCurrency)}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-1.5">Note (optional)</Label>
                  <Input placeholder="What's this for?" className="bg-slate-700 border-slate-600 text-white h-10 placeholder:text-slate-500 focus:border-blue-500" {...register('note')} />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isProcessing || !amount}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 font-medium text-base"
            >
              Continue to PIN Verification <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Summary Card */}
        <div className="space-y-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-white font-semibold text-sm mb-4">Transfer Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'You send', value: amount ? formatCurrency(amount, fromCurrency) : '—' },
                { label: 'Transfer fee', value: amount ? formatCurrency(fee, fromCurrency) : '—' },
                { label: 'Exchange rate', value: `1 ${fromCurrency} = ${rate} ${toCurrency}` },
                { label: 'Recipient gets', value: amount ? formatCurrency(convertedAmount > 0 ? convertedAmount : 0, toCurrency) : '—', highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label} className={cn('flex justify-between items-center py-1.5', label !== 'Transfer fee' && 'border-b border-slate-700/50 last:border-0')}>
                  <span className="text-slate-400 text-sm">{label}</span>
                  <span className={cn('text-sm font-medium', highlight ? 'text-emerald-400 text-base font-semibold' : 'text-white')}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-blue-400 text-xs">Estimated delivery: 1-3 minutes</span>
            </div>
          </div>

          {/* Saved Beneficiaries */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-white font-semibold text-sm mb-3">Recent Contacts</h3>
            <div className="space-y-2">
              {MOCK_BENEFICIARIES.slice(0, 3).map(b => (
                <button key={b.id} type="button" onClick={() => selectBeneficiary(b)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700 transition-colors text-left">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {b.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-medium truncate">{b.name}</div>
                    <div className="text-slate-500 text-[10px]">{b.country} • {b.transferCount} transfers</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-400/80 text-xs">Transfers over $1,000 may require additional verification per AML regulations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
