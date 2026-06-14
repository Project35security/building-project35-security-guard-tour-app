import React, { createContext, useContext, useState, useCallback } from 'react';
import type { WalletAccount, Transaction, VirtualCard, Subscription, Notification } from '@/types';
import {
  MOCK_WALLETS, MOCK_TRANSACTIONS, MOCK_CARDS,
  MOCK_SUBSCRIPTIONS, MOCK_NOTIFICATIONS,
} from '@/data/mockData';

interface WalletContextType {
  wallets: WalletAccount[];
  transactions: Transaction[];
  cards: VirtualCard[];
  subscriptions: Subscription[];
  notifications: Notification[];
  unreadCount: number;
  totalBalanceUSD: number;
  isProcessing: boolean;
  sendMoney: (params: SendMoneyParams) => Promise<{ success: boolean; reference?: string; error?: string }>;
  fundWallet: (walletId: string, amount: number, method: string) => Promise<{ success: boolean; error?: string }>;
  buyAirtime: (params: AirtimeParams) => Promise<{ success: boolean; error?: string }>;
  payInsurance: (planId: string, amount: number) => Promise<{ success: boolean; error?: string }>;
  paySubscription: (serviceId: string, amount: number) => Promise<{ success: boolean; error?: string }>;
  bookFlight: (flightId: string, amount: number) => Promise<{ success: boolean; reference?: string; error?: string }>;
  toggleCardFreeze: (cardId: string) => void;
  cancelSubscription: (subId: string) => void;
  markNotificationsRead: () => void;
  addWallet: (currency: string) => void;
}

export interface SendMoneyParams {
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientAccount?: string;
  amount: number;
  currency: string;
  note?: string;
  fee: number;
}

export interface AirtimeParams {
  networkId: string;
  phoneNumber: string;
  amount: number;
  type: 'airtime' | 'data';
  planId?: string;
}

const WalletContext = createContext<WalletContextType | null>(null);

const USD_RATES: Record<string, number> = {
  USD: 1, EUR: 1.085, GBP: 1.262, NGN: 0.000626, GHS: 0.0648,
  KES: 0.0077, ZAR: 0.0534, JPY: 0.00636, CAD: 0.7325,
  AUD: 0.6542, INR: 0.01198, CNY: 0.1379, AED: 0.2723, BRL: 0.1929, SGD: 0.7451,
};

function toUSD(amount: number, currency: string): number {
  return amount * (USD_RATES[currency] ?? 1);
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<WalletAccount[]>(MOCK_WALLETS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [cards, setCards] = useState<VirtualCard[]>(MOCK_CARDS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalBalanceUSD = wallets.reduce((sum, w) => sum + toUSD(w.balance, w.currency), 0);
  const unreadCount = notifications.filter(n => !n.read).length;

  const deductFromWallet = useCallback((currency: string, amount: number): boolean => {
    const wallet = wallets.find(w => w.currency === currency);
    if (!wallet || wallet.balance < amount) return false;
    setWallets(prev => prev.map(w =>
      w.currency === currency ? { ...w, balance: w.balance - amount } : w
    ));
    return true;
  }, [wallets]);

  const addToWallet = useCallback((currency: string, amount: number) => {
    setWallets(prev => prev.map(w =>
      w.currency === currency ? { ...w, balance: w.balance + amount } : w
    ));
  }, []);

  const addTransaction = useCallback((txn: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTxn: Transaction = {
      ...txn,
      id: `txn_${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedAt: txn.status === 'completed' ? new Date().toISOString() : undefined,
    };
    setTransactions(prev => [newTxn, ...prev]);
    return newTxn;
  }, []);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications(prev => [{
      ...notif, id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(), read: false,
    }, ...prev]);
  }, []);

  const sendMoney = useCallback(async (params: SendMoneyParams) => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));

    const total = params.amount + params.fee;
    const wallet = wallets.find(w => w.currency === params.currency);
    if (!wallet || wallet.balance < total) {
      setIsProcessing(false);
      return { success: false, error: 'Insufficient balance' };
    }

    deductFromWallet(params.currency, total);
    const ref = `BWY${Date.now()}`;
    addTransaction({
      type: 'debit', category: 'transfer_out',
      amount: params.amount, currency: params.currency as Transaction['currency'],
      description: `Transfer to ${params.recipientName}`,
      status: 'completed', reference: ref,
      counterparty: params.recipientName,
      fee: params.fee,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance - total,
      note: params.note,
    });
    addNotification({ type: 'transaction', title: 'Transfer Successful', message: `${params.amount} ${params.currency} sent to ${params.recipientName}` });
    setIsProcessing(false);
    return { success: true, reference: ref };
  }, [wallets, deductFromWallet, addTransaction, addNotification]);

  const fundWallet = useCallback(async (walletId: string, amount: number, _method: string) => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1200));
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) { setIsProcessing(false); return { success: false, error: 'Wallet not found' }; }
    addToWallet(wallet.currency, amount);
    addTransaction({
      type: 'credit', category: 'deposit',
      amount, currency: wallet.currency,
      description: `Wallet top-up`,
      status: 'completed', reference: `BWY${Date.now()}`,
      fee: 0, balanceBefore: wallet.balance, balanceAfter: wallet.balance + amount,
    });
    addNotification({ type: 'transaction', title: 'Wallet Funded', message: `${amount} ${wallet.currency} added to your wallet` });
    setIsProcessing(false);
    return { success: true };
  }, [wallets, addToWallet, addTransaction, addNotification]);

  const buyAirtime = useCallback(async (params: AirtimeParams) => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1000));
    const usdWallet = wallets.find(w => w.currency === 'USD');
    if (!usdWallet || usdWallet.balance < params.amount) {
      setIsProcessing(false);
      return { success: false, error: 'Insufficient balance' };
    }
    deductFromWallet('USD', params.amount);
    addTransaction({
      type: 'debit', category: params.type === 'airtime' ? 'airtime' : 'data',
      amount: params.amount, currency: 'USD',
      description: `${params.type === 'airtime' ? 'Airtime' : 'Data'} recharge - ${params.phoneNumber}`,
      status: 'completed', reference: `BWY${Date.now()}`,
      fee: 0, balanceBefore: usdWallet.balance, balanceAfter: usdWallet.balance - params.amount,
    });
    setIsProcessing(false);
    return { success: true };
  }, [wallets, deductFromWallet, addTransaction]);

  const payInsurance = useCallback(async (_planId: string, amount: number) => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1000));
    const usdWallet = wallets.find(w => w.currency === 'USD');
    if (!usdWallet || usdWallet.balance < amount) {
      setIsProcessing(false);
      return { success: false, error: 'Insufficient balance' };
    }
    deductFromWallet('USD', amount);
    addTransaction({
      type: 'debit', category: 'insurance',
      amount, currency: 'USD',
      description: 'Insurance premium payment',
      status: 'completed', reference: `BWY${Date.now()}`,
      fee: 0, balanceBefore: usdWallet.balance, balanceAfter: usdWallet.balance - amount,
    });
    setIsProcessing(false);
    return { success: true };
  }, [wallets, deductFromWallet, addTransaction]);

  const paySubscription = useCallback(async (serviceId: string, amount: number) => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800));
    const sub = subscriptions.find(s => s.id === serviceId);
    const usdWallet = wallets.find(w => w.currency === 'USD');
    if (!usdWallet || usdWallet.balance < amount) {
      setIsProcessing(false);
      return { success: false, error: 'Insufficient balance' };
    }
    deductFromWallet('USD', amount);
    addTransaction({
      type: 'debit', category: 'subscription',
      amount, currency: 'USD',
      description: `${sub?.service ?? 'Subscription'} - ${sub?.plan ?? ''}`,
      status: 'completed', reference: `BWY${Date.now()}`,
      fee: 0, balanceBefore: usdWallet.balance, balanceAfter: usdWallet.balance - amount,
    });
    setIsProcessing(false);
    return { success: true };
  }, [wallets, subscriptions, deductFromWallet, addTransaction]);

  const bookFlight = useCallback(async (_flightId: string, amount: number) => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    const usdWallet = wallets.find(w => w.currency === 'USD');
    if (!usdWallet || usdWallet.balance < amount) {
      setIsProcessing(false);
      return { success: false, error: 'Insufficient balance' };
    }
    deductFromWallet('USD', amount);
    const ref = `FLT${Date.now()}`;
    addTransaction({
      type: 'debit', category: 'travel',
      amount, currency: 'USD',
      description: 'Flight booking',
      status: 'completed', reference: ref,
      fee: 5, balanceBefore: usdWallet.balance, balanceAfter: usdWallet.balance - amount,
    });
    addNotification({ type: 'transaction', title: 'Flight Booked!', message: `Your flight has been booked. Booking ref: ${ref}` });
    setIsProcessing(false);
    return { success: true, reference: ref };
  }, [wallets, deductFromWallet, addTransaction, addNotification]);

  const toggleCardFreeze = useCallback((cardId: string) => {
    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, status: c.status === 'frozen' ? 'active' : 'frozen' } : c
    ));
  }, []);

  const cancelSubscription = useCallback((subId: string) => {
    setSubscriptions(prev => prev.map(s =>
      s.id === subId ? { ...s, status: 'cancelled', autoRenew: false } : s
    ));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addWallet = useCallback((currency: string) => {
    if (wallets.some(w => w.currency === currency)) return;
    setWallets(prev => [...prev, {
      id: `wal_${Date.now()}`, userId: 'usr_bridgeway_001',
      currency: currency as WalletAccount['currency'],
      balance: 0, lockedBalance: 0,
      accountNumber: Math.random().toString().slice(2, 14).replace(/(.{4})/g, '$1-').slice(0, -1),
      isDefault: false, createdAt: new Date().toISOString(),
    }]);
  }, [wallets]);

  return (
    <WalletContext.Provider value={{
      wallets, transactions, cards, subscriptions, notifications,
      unreadCount, totalBalanceUSD, isProcessing,
      sendMoney, fundWallet, buyAirtime, payInsurance,
      paySubscription, bookFlight, toggleCardFreeze,
      cancelSubscription, markNotificationsRead, addWallet,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
