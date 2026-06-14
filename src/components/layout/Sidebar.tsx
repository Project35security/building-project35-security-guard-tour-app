import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Wallet, ArrowUpDown, Plane,
  Smartphone, Shield, RefreshCw, CreditCard,
  History, User, Settings, LogOut, Bell,
  ChevronRight, Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/formatters';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/wallet', icon: Wallet, label: 'My Wallets' },
  { to: '/transfer', icon: ArrowUpDown, label: 'Transfer' },
  { to: '/travel', icon: Plane, label: 'Travel' },
  { to: '/airtime', icon: Smartphone, label: 'Airtime & Data' },
  { to: '/insurance', icon: Shield, label: 'Insurance' },
  { to: '/subscriptions', icon: RefreshCw, label: 'Subscriptions' },
  { to: '/cards', icon: CreditCard, label: 'Cards' },
  { to: '/transactions', icon: History, label: 'Transactions' },
];

const BOTTOM_NAV = [
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { unreadCount } = useWallet();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-64">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-white text-lg tracking-tight">Bridgeway</span>
          <div className="text-xs text-blue-400 font-medium -mt-0.5">Global Wallet</div>
        </div>
      </div>

      {/* User Quick Info */}
      <div className="px-4 py-3 mx-3 mt-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {getInitials(`${user?.firstName} ${user?.lastName}`)}
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-slate-400">Tier {user?.tier} • Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
              isActive
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300')} />
                <span className="flex-1">{label}</span>
                {to === '/dashboard' && unreadCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Bell className="w-3 h-3 text-amber-400" />
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0 min-w-0 h-4">
                      {unreadCount}
                    </Badge>
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 pb-4 mt-2 space-y-0.5 border-t border-slate-800 pt-3">
        {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-slate-700/60 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
