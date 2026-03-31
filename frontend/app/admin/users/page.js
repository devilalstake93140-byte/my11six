'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { Ban, Block, Plus, Minus, UserPlus, RefreshCw, RotateCcw } from 'lucide-react';
import { USDTIcon } from '@/components/USDTBadge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustForm, setAdjustForm] = useState({ amount: '', type: 'add', reason: '' });

  useEffect(() => {
    loadUsers();
  }, [search, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      
      const response = await adminAPI.getUsers(params);
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      loadUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.adjustUserBalance(selectedUser._id, adjustForm);
      setShowAdjustModal(false);
      setAdjustForm({ amount: '', type: 'add', reason: '' });
      loadUsers();
      alert('Balance updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to adjust balance');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <button
          onClick={loadUsers}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-slate-400 hover:text-white rounded-lg"
        >
          <RotateCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#111] border border-[#222] rounded-lg text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-[#111] border border-[#222] rounded-lg text-white focus:border-amber-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1a1a]">
              <tr className="text-left text-slate-400 text-sm">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Balance (USDT)</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-t border-[#222] hover:bg-[#1a1a1a]">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-slate-400 bg-[#222] px-2 py-1 rounded text-sm">
                        {user.userId}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <USDTIcon size="sm" />
                        <span className="text-emerald-400 font-bold font-mono">{user.balance?.toFixed(2) || '0.00'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        user.isActive 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAdjustModal(true);
                          }}
                          className="p-2 bg-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500/30"
                          title="Adjust Balance"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isActive 
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                              : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          }`}
                          title={user.isActive ? 'Block User' : 'Unblock User'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Balance Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] rounded-xl border border-[#222] p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Adjust Balance</h2>
            <p className="text-slate-400 mb-4">
              User: <span className="text-white">{selectedUser?.name}</span>
            </p>
            <form onSubmit={handleAdjustBalance}>
              <div className="mb-4">
                <label className="block text-slate-400 text-sm mb-2">Action</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustForm({ ...adjustForm, type: 'add' })}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      adjustForm.type === 'add' 
                        ? 'bg-emerald-500 text-black' 
                        : 'bg-[#222] text-slate-400'
                    }`}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustForm({ ...adjustForm, type: 'deduct' })}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      adjustForm.type === 'deduct' 
                        ? 'bg-red-500 text-black' 
                        : 'bg-[#222] text-slate-400'
                    }`}
                  >
                    Deduct
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-slate-400 text-sm mb-2">Amount (USDT)</label>
                <input
                  type="number"
                  value={adjustForm.amount}
                  onChange={(e) => setAdjustForm({ ...adjustForm, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-slate-400 text-sm mb-2">Reason</label>
                <input
                  type="text"
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  placeholder="Reason for adjustment"
                  className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-3 bg-[#222] text-white rounded-lg hover:bg-[#333]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}