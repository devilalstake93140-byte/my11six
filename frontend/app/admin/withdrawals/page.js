'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { RotateCcw, Check, XCircle, Copy, CheckCheck } from 'lucide-react';
import { USDTIcon } from '@/components/USDTBadge';
import { formatDateTimeInUserZone } from '@/lib/time';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadWithdrawals();
  }, [statusFilter]);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (statusFilter) params.status = statusFilter;
      
      const response = await adminAPI.getWithdrawals(params);
      setWithdrawals(response.data.data.withdrawals || []);
    } catch (error) {
      console.error('Failed to load withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleManageWithdrawal = async (id, status) => {
    if (!confirm(`Are you sure you want to ${status} this withdrawal?`)) return;
    try {
      await adminAPI.manageWithdrawal(id, status);
      loadWithdrawals();
    } catch (error) {
      alert(`Failed to ${status} withdrawal`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Withdrawal Management</h1>
        <button
          onClick={loadWithdrawals}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-slate-400 hover:text-white rounded-lg"
        >
          <RotateCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-[#111] border border-[#222] rounded-lg text-white focus:border-amber-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1a1a]">
              <tr className="text-left text-slate-400 text-sm">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Network</th>
                <th className="px-6 py-4">Wallet Address</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No withdrawals found
                  </td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="border-t border-[#222] hover:bg-[#1a1a1a]">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{withdrawal.userId?.name || 'Unknown'}</p>
                        <p className="text-slate-400 text-sm">{withdrawal.userId?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <USDTIcon size="sm" />
                        <span className="text-red-400 font-bold font-mono">{withdrawal.amount?.toFixed(2) || '0.00'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 uppercase text-sm">
                        {withdrawal.paymentMethod || 'CRYPTO'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-slate-300 text-xs bg-[#222] px-2 py-1 rounded max-w-[200px] truncate font-mono" title={withdrawal.reference || 'N/A'}>
                          {withdrawal.reference || 'N/A'}
                        </code>
                        {withdrawal.reference && (
                          <button
                            onClick={() => copyToClipboard(withdrawal.reference, withdrawal._id)}
                            className="p-1 hover:bg-[#333] rounded transition-colors"
                            title="Copy wallet address"
                          >
                            {copiedId === withdrawal._id ? (
                              <CheckCheck className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {formatDateTimeInUserZone(withdrawal.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        withdrawal.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        withdrawal.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {withdrawal.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleManageWithdrawal(withdrawal._id, 'approved')}
                            className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleManageWithdrawal(withdrawal._id, 'rejected')}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}