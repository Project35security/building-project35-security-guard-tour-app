import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode, Camera, Flashlight, X, Check, AlertCircle,
  Keyboard, ChevronRight, Store, User, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/formatters';
import type { QRPaymentData } from '@/types';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';

/* ── Sample QR payloads that users can "tap to scan" ── */
const DEMO_QR_CODES: Array<{ label: string; icon: string; color: string; category: string; data: QRPaymentData }> = [
  {
    label: "Alex's Coffee",
    icon: '☕',
    color: 'from-amber-600 to-amber-800',
    category: 'Food & Beverage',
    data: { type: 'business', merchant: "Alex's Coffee Shop", merchantId: 'biz_001', amount: 12.50, currency: 'USD', description: 'Coffee & Croissant', reference: 'ORD-COF-2024' },
  },
  {
    label: 'TechMart Store',
    icon: '💻',
    color: 'from-blue-600 to-blue-800',
    category: 'Electronics',
    data: { type: 'business', merchant: 'TechMart Electronics', merchantId: 'biz_002', amount: 249.99, currency: 'USD', description: 'Wireless Headphones', reference: 'ORD-TECH-8821' },
  },
  {
    label: 'Nairobi Market',
    icon: '🛒',
    color: 'from-green-600 to-green-800',
    category: 'Retail',
    data: { type: 'business', merchant: 'Nairobi Market Hub', merchantId: 'biz_003', amount: 3500, currency: 'KES', description: 'Weekly groceries', reference: 'ORD-NBI-0045' },
  },
  {
    label: 'Lagos Pharmacy',
    icon: '💊',
    color: 'from-red-600 to-red-800',
    category: 'Healthcare',
    data: { type: 'business', merchant: 'HealthPlus Pharmacy', merchantId: 'biz_004', amount: 8500, currency: 'NGN', description: 'Prescription refill', reference: 'ORD-PHM-1190' },
  },
  {
    label: 'Ride Share',
    icon: '🚕',
    color: 'from-yellow-500 to-yellow-700',
    category: 'Transport',
    data: { type: 'payment', merchant: 'SafeRide Driver', amount: 8.75, currency: 'USD', description: 'Airport drop-off', reference: 'RID-4422' },
  },
  {
    label: 'Request Money',
    icon: '💸',
    color: 'from-violet-600 to-violet-800',
    category: 'P2P',
    data: { type: 'request', merchant: 'David Osei', amount: 50.00, currency: 'USD', description: 'Dinner split', reference: 'REQ-9023' },
  },
];

/* ── Scan-line animation via inline style / CSS class ── */
function ScannerViewfinder({ scanning }: { scanning: boolean }) {
  return (
    <div className="relative w-72 h-72 mx-auto">
      {/* Dark overlay with transparent center */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-950/80 backdrop-blur-sm">
        {/* Camera icon in center when not scanning a specific code */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="w-16 h-16 text-slate-700" />
        </div>
      </div>

      {/* Corner brackets */}
      {[
        'top-0 left-0 border-t-4 border-l-4 rounded-tl-2xl',
        'top-0 right-0 border-t-4 border-r-4 rounded-tr-2xl',
        'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl',
        'bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl',
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-10 h-10 border-blue-400 ${cls} ${scanning ? 'border-emerald-400' : 'border-blue-400'} transition-colors duration-500`}
        />
      ))}

      {/* Scanning line */}
      {scanning && (
        <div
          className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
          style={{
            animation: 'scan-line 2s ease-in-out infinite',
            boxShadow: '0 0 8px 2px rgba(96,165,250,0.6)',
          }}
        />
      )}

      {/* Grid dots */}
      <div className="absolute inset-4 grid grid-cols-6 grid-rows-6 opacity-10">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-blue-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Payment confirmation modal ── */
function PaymentConfirmModal({
  qrData,
  onClose,
  onConfirm,
  isProcessing,
}: {
  qrData: QRPaymentData;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  isProcessing: boolean;
}) {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const { wallets } = useWallet();
  const wallet = wallets.find(w => w.currency === (qrData.currency ?? 'USD'));
  const hasBalance = wallet && wallet.balance >= (qrData.amount ?? 0);

  const handleConfirm = () => {
    setPinError('');
    if (pin.length !== 4) { setPinError('Enter 4-digit PIN'); return; }
    onConfirm(pin);
  };

  const typeLabel: Record<string, string> = {
    payment: 'Pay', request: 'Pay Request', business: 'Merchant Payment',
  };

  return (
    <div className="space-y-4">
      {/* Merchant/Payee Card */}
      <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0">
          {qrData.type === 'business' ? <Store className="w-7 h-7 text-white" /> : <User className="w-7 h-7 text-white" />}
        </div>
        <div>
          <div className="text-slate-400 text-xs">{typeLabel[qrData.type] ?? 'Payment'}</div>
          <div className="text-white font-bold text-lg mt-0.5">{qrData.merchant}</div>
          {qrData.category && <div className="text-slate-400 text-xs">{qrData.category}</div>}
        </div>
      </div>

      {/* Amount */}
      <div className="text-center py-4">
        <div className="text-slate-400 text-sm mb-1">Amount to pay</div>
        <div className="text-4xl font-bold text-white">
          {qrData.amount ? formatCurrency(qrData.amount, qrData.currency ?? 'USD') : 'Flexible'}
        </div>
        {qrData.description && (
          <div className="text-slate-400 text-sm mt-1">{qrData.description}</div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 bg-slate-800/60 rounded-xl p-4 text-sm">
        {qrData.reference && (
          <div className="flex justify-between">
            <span className="text-slate-400">Reference</span>
            <span className="text-white font-mono">{qrData.reference}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-400">Your balance</span>
          <span className={hasBalance ? 'text-emerald-400' : 'text-red-400'}>
            {wallet ? formatCurrency(wallet.balance, wallet.currency) : '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Processing fee</span>
          <span className="text-emerald-400">Free</span>
        </div>
      </div>

      {!hasBalance && qrData.amount && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <AlertDescription className="text-red-400">Insufficient balance. Please top up your {qrData.currency} wallet.</AlertDescription>
        </Alert>
      )}

      {/* PIN */}
      <div className="text-center">
        <p className="text-slate-400 text-sm mb-1">Enter transaction PIN to pay</p>
        <p className="text-slate-500 text-xs mb-3">Demo: 1234</p>
        {pinError && <p className="text-red-400 text-xs mb-2">{pinError}</p>}
        <div className="flex justify-center mb-4">
          <InputOTP maxLength={4} value={pin} onChange={setPin}>
            <InputOTPGroup>
              {Array.from({ length: 4 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} className="bg-slate-800 border-slate-700 text-white w-12 h-12 text-xl" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isProcessing || pin.length !== 4 || !hasBalance}
          className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0"
        >
          {isProcessing
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : `Pay ${qrData.amount ? formatCurrency(qrData.amount, qrData.currency ?? 'USD') : 'Now'}`}
        </Button>
      </div>
    </div>
  );
}

/* ── Success screen ── */
function PaymentSuccess({ qrData, txRef, onDone }: { qrData: QRPaymentData; txRef: string; onDone: () => void }) {
  return (
    <div className="text-center py-4 space-y-4">
      <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-emerald-400" />
      </div>
      <div>
        <p className="text-white font-bold text-xl">Payment Successful!</p>
        <p className="text-slate-400 text-sm mt-1">
          {qrData.amount ? formatCurrency(qrData.amount, qrData.currency ?? 'USD') : 'Payment'} sent to {qrData.merchant}
        </p>
      </div>
      <div className="bg-slate-800 rounded-xl p-4 text-left space-y-2 text-sm">
        {[
          ['Merchant', qrData.merchant ?? '—'],
          ['Amount', qrData.amount ? formatCurrency(qrData.amount, qrData.currency ?? 'USD') : '—'],
          ['Reference', qrData.reference ?? '—'],
          ['Transaction ID', txRef],
          ['Status', '✓ Completed'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-slate-400">{k}</span>
            <span className="text-white font-medium">{v}</span>
          </div>
        ))}
      </div>
      <Button onClick={onDone} className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0 h-11">
        Done
      </Button>
    </div>
  );
}

/* ═══════════════════════════════ Main Page ═══════════════════════════════ */
export default function QRScan() {
  const navigate = useNavigate();
  const { sendMoney, isProcessing } = useWallet();
  const { verifyPin } = useAuth();
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [scanning, setScanning] = useState(true);
  const [scanned, setScanned] = useState<QRPaymentData | null>(null);
  const [scannedLabel, setScannedLabel] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txRef, setTxRef] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [manualError, setManualError] = useState('');
  const [torch, setTorch] = useState(false);

  /* simulate a scanning pulse */
  useEffect(() => {
    if (scanned) return;
    const id = setInterval(() => setScanning(v => !v), 2000);
    return () => clearInterval(id);
  }, [scanned]);

  const handleQRSelect = (demo: typeof DEMO_QR_CODES[0]) => {
    setScanned(demo.data);
    setScannedLabel(demo.label);
    setScanning(false);
    setTimeout(() => setConfirmOpen(true), 400);
  };

  const handleManualParse = () => {
    setManualError('');
    if (!manualCode.trim()) { setManualError('Enter a QR code or payment reference'); return; }
    // Try JSON parse first
    try {
      const parsed = JSON.parse(manualCode) as QRPaymentData;
      setScanned(parsed);
      setConfirmOpen(true);
      return;
    } catch {}
    // Treat as reference code — look up in demo set
    const match = DEMO_QR_CODES.find(d => d.data.reference?.toLowerCase() === manualCode.toLowerCase().trim());
    if (match) {
      handleQRSelect(match);
      return;
    }
    setManualError('QR code not recognised. Try one of the sample codes below, e.g. ORD-COF-2024');
  };

  const handleConfirmPayment = async (pin: string) => {
    if (!scanned) return;
    const ok = await verifyPin(pin);
    if (!ok) return;
    const result = await sendMoney({
      recipientName: scanned.merchant ?? 'QR Merchant',
      amount: scanned.amount ?? 0,
      currency: scanned.currency ?? 'USD',
      fee: 0,
      note: scanned.description,
    });
    if (result.success) {
      setTxRef(result.reference ?? `QRP${Date.now()}`);
      setSuccess(true);
    }
  };

  const resetAll = () => {
    setScanned(null);
    setScannedLabel('');
    setConfirmOpen(false);
    setSuccess(false);
    setTxRef('');
    setManualCode('');
    setManualError('');
    setScanning(true);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <QrCode className="w-7 h-7 text-blue-400" /> Scan & Pay
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Scan any Bridgeway QR code to pay instantly</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/wallet?tab=receive')}
          className="border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
        >
          <QrCode className="w-4 h-4 mr-2" /> My QR
        </Button>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
        {[
          { val: 'scan', icon: Camera, label: 'Camera Scan' },
          { val: 'manual', icon: Keyboard, label: 'Enter Code' },
        ].map(({ val, icon: Icon, label }) => (
          <button
            key={val}
            onClick={() => setMode(val as 'scan' | 'manual')}
            className={cn('flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all',
              mode === val ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            )}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Camera / Scanner */}
      {mode === 'scan' && (
        <div className="space-y-5">
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

            <ScannerViewfinder scanning={scanning} />

            <div className="mt-4 text-center">
              {scanned ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">QR Code detected — {scannedLabel}</span>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">
                  {scanning ? '🔍 Scanning for QR codes...' : 'Point camera at a QR code'}
                </p>
              )}
            </div>

            {/* Camera controls */}
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => setTorch(v => !v)}
                className={cn('p-3 rounded-xl border transition-all text-sm flex items-center gap-2',
                  torch ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'
                )}
              >
                <span className="text-lg">{torch ? '🔦' : '💡'}</span>
                {torch ? 'Flash On' : 'Flash Off'}
              </button>
              <button
                onClick={() => setScanning(v => !v)}
                className="p-3 rounded-xl border border-slate-700 text-slate-400 hover:border-slate-600 transition-all text-sm"
              >
                {scanning ? '⏸ Pause' : '▶ Resume'}
              </button>
            </div>
          </div>

          {/* Demo QR Codes to "tap to scan" */}
          <div>
            <p className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wider">
              Tap a merchant QR to simulate scanning
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DEMO_QR_CODES.map(demo => (
                <button
                  key={demo.label}
                  onClick={() => handleQRSelect(demo)}
                  className="group bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-left hover:border-blue-500/50 hover:bg-slate-800 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${demo.color} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>
                    {demo.icon}
                  </div>
                  <div className="text-white text-xs font-semibold">{demo.label}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">{demo.category}</div>
                  {demo.data.amount && (
                    <div className="text-blue-400 text-xs font-bold mt-1">
                      {formatCurrency(demo.data.amount, demo.data.currency ?? 'USD')}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry */}
      {mode === 'manual' && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <div>
            <Label className="text-slate-300 text-sm mb-2">Payment code or reference</Label>
            <div className="flex gap-2">
              <Input
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="e.g. ORD-COF-2024 or paste QR data"
                className="flex-1 bg-slate-700 border-slate-600 text-white h-11 placeholder:text-slate-500 focus:border-blue-500"
                onKeyDown={e => e.key === 'Enter' && handleManualParse()}
              />
              <Button onClick={handleManualParse} className="bg-blue-600 hover:bg-blue-500 text-white border-0 h-11 px-5">
                Pay
              </Button>
            </div>
            {manualError && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {manualError}
              </p>
            )}
          </div>

          <div>
            <p className="text-slate-500 text-xs mb-2">Try these sample reference codes:</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_QR_CODES.map(d => (
                <button
                  key={d.data.reference}
                  onClick={() => setManualCode(d.data.reference ?? '')}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors font-mono"
                >
                  {d.data.reference}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <p className="text-slate-400 text-xs mb-3">Or pay a Bridgeway username</p>
            <div className="flex gap-2">
              <div className="flex items-center px-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 text-sm flex-shrink-0">
                @
              </div>
              <Input placeholder="username" className="flex-1 bg-slate-700 border-slate-600 text-white h-10 placeholder:text-slate-500" />
              <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0 h-10 px-4">Find</Button>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-blue-400/80 text-xs leading-relaxed">
          Bridgeway QR payments are instant, free, and protected by your transaction PIN.
          Works with any Bridgeway merchant or personal wallet.
        </p>
      </div>

      {/* Confirm / Success Dialog */}
      <Dialog open={confirmOpen} onOpenChange={v => { if (!v) resetAll(); }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {success ? 'Payment Complete' : 'Confirm Payment'}
            </DialogTitle>
          </DialogHeader>
          {success && scanned
            ? <PaymentSuccess qrData={scanned} txRef={txRef} onDone={() => { resetAll(); navigate('/dashboard'); }} />
            : scanned
            ? <PaymentConfirmModal
                qrData={scanned}
                onClose={resetAll}
                onConfirm={handleConfirmPayment}
                isProcessing={isProcessing}
              />
            : null}
        </DialogContent>
      </Dialog>

      {/* scan-line keyframe injected via style tag */}
      <style>{`
        @keyframes scan-line {
          0%   { top: 12px;   opacity: 1; }
          45%  { top: calc(100% - 12px); opacity: 1; }
          50%  { opacity: 0; }
          55%  { top: 12px;   opacity: 0; }
          60%  { opacity: 1; }
          100% { top: calc(100% - 12px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
