'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { adminAPI, gameAPI } from '@/lib/api';
import { Users, Gamepad2, DollarSign, Settings, Plus, Edit, Trash2, Check, X } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Game form state
  const [showGameForm, setShowGameForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [gameForm, setGameForm] = useState({
    title: '',
    description: '',
    category: 'slots',
    image: '',
    minBet: 10,
    maxBet: 1000,
    provider: 'Platform',
    rtp: 95,
    isFeatured: false
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }

    if (user && user.role === 'admin') {
      loadAdminData();
    }
  }, [user, authLoading]);

  const loadAdminData = async () => {
    try {
      const [dashboardRes, usersRes, transactionsRes, gamesRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getUsers({ limit: 20 }),
        adminAPI.getTransactions({ limit: 20 }),
        gameAPI.getAll({ limit: 50 })
      ]);

      setStats(dashboardRes.data.data.stats);
      setUsers(usersRes.data.data.users || []);
      setTransactions(transactionsRes.data.data.transactions || []);
      setGames(gamesRes.data.data.games || []);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedGames = async () => {
    try {
      await adminAPI.seedGames();
      loadAdminData();
      alert('Games seeded successfully!');
    } catch (error) {
      alert('Failed to seed games');
    }
  };

  const handleSaveGame = async (e) => {
    e.preventDefault();
    try {
      if (editingGame) {
        await adminAPI.updateGame(editingGame._id, gameForm);
      } else {
        await adminAPI.createGame(gameForm);
      }
      setShowGameForm(false);
      setEditingGame(null);
      setGameForm({
        title: '',
        description: '',
        category: 'slots',
        image: '',
        minBet: 10,
        maxBet: 1000,
        provider: 'Platform',
        rtp: 95,
        isFeatured: false
      });
      loadAdminData();
    } catch (error) {
      alert('Failed to save game');
    }
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setGameForm({
      title: game.title,
      description: game.description || '',
      category: game.category,
      image: game.image || '',
      minBet: game.minBet,
      maxBet: game.maxBet,
      provider: game.provider || 'Platform',
      rtp: game.rtp || 95,
      isFeatured: game.isFeatured || false
    });
    setShowGameForm(true);
  };

  const handleDeleteGame = async (gameId) => {
    if (!confirm('Are you sure you want to delete this game?')) return;
    try {
      await adminAPI.deleteGame(gameId);
      loadAdminData();
    } catch (error) {
      alert('Failed to delete game');
    }
  };

  const handleApproveTransaction = async (transactionId, status) => {
    try {
      await adminAPI.updateTransaction(transactionId, { status });
      loadAdminData();
    } catch (error) {
      alert('Failed to update transaction');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Settings },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'transactions', name: 'Transactions', icon: DollarSign },
    { id: 'games', name: 'Games', icon: Gamepad2 },
  ];

  return (
    <div className="min-h-screen pt-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 mt-2">Manage your gaming platform</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black font-medium'
                  : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-amber-500'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              <p className="text-sm text-gray-400">Total Users</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
              <p className="text-sm text-gray-400">Active Users</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
              <div className="flex items-center justify-between mb-4">
                <Gamepad2 className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalGames}</p>
              <p className="text-sm text-gray-400">Total Games</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.pendingWithdrawals}</p>
              <p className="text-sm text-gray-400">Pending Withdrawals</p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-bold text-white">All Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a0a]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Balance INR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Balance USDT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#0a0a0a]">
                      <td className="px-6 py-4 text-white">{user.name}</td>
                      <td className="px-6 py-4 text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 text-white">₹{user.balanceINR?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 text-white">${user.balanceUSDT?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 text-gray-400 capitalize">{user.role}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${user.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
            <div className="p-6 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-bold text-white">All Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a0a]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-[#0a0a0a]">
                      <td className="px-6 py-4 text-white">{tx.userId?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-400 capitalize">{tx.type}</td>
                      <td className="px-6 py-4 text-white">{tx.amount} {tx.currency}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          tx.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                          tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        {tx.type === 'withdraw' && tx.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveTransaction(tx._id, 'completed')}
                              className="p-1 text-green-500 hover:bg-green-500/10 rounded"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApproveTransaction(tx._id, 'cancelled')}
                              className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Manage Games</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleSeedGames}
                  className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-gray-400 hover:text-amber-500 hover:border-amber-500 transition-colors"
                >
                  Seed Sample Games
                </button>
                <button
                  onClick={() => {
                    setEditingGame(null);
                    setGameForm({
                      title: '',
                      description: '',
                      category: 'slots',
                      image: '',
                      minBet: 10,
                      maxBet: 1000,
                      provider: 'Platform',
                      rtp: 95,
                      isFeatured: false
                    });
                    setShowGameForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Game
                </button>
              </div>
            </div>

            {/* Game Form Modal */}
            {showGameForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/70" onClick={() => setShowGameForm(false)} />
                <div className="relative w-full max-w-lg bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    {editingGame ? 'Edit Game' : 'Add New Game'}
                  </h3>
                  <form onSubmit={handleSaveGame} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={gameForm.title}
                        onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Description</label>
                      <textarea
                        value={gameForm.description}
                        onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                        <select
                          value={gameForm.category}
                          onChange={(e) => setGameForm({ ...gameForm, category: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white"
                        >
                          <option value="slots">Slots</option>
                          <option value="table">Table</option>
                          <option value="card">Card</option>
                          <option value="arcade">Arcade</option>
                          <option value="sports">Sports</option>
                          <option value="lottery">Lottery</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Min Bet</label>
                        <input
                          type="number"
                          value={gameForm.minBet}
                          onChange={(e) => setGameForm({ ...gameForm, minBet: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Max Bet</label>
                        <input
                          type="number"
                          value={gameForm.maxBet}
                          onChange={(e) => setGameForm({ ...gameForm, maxBet: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">RTP (%)</label>
                        <input
                          type="number"
                          value={gameForm.rtp}
                          onChange={(e) => setGameForm({ ...gameForm, rtp: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={gameForm.image}
                        onChange={(e) => setGameForm({ ...gameForm, image: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400"
                      >
                        {editingGame ? 'Update Game' : 'Create Game'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowGameForm(false)}
                        className="px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Games List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => (
                <div key={game._id} className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4">
                  <img 
                    src={game.image || '/images/game-placeholder.jpg'} 
                    alt={game.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-white font-semibold">{game.title}</h3>
                  <p className="text-sm text-gray-400 capitalize">{game.category}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEditGame(game)}
                      className="flex-1 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-gray-400 hover:text-amber-500 hover:border-amber-500 text-sm"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game._id)}
                      className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500/20 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}