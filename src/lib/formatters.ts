import { CURRENCY_SYMBOLS } from '@/data/mockData';

export function formatCurrency(amount: number, currency: string, compact = false): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  if (compact && amount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (compact && amount >= 1_000) {
    return `${symbol}${(amount / 1_000).toFixed(1)}K`;
  }
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string, short = false): string {
  const date = new Date(dateStr);
  if (short) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr, true);
}

export function maskAccountNumber(account: string): string {
  const clean = account.replace(/[\s-]/g, '');
  return `****${clean.slice(-4)}`;
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  return `${user.slice(0, 2)}****@${domain}`;
}

export function maskPhone(phone: string): string {
  return phone.replace(/(\+?\d{1,4})[\s-]?\d{3}[\s-]?\d{3}[\s-]?/, '$1 *** *** ');
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function generateReference(): string {
  return `BWY${Date.now().toString(36).toUpperCase()}`;
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen - 3)}...`;
}
