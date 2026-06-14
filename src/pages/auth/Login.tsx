import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Zap, Lock, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, verifyTwoFactor, isLoading, isLocked, loginAttempts } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    const result = await login(data.email, data.password);
    if (!result.success) {
      setError(result.error ?? 'Login failed');
      return;
    }
    if (result.requiresTwoFactor) {
      setStep('2fa');
    } else {
      navigate('/dashboard');
    }
  };

  const handleOTPVerify = async () => {
    setOtpError('');
    if (otpValue.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    const ok = await verifyTwoFactor(otpValue);
    if (!ok) {
      setOtpError('Invalid code. Use 123456 for demo.');
      setOtpValue('');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900/50 via-slate-900 to-violet-900/50 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

        <Link to="/" className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-white">Bridgeway</span>
        </Link>

        <div className="relative">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your Global<br />Financial Hub
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Manage money across borders, book travel, pay bills, and more — all in one secure platform.
          </p>
          <div className="space-y-3">
            {[
              '🔐 Bank-grade 256-bit encryption',
              '🌍 Send money to 180+ countries',
              '⚡ Instant transfers & payments',
              '✈️ Book flights with your wallet balance',
            ].map(f => (
              <div key={f} className="text-slate-300 text-sm">{f}</div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-slate-500">
          Regulated • PCI DSS Compliant • ISO 27001 Certified
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Bridgeway</span>
          </Link>

          {step === 'credentials' ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
                <p className="text-slate-400 text-sm">Sign in to your Bridgeway account</p>
              </div>

              {/* Demo Hint */}
              <div className="mb-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-blue-400 text-xs font-medium">Demo credentials</p>
                <p className="text-slate-400 text-xs mt-0.5">Email: <code className="text-blue-300">alex@bridgeway.com</code></p>
                <p className="text-slate-400 text-xs">Password: <code className="text-blue-300">BridgeWay@2024</code></p>
                <p className="text-slate-400 text-xs">2FA Code: <code className="text-blue-300">123456</code></p>
              </div>

              {error && (
                <Alert className="mb-4 border-red-500/30 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {isLocked && (
                <Alert className="mb-4 border-amber-500/30 bg-amber-500/10">
                  <Lock className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-amber-400">Account temporarily locked. Please try again in 15 minutes.</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-slate-300 text-sm mb-1.5">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isLocked}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11"
                    {...register('email')}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="password" className="text-slate-300 text-sm">Password</Label>
                    <button type="button" className="text-blue-400 text-xs hover:text-blue-300">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      autoComplete="current-password"
                      disabled={isLocked}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 h-11 pr-10"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {loginAttempts > 0 && !isLocked && (
                  <p className="text-amber-400 text-xs">{5 - loginAttempts} attempts remaining before account lock</p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || isLocked}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : 'Sign In'}
                </Button>
              </form>

              <p className="text-center text-slate-400 text-sm mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Create one free</Link>
              </p>
            </>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Two-Factor Authentication</h1>
                <p className="text-slate-400 text-sm">Enter the 6-digit code from your authenticator app</p>
                <p className="text-blue-400 text-xs mt-1">(Demo: use <strong>123456</strong>)</p>
              </div>

              {otpError && (
                <Alert className="mb-4 border-red-500/30 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">{otpError}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center mb-6">
                <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot key={i} index={i} className="bg-slate-800 border-slate-700 text-white w-12 h-12 text-lg" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleOTPVerify}
                disabled={isLoading || otpValue.length !== 6}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : 'Verify Code'}
              </Button>

              <div className="text-center mt-4 space-y-2">
                <button className="text-blue-400 text-sm hover:text-blue-300">Resend code</button>
                <div className="text-slate-500 text-xs">·</div>
                <button onClick={() => setStep('credentials')} className="text-slate-400 text-sm hover:text-slate-300">
                  Back to login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
