import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { WalletProvider } from '@/contexts/WalletContext';
import AppLayout from '@/components/layout/AppLayout';

import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Transfer from './pages/Transfer';
import Travel from './pages/Travel';
import Airtime from './pages/Airtime';
import Insurance from './pages/Insurance';
import Subscriptions from './pages/Subscriptions';
import Cards from './pages/Cards';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WalletProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected app routes */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/transfer" element={<Transfer />} />
                  <Route path="/travel" element={<Travel />} />
                  <Route path="/airtime" element={<Airtime />} />
                  <Route path="/insurance" element={<Insurance />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/cards" element={<Cards />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
