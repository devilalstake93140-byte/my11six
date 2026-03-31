'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { RotateCcw } from 'lucide-react';

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    code: '',
    description: '',
    bonusPercentage: 10,
    maxBonus: 100,
    usageLimit: 100,
    minDeposit: 0
  });

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPromoCodes();
      setPromoCodes(response.data.data.promoCodes || []);
    } catch (error) {
      console.error('Failed to load promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createPromoCode(createForm);
      setShowCreateModal(false);
      setCreateForm({
        code: '',
        description: '',
        bonusPercentage: 10,
        maxBonus: 100,
        usageLimit: 100,
        minDeposit: 0
      });
      loadPromoCodes();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create promo code');
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await adminAPI.updatePromoCode(id, { isActive: !currentStatus });
      loadPromoCodes();
    } catch (error) {
      alert('Failed to update promo code');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      await adminAPI.deletePromoCode(id);
      loadPromoCodes();
    } catch (error) {
      alert('Failed to delete promo code');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Promo Codes</h1>
        <div className="flex gap-2">
          <button
            onClick={loadPromoCodes}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-slate-400 hover:text-white rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400"
          >
            <Plus className="w-4 h-4" />
            Create Code
          </button>
        </div>
      </div>

      {/* Promo Codes Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : promoCodes.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No promo codes found</div>
        ) : (
          promoCodes.map((promo) => (
            <div key={promo._id} className="bg-[#111] rounded-xl border border-[#222] p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <code className="text-xl font-bold text-amber-500">{promo.code}</code>
                  <span className={`px-2 py-1 rounded text-xs ${promo.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-2">{promo.description || 'No description'}</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-slate-500">Bonus: <span className="text-amber-500">{promo.bonusPercentage}%</span></span>
                  <span className="text-slate-500">Max: <span className="text-emerald-400">₮{promo.maxBonus}</span></span>
                  <span className="text-slate-500">Used: <span className="text-white">{promo.usedCount}/{promo.usageLimit}</span></span>
                  <span className="text-slate-500">Min Deposit: <span className="text-white">₮{promo.minDeposit}</span></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(promo._id, promo.isActive)}
                  className={`p-2 rounded-lg ${promo.isActive ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-slate-400 hover:bg-slate-500/20'}`}
                >
                  {promo.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => handleDelete(promo._id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] rounded-xl border border-[#222] p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Create Promo Code</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-slate-400 text-sm mb-2">Code</label>
                <input
                  type="text"
                  value={createForm.code}
                  onChange={(e) => setCreateForm({ ...createForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., WELCOME20"
                  className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white uppercase"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-slate-400 text-sm mb-2">Description</label>
                <input
                  type="text"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Optional description"
                  className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Bonus %</label>
                  <input
                    type="number"
                    value={createForm.bonusPercentage}
                    onChange={(e) => setCreateForm({ ...createForm, bonusPercentage: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Max Bonus (USDT)</label>
                  <input
                    type="number"
                    value={createForm.maxBonus}
                    onChange={(e) => setCreateForm({ ...createForm, maxBonus: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={createForm.usageLimit}
                    onChange={(e) => setCreateForm({ ...createForm, usageLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Min Deposit (USDT)</label>
                  <input
                    type="number"
                    value={createForm.minDeposit}
                    onChange={(e) => setCreateForm({ ...createForm, minDeposit: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-[#222] text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 text-black font-semibold rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}