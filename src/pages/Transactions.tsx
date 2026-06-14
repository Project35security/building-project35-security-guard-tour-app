import { useState, useMemo } from 'react';
import { History, Search, Filter, Download, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWallet } from '@/contexts/WalletContext';
import { formatCurrency, formatDateTime, formatDate } from '@/lib/formatters';
import type { Transaction } from '@/types';
import { cn } from '@/lib/utils';

const TX_ICONS: Record<string, string> = {
  transfer_in: '↙️', transfer_out: '↗️', airtime: '📱', data: '📡',
  insurance: '🛡️', subscription: '🔄', travel: '✈️', card: '💳',
  deposit: '💰', withdrawal: '🏧', refund: '↩️', fee: '📋',
};

const STATUS_STYLES = {
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  failed: 'bg-red-500/15 text-red-400 border-red-500/30',
  reversed: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const CATEGORY_LABELS: Record<string, string> = {
  transfer_in: 'Transfer In', transfer_out: 'Transfer Out', airtime: 'Airtime',
  data: 'Data', insurance: 'Insurance', subscription: 'Subscription',
  travel: 'Travel', card: 'Card Payment', deposit: 'Deposit',
  withdrawal: 'Withdrawal', refund: 'Refund', fee: 'Fee',
};

export default function Transactions() {
  const { transactions } = useWallet();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const now = new Date();
      const txDate = new Date(t.createdAt);
      const diffDays = (now.getTime() - txDate.getTime()) / 86400000;

      if (search && !t.description.toLowerCase().includes(search.toLowerCase()) &&
        !t.reference.toLowerCase().includes(search.toLowerCase()) &&
        !(t.counterparty?.toLowerCase().includes(search.toLowerCase()))) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (dateFilter === '7d' && diffDays > 7) return false;
      if (dateFilter === '30d' && diffDays > 30) return false;
      if (dateFilter === '90d' && diffDays > 90) return false;
      return true;
    });
  }, [transactions, search, statusFilter, typeFilter, categoryFilter, dateFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeFilters = [
    statusFilter !== 'all' && statusFilter,
    typeFilter !== 'all' && typeFilter,
    categoryFilter !== 'all' && CATEGORY_LABELS[categoryFilter],
    dateFilter !== 'all' && dateFilter,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-7 h-7 text-slate-400" /> Transactions
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{filtered.length} transactions found</p>
        </div>
        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by description, reference, or counterparty..."
            className="pl-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 h-10"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white hover:bg-slate-700">All Statuses</SelectItem>
              {['completed', 'pending', 'failed', 'reversed'].map(s => (
                <SelectItem key={s} value={s} className="text-white hover:bg-slate-700 capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-9 text-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white hover:bg-slate-700">All Types</SelectItem>
              <SelectItem value="credit" className="text-white hover:bg-slate-700">Credit (In)</SelectItem>
              <SelectItem value="debit" className="text-white hover:bg-slate-700">Debit (Out)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-9 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white hover:bg-slate-700">All Categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-white hover:bg-slate-700">{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={v => { setDateFilter(v); setPage(1); }}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-9 text-sm">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-white hover:bg-slate-700">All Time</SelectItem>
              <SelectItem value="7d" className="text-white hover:bg-slate-700">Last 7 days</SelectItem>
              <SelectItem value="30d" className="text-white hover:bg-slate-700">Last 30 days</SelectItem>
              <SelectItem value="90d" className="text-white hover:bg-slate-700">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 text-xs">Active filters:</span>
            {activeFilters.map(f => (
              <Badge key={f as string} className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                {f as string}
              </Badge>
            ))}
            <button
              onClick={() => { setStatusFilter('all'); setTypeFilter('all'); setCategoryFilter('all'); setDateFilter('all'); setSearch(''); setPage(1); }}
              className="text-slate-500 text-xs hover:text-red-400 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl divide-y divide-slate-700/50">
        {paginated.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No transactions found</p>
          </div>
        ) : paginated.map(txn => (
          <div
            key={txn.id}
            className="flex items-center gap-3 p-4 hover:bg-slate-800/40 transition-colors cursor-pointer"
            onClick={() => setSelectedTxn(txn)}
          >
            <div className="w-10 h-10 rounded-full bg-slate-700/60 flex items-center justify-center text-lg flex-shrink-0">
              {TX_ICONS[txn.category] ?? '💳'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{txn.description}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-slate-500 text-xs">{formatDate(txn.createdAt, true)}</span>
                <span className="text-slate-600 text-xs">•</span>
                <span className="text-slate-500 text-xs">{CATEGORY_LABELS[txn.category]}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={cn('text-sm font-semibold', txn.type === 'credit' ? 'text-emerald-400' : 'text-slate-200')}>
                {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount, txn.currency)}
              </div>
              <Badge className={cn('text-[10px] px-1.5 py-0 h-4 mt-0.5', STATUS_STYLES[txn.status])}>
                {txn.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTxn} onOpenChange={() => setSelectedTxn(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTxn && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl">
                  {TX_ICONS[selectedTxn.category] ?? '💳'}
                </div>
                <div>
                  <div className={cn('text-2xl font-bold', selectedTxn.type === 'credit' ? 'text-emerald-400' : 'text-white')}>
                    {selectedTxn.type === 'credit' ? '+' : '-'}{formatCurrency(selectedTxn.amount, selectedTxn.currency)}
                  </div>
                  <Badge className={cn('mt-1', STATUS_STYLES[selectedTxn.status])}>
                    {selectedTxn.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 bg-slate-800 rounded-xl p-4 text-sm">
                {[
                  ['Description', selectedTxn.description],
                  ['Reference', selectedTxn.reference],
                  ['Category', CATEGORY_LABELS[selectedTxn.category]],
                  ...(selectedTxn.counterparty ? [['Counterparty', selectedTxn.counterparty]] : []),
                  ['Date', formatDateTime(selectedTxn.createdAt)],
                  ...(selectedTxn.completedAt ? [['Completed', formatDateTime(selectedTxn.completedAt)]] : []),
                  ...(selectedTxn.fee > 0 ? [['Fee', formatCurrency(selectedTxn.fee, selectedTxn.currency)]] : []),
                  ['Balance Before', formatCurrency(selectedTxn.balanceBefore, selectedTxn.currency)],
                  ['Balance After', formatCurrency(selectedTxn.balanceAfter, selectedTxn.currency)],
                  ...(selectedTxn.note ? [['Note', selectedTxn.note]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <span className="text-slate-400 flex-shrink-0">{k}</span>
                    <span className="text-white font-medium text-right break-all">{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">Download Receipt</Button>
                <Button variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">Report Issue</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
