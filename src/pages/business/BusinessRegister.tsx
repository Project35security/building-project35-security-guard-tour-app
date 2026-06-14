import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Store, Building, FileText, CreditCard, Check, Upload,
  ChevronRight, AlertCircle, Info, Globe, Smartphone,
  ArrowLeft, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BUSINESS_INDUSTRIES, BUSINESS_TYPES, REQUIRED_DOCS, MOBILE_MONEY_PROVIDERS } from '@/data/businessData';
import type { BusinessType } from '@/types';
import { cn } from '@/lib/utils';

const COUNTRIES = [
  'United States', 'United Kingdom', 'Nigeria', 'Ghana', 'Kenya', 'South Africa',
  'Tanzania', 'Uganda', 'Rwanda', 'Senegal', 'Canada', 'Australia',
  'Germany', 'France', 'UAE', 'India', 'Singapore', 'Brazil',
];

const STEPS = [
  { label: 'Business Info', icon: Building },
  { label: 'Documents', icon: FileText },
  { label: 'Bank Account', icon: CreditCard },
  { label: 'Mobile Money', icon: Smartphone },
  { label: 'Review', icon: Check },
];

/* ─── Form schemas ─── */
const step0Schema = z.object({
  businessName: z.string().min(2, 'Business name required'),
  businessType: z.string().min(1, 'Select business type'),
  industry: z.string().min(1, 'Select industry'),
  registrationNumber: z.string().min(3, 'Registration number required'),
  taxId: z.string().min(3, 'Tax ID required'),
  businessEmail: z.string().email('Valid email required'),
  businessPhone: z.string().min(7, 'Phone number required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  country: z.string().min(1, 'Select country'),
  website: z.string().optional(),
  description: z.string().min(20, 'Describe your business (min 20 chars)'),
});

const step2Schema = z.object({
  bankName: z.string().min(2, 'Bank name required'),
  accountName: z.string().min(2, 'Account name required'),
  accountNumber: z.string().min(6, 'Account number required'),
  routingNumber: z.string().optional(),
  swiftCode: z.string().optional(),
  bankCurrency: z.string().min(1, 'Select currency'),
  bankCountry: z.string().min(1, 'Select country'),
});

type Step0Form = z.infer<typeof step0Schema>;
type Step2Form = z.infer<typeof step2Schema>;

/* ─── File upload card ─── */
function DocUploadCard({
  label,
  required,
  uploaded,
  onUpload,
}: {
  label: string;
  required: boolean;
  uploaded: boolean;
  onUpload: () => void;
}) {
  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-xl border transition-all',
      uploaded
        ? 'border-emerald-500/30 bg-emerald-500/5'
        : 'border-dashed border-slate-600 hover:border-slate-500',
    )}>
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
        uploaded ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-400'
      )}>
        {uploaded ? <Check className="w-5 h-5" /> : <Upload className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium flex items-center gap-2">
          {label}
          {required && <span className="text-red-400 text-xs">*</span>}
        </div>
        <div className={cn('text-xs mt-0.5', uploaded ? 'text-emerald-400' : 'text-slate-500')}>
          {uploaded ? '✓ Uploaded successfully — pending review' : 'PDF, JPG or PNG • max 10 MB'}
        </div>
      </div>
      {!uploaded && (
        <Button
          size="sm"
          variant="outline"
          onClick={onUpload}
          className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8 flex-shrink-0 text-xs"
        >
          Upload
        </Button>
      )}
    </div>
  );
}

/* ─── Mobile money entry row ─── */
function MobileMoneyRow({
  provider,
  selected,
  phone,
  onToggle,
  onPhoneChange,
}: {
  provider: typeof MOBILE_MONEY_PROVIDERS[0];
  selected: boolean;
  phone: string;
  onToggle: () => void;
  onPhoneChange: (v: string) => void;
}) {
  return (
    <div className={cn('rounded-xl border p-4 transition-all space-y-3',
      selected ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
    )}>
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl', provider.color)}>
          {provider.logo}
        </div>
        <div className="flex-1">
          <div className="text-white text-sm font-semibold">{provider.name}</div>
          <div className="text-slate-400 text-xs">{provider.countries.slice(0, 3).join(', ')}</div>
        </div>
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
      </div>
      {selected && (
        <div>
          <Label className="text-slate-400 text-xs mb-1">Registered phone number</Label>
          <Input
            value={phone}
            onChange={e => onPhoneChange(e.target.value)}
            placeholder="+1 234 567 8900"
            className="bg-slate-700 border-slate-600 text-white h-9 text-sm placeholder:text-slate-500 focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════ Main Page ═══════════════════════════════ */
export default function BusinessRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState<BusinessType>('sole_proprietor');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [bankCurrency, setBankCurrency] = useState('USD');
  const [bankCountry, setBankCountry] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set());
  const [selectedMM, setSelectedMM] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const step0Form = useForm<Step0Form>({
    resolver: zodResolver(step0Schema),
    mode: 'onChange',
    defaultValues: { businessType: 'sole_proprietor' },
  });

  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
  });

  const requiredDocs = REQUIRED_DOCS[businessType] ?? REQUIRED_DOCS.sole_proprietor;
  const requiredUploaded = requiredDocs.filter(d => d.required && uploadedDocs.has(d.type)).length;
  const totalRequired = requiredDocs.filter(d => d.required).length;
  const docsComplete = requiredUploaded >= totalRequired;

  const simulateUpload = (docType: string) => {
    setTimeout(() => {
      setUploadedDocs(prev => new Set([...prev, docType]));
    }, 800);
  };

  const toggleMM = (providerId: string) => {
    setSelectedMM(prev => {
      const next = { ...prev };
      if (next[providerId] !== undefined) delete next[providerId];
      else next[providerId] = '';
      return next;
    });
  };

  const handleNext = async () => {
    if (step === 0) {
      const ok = await step0Form.trigger();
      if (!ok) return;
      const bt = step0Form.getValues('businessType') as BusinessType;
      setBusinessType(bt);
    }
    if (step === 2) {
      const ok = await step2Form.trigger();
      if (!ok) return;
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30">
          <Store className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Business Account Submitted!</h2>
        <p className="text-slate-400 mb-6">
          Your business profile is under review. We'll notify you within 1–2 business days
          once verification is complete. In the meantime, you can set up your payment links.
        </p>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-left space-y-2 text-sm mb-6">
          {[
            ['Business', step0Form.getValues('businessName')],
            ['Type', BUSINESS_TYPES.find(t => t.value === businessType)?.label ?? '—'],
            ['Status', '⏳ Under Review'],
            ['Docs Uploaded', `${uploadedDocs.size} / ${requiredDocs.length}`],
            ['Bank Linked', step2Form.getValues('bankName') ? '✓ Yes' : '✗ Not yet'],
            ['Mobile Money', Object.keys(selectedMM).length > 0 ? `✓ ${Object.keys(selectedMM).length} provider(s)` : '✗ Not yet'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-slate-400">{k}</span>
              <span className="text-white font-medium">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/business/profile')} className="bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0 h-11 w-full">
            View Business Profile <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="border-slate-600 text-slate-300 hover:bg-slate-700 h-11 w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/dashboard')} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Store className="w-6 h-6 text-blue-400" /> Business Account Setup
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Accept payments from your customers worldwide</p>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.label} className="flex items-center gap-1 flex-1 last:flex-none">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                done ? 'bg-emerald-500 text-white' : active ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : 'bg-slate-800 text-slate-500'
              )}>
                {done ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className={cn('text-[10px] font-medium hidden sm:block',
                active ? 'text-white' : done ? 'text-emerald-400' : 'text-slate-500'
              )}>{s.label}</span>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px mx-1', done ? 'bg-emerald-500' : 'bg-slate-700')} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step 0: Business Information ── */}
      {step === 0 && (
        <div className="space-y-5">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400" /> Business Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-slate-300 text-sm mb-1.5">Business / Trading Name *</Label>
                <Input placeholder="e.g. Alex's Digital Store" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500" {...step0Form.register('businessName')} />
                {step0Form.formState.errors.businessName && <p className="text-red-400 text-xs mt-1">{step0Form.formState.errors.businessName.message}</p>}
              </div>

              <div>
                <Label className="text-slate-300 text-sm mb-1.5">Business Type *</Label>
                <Select value={businessType} onValueChange={v => { setBusinessType(v as BusinessType); step0Form.setValue('businessType', v); }}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {BUSINESS_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value} className="text-white hover:bg-slate-700">{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300 text-sm mb-1.5">Industry *</Label>
                <Select value={industry} onValueChange={v => { setIndustry(v); step0Form.setValue('industry', v); }}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 max-h-56">
                    {BUSINESS_INDUSTRIES.map(i => (
                      <SelectItem key={i} value={i} className="text-white hover:bg-slate-700">{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300 text-sm mb-1.5">Registration Number *</Label>
                <Input placeholder="e.g. RC-2024-001234" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500 font-mono" {...step0Form.register('registrationNumber')} />
                {step0Form.formState.errors.registrationNumber && <p className="text-red-400 text-xs mt-1">{step0Form.formState.errors.registrationNumber.message}</p>}
              </div>

              <div>
                <Label className="text-slate-300 text-sm mb-1.5">Tax ID / TIN *</Label>
                <Input placeholder="e.g. TIN-0099887766" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500 font-mono" {...step0Form.register('taxId')} />
                {step0Form.formState.errors.taxId && <p className="text-red-400 text-xs mt-1">{step0Form.formState.errors.taxId.message}</p>}
              </div>

              <div>
                <Label className="text-slate-300 text-sm mb-1.5">Business Email *</Label>
                <Input type="email" placeholder="info@yourbusiness.com" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500" {...step0Form.register('businessEmail')} />
                {step0Form.formState.errors.businessEmail && <p className="text-red-400 text-xs mt-1">{step0Form.formState.errors.businessEmail.message}</p>}
              </div>

              <div>
                <Label className="text-slate-300 text-sm mb-1.5">Business Phone *</Label>
                <Input placeholder="+1 555 000 0000" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500" {...step0Form.register('businessPhone')} />
                {step0Form.formState.errors.businessPhone && <p className="text-red-400 text-xs mt-1">{step0Form.formState.errors.businessPhone.message}</p>}
              </div>

              <div>
                <Label className="text-slate-300 text-sm mb-1.5">Website (optional)</Label>
                <Input placeholder="https://www.yourbusiness.com" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500" {...step0Form.register('website')} />
              </div>

              <div>
                <Label className="text-slate-300 text-sm mb-1.5">Country *</Label>
                <Select value={country} onValueChange={v => { setCountry(v); step0Form.setValue('country', v); }}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500">
                    <SelectValue placeholder="Country of registration" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 max-h-56">
                    {COUNTRIES.map(c => (
                      <SelectItem key={c} value={c} className="text-white hover:bg-slate-700">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label className="text-slate-300 text-sm mb-1.5">Street Address *</Label>
                <Input placeholder="123 Business Ave, Suite 100" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500" {...step0Form.register('address')} />
              </div>

              <div>
                <Label className="text-slate-300 text-sm mb-1.5">City *</Label>
                <Input placeholder="City" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500" {...step0Form.register('city')} />
              </div>

              <div className="md:col-span-2">
                <Label className="text-slate-300 text-sm mb-1.5">Business Description *</Label>
                <Textarea
                  placeholder="Briefly describe what your business does, the products/services you offer, and your target customers..."
                  className="bg-slate-700 border-slate-600 text-white resize-none focus:border-blue-500 placeholder:text-slate-500"
                  rows={3}
                  {...step0Form.register('description')}
                />
                {step0Form.formState.errors.description && <p className="text-red-400 text-xs mt-1">{step0Form.formState.errors.description.message}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Documents ── */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" /> Business Documents
              </h2>
              <Badge className={cn(docsComplete ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30')}>
                {requiredUploaded}/{totalRequired} required
              </Badge>
            </div>
            <p className="text-slate-400 text-xs mb-4">
              Documents for a <strong className="text-slate-300">{BUSINESS_TYPES.find(t => t.value === businessType)?.label}</strong>.
              Required documents are marked with <span className="text-red-400">*</span>.
            </p>

            <div className="space-y-3">
              {requiredDocs.map(doc => (
                <DocUploadCard
                  key={doc.type}
                  label={doc.label}
                  required={doc.required}
                  uploaded={uploadedDocs.has(doc.type)}
                  onUpload={() => simulateUpload(doc.type)}
                />
              ))}
            </div>
          </div>

          {!docsComplete && (
            <Alert className="border-amber-500/30 bg-amber-500/10">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <AlertDescription className="text-amber-400">
                Please upload all required documents before continuing. You can add optional documents later from your business profile.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-400/80 text-xs">All documents are encrypted at rest and in transit. Access is restricted to our compliance team only.</p>
          </div>
        </div>
      )}

      {/* ── Step 2: Bank Account ── */}
      {step === 2 && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" /> Link Bank Account
          </h2>
          <p className="text-slate-400 text-xs">Add a bank account to receive settlements from Bridgeway. Must match your business name.</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="text-slate-300 text-sm mb-1.5">Bank Name *</Label>
              <Input placeholder="e.g. Chase Bank, GTBank, Barclays" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500" {...step2Form.register('bankName')} />
              {step2Form.formState.errors.bankName && <p className="text-red-400 text-xs mt-1">{step2Form.formState.errors.bankName.message}</p>}
            </div>
            <div className="md:col-span-2">
              <Label className="text-slate-300 text-sm mb-1.5">Account Name (as on bank records) *</Label>
              <Input placeholder="Legal business name" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500" {...step2Form.register('accountName')} />
              {step2Form.formState.errors.accountName && <p className="text-red-400 text-xs mt-1">{step2Form.formState.errors.accountName.message}</p>}
            </div>
            <div>
              <Label className="text-slate-300 text-sm mb-1.5">Account Number *</Label>
              <Input placeholder="e.g. 0123456789" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500 font-mono" {...step2Form.register('accountNumber')} />
              {step2Form.formState.errors.accountNumber && <p className="text-red-400 text-xs mt-1">{step2Form.formState.errors.accountNumber.message}</p>}
            </div>
            <div>
              <Label className="text-slate-300 text-sm mb-1.5">Routing / Sort Code</Label>
              <Input placeholder="e.g. 021000021" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500 font-mono" {...step2Form.register('routingNumber')} />
            </div>
            <div>
              <Label className="text-slate-300 text-sm mb-1.5">SWIFT / BIC Code</Label>
              <Input placeholder="e.g. CHASUS33" className="bg-slate-700 border-slate-600 text-white h-11 focus:border-blue-500 placeholder:text-slate-500 font-mono uppercase" {...step2Form.register('swiftCode')} />
            </div>
            <div>
              <Label className="text-slate-300 text-sm mb-1.5">Account Currency *</Label>
              <Select value={bankCurrency} onValueChange={v => { setBankCurrency(v); step2Form.setValue('bankCurrency', v); }}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {['USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'ZAR', 'CAD', 'AUD', 'INR', 'AED'].map(c => (
                    <SelectItem key={c} value={c} className="text-white hover:bg-slate-700">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-300 text-sm mb-1.5">Bank Country *</Label>
              <Select value={bankCountry} onValueChange={v => { setBankCountry(v); step2Form.setValue('bankCountry', v); }}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-11">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 max-h-56">
                  {COUNTRIES.map(c => (
                    <SelectItem key={c} value={c} className="text-white hover:bg-slate-700">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-400/80 text-xs">Bridgeway sends a micro-deposit of $0.01 to verify your account. This may take up to 2 business days.</p>
          </div>
        </div>
      )}

      {/* ── Step 3: Mobile Money ── */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-white font-semibold flex items-center gap-2 mb-1">
              <Smartphone className="w-4 h-4 text-blue-400" /> Link Mobile Money
            </h2>
            <p className="text-slate-400 text-xs mb-5">
              Enable customers in Africa and emerging markets to pay you via mobile money.
              Select all providers you wish to accept. You can add more later.
            </p>
            <div className="space-y-3">
              {MOBILE_MONEY_PROVIDERS.map(p => (
                <MobileMoneyRow
                  key={p.id}
                  provider={p}
                  selected={selectedMM[p.id] !== undefined}
                  phone={selectedMM[p.id] ?? ''}
                  onToggle={() => toggleMM(p.id)}
                  onPhoneChange={v => setSelectedMM(prev => ({ ...prev, [p.id]: v }))}
                />
              ))}
            </div>
          </div>
          {Object.keys(selectedMM).length === 0 && (
            <Alert className="border-slate-700 bg-slate-800/40">
              <Info className="w-4 h-4 text-slate-400" />
              <AlertDescription className="text-slate-400">
                You can skip mobile money for now and add it later from your Business Profile.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* ── Step 4: Review ── */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" /> Review &amp; Submit
            </h2>

            {/* Summary sections */}
            {[
              {
                title: '🏢 Business Information',
                rows: [
                  ['Name', step0Form.getValues('businessName')],
                  ['Type', BUSINESS_TYPES.find(t => t.value === businessType)?.label ?? '—'],
                  ['Industry', step0Form.getValues('industry')],
                  ['Reg. No.', step0Form.getValues('registrationNumber')],
                  ['Tax ID', step0Form.getValues('taxId')],
                  ['Country', step0Form.getValues('country')],
                  ['Email', step0Form.getValues('businessEmail')],
                ],
              },
              {
                title: '📄 Documents',
                rows: [[`Uploaded`, `${uploadedDocs.size} of ${requiredDocs.length} (${totalRequired - requiredUploaded} required missing)`]],
              },
              {
                title: '🏦 Bank Account',
                rows: [
                  ['Bank', step2Form.getValues('bankName') || '— (not added)'],
                  ['A/C', step2Form.getValues('accountNumber') ? `****${step2Form.getValues('accountNumber').slice(-4)}` : '—'],
                  ['Currency', bankCurrency],
                ],
              },
              {
                title: '📱 Mobile Money',
                rows: Object.keys(selectedMM).length > 0
                  ? Object.entries(selectedMM).map(([id, phone]) => [MOBILE_MONEY_PROVIDERS.find(p => p.id === id)?.name ?? id, phone || 'No number'])
                  : [['Status', 'None selected']],
              },
            ].map(section => (
              <div key={section.title} className="bg-slate-700/40 rounded-xl p-4 space-y-2">
                <div className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">{section.title}</div>
                {section.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-slate-400">{k}</span>
                    <span className="text-white font-medium truncate max-w-48 text-right">{v}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Terms */}
            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="biz-terms"
                checked={agreed}
                onCheckedChange={v => setAgreed(!!v)}
                className="mt-0.5 border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label htmlFor="biz-terms" className="text-slate-400 text-sm leading-relaxed cursor-pointer">
                I confirm that all information provided is accurate and I agree to Bridgeway's{' '}
                <span className="text-blue-400">Business Terms of Service</span>,{' '}
                <span className="text-blue-400">Merchant Agreement</span>, and{' '}
                <span className="text-blue-400">Anti-Money Laundering Policy</span>.
              </Label>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(s => s - 1)} className="border-slate-600 text-slate-300 hover:bg-slate-700 h-11">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={step === 1 && !docsComplete}
            className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 h-11"
          >
            Continue <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => setSubmitted(true)}
            disabled={!agreed || !docsComplete}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 h-11"
          >
            <Store className="w-4 h-4 mr-2" /> Submit Business Application
          </Button>
        )}
      </div>
    </div>
  );
}
