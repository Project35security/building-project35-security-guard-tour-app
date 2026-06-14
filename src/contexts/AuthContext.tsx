import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '@/types';
import { MOCK_USER } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAttempts: number;
  isLocked: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresTwoFactor: boolean; error?: string }>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  resetLoginAttempts: () => void;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  dateOfBirth: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_PIN = '1234';
const DEMO_2FA = '123456';
const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000; // 15 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);

  const isLocked = lockUntil !== null && Date.now() < lockUntil;

  useEffect(() => {
    const stored = sessionStorage.getItem('bw_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          setUser(parsed.user);
          setSessionExpiry(parsed.expiresAt);
        } else {
          sessionStorage.removeItem('bw_auth');
        }
      } catch {
        sessionStorage.removeItem('bw_auth');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!sessionExpiry) return;
    const remaining = sessionExpiry - Date.now();
    if (remaining <= 0) { logout(); return; }
    const timer = setTimeout(logout, remaining);
    return () => clearTimeout(timer);
  }, [sessionExpiry]);

  const login = useCallback(async (email: string, password: string) => {
    if (isLocked) {
      const remaining = Math.ceil((lockUntil! - Date.now()) / 60000);
      return { success: false, requiresTwoFactor: false, error: `Account locked. Try again in ${remaining} minutes.` };
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const validEmail = email.toLowerCase() === 'alex@bridgeway.com' || email.toLowerCase() === 'demo@bridgeway.com';
    const validPassword = password === 'BridgeWay@2024' || password === 'demo123';

    if (!validEmail || !validPassword) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      if (attempts >= MAX_ATTEMPTS) {
        setLockUntil(Date.now() + LOCK_DURATION);
        setIsLoading(false);
        return { success: false, requiresTwoFactor: false, error: 'Too many failed attempts. Account locked for 15 minutes.' };
      }
      setIsLoading(false);
      return { success: false, requiresTwoFactor: false, error: `Invalid credentials. ${MAX_ATTEMPTS - attempts} attempts remaining.` };
    }

    setLoginAttempts(0);
    setIsLoading(false);
    return { success: true, requiresTwoFactor: MOCK_USER.twoFactorEnabled };
  }, [isLocked, lockUntil, loginAttempts]);

  const verifyTwoFactor = useCallback(async (code: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setIsLoading(false);

    if (code !== DEMO_2FA) return false;

    const expiresAt = Date.now() + MOCK_USER.sessionTimeout * 60 * 1000;
    setUser(MOCK_USER);
    setSessionExpiry(expiresAt);
    sessionStorage.setItem('bw_auth', JSON.stringify({ user: MOCK_USER, expiresAt }));
    return true;
  }, []);

  const verifyPin = useCallback(async (pin: string) => {
    await new Promise(r => setTimeout(r, 400));
    return pin === DEMO_PIN;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSessionExpiry(null);
    sessionStorage.removeItem('bw_auth');
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      const stored = sessionStorage.getItem('bw_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        sessionStorage.setItem('bw_auth', JSON.stringify({ ...parsed, user: updated }));
      }
      return updated;
    });
  }, []);

  const register = useCallback(async (_data: RegisterData) => {
    await new Promise(r => setTimeout(r, 1200));
    return { success: true };
  }, []);

  const resetLoginAttempts = useCallback(() => {
    setLoginAttempts(0);
    setLockUntil(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading,
      loginAttempts, isLocked,
      login, verifyTwoFactor, verifyPin, logout,
      updateUser, register, resetLoginAttempts,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
