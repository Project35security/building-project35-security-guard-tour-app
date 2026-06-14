import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowUpDown, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/transfer', icon: ArrowUpDown, label: 'Transfer' },
  { to: '/transactions', icon: History, label: 'History' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 z-40">
      <div className="flex items-center justify-around px-2 py-1">
        {ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-150 min-w-[52px]',
              isActive ? 'text-blue-400' : 'text-slate-500'
            )}
          >
            {({ isActive }) => (
              <>
                <div className={cn('p-1.5 rounded-lg transition-all', isActive && 'bg-blue-500/15')}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div className="pb-safe" />
    </nav>
  );
}
