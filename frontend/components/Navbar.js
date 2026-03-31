'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Wallet, User, LogOut, Menu, X, Gamepad2, Home, Trophy, Shield } from 'lucide-react';
import { USDTIcon } from './USDTBadge';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  // Navigation items with icons
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/ipl-betting', label: 'IPL Betting', icon: Trophy },
    { href: '/wallet', label: 'Wallet', icon: Wallet },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  // Check if route is active
  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Check if user is logged in for protected routes
  const canAccess = (href) => {
    if (href === '/') return true;
    return !!user;
  };

  return (
    <nav className="hidden lg:block lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-50 lg:bg-[#0a0a0a]/95 lg:backdrop-blur-md lg:border-b lg:border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-gradient">My11Six</span>
          </Link>

          {/* Desktop Navigation - hidden on mobile, flex on desktop */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-1 px-2 py-1.5 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const accessible = canAccess(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={accessible ? item.href : '/login'}
                    className={`relative flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all duration-300 ${
                      active
                        ? 'text-black bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/30 scale-105'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-black' : ''}`} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Auth Buttons / User Menu - desktop only */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Admin Badge - Only show for admin users */}
                {user.role === 'admin' && (
                  <Link 
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 rounded-full hover:scale-110 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
                    title="Admin Panel"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400">Admin</span>
                  </Link>
                )}

                {/* Balance Display */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <USDTIcon size="sm" />
                  <span className="text-sm font-medium text-emerald-400">
                    ₮{user.balance?.toFixed(2) || '0.00'}
                  </span>
                </div>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-amber-500 transition-colors">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <span className="text-sm font-bold text-black">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-1">
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#2a2a2a] hover:text-amber-500 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#2a2a2a] hover:text-red-500 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-gray-300 hover:text-amber-500 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#2a2a2a]">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const accessible = canAccess(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={accessible ? item.href : '/login'}
                    className={`flex items-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                      active ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300 hover:text-amber-500'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="text-left text-red-500 hover:text-red-400 transition-colors font-medium py-2"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-[#2a2a2a]">
                  <Link 
                    href="/login" 
                    className="text-center py-2 text-gray-300 hover:text-amber-500 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="text-center py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}