'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { RotateCcw, Copy, Check, Wallet, AlertCircle } from 'lucide-react';

export default function AdminWalletSettingsPage() {
  const [settings, setSettings] = useState({
    trc20Address: '',
    bep20Address: '',
    btcAddress: '',
    solAddress: '',
    polygonAddress: '',
    minDeposit: 10
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDepositSettings();
      setSettings(response.data.data.settings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminAPI.updateDepositAddresses(settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async (text, network) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(network);
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Wallet Settings</h1>
        <button
          onClick={loadSettings}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-slate-400 hover:text-white rounded-lg"
        >
          <RotateCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          <AlertCircle className="w-5 h-5" />
          {message.text}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Wallet className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <p className="text-amber-400 font-medium">USDT Deposit Addresses</p>
            <p className="text-slate-400 text-sm mt-1">
              Users will see these addresses when making deposits. Update addresses periodically for security.
            </p>
          </div>
        </div>
      </div>

      {/* Address Forms */}
      <div className="grid gap-6 mb-6">
        {[
          {
            key: 'trc20Address',
            network: 'TRC20',
            title: 'TRC20 (Tron)',
            description: 'Tron network USDT deposits',
            badgeClass: 'bg-blue-500/20 text-blue-400',
            copyKey: 'trc20'
          },
          {
            key: 'bep20Address',
            network: 'BEP20',
            title: 'BEP20 (BSC)',
            description: 'Binance Smart Chain USDT deposits',
            badgeClass: 'bg-yellow-500/20 text-yellow-400',
            copyKey: 'bep20'
          },
          {
            key: 'btcAddress',
            network: 'BTC',
            title: 'BTC (Bitcoin)',
            description: 'Bitcoin network deposits',
            badgeClass: 'bg-orange-500/20 text-orange-400',
            copyKey: 'btc'
          },
          {
            key: 'solAddress',
            network: 'SOL',
            title: 'SOL (Solana)',
            description: 'Solana network deposits',
            badgeClass: 'bg-cyan-500/20 text-cyan-400',
            copyKey: 'sol'
          },
          {
            key: 'polygonAddress',
            network: 'POLYGON',
            title: 'POLYGON',
            description: 'Polygon network deposits',
            badgeClass: 'bg-violet-500/20 text-violet-400',
            copyKey: 'polygon'
          }
        ].map((item) => (
          <div key={item.key} className="bg-[#111] rounded-xl border border-[#222] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${item.badgeClass}`}>{item.network}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings[item.key] || ''}
                onChange={(e) => setSettings({ ...settings, [item.key]: e.target.value })}
                placeholder={`Enter ${item.network} wallet address`}
                className="flex-1 px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              {settings[item.key] && (
                <button
                  onClick={() => copyToClipboard(settings[item.key], item.copyKey)}
                  className="px-4 py-3 bg-[#333] text-slate-400 hover:text-white rounded-lg"
                >
                  {copied === item.copyKey ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Min Deposit */}
      <div className="bg-[#111] rounded-xl border border-[#222] p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Minimum Deposit Amount</h3>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={settings.minDeposit}
            onChange={(e) => setSettings({ ...settings, minDeposit: parseFloat(e.target.value) || 0 })}
            className="w-32 px-4 py-3 bg-[#222] border border-[#333] rounded-lg text-white focus:border-amber-500 focus:outline-none"
          />
          <span className="text-slate-400">USDT</span>
        </div>
        <p className="text-slate-500 text-sm mt-2">Minimum amount required for deposit confirmation</p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}