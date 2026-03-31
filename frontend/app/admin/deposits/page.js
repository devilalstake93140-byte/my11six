'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { RotateCcw, Check, XCircle, Copy, CheckCheck } from 'lucide-react';
import { USDTIcon } from '@/components/USDTBadge';
import { formatDateTimeInUserZone } from '@/lib/time';

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadDeposits();
  }, [statusFilter]);

  const loadDeposits = async () => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (statusFilter) params.status = statusFilter;
      
      const response = await adminAPI.getDeposits(params);
      console.log('Deposits response:', response.data);
      setDeposits(response.data.data.deposits || []);
    } catch (error) {
      console.error('Failed to load deposits:', error);
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

  const handleManageDeposit = async (id, status) => {
    if (!confirm(`Are you sure you want to ${status} this deposit?`)) return;
    try {
      await adminAPI.manageDeposit(id, status);
      loadDeposits();
    } catch (error) {
      alert(`Failed to ${status} deposit`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Deposit Management</h1>
        <button
          onClick={loadDeposits}
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
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Deposits Table */}
      <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1a1a]">
              <tr className="text-left text-slate-400 text-sm">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Network</th>
                <th className="px-6 py-4">TXID</th>
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
              ) : deposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No deposits found
                  </td>
                </tr>
              ) : (
                deposits.map((deposit) => (
                  <tr key={deposit._id} className="border-t border-[#222] hover:bg-[#1a1a1a]">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{deposit.userId?.name || 'Unknown'}</p>
                        <p className="text-slate-400 text-sm">{deposit.userId?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <USDTIcon size="sm" />
                        <span className="text-emerald-400 font-bold font-mono">{deposit.amount?.toFixed(2) || '0.00'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        deposit.network === 'TRC20' ? 'bg-red-500/20 text-red-400' :
                        deposit.network === 'BEP20' ? 'bg-yellow-500/20 text-yellow-400' :
                        deposit.network === 'BTC' ? 'bg-orange-500/20 text-orange-400' :
                        deposit.network === 'SOL' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {deposit.network || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-slate-300 text-xs bg-[#222] px-2 py-1 rounded max-w-[150px] truncate" title={deposit.txid || 'N/A'}>
                          {deposit.txid || 'N/A'}
                        </code>
                        {deposit.txid && (
                          <button
                            onClick={() => copyToClipboard(deposit.txid, deposit._id)}
                            className="p-1 hover:bg-[#333] rounded transition-colors"
                            title="Copy TXID"
                          >
                            {copiedId === deposit._id ? (
                              <CheckCheck className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {formatDateTimeInUserZone(deposit.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        deposit.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                        deposit.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {deposit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {deposit.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleManageDeposit(deposit._id, 'approved')}
                            className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleManageDeposit(deposit._id, 'rejected')}
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