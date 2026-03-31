'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { RotateCcw } from 'lucide-react';
import { formatDateTimeInUserZone } from '@/lib/time';

export default function AdminBetsPage() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadBets();
  }, [statusFilter]);

  const loadBets = async () => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (statusFilter) params.status = statusFilter;
      
      const response = await adminAPI.getBets(params);
      setBets(response.data.data.bets || []);
    } catch (error) {
      console.error('Failed to load bets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Bet Management</h1>
        <button
          onClick={loadBets}
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
          <option value="win">Win</option>
          <option value="loss">Loss</option>
        </select>
      </div>

      {/* Bets Table */}
      <div className="bg-[#111] rounded-xl border border-[#222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1a1a]">
              <tr className="text-left text-slate-400 text-sm">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Match</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">Amount (USDT)</th>
                <th className="px-6 py-4">Potential Win</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : bets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No bets found
                  </td>
                </tr>
              ) : (
                bets.map((bet) => (
                  <tr key={bet._id} className="border-t border-[#222] hover:bg-[#1a1a1a]">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{bet.userId?.name || 'Unknown'}</p>
                        <p className="text-slate-400 text-sm">{bet.userId?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">
                        {bet.matchId?.teamA?.name} vs {bet.matchId?.teamB?.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-500">
                        {bet.selectedTeam === 'teamA' ? bet.matchId?.teamA?.name : bet.matchId?.teamB?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">₮{bet.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400">₮{bet.potentialWin}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {formatDateTimeInUserZone(bet.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        bet.status === 'win' ? 'bg-emerald-500/20 text-emerald-400' :
                        bet.status === 'loss' ? 'bg-red-500/20 text-red-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {bet.status}
                      </span>
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