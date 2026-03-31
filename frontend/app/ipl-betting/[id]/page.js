'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { bettingAPI, walletAPI } from '@/lib/api';
import { ArrowLeft, Trophy, Clock, Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDateTimeInUserZone } from '@/lib/time';

export default function MatchBettingPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params.id;
  
  const { user, loading: authLoading, updateBalance } = useAuth();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [placingBet, setPlacingBet] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState(0);
  const [userBet, setUserBet] = useState(null); // Track user's existing bet on this match

  // Constants
  const MIN_BET = 5;
  const MAX_BET = 25;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/ipl-betting/' + matchId);
      return;
    }

    if (user) {
      loadMatch();
      loadBalance();
      loadUserBet();
    }
  }, [user, authLoading, matchId]);

  const loadUserBet = async () => {
    try {
      const currentUserId = String(user?._id || user?.id || '');
      if (!currentUserId) {
        setUserBet(null);
        return;
      }

      const response = await bettingAPI.getBetsByMatch(matchId);
      const bets = response.data.data.bets || [];
      const ownBets = bets.filter((bet) => {
        const betUserId = String(
          typeof bet.userId === 'string'
            ? bet.userId
            : (bet.userId?._id || bet.userId?.id || '')
        );
        return !!betUserId && betUserId === currentUserId;
      });
      const existingBet = ownBets[0] || null;
      if (existingBet) {
        setUserBet(existingBet);
        setSelectedTeam(existingBet.selectedTeam);
        setBetAmount(existingBet.amount.toString());
      } else {
        setUserBet(null);
      }
    } catch (error) {
      console.error('Failed to load user bet:', error);
      setUserBet(null);
    }
  };

  const loadMatch = async () => {
    try {
      const response = await bettingAPI.getMatchById(matchId);
      setMatch(response.data.data.match);
    } catch (error) {
      console.error('Failed to load match:', error);
      router.push('/ipl-betting');
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async () => {
    try {
      const response = await walletAPI.getBalance();
      setBalance(response.data.data.balance);
      
      // If balance is 0 and user is trying to bet, show warning
      if (response.data.data.balance === 0) {
        // Optionally auto-show deposit prompt
        console.log('Balance is 0 - user cannot place bets');
      }
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const handlePlaceBet = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!selectedTeam) {
      setError('Please select a team');
      return;
    }

    const amount = parseFloat(betAmount);
    if (isNaN(amount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount < MIN_BET) {
      setError(`Minimum bet is ₮${MIN_BET}`);
      return;
    }

    if (amount > MAX_BET) {
      setError(`Maximum bet is ₮${MAX_BET}`);
      return;
    }

    if (amount > balance) {
      setError('');
      // Use alert with redirect for now (toast can be added via a toast library)
      alert('Insufficient balance! Please deposit first to place bets.');
      router.push('/wallet');
      return;
    }

    try {
      setPlacingBet(true);
      const response = await bettingAPI.placeBet({
        matchId,
        selectedTeam,
        amount
      });

      setSuccess(`Bet placed successfully! You bet ₮${amount} on ${selectedTeam === 'teamA' ? match.teamA.name : match.teamB.name}`);
      
      // Update global balance (for navbar and other components)
      if (response.data?.data?.remainingBalance !== undefined) {
        updateBalance(response.data.data.remainingBalance);
      }
      
      // Update local balance state
      setBalance(response.data?.data?.remainingBalance ?? balance);
      
      // Set userBet state to show bet placed
      setUserBet({
        _id: response.data?.data?.bet?.id || Date.now().toString(),
        matchId,
        selectedTeam,
        amount,
        status: 'pending',
        potentialWin: response.data?.data?.bet?.potentialWin ?? amount * (Number(match?.odds?.[selectedTeam]) || 2)
      });
      
      // Reset form
      setSelectedTeam(selectedTeam);
      setBetAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bet');
    } finally {
      setPlacingBet(false);
    }
  };

  const calculatePotentialWin = () => {
    const amount = parseFloat(betAmount) || 0;
    const odds = selectedTeam ? Number(match?.odds?.[selectedTeam]) : 0;
    if (!Number.isFinite(odds) || odds <= 0) return '0.00';
    return (amount * odds).toFixed(2);
  };

  const getSelectedOdds = () => {
    const odds = selectedTeam ? Number(match?.odds?.[selectedTeam]) : 0;
    return Number.isFinite(odds) && odds > 0 ? odds : 0;
  };

  const getSelectedTeamName = () => {
    if (selectedTeam === 'teamA') return match?.teamA?.name || 'Team A';
    if (selectedTeam === 'teamB') return match?.teamB?.name || 'Team B';
    return '';
  };

  const canChangeSelection = match?.status === 'upcoming' && !userBet;

  const formatUsdt = (value) => {
    return `₮${(Number(value) || 0).toFixed(2)}`;
  };

  const getBetOutcomeText = () => {
    if (!userBet) return '';

    if (userBet.status === 'pending') {
      const profit = (Number(userBet.potentialWin) || 0) - (Number(userBet.amount) || 0);
      return `If your team wins: +${formatUsdt(profit)} | If your team loses: -${formatUsdt(userBet.amount)}`;
    }

    if (userBet.status === 'win') {
      const profit = (Number(userBet.potentialWin) || 0) - (Number(userBet.amount) || 0);
      return `Result: WON. Net profit +${formatUsdt(profit)}`;
    }

    if (userBet.status === 'loss') {
      return `Result: LOST. Net loss -${formatUsdt(userBet.amount)}`;
    }

    return '';
  };

  const handleBetAmountChange = (event) => {
    const { value } = event.target;
    if (value === '') {
      setBetAmount('');
      return;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return;
    if (numeric > MAX_BET) {
      setBetAmount(String(MAX_BET));
      return;
    }

    setBetAmount(value);
  };

  const getTeamShortName = (team) => {
    return team?.shortName || team?.name?.slice(0, 3).toUpperCase() || 'TBD';
  };

  const formatLocalMatchTime = (startTime) => {
    return formatDateTimeInUserZone(startTime);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-slate-400">Match not found</p>
          <Link href="/ipl-betting" className="text-amber-500 hover:underline mt-2 inline-block">
            Back to matches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/10 to-amber-600/20 border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/ipl-betting" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Matches
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Place Your Bet</h1>
              <p className="text-slate-400">First Six in First 2 Overs</p>
            </div>
            
            {/* Balance */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-700">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">₮{(balance || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Match Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                match.status === 'live' ? 'bg-red-500' : 
                match.status === 'upcoming' ? 'bg-amber-500' : 'bg-slate-500'
              }`} />
              <span className="text-sm font-medium text-slate-400 capitalize">{match.status}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatLocalMatchTime(match.startTime)}</span>
            </div>
          </div>

          {/* Teams Display */}
          <div className="flex items-center justify-between">
            {/* Team A */}
            <div 
              className={`flex-1 text-center p-4 rounded-xl transition-all ${
                selectedTeam === 'teamA' 
                  ? 'bg-amber-500/20 border-2 border-amber-500' 
                  : `bg-slate-800/50 border-2 border-transparent ${canChangeSelection ? 'hover:border-slate-700 cursor-pointer' : 'cursor-default'}`
              }`}
              onClick={() => canChangeSelection && setSelectedTeam('teamA')}
            >
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] mx-auto mb-2 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 overflow-hidden shadow-lg shadow-amber-500/10">
                {match.teamA?.logo ? (
                  <img 
                    src={match.teamA.logo} 
                    alt={match.teamA?.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span className="text-xl md:text-2xl font-bold text-amber-500 hidden items-center justify-center w-full h-full">
                  {getTeamShortName(match.teamA)}
                </span>
              </div>
              <p className="text-white font-medium text-sm">{match.teamA?.name}</p>
              <p className="text-amber-500 font-bold mt-1">{match.odds?.teamA?.toFixed(2)}x</p>
            </div>

            {/* VS */}
            <div className="px-4">
              <span className="text-amber-500 text-xl font-bold">VS</span>
            </div>

            {/* Team B */}
            <div 
              className={`flex-1 text-center p-4 rounded-xl transition-all ${
                selectedTeam === 'teamB' 
                  ? 'bg-amber-500/20 border-2 border-amber-500' 
                  : `bg-slate-800/50 border-2 border-transparent ${canChangeSelection ? 'hover:border-slate-700 cursor-pointer' : 'cursor-default'}`
              }`}
              onClick={() => canChangeSelection && setSelectedTeam('teamB')}
            >
              <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] mx-auto mb-2 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 overflow-hidden shadow-lg shadow-orange-500/10">
                {match.teamB?.logo ? (
                  <img 
                    src={match.teamB.logo} 
                    alt={match.teamB?.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span className="text-xl md:text-2xl font-bold text-orange-500 hidden items-center justify-center w-full h-full">
                  {getTeamShortName(match.teamB)}
                </span>
              </div>
              <p className="text-white font-medium text-sm">{match.teamB?.name}</p>
              <p className="text-amber-500 font-bold mt-1">{match.odds?.teamB?.toFixed(2)}x</p>
            </div>
          </div>
        </div>

        {/* User's Existing Bet Info */}
        {userBet && (
          <div className="mt-4 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Your Bet Placed</span>
            </div>
            <p className="text-white mb-3">
              You bet <span className="text-amber-500 font-bold">{formatUsdt(userBet.amount)}</span> on{' '}
              <span className="text-emerald-400 font-semibold">
                {userBet.selectedTeam === 'teamA' ? match.teamA?.name : match.teamB?.name}
              </span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p className="text-slate-300">
                Status:{' '}
                <span className={`font-semibold ${
                  userBet.status === 'pending' ? 'text-amber-400' :
                  userBet.status === 'win' ? 'text-emerald-400' : 'text-red-400'
                }`}>{userBet.status.toUpperCase()}</span>
              </p>
              <p className="text-slate-300">
                Potential Win:{' '}
                <span className="text-amber-500 font-semibold">{formatUsdt(userBet.potentialWin)}</span>
              </p>
              {userBet.status === 'pending' && (
                <>
                  <p className="text-slate-300">
                    Possible Profit:{' '}
                    <span className="text-emerald-400 font-semibold">{formatUsdt((Number(userBet.potentialWin) || 0) - (Number(userBet.amount) || 0))}</span>
                  </p>
                  <p className="text-slate-300">
                    Possible Loss:{' '}
                    <span className="text-red-400 font-semibold">{formatUsdt(userBet.amount)}</span>
                  </p>
                </>
              )}
            </div>
            {getBetOutcomeText() && (
              <p className="text-slate-400 text-sm mt-3">{getBetOutcomeText()}</p>
            )}
            <p className="text-slate-500 text-xs mt-3">You cannot place another bet on this match.</p>
          </div>
        )}

        {/* Betting Form */}
        {match.status === 'upcoming' && !userBet && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Place Your Bet</h2>
            
            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 text-sm">{success}</span>
              </div>
            )}

            {/* Bet Amount Input */}
            <div className="mb-4">
              <label className="block text-slate-400 text-sm mb-2">Bet Amount (₮)</label>
              <input
                type="number"
                value={betAmount}
                onChange={handleBetAmountChange}
                min={MIN_BET}
                max={MAX_BET}
                step="0.01"
                placeholder={`${MIN_BET} - ${MAX_BET}`}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Min: ₮{MIN_BET}</span>
                <span>Max: ₮{MAX_BET}</span>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2 mb-6">
              {[5, 10, 15, 25].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount.toString())}
                  disabled={amount > balance}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    betAmount === amount.toString()
                      ? 'bg-amber-500 text-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  } ${amount > balance ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  ₮{amount}
                </button>
              ))}
            </div>

            {/* Potential Win */}
            {selectedTeam && betAmount && parseFloat(betAmount) >= MIN_BET && (
              <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Potential Win for {getSelectedTeamName()} ({getSelectedOdds().toFixed(2)}x):</span>
                  <span className="text-2xl font-bold text-emerald-400">₮{calculatePotentialWin()}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Cashout not available during the match session</p>
              </div>
            )}

            {/* Place Bet Button */}
            <button
              onClick={handlePlaceBet}
              disabled={!selectedTeam || !betAmount || placingBet || balance < MIN_BET}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedTeam && betAmount && placingBet
                  ? 'bg-amber-600 text-black'
                  : selectedTeam && betAmount && balance >= MIN_BET
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {placingBet ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Placing Bet...
                </span>
              ) : !selectedTeam ? (
                'Select a Team'
              ) : !betAmount ? (
                'Enter Bet Amount'
              ) : balance < MIN_BET ? (
                'Insufficient Balance'
              ) : (
                `Place Bet - ₮${betAmount || 0}`
              )}
            </button>

            {/* Balance Warning */}
            {balance < MIN_BET && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-amber-400 text-sm text-center">
                  Your balance is too low. Please deposit funds to place bets.
                </p>
                <Link 
                  href="/wallet" 
                  className="block text-center mt-2 text-amber-500 hover:underline text-sm"
                >
                  Go to Wallet →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Match Finished */}
        {match.status === 'finished' && match.result?.winner && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-500" />
            <h2 className="text-2xl font-bold text-white mb-2">Match Result</h2>
            <p className="text-xl text-emerald-400 font-semibold">
              {match.result.winner === 'teamA' ? match.teamA.name : match.teamB.name} WON!
            </p>
            <p className="text-slate-400 mt-2">Hit the first six in the first 2 overs</p>
          </div>
        )}

        {/* Live Match */}
        {match.status === 'live' && !userBet && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Match In Progress</h2>
            <p className="text-slate-400">Betting is closed for this match</p>
            <p className="text-slate-500 text-sm mt-2">Cashout not available during the match session</p>
          </div>
        )}
      </div>
    </div>
  );
}