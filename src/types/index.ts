export type Currency =
  | 'USD' | 'EUR' | 'GBP' | 'NGN' | 'GHS' | 'KES' | 'ZAR'
  | 'JPY' | 'CAD' | 'AUD' | 'INR' | 'BRL' | 'MXN' | 'SGD'
  | 'AED' | 'SAR' | 'CNY' | 'CHF' | 'SEK' | 'NOK' | 'USDT' | 'BTC' | 'ETH';

export type KYCStatus = 'none' | 'pending' | 'in_review' | 'verified' | 'rejected';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'reversed';
export type TransactionType = 'credit' | 'debit';
export type TransactionCategory =
  | 'transfer_in' | 'transfer_out' | 'airtime' | 'data' | 'insurance'
  | 'subscription' | 'travel' | 'card' | 'deposit' | 'withdrawal' | 'fee' | 'refund';

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  kycStatus: KYCStatus;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  transactionPinSet: boolean;
  country: string;
  dateOfBirth?: string;
  address?: string;
  occupation?: string;
  tier: 1 | 2 | 3;
  referralCode: string;
  createdAt: string;
  lastLoginAt: string;
  loginAttempts: number;
  sessionTimeout: number; // minutes
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingOptIn: boolean;
  preferredCurrency: Currency;
  language: string;
}

export interface WalletAccount {
  id: string;
  userId: string;
  currency: Currency;
  balance: number;
  lockedBalance: number;
  accountNumber: string;
  iban?: string;
  routingNumber?: string;
  swiftCode?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: Currency;
  description: string;
  status: TransactionStatus;
  reference: string;
  counterparty?: string;
  counterpartyAccount?: string;
  fee: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
  note?: string;
  receiptUrl?: string;
}

export interface VirtualCard {
  id: string;
  userId: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  brand: 'Visa' | 'Mastercard';
  currency: Currency;
  balance: number;
  spendingLimit: number;
  status: 'active' | 'frozen' | 'blocked' | 'expired';
  nickname: string;
  createdAt: string;
  color: string;
}

export interface FlightResult {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departureAirport: string;
  departureCity: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalCity: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: Currency;
  class: 'economy' | 'business' | 'first';
  seatsLeft: number;
  logo: string;
}

export interface InsurancePlan {
  id: string;
  type: 'health' | 'life' | 'auto' | 'travel' | 'home';
  name: string;
  provider: string;
  monthlyPremium: number;
  coverageAmount: number;
  currency: Currency;
  description: string;
  features: string[];
  rating: number;
  popular: boolean;
  color: string;
}

export interface Subscription {
  id: string;
  service: string;
  plan: string;
  logo: string;
  color: string;
  amount: number;
  currency: Currency;
  billingCycle: 'monthly' | 'annual' | 'weekly';
  nextBillingDate: string;
  status: 'active' | 'paused' | 'cancelled';
  category: 'streaming' | 'music' | 'cloud' | 'productivity' | 'gaming' | 'news' | 'other';
  autoRenew: boolean;
  startedAt: string;
}

export interface Network {
  id: string;
  name: string;
  country: string;
  code: string;
  logo: string;
  color: string;
  currency: Currency;
  airtimeDenominations: number[];
  dataPlans: DataPlan[];
}

export interface DataPlan {
  id: string;
  name: string;
  data: string;
  validity: string;
  price: number;
  popular?: boolean;
}

export interface ExchangeRate {
  from: Currency;
  to: Currency;
  rate: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'transaction' | 'security' | 'promotion' | 'system' | 'kyc';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  icon?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  ipAddress: string;
  device: string;
  location: string;
  status: 'success' | 'failed';
  createdAt: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  accountNumber?: string;
  bankName?: string;
  currency: Currency;
  country: string;
  avatar?: string;
  lastTransferAt?: string;
  transferCount: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: Currency;
  targetDate: string;
  autoSave: boolean;
  autoSaveAmount?: number;
  color: string;
  icon: string;
}

export type AuthStep = 'login' | '2fa' | 'biometric' | 'pin';

/* ─── Business / Merchant types ─── */

export type BusinessType =
  | 'sole_proprietor' | 'partnership' | 'llc' | 'corporation' | 'ngo' | 'freelancer';

export type BusinessDocType =
  | 'certificate_of_incorporation' | 'tax_id' | 'business_license'
  | 'utility_bill' | 'bank_statement' | 'directors_id' | 'memorandum';

export type VerificationStatus = 'draft' | 'pending' | 'in_review' | 'approved' | 'rejected';

export interface BusinessDocument {
  id: string;
  type: BusinessDocType;
  label: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  fileName?: string;
}

export interface LinkedBankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
  swiftCode?: string;
  iban?: string;
  currency: Currency;
  country: string;
  isPrimary: boolean;
  verified: boolean;
  addedAt: string;
}

export interface LinkedMobileMoney {
  id: string;
  provider: string;
  providerLogo: string;
  providerColor: string;
  phoneNumber: string;
  accountName: string;
  currency: Currency;
  country: string;
  isPrimary: boolean;
  verified: boolean;
  addedAt: string;
}

export interface BusinessAccount {
  id: string;
  userId: string;
  businessName: string;
  businessType: BusinessType;
  registrationNumber: string;
  taxId: string;
  industry: string;
  website?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  description: string;
  logo?: string;
  verificationStatus: VerificationStatus;
  kycStatus: KYCStatus;
  linkedBankAccounts: LinkedBankAccount[];
  linkedMobileMoney: LinkedMobileMoney[];
  documents: BusinessDocument[];
  acceptedPaymentMethods: ('card' | 'bank_transfer' | 'mobile_money' | 'qr' | 'crypto')[];
  paymentLinkSlug: string;
  settlementCurrency: Currency;
  settlementFrequency: 'instant' | 'daily' | 'weekly';
  totalRevenue: number;
  pendingSettlement: number;
  createdAt: string;
}

/* ─── QR Payment types ─── */

export interface QRPaymentData {
  type: 'payment' | 'request' | 'business';
  merchant?: string;
  merchantId?: string;
  amount?: number;
  currency?: Currency;
  reference?: string;
  walletId?: string;
  description?: string;
  category?: string;
}

export interface MobileMoneyProvider {
  id: string;
  name: string;
  logo: string;
  color: string;
  countries: string[];
  currencies: Currency[];
  ussdCode?: string;
  website: string;
}
