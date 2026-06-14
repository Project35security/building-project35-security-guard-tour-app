import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Zap, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';

const COUNTRIES = ['United States', 'United Kingdom', 'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Brazil', 'Singapore', 'UAE', 'Saudi Arabia'];

const passwordSchema = z.string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/[a-z]/, 'At least one lowercase letter')
  .regex(/[0-9]/, 'At least one number')
  .regex(/[^A-Za-z0-9]/, 'At least one special character');

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name too short'),
  lastName: z.string().min(2, 'Last name too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone number'),
  country: z.string().min(1, 'Select a country'),
  dateOfBirth: z.string().min(1, 'Date of birth required'),
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(v => v, 'You must accept the terms'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const STEPS = ['Personal Info', 'Contact', 'Security', 'Confirm'];

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500'];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < score ? colors[score - 1] : 'bg-slate-700'}`} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map(({ label, ok }) => (
          <div key={label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-emerald-400' : 'text-slate-500'}`}>
            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${ok ? 'bg-emerald-500/20' : 'bg-slate-700'}`}>
              {ok && <Check className="w-2 h-2" />}
            </div>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [country, setCountry] = useState('');

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');
  const acceptTerms = watch('acceptTerms', false);

  const STEP_FIELDS: (keyof RegisterForm)[][] = [
    ['firstName', 'lastName', 'dateOfBirth', 'country'],
    ['email', 'phone'],
    ['password', 'confirmPassword'],
    ['acceptTerms'],
  ];

  const nextStep = async () => {
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (valid) setCurrentStep(s => Math.min(s + 1, 3));
  };

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    const result = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      country: data.country,
      dateOfBirth: data.dateOfBirth,
    });
    if (!result.success) {
      setError(result.error ?? 'Registration failed');
      return;
    }
    navigate('/login?registered=true');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">Bridgeway</span>
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-slate-400 text-sm mt-1">Join millions of users worldwide</p>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
                  ${i < currentStep ? 'bg-emerald-500 text-white' : i === currentStep ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                  {i < currentStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i === currentStep ? 'text-white font-medium' : 'text-slate-500'}`}>{step}</span>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px transition-all ${i < currentStep ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <Alert className="mb-4 border-red-500/30 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 0: Personal Info */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300 text-sm mb-1.5">First name</Label>
                    <Input placeholder="John" className="bg-slate-800 border-slate-700 text-white h-11 placeholder:text-slate-500 focus:border-blue-500" {...register('firstName')} />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <Label className="text-slate-300 text-sm mb-1.5">Last name</Label>
                    <Input placeholder="Doe" className="bg-slate-800 border-slate-700 text-white h-11 placeholder:text-slate-500 focus:border-blue-500" {...register('lastName')} />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-1.5">Date of birth</Label>
                  <Input type="date" className="bg-slate-800 border-slate-700 text-white h-11 focus:border-blue-500" {...register('dateOfBirth')} />
                  {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth.message}</p>}
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-1.5">Country of residence</Label>
                  <Select value={country} onValueChange={v => { setCountry(v); setValue('country', v); }}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-11 focus:border-blue-500">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {COUNTRIES.map(c => (
                        <SelectItem key={c} value={c} className="text-white hover:bg-slate-700">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country.message}</p>}
                </div>
              </div>
            )}

            {/* Step 1: Contact */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300 text-sm mb-1.5">Email address</Label>
                  <Input type="email" placeholder="john@example.com" className="bg-slate-800 border-slate-700 text-white h-11 placeholder:text-slate-500 focus:border-blue-500" {...register('email')} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-1.5">Phone number</Label>
                  <Input placeholder="+1 (555) 000-0000" className="bg-slate-800 border-slate-700 text-white h-11 placeholder:text-slate-500 focus:border-blue-500" {...register('phone')} />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Security */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300 text-sm mb-1.5">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className="bg-slate-800 border-slate-700 text-white h-11 placeholder:text-slate-500 focus:border-blue-500 pr-10"
                      {...register('password')}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && <PasswordStrength password={password} />}
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-1.5">Confirm password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      className="bg-slate-800 border-slate-700 text-white h-11 placeholder:text-slate-500 focus:border-blue-500 pr-10"
                      {...register('confirmPassword')}
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 rounded-xl p-4 text-sm space-y-1.5">
                  <div className="text-slate-400 text-xs font-medium uppercase mb-2">Account Summary</div>
                  {[
                    ['Name', `${watch('firstName')} ${watch('lastName')}`],
                    ['Email', watch('email')],
                    ['Phone', watch('phone')],
                    ['Country', watch('country')],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400">{k}</span>
                      <span className="text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={v => setValue('acceptTerms', !!v)}
                    className="mt-0.5 border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="terms" className="text-slate-400 text-sm leading-relaxed cursor-pointer">
                    I agree to Bridgeway's <span className="text-blue-400">Terms of Service</span> and <span className="text-blue-400">Privacy Policy</span>. I confirm I am 18 years or older.
                  </Label>
                </div>
                {errors.acceptTerms && <p className="text-red-400 text-xs">{errors.acceptTerms.message}</p>}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={() => setCurrentStep(s => s - 1)} className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 h-11">
                  Back
                </Button>
              )}
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep} className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 h-11">
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !acceptTerms} className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 h-11">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </div>
                  ) : 'Create Account'}
                </Button>
              )}
            </div>
          </form>

          <p className="text-center text-slate-400 text-sm mt-4">
            Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
