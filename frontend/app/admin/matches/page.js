'use client';

import { useState, useEffect } from 'react';
import { adminAPI, bettingAPI } from '@/lib/api';
import { RotateCcw, Plus, Check, Clock, Trophy, Upload, X, Image, Pencil, Trash2, Edit } from 'lucide-react';
import { toUtcISOStringFromLocalInput, toDateTimeLocalInputValue, getClientTimeZone } from '@/lib/time';

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [createForm, setCreateForm] = useState({
    teamA: { name: '', shortName: '', logo: '' },
    teamB: { name: '', shortName: '', logo: '' },
    startTime: '',
    odds: { teamA: 2.0, teamB: 2.0 }
  });

  const [editForm, setEditForm] = useState({
    teamA: { name: '', shortName: '', logo: '' },
    teamB: { name: '', shortName: '', logo: '' },
    startTime: '',
    status: 'upcoming',
    odds: { teamA: 2.0, teamB: 2.0 }
  });

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await bettingAPI.getMatches({ limit: 50 });
      setMatches(response.data.data.matches || []);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (form, team, e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditForm(prev => ({
            ...prev,
            [team]: {
              ...prev[team],
              logo: reader.result
            }
          }));
        } else {
          setCreateForm(prev => ({
            ...prev,
            [team]: {
              ...prev[team],
              logo: reader.result
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    try {
      const utcStartTime = toUtcISOStringFromLocalInput(createForm.startTime);
      if (!utcStartTime) {
        alert('Invalid start time');
        return;
      }

      await adminAPI.createMatch({
        ...createForm,
        startTime: utcStartTime
      });
      setShowCreateModal(false);
      setCreateForm({
        teamA: { name: '', shortName: '', logo: '' },
        teamB: { name: '', shortName: '', logo: '' },
        startTime: '',
        odds: { teamA: 2.0, teamB: 2.0 }
      });
      loadMatches();
    } catch (error) {
      alert('Failed to create match');
    }
  };

  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setEditForm({
      teamA: { ...match.teamA },
      teamB: { ...match.teamB },
      startTime: toDateTimeLocalInputValue(match.startTime),
      status: match.status,
      odds: { ...match.odds }
    });
    setShowEditModal(true);
  };

  const handleUpdateMatch = async (e) => {
    e.preventDefault();
    try {
      const utcStartTime = toUtcISOStringFromLocalInput(editForm.startTime);
      if (!utcStartTime) {
        alert('Invalid start time');
        return;
      }

      const response = await adminAPI.updateMatch(editingMatch._id, {
        ...editForm,
        startTime: utcStartTime
      });
      console.log('Update response:', response.data);
      setShowEditModal(false);
      setEditingMatch(null);
      loadMatches();
    } catch (error) {
      console.error('Update error:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to update match: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (!matchId) {
      alert('No match selected for deletion');
      return;
    }
    try {
      console.log('Deleting match with ID:', matchId);
      const response = await adminAPI.deleteMatch(matchId);
      console.log('Delete response:', response.data);
      setDeleteConfirm(null);
      loadMatches();
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to delete match: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminAPI.updateMatchStatus(id, status);
      loadMatches();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleSettleMatch = async (id, winner) => {
    const match = matches.find(m => m._id === id);
    if (!confirm(`Confirm ${winner === 'teamA' ? match?.teamA?.name : match?.teamB?.name} as winner?`)) return;
    try {
      await adminAPI.settleMatch(id, winner);
      loadMatches();
    } catch (error) {
      alert('Failed to settle match');
    }
  };

  const handleSeedMatches = async () => {
    try {
      await bettingAPI.seedMatches();
      loadMatches();
    } catch (error) {
      alert('Failed to seed matches');
    }
  };

  const formatAdminMatchTime = (dateInput) => {
    if (!dateInput) return 'Invalid time';
    const parsed = new Date(dateInput);
    if (Number.isNaN(parsed.getTime())) return 'Invalid time';

    return new Intl.DateTimeFormat('en-US', {
      timeZone: getClientTimeZone(),
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(parsed);
  };

  // Generate short name from team name
  const generateShortName = (name, team, isEdit = false, formKey = 'teamA') => {
    const words = name.trim().split(' ');
    const short = words.length >= 2 ? words[0][0] + words[1][0] : name.substring(0, 2).toUpperCase();
    if (isEdit) {
      setEditForm(prev => ({
        ...prev,
        [formKey]: { ...prev[formKey], shortName: short }
      }));
    } else {
      setCreateForm(prev => ({
        ...prev,
        [formKey]: { ...prev[formKey], shortName: short }
      }));
    }
    return short;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Matches</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSeedMatches}
            className="px-4 py-2 bg-[#1a1a1a] text-slate-400 hover:text-white rounded-lg border border-[#333]"
          >
            Seed Demo
          </button>
          <button
            onClick={loadMatches}
            className="p-2 bg-[#1a1a1a] text-slate-400 hover:text-white rounded-lg border border-[#333]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 shadow-lg shadow-green-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Match
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : matches.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-400">No matches found</div>
        ) : (
          matches.map((match) => (
            <div key={match._id} className="bg-[#111] rounded-xl border border-[#222] p-5 hover:border-amber-500/30 transition-all hover:shadow-lg hover:shadow-amber-500/5">
              {/* Status & Time */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  match.status === 'live' ? 'bg-red-500/20 text-red-400' :
                  match.status === 'upcoming' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {match.status === 'live' ? '● LIVE' : match.status.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditMatch(match)}
                    className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                    title="Edit Match"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(match._id)}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Match"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="text-slate-400 text-xs">
                    {formatAdminMatchTime(match.startTime)}
                  </span>
                </div>
              </div>
              
              {/* Teams */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] mx-auto mb-2 rounded-full bg-[#222] flex items-center justify-center border-2 border-[#333] overflow-hidden shadow-lg shadow-amber-500/10">
                    {match.teamA?.logo ? (
                      <img src={match.teamA.logo} alt={match.teamA.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg md:text-xl font-bold text-amber-500">{match.teamA?.shortName || 'A'}</span>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium">{match.teamA?.name}</p>
                  <p className="text-amber-500 font-bold">{match.odds?.teamA}x</p>
                </div>
                <span className="text-slate-500 text-lg font-bold px-2">VS</span>
                <div className="text-center flex-1">
                  <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] mx-auto mb-2 rounded-full bg-[#222] flex items-center justify-center border-2 border-[#333] overflow-hidden shadow-lg shadow-orange-500/10">
                    {match.teamB?.logo ? (
                      <img src={match.teamB.logo} alt={match.teamB.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg md:text-xl font-bold text-orange-500">{match.teamB?.shortName || 'B'}</span>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium">{match.teamB?.name}</p>
                  <p className="text-amber-500 font-bold">{match.odds?.teamB}x</p>
                </div>
              </div>

              {/* Actions */}
              {match.status !== 'finished' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-[#222]">
                  {match.status === 'upcoming' && (
                    <button
                      onClick={() => handleUpdateStatus(match._id, 'live')}
                      className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 flex items-center justify-center gap-1 text-xs"
                    >
                      <Clock className="w-3 h-3" />
                      Go Live
                    </button>
                  )}
                  {(match.status === 'upcoming' || match.status === 'live') && (
                    <>
                      <button
                        onClick={() => handleSettleMatch(match._id, 'teamA')}
                        className="py-2 px-3 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 text-xs"
                      >
                        A Wins
                      </button>
                      <button
                        onClick={() => handleSettleMatch(match._id, 'teamB')}
                        className="py-2 px-3 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 text-xs"
                      >
                        B Wins
                      </button>
                    </>
                  )}
                  {match.status === 'live' && (
                    <button
                      onClick={() => handleUpdateStatus(match._id, 'finished')}
                      className="flex-1 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 text-sm"
                    >
                      End Match
                    </button>
                  )}
                </div>
              )}

              {match.status === 'finished' && match.result?.winner && (
                <div className="mt-4 pt-4 border-t border-[#222]">
                  <div className="p-3 bg-emerald-500/10 rounded-lg text-center border border-emerald-500/20">
                    <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <span className="text-emerald-400 font-semibold text-sm">
                      Winner: {match.result.winner === 'teamA' ? match.teamA.name : match.teamB.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Match Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] rounded-2xl border border-[#222] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Match</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMatch} className="space-y-4">
              {/* Team A */}
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                <h3 className="text-white font-semibold mb-3">Team A</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Team Name</label>
                    <input
                      type="text"
                      value={createForm.teamA.name}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, teamA: { ...prev.teamA, name: e.target.value } }))}
                      onBlur={(e) => generateShortName(e.target.value, 'teamA', false)}
                      placeholder="e.g., Mumbai Indians"
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Logo URL (optional)</label>
                    <input
                      type="text"
                      value={createForm.teamA.logo}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, teamA: { ...prev.teamA, logo: e.target.value } }))}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Or Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(null, 'teamA', e, false)}
                      className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-black file:font-semibold file:cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Team B */}
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                <h3 className="text-white font-semibold mb-3">Team B</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Team Name</label>
                    <input
                      type="text"
                      value={createForm.teamB.name}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, teamB: { ...prev.teamB, name: e.target.value } }))}
                      onBlur={(e) => generateShortName(e.target.value, 'teamB', false)}
                      placeholder="e.g., Chennai Super Kings"
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Logo URL (optional)</label>
                    <input
                      type="text"
                      value={createForm.teamB.logo}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, teamB: { ...prev.teamB, logo: e.target.value } }))}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Or Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(null, 'teamB', e, false)}
                      className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-black file:font-semibold file:cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Match Details */}
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                <h3 className="text-white font-semibold mb-3">Match Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Start Time</label>
                    <input
                      type="datetime-local"
                      value={createForm.startTime}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 text-sm mb-1 block">Odds A</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1.01"
                        value={createForm.odds.teamA}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, odds: { ...prev.odds, teamA: parseFloat(e.target.value) || 2.0 } }))}
                        className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white focus:border-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-1 block">Odds B</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1.01"
                        value={createForm.odds.teamB}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, odds: { ...prev.odds, teamB: parseFloat(e.target.value) || 2.0 } }))}
                        className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white focus:border-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 transition-colors"
              >
                Create Match
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Match Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] rounded-2xl border border-[#222] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Match</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMatch} className="space-y-4">
              {/* Team A */}
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                <h3 className="text-white font-semibold mb-3">Team A</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Team Name</label>
                    <input
                      type="text"
                      value={editForm.teamA.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, teamA: { ...prev.teamA, name: e.target.value } }))}
                      placeholder="e.g., Mumbai Indians"
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Logo URL</label>
                    <input
                      type="text"
                      value={editForm.teamA.logo}
                      onChange={(e) => setEditForm(prev => ({ ...prev, teamA: { ...prev.teamA, logo: e.target.value } }))}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Or Upload New Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(null, 'teamA', e, true)}
                      className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-black file:font-semibold file:cursor-pointer"
                    />
                  </div>
                  {editForm.teamA.logo && (
                    <div className="mt-2">
                      <img src={editForm.teamA.logo} alt="Team A Logo Preview" className="w-12 h-12 rounded-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Team B */}
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                <h3 className="text-white font-semibold mb-3">Team B</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Team Name</label>
                    <input
                      type="text"
                      value={editForm.teamB.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, teamB: { ...prev.teamB, name: e.target.value } }))}
                      placeholder="e.g., Chennai Super Kings"
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Logo URL</label>
                    <input
                      type="text"
                      value={editForm.teamB.logo}
                      onChange={(e) => setEditForm(prev => ({ ...prev, teamB: { ...prev.teamB, logo: e.target.value } }))}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Or Upload New Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(null, 'teamB', e, true)}
                      className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-black file:font-semibold file:cursor-pointer"
                    />
                  </div>
                  {editForm.teamB.logo && (
                    <div className="mt-2">
                      <img src={editForm.teamB.logo} alt="Team B Logo Preview" className="w-12 h-12 rounded-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Match Details */}
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                <h3 className="text-white font-semibold mb-3">Match Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Start Time</label>
                    <input
                      type="datetime-local"
                      value={editForm.startTime}
                      onChange={(e) => setEditForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="finished">Finished</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Odds A</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1.01"
                      value={editForm.odds.teamA}
                      onChange={(e) => setEditForm(prev => ({ ...prev, odds: { ...prev.odds, teamA: parseFloat(e.target.value) || 2.0 } }))}
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Odds B</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1.01"
                      value={editForm.odds.teamB}
                      onChange={(e) => setEditForm(prev => ({ ...prev, odds: { ...prev.odds, teamB: parseFloat(e.target.value) || 2.0 } }))}
                      className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] rounded-2xl border border-[#222] p-6 w-full max-w-md">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Match?</h3>
              <p className="text-slate-400 mb-6">Are you sure you want to delete this match? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMatch(deleteConfirm)}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}