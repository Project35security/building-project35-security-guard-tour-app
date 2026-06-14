import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { formatRelativeTime, getInitials } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { user } = useAuth();
  const { notifications, unreadCount, markNotificationsRead } = useWallet();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  const handleNotifOpen = (open: boolean) => {
    setNotifOpen(open);
    if (open) markNotificationsRead();
  };

  const NOTIF_ICONS: Record<string, string> = {
    transaction: '💸', security: '🔐', promotion: '🎁', system: '⚙️', kyc: '✅',
  };

  return (
    <header className="h-14 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 flex items-center px-4 gap-4 sticky top-0 z-40">
      <Button
        variant="ghost" size="icon"
        className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
        onClick={onMenuToggle}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Search */}
      <div className="flex-1 max-w-xs hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-sm cursor-pointer hover:border-slate-600 transition-colors">
        <Search className="w-4 h-4" />
        <span>Search transactions, services...</span>
        <kbd className="ml-auto text-xs bg-slate-700 px-1.5 py-0.5 rounded">⌘K</kbd>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <DropdownMenu open={notifOpen} onOpenChange={handleNotifOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-slate-800">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-slate-700 p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <span className="text-white font-semibold text-sm">Notifications</span>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
              {notifications.length} total
            </Badge>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 8).map(n => (
              <DropdownMenuItem key={n.id} className="px-4 py-3 hover:bg-slate-800 cursor-pointer flex items-start gap-3 focus:bg-slate-800">
                <span className="text-lg mt-0.5 flex-shrink-0">{NOTIF_ICONS[n.type] ?? '📌'}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn('text-sm font-medium', n.read ? 'text-slate-300' : 'text-white')}>{n.title}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  <span className="text-[10px] text-slate-500 mt-1">{formatRelativeTime(n.createdAt)}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator className="bg-slate-700" />
          <DropdownMenuItem className="px-4 py-2.5 text-center text-blue-400 text-sm hover:bg-slate-800 focus:bg-slate-800 cursor-pointer justify-center font-medium">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 h-auto hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(`${user?.firstName} ${user?.lastName}`)}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium">{user?.firstName}</span>
              <span className="text-[10px] text-slate-500">Tier {user?.tier}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-700">
          <DropdownMenuItem onClick={() => navigate('/profile')} className="text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')} className="text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 cursor-pointer">
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-700" />
          <DropdownMenuItem
            onClick={() => { useAuth(); navigate('/login'); }}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer"
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
