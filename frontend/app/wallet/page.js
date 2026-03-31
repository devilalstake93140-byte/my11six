'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { walletAPI, transactionAPI, depositAPI } from '@/lib/api';
import { Wallet, ArrowDownLeft, ArrowUpRight, Copy, Check, AlertTriangle, History } from 'lucide-react';
import { formatDateTimeInUserZone } from '@/lib/time';

// Network configurations with icons and tags
const NETWORKS = [
  { 
    id: 'TRC20', 
    name: 'TRC20', 
    symbol: 'Tron',
    color: 'bg-red-500',
    tag: 'Fast & Low Fee',
    icon: '🔶'
  },
  { 
    id: 'BEP20', 
    name: 'BEP20', 
    symbol: 'BNB Chain',
    color: 'bg-yellow-500',
    tag: 'Popular',
    icon: '🔷'
  },
  {
    id: 'BTC',
    name: 'BTC',
    symbol: 'Bitcoin',
    color: 'bg-orange-500',
    tag: 'Mainnet',
    icon: '₿'
  },
  {
    id: 'SOL',
    name: 'SOL',
    symbol: 'Solana',
    color: 'bg-cyan-500',
    tag: 'High Speed',
    icon: '◎'
  },
  {
    id: 'POLYGON',
    name: 'POLYGON',
    symbol: 'Polygon',
    color: 'bg-violet-500',
    tag: 'Low Fee',
    icon: '⬢'
  }
];

const PRESET_AMOUNTS = [25, 50, 100, 250];
const DEFAULT_MIN_DEPOSIT = 25;

export default function WalletPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [balance, setBalance] = useState({ balance: 0, formattedBalance: '₮0.00' });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deposit');
  const [walletAddresses, setWalletAddresses] = useState({});
  const [minDeposit, setMinDeposit] = useState(DEFAULT_MIN_DEPOSIT);

  // Deposit state - Step-by-step
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [depositStep, setDepositStep] = useState(1); // 1: Amount, 2: Network, 3: Address, 4: TXID
  const [txid, setTxid] = useState('');
  const [copied, setCopied] = useState(false);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  // Common state
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadWalletData();
    }
  }, [user, authLoading]);

  const loadWalletData = async () => {
    try {
      const [balanceRes, transactionsRes, addressesRes, minDepositRes] = await Promise.all([
        walletAPI.getBalance(),
        transactionAPI.getAll({ limit: 20 }),
        depositAPI.getAddresses(),
        depositAPI.getMinDeposit()
      ]);

      setBalance(balanceRes.data.data);
      setTransactions(transactionsRes.data.data.transactions || []);

      const addresses = addressesRes?.data?.data?.addresses;
      if (addresses && typeof addresses === 'object') {
        setWalletAddresses(addresses);
      } else {
        setWalletAddresses({});
      }

      const apiMinDeposit = Number(minDepositRes?.data?.data?.minDeposit);
      if (Number.isFinite(apiMinDeposit) && apiMinDeposit > 0) {
        setMinDeposit(apiMinDeposit);
      }
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      // Don't throw - just set loading to false
      setBalance({ balance: 0, formattedBalance: '₮0.00' });
      setTransactions([]);
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

  // Step 1: Select amount
  const handleDepositPreset = (amount) => {
    setDepositAmount(amount.toString());
    setDepositStep(2);
    setSelectedNetwork(null);
    setTxid('');
    setMessage({ type: '', text: '' });
  };

  const handleAmountChange = (value) => {
    setDepositAmount(value);
    setDepositStep(1);
    setSelectedNetwork(null);
    setTxid('');
  };

  // Step 2: Select network
  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
    setDepositStep(3);
    setTxid('');
  };

  // Step 4: Submit deposit request
  const handleDepositSubmit = async (e) => {
    e.preventDefault();

    if (!selectedNetwork) {
      setMessage({ type: 'error', text: 'Please select a network' });
      return;
    }

    const amount = parseFloat(depositAmount);
    if (amount < minDeposit) {
      setMessage({ type: 'error', text: `Minimum deposit is ₮${minDeposit}` });
      return;
    }

    const selectedAddress = walletAddresses[selectedNetwork.id];
    if (!selectedAddress) {
      setMessage({ type: 'error', text: `Deposit address for ${selectedNetwork.id} is currently unavailable` });
      return;
    }

    if (!txid || txid.trim().length === 0) {
      setMessage({ type: 'error', text: 'Please enter the Transaction ID (TXID) from your transfer' });
      return;
    }

    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Deposit request data:', { amount, network: selectedNetwork.id, txid: txid.trim() });
      // Use depositAPI which handles token automatically via axios interceptor
      const response = await depositAPI.createRequest({
        amount,
        network: selectedNetwork.id,
        txid: txid.trim()
      });
      console.log('Deposit response:', response.data);

      // Success - show message and reset form
      setMessage({ type: 'success', text: 'Your deposit request has been submitted. It will be approved shortly and balance will be added to your wallet.' });
      setDepositAmount('');
      setSelectedNetwork(null);
      setDepositStep(1);
      setTxid('');
      loadWalletData();
    } catch (error) {
      console.error('Deposit error:', error);
      // Handle specific error cases
      if (error.response?.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please login again.' });
      } else if (error.response?.data?.message) {
        setMessage({ type: 'error', text: error.response.data.message });
      } else {
        setMessage({ type: 'error', text: 'Failed to submit deposit request' });
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const amount = parseFloat(withdrawAmount);
    if (amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    if (amount > balance.balance) {
      setMessage({ type: 'error', text: 'Insufficient balance' });
      return;
    }

    if (!withdrawAddress) {
      setMessage({ type: 'error', text: 'Please enter withdrawal address' });
      return;
    }

    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Withdraw request:', { amount, withdrawAddress });
      const response = await walletAPI.withdraw({
        amount,
        address: withdrawAddress,
        walletAddress: withdrawAddress
      });
      console.log('Withdraw response:', response.data);

      if (response.data.success) {
        // Show English success message
        setMessage({ 
          type: 'success', 
          text: '✓ Withdrawal request submitted successfully! Payment will be processed shortly.' 
        });
        setWithdrawAmount('');
        setWithdrawAddress('');
        
        // Reload wallet data to show updated balance and new pending status
        await loadWalletData();
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Withdrawal failed. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-[#0f172a]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasBalance = balance.balance > 0;

  return (
    <div className="min-h-screen pt-16 bg-[#0f172a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Wallet</h1>
          <p className="text-slate-400 mt-2">Manage your USDT assets</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-medium">Available Balance</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">₮</span>
              <span className="text-emerald-400 font-semibold">USDT</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-white font-mono">
              ₮{balance.balance?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deposit Section */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Deposit USDT</h2>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex-1 flex items-center">
                  <div className={`h-2 flex-1 rounded-full ${
                    depositStep >= step ? 'bg-emerald-500' : 'bg-slate-700'
                  } ${step === 1 ? 'rounded-l-full' : ''} ${step === 4 ? 'rounded-r-full' : ''}`} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mb-4">
              <span className={depositStep >= 1 ? 'text-emerald-400' : ''}>Amount</span>
              <span className={depositStep >= 2 ? 'text-emerald-400' : ''}>Network</span>
              <span className={depositStep >= 3 ? 'text-emerald-400' : ''}>Address</span>
              <span className={depositStep >= 4 ? 'text-emerald-400' : ''}>TXID</span>
            </div>

            {/* Step 1: Amount Selection */}
            {depositStep === 1 && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Quick Select</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleDepositPreset(amount)}
                        className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                          parseFloat(depositAmount) === amount
                            ? 'bg-emerald-500 text-black'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        ₮{amount}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Or enter custom amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-mono"
                      min={minDeposit}
                      step={1}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">
                      ₮
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Minimum: ₮{minDeposit}</p>
                </div>

                {depositAmount && parseFloat(depositAmount) >= minDeposit && (
                  <button
                    onClick={() => setDepositStep(2)}
                    className="w-full py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-all"
                  >
                    Continue
                  </button>
                )}
              </>
            )}

            {/* Step 2: Network Selection */}
            {depositStep === 2 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-3">Select Network</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {NETWORKS.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => handleNetworkSelect(network)}
                      className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02] ${
                        selectedNetwork?.id === network.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{network.icon}</span>
                          <span className="text-white font-bold">{network.name}</span>
                          <span className="text-xs text-slate-500">({network.symbol})</span>
                        </div>
                        <span className={`w-3 h-3 rounded-full ${network.color}`} />
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        network.tag === 'Fast & Low Fee' ? 'bg-green-500/20 text-green-400' :
                        network.tag === 'Popular' ? 'bg-amber-500/20 text-amber-400' :
                        network.tag === 'High Fee' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {network.tag}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setDepositStep(1)}
                  className="mt-4 text-slate-400 hover:text-white text-sm"
                >
                  ← Back to Amount
                </button>
              </div>
            )}

            {/* Step 3: Address Display */}
            {depositStep === 3 && selectedNetwork && (
              <div className="mb-4">
                {/* Selected Amount */}
                <div className="mb-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Amount to deposit</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white font-mono">₮{depositAmount}</span>
                      <button
                        onClick={() => copyToClipboard(depositAmount)}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Network & Address */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedNetwork.icon}</span>
                      <span className="text-white font-bold">{selectedNetwork.name}</span>
                      <span className="text-xs text-slate-500">({selectedNetwork.symbol})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <code className="flex-1 p-3 bg-slate-800 rounded-lg text-emerald-400 font-mono text-xs break-all">
                      {walletAddresses[selectedNetwork.id] || 'Address unavailable'}
                    </code>
                    <button
                      onClick={() => copyToClipboard(walletAddresses[selectedNetwork.id])}
                      disabled={!walletAddresses[selectedNetwork.id]}
                      className="p-3 bg-emerald-500/20 text-emerald-500 rounded-lg hover:bg-emerald-500/30 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Safety Warning */}
                  <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-400 text-xs">
                      Send only {selectedNetwork.name} to this address. Sending other tokens may result in permanent loss.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDepositStep(4)}
                  disabled={!walletAddresses[selectedNetwork.id]}
                  className="w-full py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  I've Sent the Funds
                </button>
                <button
                  onClick={() => setDepositStep(2)}
                  className="w-full mt-2 py-2 text-slate-400 hover:text-white text-sm"
                >
                  ← Change Network
                </button>
              </div>
            )}

            {/* Step 4: TXID Input */}
            {depositStep === 4 && (
              <form onSubmit={handleDepositSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Enter Transaction ID (TXID)
                  </label>
                  <input
                    type="text"
                    value={txid}
                    onChange={(e) => setTxid(e.target.value)}
                    placeholder="Enter your transaction hash/TXID"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Find this in your wallet's transaction history
                  </p>
                </div>

                {/* Message */}
                {message.text && activeTab === 'deposit' && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${
                    message.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processing || !txid}
                  className="w-full py-3 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-all disabled:opacity-50"
                >
                  {processing ? 'Processing...' : `Submit Deposit Request (₮${depositAmount})`}
                </button>
              </form>
            )}
          </div>

          {/* Withdraw Section */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Withdraw USDT</h2>
            </div>

            {!hasBalance ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 mb-2">No funds available</p>
                <button
                  onClick={() => setActiveTab('deposit')}
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Deposit now
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdraw}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none font-mono"
                      min={0}
                      step={0.01}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">
                      ₮
                    </span>
                  </div>
                  <div className="flex justify-end text-xs text-slate-500 mt-1">
                    <span>Enter any amount</span>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(balance.balance.toString())}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="Enter your USDT address"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none font-mono"
                  />
                </div>

                {message.text && activeTab === 'withdraw' && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${
                    message.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processing || !withdrawAmount || !withdrawAddress}
                  className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : `Withdraw ₮${withdrawAmount || '0'}`}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8 bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
          </div>

          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between p-4 bg-slate-900 rounded-lg"
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
                      <p className="text-sm text-slate-500">{formatDateTimeInUserZone(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      tx.type === 'deposit' || tx.type === 'reward' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'reward' ? '+' : '-'}₮{tx.amount}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No transactions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}