'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { walletAPI, transactionAPI, userAPI } from '@/lib/api';
import { User, Mail, Calendar, Wallet, ArrowDownLeft, ArrowUpRight, Copy, Check } from 'lucide-react';
import { formatDateInUserZone, formatDateTimeInUserZone } from '@/lib/time';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [balance, setBalance] = useState({ balance: 0, formattedBalance: '₮0.00' });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadProfileData();
    }
  }, [user, authLoading]);

  const loadProfileData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        walletAPI.getBalance(),
        transactionAPI.getAll({ limit: 10 })
      ]);

      setBalance(balanceRes.data.data);
      setTransactions(transactionsRes.data.data.transactions || []);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-[#0f172a]">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Generate user initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Format date
  const formatDate = (dateString) => {
    return formatDateInUserZone(dateString);
  };

  return (
    <div className="min-h-screen pt-16 bg-[#0f172a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-slate-400 mt-2">Manage your account</p>
        </div>

        <div className="space-y-6">
          {/* Top Profile Card - User Info */}
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-3xl font-bold text-black">
                  {getInitials(user?.name)}
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-800" />
              </div>

              {/* User Details */}
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h2 className="text-2xl font-bold text-white">{user?.name || 'User'}</h2>
                  {user?.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      KYC Verified
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">{user?.email || 'email@example.com'}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                    Active Account
                  </span>
                </div>
              </div>

              {/* User ID */}
              <div className="bg-slate-800/50 rounded-lg px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">User ID</p>
                <div className="flex items-center gap-2">
                  <code className="text-slate-300 font-mono text-sm">
                    {user?._id || 'Generating...'}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(user?._id || '')}
                    className="p-1 text-slate-500 hover:text-amber-500 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Card - Glassmorphism */}
          <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-700/50 p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-amber-500/5" />
            <div className="relative text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">₮</span>
                <span className="text-sm text-emerald-400 font-semibold">USDT</span>
              </div>
              <p className="text-sm text-slate-500 mb-2">Available Balance</p>
              <p className="text-5xl font-bold text-white font-mono">
                {balance.balance?.toFixed(2) || '0.00'}
              </p>
              <button 
                onClick={() => router.push('/wallet')}
                className="mt-4 px-6 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium"
              >
                Manage Wallet
              </button>
            </div>
          </div>

          {/* User Details Section */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="text-white font-medium">{user?.name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-white font-medium">{user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="text-white font-medium">{formatDate(user?.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="text-emerald-400 font-medium">Active</p>
                </div>
              </div>

              {/* KYC Status */}
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user?.isVerified ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                  {user?.isVerified ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500">KYC</p>
                  <p className={user?.isVerified ? 'text-green-400 font-medium' : 'text-yellow-400 font-medium'}>
                    {user?.isVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div 
                    key={tx._id}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-emerald-500/20' :
                        tx.type === 'withdraw' ? 'bg-red-500/20' :
                        'bg-slate-700'
                      }`}>
                        {tx.type === 'deposit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                        ) : tx.type === 'withdraw' ? (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        ) : (
                          <Wallet className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">{tx.type}</p>
                        <p className="text-xs text-slate-500">{formatDateTimeInUserZone(tx.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.type === 'deposit' || tx.type === 'reward' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'reward' ? '+' : '-'}
                        {tx.currency === 'INR' ? '₹' : '₮'}{tx.amount}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-700 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}