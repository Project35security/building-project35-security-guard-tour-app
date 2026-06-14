import { useState } from 'react';
import {
  Settings as SettingsIcon, Shield, Bell, Globe, Palette,
  Smartphone, Key, LogOut, ChevronRight, Check, Eye, EyeOff,
  Lock, AlertCircle, ToggleLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

function SettingRow({ icon: Icon, title, description, children, badge }: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children?: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-700/50 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-slate-700/60 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">{title}</span>
          {badge && <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-[10px]">{badge}</Badge>}
        </div>
        {description && <p className="text-slate-500 text-xs mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');

  const handleChange = () => {
    setError('');
    if (!oldPw || !newPw || !confirmPw) { setError('All fields required'); return; }
    if (newPw !== confirmPw) { setError('Passwords do not match'); return; }
    if (newPw.length < 8) { setError('Password must be at least 8 characters'); return; }
    setStep('success');
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8">
        Change
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
          {step === 'success' ? (
            <div className="text-center py-4">
              <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold">Password changed successfully</p>
              <Button onClick={() => { setOpen(false); setStep('form'); setOldPw(''); setNewPw(''); setConfirmPw(''); }} className="mt-4 w-full bg-blue-600 text-white border-0">Done</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {error && <Alert className="border-red-500/30 bg-red-500/10"><AlertCircle className="w-4 h-4 text-red-400" /><AlertDescription className="text-red-400">{error}</AlertDescription></Alert>}
              {[
                { label: 'Current password', value: oldPw, set: setOldPw, show: showOld, toggle: () => setShowOld(v => !v) },
                { label: 'New password', value: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(v => !v) },
                { label: 'Confirm new password', value: confirmPw, set: setConfirmPw, show: showNew, toggle: () => {} },
              ].map(({ label, value, set, show, toggle }) => (
                <div key={label}>
                  <Label className="text-slate-300 text-xs mb-1">{label}</Label>
                  <div className="relative">
                    <Input type={show ? 'text' : 'password'} value={value} onChange={e => set(e.target.value)} className="bg-slate-800 border-slate-700 text-white h-10 pr-10" />
                    <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</Button>
                <Button onClick={handleChange} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white border-0">Update</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ChangePINDialog() {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [done, setDone] = useState(false);
  const [step, setStep] = useState<'current' | 'new' | 'confirm'>('current');
  const { verifyPin } = useAuth();

  const handleStep = async () => {
    if (step === 'current') {
      const ok = await verifyPin(pin);
      if (!ok) return;
      setPin('');
      setStep('new');
    } else if (step === 'new') {
      setStep('confirm');
    } else {
      if (pin === newPin) { setDone(true); }
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8">
        Change PIN
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader><DialogTitle>Change Transaction PIN</DialogTitle></DialogHeader>
          {done ? (
            <div className="text-center py-4">
              <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold">PIN updated successfully</p>
              <Button onClick={() => { setOpen(false); setDone(false); setStep('current'); }} className="mt-4 w-full bg-blue-600 text-white border-0">Done</Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-slate-400 text-sm">
                {step === 'current' ? 'Enter your current PIN' : step === 'new' ? 'Enter new PIN' : 'Confirm new PIN'}
              </p>
              <p className="text-slate-500 text-xs">Demo PIN: 1234</p>
              <div className="flex justify-center">
                <InputOTP maxLength={4} value={step === 'confirm' ? pin : (step === 'new' ? newPin : pin)} onChange={v => step === 'new' ? setNewPin(v) : setPin(v)}>
                  <InputOTPGroup>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <InputOTPSlot key={i} index={i} className="bg-slate-800 border-slate-700 text-white w-12 h-12 text-xl" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</Button>
                <Button onClick={handleStep} className="flex-1 bg-blue-600 text-white border-0">
                  {step === 'confirm' ? 'Confirm' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [notifSettings, setNotifSettings] = useState({
    notifications: user?.notificationsEnabled ?? true,
    email: user?.emailNotifications ?? true,
    sms: user?.smsNotifications ?? true,
    marketing: user?.marketingOptIn ?? false,
    transactions: true,
    security: true,
    promotions: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showActivity: false,
    dataSharing: false,
  });

  const toggleNotif = (key: keyof typeof notifSettings) => {
    const updated = { ...notifSettings, [key]: !notifSettings[key] };
    setNotifSettings(updated);
    if (key === 'notifications') updateUser({ notificationsEnabled: updated.notifications });
    if (key === 'email') updateUser({ emailNotifications: updated.email });
    if (key === 'sms') updateUser({ smsNotifications: updated.sms });
    if (key === 'marketing') updateUser({ marketingOptIn: updated.marketing });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-slate-400" /> Settings
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your account preferences and security</p>
      </div>

      <Tabs defaultValue="security">
        <TabsList className="bg-slate-800 grid grid-cols-4 w-full">
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-400 text-xs">Security</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-400 text-xs">Alerts</TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-400 text-xs">Privacy</TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-400 text-xs">Preferences</TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-5">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl px-5">
            <SettingRow icon={Key} title="Password" description="Last changed 3 months ago">
              <ChangePasswordDialog />
            </SettingRow>
            <SettingRow icon={Lock} title="Transaction PIN" description="4-digit PIN for authorizing payments" badge={user?.transactionPinSet ? 'Set' : 'Not Set'}>
              <ChangePINDialog />
            </SettingRow>
            <SettingRow icon={Shield} title="Two-Factor Authentication" description="Add an extra layer of security via TOTP app" badge={user?.twoFactorEnabled ? 'Active' : 'Off'}>
              <div className="flex items-center gap-2">
                <Badge className={user?.twoFactorEnabled ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'}>
                  {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateUser({ twoFactorEnabled: !user?.twoFactorEnabled })}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8"
                >
                  {user?.twoFactorEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </SettingRow>
            <SettingRow icon={Smartphone} title="Biometric Authentication" description="Use fingerprint or Face ID to log in">
              <Switch
                checked={user?.biometricEnabled ?? false}
                onCheckedChange={v => updateUser({ biometricEnabled: v })}
                className="data-[state=checked]:bg-blue-600"
              />
            </SettingRow>
            <SettingRow icon={Globe} title="Session Timeout" description={`Auto-logout after ${user?.sessionTimeout} minutes of inactivity`}>
              <select
                value={user?.sessionTimeout ?? 30}
                onChange={e => updateUser({ sessionTimeout: parseInt(e.target.value) })}
                className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-2 py-1"
              >
                {[15, 30, 60, 120].map(v => (
                  <option key={v} value={v}>{v} min</option>
                ))}
              </select>
            </SettingRow>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-400 font-medium text-sm">Security Recommendation</p>
                <p className="text-amber-400/70 text-xs mt-1">Enable biometric authentication for an additional layer of security. Never share your PIN or 2FA codes.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-5">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl px-5">
            {[
              { key: 'notifications', icon: Bell, title: 'Push Notifications', description: 'Enable all in-app notifications' },
              { key: 'email', icon: Globe, title: 'Email Notifications', description: 'Receive updates via email' },
              { key: 'sms', icon: Smartphone, title: 'SMS Alerts', description: 'Critical alerts via text message' },
              { key: 'transactions', icon: Shield, title: 'Transaction Alerts', description: 'Notify on every transaction' },
              { key: 'security', icon: Lock, title: 'Security Alerts', description: 'Login attempts and security events' },
              { key: 'promotions', icon: Bell, title: 'Promotions', description: 'Deals, cashback, and offers' },
              { key: 'marketing', icon: Globe, title: 'Marketing Communications', description: 'Product updates and newsletters' },
            ].map(({ key, icon, title, description }) => (
              <SettingRow key={key} icon={icon} title={title} description={description}>
                <Switch
                  checked={notifSettings[key as keyof typeof notifSettings]}
                  onCheckedChange={() => toggleNotif(key as keyof typeof notifSettings)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </SettingRow>
            ))}
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="mt-5">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl px-5">
            {[
              { key: 'profileVisible', title: 'Public Profile', description: 'Allow others to find you by email or phone' },
              { key: 'showActivity', title: 'Show Activity Status', description: 'Let contacts know when you are online' },
              { key: 'dataSharing', title: 'Analytics Data Sharing', description: 'Help improve Bridgeway by sharing usage data' },
            ].map(({ key, title, description }) => (
              <SettingRow key={key} icon={Eye} title={title} description={description}>
                <Switch
                  checked={privacy[key as keyof typeof privacy]}
                  onCheckedChange={() => setPrivacy(prev => ({ ...prev, [key]: !prev[key as keyof typeof privacy] }))}
                  className="data-[state=checked]:bg-blue-600"
                />
              </SettingRow>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 justify-between">
              Download My Data <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 justify-between">
              Request Account Deletion <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="mt-5">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl px-5">
            <SettingRow icon={Globe} title="Language" description="Application display language">
              <select className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-2 py-1">
                <option>English</option>
                <option>Français</option>
                <option>Español</option>
                <option>Deutsche</option>
                <option>Português</option>
              </select>
            </SettingRow>
            <SettingRow icon={Palette} title="Currency Display" description="Default currency for display">
              <select
                value={user?.preferredCurrency}
                onChange={e => updateUser({ preferredCurrency: e.target.value as typeof user.preferredCurrency })}
                className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-2 py-1"
              >
                {['USD', 'EUR', 'GBP', 'NGN', 'GHS'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </SettingRow>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-800">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 h-11"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out of All Devices
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
