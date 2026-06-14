import type {
  User, WalletAccount, Transaction, VirtualCard, InsurancePlan,
  Subscription, Network, ExchangeRate, Notification, AuditLog,
  Beneficiary, SavingsGoal, FlightResult
} from '@/types';

export const MOCK_USER: User = {
  id: 'usr_bridgeway_001',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 234-5678',
  firstName: 'Alex',
  lastName: 'Morgan',
  avatar: '',
  kycStatus: 'verified',
  twoFactorEnabled: true,
  biometricEnabled: false,
  transactionPinSet: true,
  country: 'US',
  dateOfBirth: '1990-03-15',
  address: '742 Evergreen Terrace, Springfield, CA 90210',
  occupation: 'Software Engineer',
  tier: 2,
  referralCode: 'ALEX2024BW',
  createdAt: '2024-01-15T10:30:00Z',
  lastLoginAt: '2026-06-14T08:15:00Z',
  loginAttempts: 0,
  sessionTimeout: 30,
  notificationsEnabled: true,
  emailNotifications: true,
  smsNotifications: true,
  marketingOptIn: false,
  preferredCurrency: 'USD',
  language: 'en',
};

export const MOCK_WALLETS: WalletAccount[] = [
  {
    id: 'wal_001', userId: 'usr_bridgeway_001', currency: 'USD',
    balance: 12_485.67, lockedBalance: 250.00,
    accountNumber: '4521-8834-9012', iban: 'US29 NWBK 6016 1331 9268 19',
    routingNumber: '021000021', swiftCode: 'BWAYUS33',
    isDefault: true, createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'wal_002', userId: 'usr_bridgeway_001', currency: 'EUR',
    balance: 3_890.20, lockedBalance: 0,
    accountNumber: '7823-1145-3344', iban: 'DE89 3704 0044 0532 0130 00',
    swiftCode: 'BWAYDEM1',
    isDefault: false, createdAt: '2024-02-10T14:20:00Z',
  },
  {
    id: 'wal_003', userId: 'usr_bridgeway_001', currency: 'GBP',
    balance: 2_150.80, lockedBalance: 0,
    accountNumber: '6611-2233-8855', iban: 'GB29 NWBK 6016 1331 9268 19',
    swiftCode: 'BWAYGB2L',
    isDefault: false, createdAt: '2024-03-05T09:15:00Z',
  },
  {
    id: 'wal_004', userId: 'usr_bridgeway_001', currency: 'NGN',
    balance: 5_420_000.00, lockedBalance: 0,
    accountNumber: '0123456789',
    isDefault: false, createdAt: '2024-04-01T11:00:00Z',
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_001', type: 'credit', category: 'transfer_in',
    amount: 2500.00, currency: 'USD', description: 'Payment from Sarah K.',
    status: 'completed', reference: 'BWY2024061401', counterparty: 'Sarah Kimani',
    fee: 0, balanceBefore: 9985.67, balanceAfter: 12485.67,
    createdAt: '2026-06-14T07:32:00Z', completedAt: '2026-06-14T07:33:00Z',
    note: 'Rent split June',
  },
  {
    id: 'txn_002', type: 'debit', category: 'subscription',
    amount: 15.99, currency: 'USD', description: 'Netflix Premium',
    status: 'completed', reference: 'BWY2024061402',
    fee: 0, balanceBefore: 10001.66, balanceAfter: 9985.67,
    createdAt: '2026-06-13T23:00:00Z', completedAt: '2026-06-13T23:01:00Z',
  },
  {
    id: 'txn_003', type: 'debit', category: 'transfer_out',
    amount: 500.00, currency: 'USD', description: 'International transfer to James O.',
    status: 'completed', reference: 'BWY2024061403', counterparty: 'James Okonkwo',
    fee: 3.99, balanceBefore: 10501.66, balanceAfter: 10001.66,
    createdAt: '2026-06-13T14:20:00Z', completedAt: '2026-06-13T14:25:00Z',
  },
  {
    id: 'txn_004', type: 'debit', category: 'airtime',
    amount: 20.00, currency: 'USD', description: 'Airtime recharge - Verizon +14155551234',
    status: 'completed', reference: 'BWY2024061404',
    fee: 0.50, balanceBefore: 10521.66, balanceAfter: 10501.66,
    createdAt: '2026-06-12T10:05:00Z', completedAt: '2026-06-12T10:05:30Z',
  },
  {
    id: 'txn_005', type: 'credit', category: 'deposit',
    amount: 5000.00, currency: 'USD', description: 'Bank deposit - Chase ****1234',
    status: 'completed', reference: 'BWY2024061405',
    fee: 0, balanceBefore: 5521.66, balanceAfter: 10521.66,
    createdAt: '2026-06-11T16:45:00Z', completedAt: '2026-06-11T16:50:00Z',
  },
  {
    id: 'txn_006', type: 'debit', category: 'travel',
    amount: 342.50, currency: 'USD', description: 'Flight - NYC to London (BA007)',
    status: 'completed', reference: 'BWY2024061406',
    fee: 5.00, balanceBefore: 5864.16, balanceAfter: 5521.66,
    createdAt: '2026-06-10T12:30:00Z', completedAt: '2026-06-10T12:32:00Z',
  },
  {
    id: 'txn_007', type: 'debit', category: 'insurance',
    amount: 89.00, currency: 'USD', description: 'Health Insurance Premium - BlueCross',
    status: 'completed', reference: 'BWY2024061407',
    fee: 0, balanceBefore: 5953.16, balanceAfter: 5864.16,
    createdAt: '2026-06-10T08:00:00Z', completedAt: '2026-06-10T08:00:01Z',
  },
  {
    id: 'txn_008', type: 'debit', category: 'data',
    amount: 30.00, currency: 'USD', description: 'Data Plan - AT&T 10GB',
    status: 'completed', reference: 'BWY2024061408',
    fee: 0, balanceBefore: 5983.16, balanceAfter: 5953.16,
    createdAt: '2026-06-09T15:20:00Z', completedAt: '2026-06-09T15:21:00Z',
  },
  {
    id: 'txn_009', type: 'credit', category: 'refund',
    amount: 150.00, currency: 'USD', description: 'Refund - Cancelled hotel booking',
    status: 'completed', reference: 'BWY2024061409',
    fee: 0, balanceBefore: 5833.16, balanceAfter: 5983.16,
    createdAt: '2026-06-09T09:15:00Z', completedAt: '2026-06-09T09:16:00Z',
  },
  {
    id: 'txn_010', type: 'debit', category: 'subscription',
    amount: 9.99, currency: 'USD', description: 'Spotify Premium',
    status: 'completed', reference: 'BWY2024061410',
    fee: 0, balanceBefore: 5843.15, balanceAfter: 5833.16,
    createdAt: '2026-06-08T06:00:00Z', completedAt: '2026-06-08T06:00:10Z',
  },
  {
    id: 'txn_011', type: 'debit', category: 'transfer_out',
    amount: 200.00, currency: 'USD', description: 'Transfer to Maria C.',
    status: 'pending', reference: 'BWY2024061411', counterparty: 'Maria Chen',
    fee: 2.00, balanceBefore: 6043.15, balanceAfter: 5843.15,
    createdAt: '2026-06-08T11:20:00Z',
  },
  {
    id: 'txn_012', type: 'debit', category: 'card',
    amount: 75.40, currency: 'USD', description: 'Amazon.com - Virtual Card',
    status: 'completed', reference: 'BWY2024061412',
    fee: 0, balanceBefore: 6118.55, balanceAfter: 6043.15,
    createdAt: '2026-06-07T20:14:00Z', completedAt: '2026-06-07T20:15:00Z',
  },
];

export const MOCK_CARDS: VirtualCard[] = [
  {
    id: 'crd_001', userId: 'usr_bridgeway_001',
    last4: '4242', expiryMonth: '09', expiryYear: '28',
    brand: 'Visa', currency: 'USD', balance: 1000.00, spendingLimit: 5000.00,
    status: 'active', nickname: 'Main Shopping Card',
    createdAt: '2024-01-15T10:30:00Z', color: 'from-blue-600 to-violet-600',
  },
  {
    id: 'crd_002', userId: 'usr_bridgeway_001',
    last4: '8833', expiryMonth: '12', expiryYear: '27',
    brand: 'Mastercard', currency: 'USD', balance: 500.00, spendingLimit: 2000.00,
    status: 'frozen', nickname: 'Subscriptions Card',
    createdAt: '2024-03-20T09:00:00Z', color: 'from-amber-500 to-orange-600',
  },
];

export const MOCK_INSURANCE_PLANS: InsurancePlan[] = [
  {
    id: 'ins_001', type: 'health', name: 'BlueCross Essential',
    provider: 'BlueCross BlueShield', monthlyPremium: 89.00, coverageAmount: 500_000,
    currency: 'USD', description: 'Comprehensive health coverage for individuals',
    features: ['Preventive care', 'Emergency services', 'Prescription drugs', 'Mental health', 'Vision & Dental'],
    rating: 4.7, popular: true, color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'ins_002', type: 'life', name: 'SecureLife Term 20',
    provider: 'MetLife', monthlyPremium: 45.00, coverageAmount: 500_000,
    currency: 'USD', description: '20-year term life insurance with fixed premiums',
    features: ['$500K death benefit', 'Income protection', 'Child rider available', 'Convertible policy'],
    rating: 4.8, popular: false, color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'ins_003', type: 'auto', name: 'DriveShield Comprehensive',
    provider: 'State Farm', monthlyPremium: 120.00, coverageAmount: 50_000,
    currency: 'USD', description: 'Full vehicle protection including collision and liability',
    features: ['Collision coverage', 'Liability protection', 'Roadside assistance', 'Rental reimbursement', 'Uninsured motorist'],
    rating: 4.6, popular: true, color: 'from-orange-500 to-red-500',
  },
  {
    id: 'ins_004', type: 'travel', name: 'GlobalTravel Pro',
    provider: 'Allianz', monthlyPremium: 25.00, coverageAmount: 100_000,
    currency: 'USD', description: 'Worldwide travel protection for frequent travelers',
    features: ['Trip cancellation', 'Medical evacuation', 'Lost luggage', 'Flight delay', '24/7 assistance'],
    rating: 4.5, popular: false, color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'ins_005', type: 'home', name: 'HomeGuard Premium',
    provider: 'Allstate', monthlyPremium: 95.00, coverageAmount: 350_000,
    currency: 'USD', description: 'Complete home and contents insurance',
    features: ['Structure protection', 'Personal property', 'Liability coverage', 'Temporary housing', 'Natural disasters'],
    rating: 4.4, popular: false, color: 'from-pink-500 to-rose-600',
  },
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_001', service: 'Netflix', plan: 'Premium 4K', logo: '🎬',
    color: 'from-red-600 to-red-800', amount: 15.99, currency: 'USD',
    billingCycle: 'monthly', nextBillingDate: '2026-07-13',
    status: 'active', category: 'streaming', autoRenew: true, startedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'sub_002', service: 'Spotify', plan: 'Premium', logo: '🎵',
    color: 'from-green-500 to-green-700', amount: 9.99, currency: 'USD',
    billingCycle: 'monthly', nextBillingDate: '2026-07-08',
    status: 'active', category: 'music', autoRenew: true, startedAt: '2023-08-08T00:00:00Z',
  },
  {
    id: 'sub_003', service: 'Amazon Prime', plan: 'Annual', logo: '📦',
    color: 'from-amber-500 to-orange-600', amount: 139.00, currency: 'USD',
    billingCycle: 'annual', nextBillingDate: '2027-01-20',
    status: 'active', category: 'streaming', autoRenew: true, startedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'sub_004', service: 'iCloud+', plan: '2TB Storage', logo: '☁️',
    color: 'from-blue-400 to-blue-600', amount: 9.99, currency: 'USD',
    billingCycle: 'monthly', nextBillingDate: '2026-07-01',
    status: 'active', category: 'cloud', autoRenew: true, startedAt: '2022-07-01T00:00:00Z',
  },
  {
    id: 'sub_005', service: 'Microsoft 365', plan: 'Personal', logo: '📊',
    color: 'from-blue-600 to-indigo-700', amount: 6.99, currency: 'USD',
    billingCycle: 'monthly', nextBillingDate: '2026-07-05',
    status: 'active', category: 'productivity', autoRenew: true, startedAt: '2023-07-05T00:00:00Z',
  },
  {
    id: 'sub_006', service: 'Disney+', plan: 'Standard', logo: '✨',
    color: 'from-blue-800 to-indigo-900', amount: 7.99, currency: 'USD',
    billingCycle: 'monthly', nextBillingDate: '2026-07-18',
    status: 'paused', category: 'streaming', autoRenew: false, startedAt: '2024-03-18T00:00:00Z',
  },
  {
    id: 'sub_007', service: 'PlayStation Plus', plan: 'Extra', logo: '🎮',
    color: 'from-blue-600 to-blue-900', amount: 14.99, currency: 'USD',
    billingCycle: 'monthly', nextBillingDate: '2026-07-22',
    status: 'active', category: 'gaming', autoRenew: true, startedAt: '2024-04-22T00:00:00Z',
  },
];

export const MOCK_NETWORKS: Network[] = [
  {
    id: 'net_001', name: 'Verizon', country: 'US', code: '+1', logo: '📶',
    color: 'from-red-500 to-red-700', currency: 'USD',
    airtimeDenominations: [5, 10, 15, 20, 25, 30, 50, 100],
    dataPlans: [
      { id: 'dp_001', name: 'Basic 1GB', data: '1GB', validity: '30 days', price: 10, popular: false },
      { id: 'dp_002', name: 'Standard 5GB', data: '5GB', validity: '30 days', price: 20, popular: true },
      { id: 'dp_003', name: 'Pro 10GB', data: '10GB', validity: '30 days', price: 30, popular: false },
      { id: 'dp_004', name: 'Unlimited', data: 'Unlimited', validity: '30 days', price: 50, popular: true },
    ],
  },
  {
    id: 'net_002', name: 'AT&T', country: 'US', code: '+1', logo: '📡',
    color: 'from-blue-500 to-blue-700', currency: 'USD',
    airtimeDenominations: [5, 10, 20, 30, 50, 100],
    dataPlans: [
      { id: 'dp_005', name: 'Basic 2GB', data: '2GB', validity: '30 days', price: 15, popular: false },
      { id: 'dp_006', name: 'Value 5GB', data: '5GB', validity: '30 days', price: 25, popular: true },
      { id: 'dp_007', name: 'Pro 15GB', data: '15GB', validity: '30 days', price: 40, popular: false },
      { id: 'dp_008', name: 'Unlimited Plus', data: 'Unlimited', validity: '30 days', price: 55, popular: true },
    ],
  },
  {
    id: 'net_003', name: 'MTN Nigeria', country: 'NG', code: '+234', logo: '📱',
    color: 'from-yellow-400 to-yellow-600', currency: 'NGN',
    airtimeDenominations: [100, 200, 500, 1000, 2000, 5000],
    dataPlans: [
      { id: 'dp_009', name: '1GB Daily', data: '1GB', validity: '1 day', price: 200, popular: false },
      { id: 'dp_010', name: '5GB Weekly', data: '5GB', validity: '7 days', price: 1000, popular: true },
      { id: 'dp_011', name: '10GB Monthly', data: '10GB', validity: '30 days', price: 2000, popular: true },
      { id: 'dp_012', name: '30GB Monthly', data: '30GB', validity: '30 days', price: 5000, popular: false },
    ],
  },
  {
    id: 'net_004', name: 'Airtel Africa', country: 'NG', code: '+234', logo: '🔴',
    color: 'from-red-600 to-red-800', currency: 'NGN',
    airtimeDenominations: [100, 200, 500, 1000, 2000, 5000],
    dataPlans: [
      { id: 'dp_013', name: '1.5GB Daily', data: '1.5GB', validity: '1 day', price: 200, popular: false },
      { id: 'dp_014', name: '6GB Weekly', data: '6GB', validity: '7 days', price: 1000, popular: true },
      { id: 'dp_015', name: '12GB Monthly', data: '12GB', validity: '30 days', price: 2000, popular: true },
    ],
  },
  {
    id: 'net_005', name: 'Safaricom', country: 'KE', code: '+254', logo: '🌍',
    color: 'from-green-500 to-green-700', currency: 'KES',
    airtimeDenominations: [50, 100, 200, 500, 1000],
    dataPlans: [
      { id: 'dp_016', name: '1GB Daily', data: '1GB', validity: '1 day', price: 99, popular: false },
      { id: 'dp_017', name: '5GB Weekly', data: '5GB', validity: '7 days', price: 500, popular: true },
      { id: 'dp_018', name: '15GB Monthly', data: '15GB', validity: '30 days', price: 1000, popular: true },
    ],
  },
  {
    id: 'net_006', name: 'T-Mobile', country: 'US', code: '+1', logo: '🟣',
    color: 'from-pink-500 to-pink-700', currency: 'USD',
    airtimeDenominations: [10, 20, 30, 50, 100],
    dataPlans: [
      { id: 'dp_019', name: 'Basic 3GB', data: '3GB', validity: '30 days', price: 15 },
      { id: 'dp_020', name: 'Essentials 10GB', data: '10GB', validity: '30 days', price: 35, popular: true },
      { id: 'dp_021', name: 'Magenta Unlimited', data: 'Unlimited', validity: '30 days', price: 45, popular: true },
    ],
  },
];

export const MOCK_EXCHANGE_RATES: ExchangeRate[] = [
  { from: 'USD', to: 'EUR', rate: 0.9218, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'GBP', rate: 0.7924, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'NGN', rate: 1595.50, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'GHS', rate: 15.42, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'KES', rate: 129.80, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'ZAR', rate: 18.72, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'JPY', rate: 157.23, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'CAD', rate: 1.3651, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'AUD', rate: 1.5289, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'INR', rate: 83.45, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'CNY', rate: 7.2567, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'AED', rate: 3.6725, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'BRL', rate: 5.1823, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'SGD', rate: 1.3421, updatedAt: '2026-06-14T08:00:00Z' },
  { from: 'USD', to: 'CHF', rate: 0.8978, updatedAt: '2026-06-14T08:00:00Z' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_001', type: 'transaction', title: 'Money Received',
    message: 'You received $2,500.00 from Sarah Kimani',
    read: false, createdAt: '2026-06-14T07:33:00Z',
  },
  {
    id: 'notif_002', type: 'security', title: 'New Login Detected',
    message: 'Your account was accessed from San Francisco, CA on Chrome/MacOS',
    read: false, createdAt: '2026-06-14T08:15:00Z',
  },
  {
    id: 'notif_003', type: 'transaction', title: 'Transfer Successful',
    message: '$500.00 sent to James Okonkwo (Nigeria) successfully',
    read: true, createdAt: '2026-06-13T14:25:00Z',
  },
  {
    id: 'notif_004', type: 'promotion', title: 'Zero Fees Weekend!',
    message: 'Send money internationally with 0% fees this weekend only',
    read: true, createdAt: '2026-06-13T09:00:00Z',
  },
  {
    id: 'notif_005', type: 'system', title: 'KYC Verification Complete',
    message: 'Your identity has been verified. You now have Tier 2 access.',
    read: true, createdAt: '2026-06-10T15:30:00Z',
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud_001', action: 'Login successful', ipAddress: '192.168.1.1', device: 'Chrome / MacOS', location: 'San Francisco, CA', status: 'success', createdAt: '2026-06-14T08:15:00Z' },
  { id: 'aud_002', action: 'Initiated transfer', ipAddress: '192.168.1.1', device: 'Chrome / MacOS', location: 'San Francisco, CA', status: 'success', createdAt: '2026-06-13T14:19:00Z' },
  { id: 'aud_003', action: 'Changed notification settings', ipAddress: '192.168.1.1', device: 'Safari / iOS', location: 'San Francisco, CA', status: 'success', createdAt: '2026-06-12T20:05:00Z' },
  { id: 'aud_004', action: 'Login failed (wrong password)', ipAddress: '45.12.34.56', device: 'Unknown / Windows', location: 'Lagos, Nigeria', status: 'failed', createdAt: '2026-06-12T03:22:00Z' },
  { id: 'aud_005', action: 'Password changed', ipAddress: '192.168.1.1', device: 'Chrome / MacOS', location: 'San Francisco, CA', status: 'success', createdAt: '2026-06-10T11:00:00Z' },
];

export const MOCK_BENEFICIARIES: Beneficiary[] = [
  { id: 'ben_001', name: 'Sarah Kimani', email: 'sarah.k@example.com', phone: '+254 712 345 678', currency: 'USD', country: 'KE', avatar: '', lastTransferAt: '2026-06-14T07:32:00Z', transferCount: 12 },
  { id: 'ben_002', name: 'James Okonkwo', email: 'james.o@example.com', accountNumber: '0123456789', bankName: 'GTBank', currency: 'NGN', country: 'NG', avatar: '', lastTransferAt: '2026-06-13T14:20:00Z', transferCount: 8 },
  { id: 'ben_003', name: 'Maria Chen', email: 'maria.c@example.com', currency: 'USD', country: 'CN', avatar: '', lastTransferAt: '2026-06-08T11:20:00Z', transferCount: 3 },
  { id: 'ben_004', name: 'David Osei', phone: '+233 244 123 456', currency: 'GHS', country: 'GH', avatar: '', lastTransferAt: '2026-05-30T09:00:00Z', transferCount: 5 },
];

export const MOCK_SAVINGS_GOALS: SavingsGoal[] = [
  { id: 'sav_001', name: 'Europe Vacation', targetAmount: 5000, currentAmount: 3200, currency: 'USD', targetDate: '2026-12-01', autoSave: true, autoSaveAmount: 200, color: 'from-blue-500 to-violet-500', icon: '✈️' },
  { id: 'sav_002', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 6500, currency: 'USD', targetDate: '2027-03-01', autoSave: true, autoSaveAmount: 300, color: 'from-emerald-500 to-teal-500', icon: '🏦' },
  { id: 'sav_003', name: 'New MacBook', targetAmount: 2500, currentAmount: 1800, currency: 'USD', targetDate: '2026-08-15', autoSave: false, color: 'from-orange-500 to-amber-500', icon: '💻' },
];

export const MOCK_FLIGHTS: FlightResult[] = [
  {
    id: 'flt_001', airline: 'British Airways', airlineCode: 'BA', flightNumber: 'BA007',
    departureAirport: 'JFK', departureCity: 'New York', departureTime: '2026-07-15T22:00:00',
    arrivalAirport: 'LHR', arrivalCity: 'London', arrivalTime: '2026-07-16T10:30:00',
    duration: '7h 30m', stops: 0, price: 342.50, currency: 'USD', class: 'economy',
    seatsLeft: 8, logo: '✈️',
  },
  {
    id: 'flt_002', airline: 'Delta Airlines', airlineCode: 'DL', flightNumber: 'DL401',
    departureAirport: 'JFK', departureCity: 'New York', departureTime: '2026-07-15T18:30:00',
    arrivalAirport: 'LHR', arrivalCity: 'London', arrivalTime: '2026-07-16T07:45:00',
    duration: '8h 15m', stops: 0, price: 298.00, currency: 'USD', class: 'economy',
    seatsLeft: 15, logo: '✈️',
  },
  {
    id: 'flt_003', airline: 'Virgin Atlantic', airlineCode: 'VS', flightNumber: 'VS003',
    departureAirport: 'JFK', departureCity: 'New York', departureTime: '2026-07-15T09:00:00',
    arrivalAirport: 'LHR', arrivalCity: 'London', arrivalTime: '2026-07-15T21:15:00',
    duration: '7h 15m', stops: 0, price: 385.00, currency: 'USD', class: 'economy',
    seatsLeft: 3, logo: '✈️',
  },
  {
    id: 'flt_004', airline: 'American Airlines', airlineCode: 'AA', flightNumber: 'AA101',
    departureAirport: 'JFK', departureCity: 'New York', departureTime: '2026-07-15T23:59:00',
    arrivalAirport: 'LHR', arrivalCity: 'London', arrivalTime: '2026-07-16T12:30:00',
    duration: '9h 31m', stops: 1, price: 265.00, currency: 'USD', class: 'economy',
    seatsLeft: 22, logo: '✈️',
  },
];

export const CURRENCY_FLAGS: Record<string, string> = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', NGN: '🇳🇬', GHS: '🇬🇭',
  KES: '🇰🇪', ZAR: '🇿🇦', JPY: '🇯🇵', CAD: '🇨🇦', AUD: '🇦🇺',
  INR: '🇮🇳', BRL: '🇧🇷', MXN: '🇲🇽', SGD: '🇸🇬', AED: '🇦🇪',
  SAR: '🇸🇦', CNY: '🇨🇳', CHF: '🇨🇭', SEK: '🇸🇪', NOK: '🇳🇴',
  USDT: '💲', BTC: '₿', ETH: 'Ξ',
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', NGN: '₦', GHS: 'GH₵',
  KES: 'KSh', ZAR: 'R', JPY: '¥', CAD: 'CA$', AUD: 'A$',
  INR: '₹', BRL: 'R$', MXN: 'MX$', SGD: 'S$', AED: 'د.إ',
  SAR: '﷼', CNY: '¥', CHF: 'Fr', SEK: 'kr', NOK: 'kr',
  USDT: 'USDT', BTC: 'BTC', ETH: 'ETH',
};
