'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function WalletModal({ isOpen, onClose, onSuccess, user }) {
  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentBalance, setCurrentBalance] = useState(user?.balance || 0);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setMessage('');
      setActiveTab('deposit');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const endpoint = activeTab === 'deposit' ? '/api/wallet/deposit' : '/api/wallet/withdraw';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(activeTab === 'deposit' ? 'Deposit successful!' : 'Withdrawal request submitted!');
        // Update balance after successful transaction
        if (activeTab === 'deposit') {
          setCurrentBalance(prev => prev + parseFloat(amount));
        } else {
          setCurrentBalance(prev => prev - parseFloat(amount));
        }
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage(data.message || 'Transaction failed');
      }
    } catch (error) {
      setMessage('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black border border-yellow-500/30 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">Wallet</h2>
          <button onClick={onClose} className="text-black/70 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'deposit'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'withdraw'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <p className="text-gray-400 text-sm mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
              <span className="text-lg">₮</span>
              <span id="modal-balance">{currentBalance.toFixed(2)}</span>
              <span className="text-gray-500 text-sm">USDT</span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">
                Amount (USDT)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none"
                placeholder="Enter amount"
              />
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes('successful') || message.includes('submitted')
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : activeTab === 'deposit' ? 'Deposit Now' : 'Request Withdrawal'}
            </button>
          </form>

          <div className="mt-4 text-center text-gray-500 text-xs">
            <p>Deposits are instant. Withdrawals take 24-48 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}