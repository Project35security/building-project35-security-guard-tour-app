import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Zap, Shield, Globe, Smartphone, Plane, CreditCard,
  ArrowRight, Check, Star, Lock, Eye, TrendingUp, RefreshCw,
} from 'lucide-react';

const FEATURES = [
  { icon: Globe, title: 'Global Transfers', description: 'Send money to 180+ countries in seconds with real-time exchange rates and minimal fees.', color: 'from-blue-500 to-cyan-500' },
  { icon: Plane, title: 'Travel Booking', description: 'Search and book flights worldwide directly from your wallet. Earn cashback on every booking.', color: 'from-violet-500 to-purple-600' },
  { icon: Smartphone, title: 'Airtime & Data', description: 'Instantly recharge airtime and data for any network in 50+ countries.', color: 'from-emerald-500 to-teal-600' },
  { icon: Shield, title: 'Insurance', description: 'Comprehensive health, life, auto and travel insurance tailored to your needs.', color: 'from-orange-500 to-amber-500' },
  { icon: RefreshCw, title: 'Subscriptions', description: 'Pay all your digital subscriptions from one place. Never miss a payment.', color: 'from-pink-500 to-rose-500' },
  { icon: CreditCard, title: 'Virtual Cards', description: 'Issue unlimited virtual cards for secure online shopping with custom spending limits.', color: 'from-indigo-500 to-blue-600' },
];

const SECURITY_FEATURES = [
  'Bank-grade 256-bit AES encryption',
  'Two-factor authentication (2FA)',
  'Biometric verification',
  'Real-time fraud detection',
  'Transaction PIN protection',
  'KYC & AML compliance',
  'PCI DSS Level 1 certified',
  'ISO 27001 certified',
];

const STATS = [
  { value: '4M+', label: 'Active Users' },
  { value: '180+', label: 'Countries' },
  { value: '$2B+', label: 'Transferred' },
  { value: '4.9★', label: 'App Rating' },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', country: 'Kenya', text: 'Bridgeway changed how I send money home. Fees are incredibly low and transfers are instant.', avatar: 'SK', rating: 5 },
  { name: 'James O.', country: 'Nigeria', text: 'Finally a wallet that handles everything. Airtime, flights, insurance - all in one app!', avatar: 'JO', rating: 5 },
  { name: 'Maria C.', country: 'China', text: 'The security features give me complete peace of mind. Best fintech app I\'ve used.', avatar: 'MC', rating: 5 },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-slate-800/80 backdrop-blur-sm bg-slate-950/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Bridgeway</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')} className="text-slate-300 hover:text-white hover:bg-slate-800">
              Sign in
            </Button>
            <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-blue-500/25">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-violet-600/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <Badge className="mb-6 bg-blue-500/15 text-blue-400 border-blue-500/30 px-4 py-1.5 text-sm">
            🌍 Now serving 180+ countries worldwide
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Global
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent"> Financial</span>
            <br />Companion
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Send money globally, buy flights, pay for insurance, manage subscriptions,
            and more — all secured with bank-grade encryption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 px-8 h-14 text-base shadow-xl shadow-blue-500/25"
            >
              Open Free Account <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg" variant="outline"
              onClick={() => navigate('/login')}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 h-14 text-base"
            >
              Demo: alex@bridgeway.com / BridgeWay@2024
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="text-sm text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wallet Preview */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-slate-400 text-sm">Total Portfolio Balance</div>
                <div className="text-4xl font-bold text-white mt-1">$18,526.67</div>
                <div className="text-emerald-400 text-sm mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +2.34% this month
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">Verified ✓</Badge>
                <div className="text-slate-500 text-xs mt-2">Tier 2 Account</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {['🇺🇸 USD $12,485', '🇪🇺 EUR €3,890', '🇬🇧 GBP £2,150'].map(w => (
                <div key={w} className="bg-slate-800 rounded-xl p-3 text-sm">
                  <div className="text-slate-300 font-medium">{w}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: '↗️', label: 'Send', color: 'bg-blue-500/15 text-blue-400' },
                { icon: '↙️', label: 'Receive', color: 'bg-emerald-500/15 text-emerald-400' },
                { icon: '✈️', label: 'Travel', color: 'bg-violet-500/15 text-violet-400' },
                { icon: '📱', label: 'Airtime', color: 'bg-orange-500/15 text-orange-400' },
              ].map(({ icon, label, color }) => (
                <div key={label} className={`${color} rounded-xl p-3 text-center cursor-pointer hover:opacity-80 transition-opacity`}>
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-xs font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">One wallet for all your financial needs, globally.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                🔐 Enterprise-Grade Security
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-4">Your Money, Safe &amp; Secure</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Bridgeway employs multiple layers of security to protect your funds and personal information. We comply with all major international financial regulations.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SECURITY_FEATURES.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                {[
                  { icon: Lock, text: 'Transaction secured with 2FA', time: 'Just now', color: 'text-blue-400' },
                  { icon: Eye, text: 'Suspicious login blocked', time: '2 min ago', color: 'text-amber-400' },
                  { icon: Shield, text: 'KYC verification complete', time: '5 min ago', color: 'text-emerald-400' },
                  { icon: Zap, text: '$2,500 received from Sarah K.', time: '12 min ago', color: 'text-violet-400' },
                ].map(({ icon: Icon, text, time, color }) => (
                  <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60">
                    <div className={`w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">{text}</div>
                      <div className="text-xs text-slate-500">{time}</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Loved by Millions</h2>
            <p className="text-slate-400">Join 4 million+ users who trust Bridgeway</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, country, text, avatar, rating }) => (
              <div key={name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                    {avatar}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{name}</div>
                    <div className="text-slate-500 text-xs">{country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Start Your Global Journey</h2>
          <p className="text-slate-400 mb-8">Open a free account in 3 minutes. No hidden fees.</p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 px-10 h-14 text-base shadow-xl shadow-blue-500/25"
          >
            Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-slate-500 text-sm mt-4">No credit card required • FDIC insured • Regulated in 50+ countries</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-white">Bridgeway</span>
            <span className="text-slate-500 text-sm">© 2026 All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy</a>
            <a href="#" className="hover:text-slate-300">Terms</a>
            <a href="#" className="hover:text-slate-300">Security</a>
            <a href="#" className="hover:text-slate-300">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
