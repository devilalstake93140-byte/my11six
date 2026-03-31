'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { 
  LayoutDashboard, Users, CreditCard, Wallet, Gamepad2, 
  Trophy, Settings, LogOut, Menu, X, ChevronRight,
  Search, RefreshCw, Check, XCircle, Plus, Trash2, Copy
} from 'lucide-react';
import { adminAPI, bettingAPI } from '@/lib/api';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { id: 'deposits', label: 'Deposits', icon: CreditCard, href: '/admin/deposits' },
    { id: 'withdrawals', label: 'Withdrawals', icon: Wallet, href: '/admin/withdrawals' },
    { id: 'matches', label: 'Matches', icon: Gamepad2, href: '/admin/matches' },
    { id: 'bets', label: 'Bets', icon: Trophy, href: '/admin/bets' },
    { id: 'wallet', label: 'Wallet Settings', icon: Settings, href: '/admin/wallet' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#111] border-b border-[#222] px-4 py-3 flex items-center justify-between">
        <span className="text-amber-500 font-bold">Admin Panel</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 bottom-0 w-64 bg-[#111] border-r border-[#222] z-40 transform transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Settings className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Admin</span>
          </div>
        </div>

        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  activeItem === item.id 
                    ? 'bg-amber-500/20 text-amber-500' 
                    : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#222]">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        {children}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}