import { useState } from 'react';
import { User, Camera, Check, Upload, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/lib/formatters';
import { MOCK_AUDIT_LOGS } from '@/data/mockData';
import { formatDateTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';

const KYC_STEPS = [
  { label: 'Email verified', done: true },
  { label: 'Phone verified', done: true },
  { label: 'ID document', done: true },
  { label: 'Proof of address', done: true },
  { label: 'Selfie verification', done: true },
  { label: 'Video call', done: false },
];

const TIER_INFO = [
  { tier: 1, name: 'Starter', daily: '$500', monthly: '$2,000', color: 'from-slate-500 to-slate-600' },
  { tier: 2, name: 'Standard', daily: '$5,000', monthly: '$20,000', color: 'from-blue-500 to-blue-700' },
  { tier: 3, name: 'Premium', daily: 'Unlimited', monthly: 'Unlimited', color: 'from-amber-500 to-amber-700' },
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: user?.phone ?? '',
    address: user?.address ?? '',
    occupation: user?.occupation ?? '',
  });

  const handleSave = () => {
    updateUser(form);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const kycPct = Math.round((KYC_STEPS.filter(s => s.done).length / KYC_STEPS.length) * 100);

  const KYC_BADGE = {
    none: { label: 'Unverified', color: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
    pending: { label: 'Pending', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    in_review: { label: 'In Review', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    verified: { label: 'Verified ✓', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    rejected: { label: 'Rejected', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
  };

  const kyc = KYC_BADGE[user?.kycStatus ?? 'none'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-7 h-7 text-blue-400" /> My Profile
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your personal information and verification</p>
      </div>

      {/* Profile Header */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
              {getInitials(`${user?.firstName} ${user?.lastName}`)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
              <Badge className={kyc.color}>{kyc.label}</Badge>
              <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30">Tier {user?.tier}</Badge>
            </div>
            <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
            <p className="text-slate-400 text-sm">{user?.phone}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-slate-500 text-xs">Member since {new Date(user?.createdAt ?? '').toLocaleDateString('en', { month: 'long', year: 'numeric' })}</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-500 text-xs">Referral: <span className="text-blue-400">{user?.referralCode}</span></span>
            </div>
          </div>
          {saved && (
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
              <Check className="w-3 h-3 mr-1" /> Saved
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="personal" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">Personal Info</TabsTrigger>
          <TabsTrigger value="kyc" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">KYC Verification</TabsTrigger>
          <TabsTrigger value="limits" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">Account Limits</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">Activity Log</TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal" className="mt-5">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Personal Information</h3>
              {editing ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8">Cancel</Button>
                  <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white border-0 h-8">Save</Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8">Edit</Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'First Name', key: 'firstName', type: 'text' },
                { label: 'Last Name', key: 'lastName', type: 'text' },
                { label: 'Phone', key: 'phone', type: 'tel' },
                { label: 'Occupation', key: 'occupation', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <Label className="text-slate-400 text-xs mb-1.5">{label}</Label>
                  {editing ? (
                    <Input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white h-10 focus:border-blue-500"
                    />
                  ) : (
                    <div className="text-white text-sm py-2 border-b border-slate-700/50">
                      {form[key as keyof typeof form] || '—'}
                    </div>
                  )}
                </div>
              ))}
              <div className="md:col-span-2">
                <Label className="text-slate-400 text-xs mb-1.5">Address</Label>
                {editing ? (
                  <Input
                    value={form.address}
                    onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white h-10 focus:border-blue-500"
                  />
                ) : (
                  <div className="text-white text-sm py-2 border-b border-slate-700/50">{form.address || '—'}</div>
                )}
              </div>
              <div>
                <Label className="text-slate-400 text-xs mb-1.5">Email</Label>
                <div className="text-white text-sm py-2 border-b border-slate-700/50 flex items-center gap-2">
                  {user?.email}
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">Verified</Badge>
                </div>
              </div>
              <div>
                <Label className="text-slate-400 text-xs mb-1.5">Date of Birth</Label>
                <div className="text-white text-sm py-2 border-b border-slate-700/50">{user?.dateOfBirth || '—'}</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* KYC Verification */}
        <TabsContent value="kyc" className="mt-5">
          <div className="space-y-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Verification Status</h3>
                <Badge className={kyc.color}>{kyc.label}</Badge>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Verification progress</span>
                  <span>{kycPct}%</span>
                </div>
                <Progress value={kycPct} className="h-2 bg-slate-700" />
              </div>
              <div className="space-y-2">
                {KYC_STEPS.map(step => (
                  <div key={step.label} className="flex items-center gap-3 text-sm">
                    <div className={cn('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                      step.done ? 'bg-emerald-500/20' : 'bg-slate-700'
                    )}>
                      {step.done ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-2 h-2 rounded-full bg-slate-500" />}
                    </div>
                    <span className={step.done ? 'text-slate-300' : 'text-slate-500'}>{step.label}</span>
                    {!step.done && <Badge className="ml-auto bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]">Required</Badge>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Upload Documents</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'National ID / Passport', icon: '🪪', done: true },
                  { label: 'Proof of Address', icon: '📄', done: true },
                  { label: 'Selfie with ID', icon: '🤳', done: true },
                  { label: 'Bank Statement', icon: '🏦', done: false },
                ].map(doc => (
                  <div key={doc.label} className={cn(
                    'p-4 rounded-xl border flex items-center gap-3',
                    doc.done ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-dashed border-slate-600'
                  )}>
                    <span className="text-2xl">{doc.icon}</span>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{doc.label}</div>
                      <div className={doc.done ? 'text-emerald-400 text-xs' : 'text-slate-500 text-xs'}>
                        {doc.done ? '✓ Uploaded & verified' : 'Not uploaded yet'}
                      </div>
                    </div>
                    {!doc.done && (
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 h-7 text-xs">
                        <Upload className="w-3 h-3 mr-1" /> Upload
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Limits */}
        <TabsContent value="limits" className="mt-5">
          <div className="space-y-4">
            {TIER_INFO.map(t => (
              <div
                key={t.tier}
                className={cn(
                  'bg-slate-800/60 border rounded-xl p-5 transition-all',
                  user?.tier === t.tier ? 'border-blue-500/30' : 'border-slate-700/50 opacity-60'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`bg-gradient-to-r ${t.color} px-3 py-1 rounded-full text-white text-sm font-medium`}>
                    Tier {t.tier} — {t.name}
                  </div>
                  {user?.tier === t.tier && <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30">Current</Badge>}
                  {(user?.tier ?? 0) < t.tier && <Badge className="bg-slate-700 text-slate-400 border-slate-600">Locked</Badge>}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Daily limit</div>
                    <div className="text-white font-semibold mt-0.5">{t.daily}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Monthly limit</div>
                    <div className="text-white font-semibold mt-0.5">{t.monthly}</div>
                  </div>
                </div>
                {(user?.tier ?? 0) < t.tier && (
                  <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-500 text-white border-0 h-8 text-xs">
                    Upgrade to Tier {t.tier}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Activity Log */}
        <TabsContent value="activity" className="mt-5">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl divide-y divide-slate-700/50">
            {MOCK_AUDIT_LOGS.map(log => (
              <div key={log.id} className="flex items-start gap-3 p-4">
                <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0',
                  log.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'
                )} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{log.action}</div>
                  <div className="text-slate-400 text-xs mt-0.5">
                    {log.device} • {log.location} • {log.ipAddress}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-slate-400 text-xs">{formatDateTime(log.createdAt)}</div>
                  <Badge className={cn('mt-1 text-[10px]',
                    log.status === 'success'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/15 text-red-400 border-red-500/30'
                  )}>
                    {log.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
