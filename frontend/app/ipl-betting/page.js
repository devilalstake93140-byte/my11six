'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { bettingAPI } from '@/lib/api';
import { Trophy, Clock, Users, ChevronRight, RefreshCw, ArrowLeft } from 'lucide-react';
import { formatDateTimeInUserZone, getClientTimeZone } from '@/lib/time';

export default function IPLBettingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [seeding, setSeeding] = useState(false);
  const [userBets, setUserBets] = useState({}); // Track bets by matchId
  const [refreshKey, setRefreshKey] = useState(0); // For triggering refresh
  const [betsLoading, setBetsLoading] = useState(false);
  const [nowTs, setNowTs] = useState(Date.now());
  const [checkingMatchId, setCheckingMatchId] = useState(null);

  const loadUserBets = async () => {
    const currentUserId = String(user?._id || user?.id || '');
    if (!currentUserId) {
      setUserBets({});
      setBetsLoading(false);
      return;
    }

    setBetsLoading(true);
    try {
      const response = await bettingAPI.getMyBets({ limit: 50 });
      const bets = response.data.data.bets || [];
      const betMap = {};

      bets.forEach((bet) => {
        const betUserId = String(
          typeof bet.userId === 'string'
            ? bet.userId
            : (bet.userId?._id || bet.userId?.id || '')
        );
        if (!betUserId || betUserId !== currentUserId) {
          return;
        }

        const mappedMatchId = typeof bet.matchId === 'string'
          ? bet.matchId
          : (bet.matchId?._id ? String(bet.matchId._id) : String(bet.matchId || ''));
        if (mappedMatchId) {
          betMap[mappedMatchId] = bet;
        }
      });

      setUserBets(betMap);
    } catch (error) {
      console.error('Failed to load user bets:', error);
    } finally {
      setBetsLoading(false);
    }
  };

  const formatLocalMatchTime = (startTime) => {
    const startDate = new Date(startTime);
    if (Number.isNaN(startDate.getTime())) return 'Invalid time';

    const timeZone = getClientTimeZone();
    const localDay = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(startDate);
    const todayDay = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(nowTs));

    // If match is today in user's local timezone, show only time.
    if (localDay === todayDay) {
      return new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(startDate);
    }

    return formatDateTimeInUserZone(startTime);
  };
useEffect(() => {
    loadMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, refreshKey]);

  useEffect(() => {
    if (user) {
      loadUserBets();
    } else {
      setUserBets({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const loadMatches = async () => {
    try {
      setLoading(true);
      let response;
      
      if (activeTab === 'live') {
        response = await bettingAPI.getLiveMatches();
      } else if (activeTab === 'upcoming') {
        response = await bettingAPI.getUpcomingMatches();
      } else {
        response = await bettingAPI.getMatches({ limit: 20 });
      }
      
      setMatches(response.data.data.matches || []);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  

  // Format time until match starts
  const getTimeUntil = (startTime) => {
    const startDate = new Date(startTime);
    if (Number.isNaN(startDate.getTime())) return 'TBD';

    const timeZone = getClientTimeZone();
    const toWallClockTs = (date) => {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).formatToParts(date);

      const getPart = (type) => parts.find((p) => p.type === type)?.value || '00';
      const localWallClock = `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;
      return new Date(localWallClock).getTime();
    };

    const startWallClockTs = toWallClockTs(startDate);
    const nowWallClockTs = toWallClockTs(new Date(nowTs));
    const diffMs = startWallClockTs - nowWallClockTs;

    // Remove timer once start time is reached.
    if (diffMs <= 0) {
      return null;
    }

    const totalMinutes = Math.ceil(diffMs / (60 * 1000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const isSameLocalDay = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(startDate) === new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(nowTs));

    if (isSameLocalDay) {
      return `${hours}h ${minutes}m`;
    }

    const days = Math.floor(totalMinutes / (60 * 24));
    const remHours = Math.floor((totalMinutes % (60 * 24)) / 60);
    return `${days}d ${remHours}h`;
  };

  const handlePlaceBetClick = async (matchId) => {
    if (!user) {
      router.push(`/login?redirect=/ipl-betting/${matchId}`);
      return;
    }

    try {
      setCheckingMatchId(matchId);
      const response = await bettingAPI.getBetsByMatch(matchId);
      const bets = response.data?.data?.bets || [];
      const currentUserId = String(user?._id || user?.id || '');
      const ownBets = bets.filter((bet) => {
        const betUserId = String(
          typeof bet.userId === 'string'
            ? bet.userId
            : (bet.userId?._id || bet.userId?.id || '')
        );
        return !!betUserId && !!currentUserId && betUserId === currentUserId;
      });
      const existingBet = ownBets[0] || null;

      if (existingBet) {
        setUserBets(prev => ({ ...prev, [String(matchId)]: existingBet }));
        return;
      }

      router.push(`/ipl-betting/${matchId}`);
    } catch (error) {
      console.error('Failed to pre-check bet status:', error);
      router.push(`/ipl-betting/${matchId}`);
    } finally {
      setCheckingMatchId(null);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-red-500';
      case 'upcoming': return 'bg-amber-500';
      case 'finished': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  // Get team short name
  const getTeamShortName = (team) => {
    return team?.shortName || team?.name?.slice(0, 3).toUpperCase() || 'TBD';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/10 to-amber-600/20 border-b border-amber-500/20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/" 
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-amber-500" />
            </Link>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Early Six IPL</h1>
              <p className="text-slate-400">Bet on which team hits the first six</p>
            </div>
          </div>

          {/* Seed Button removed - only admin-created matches shown */}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'live', 'upcoming'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Terms & Conditions */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-amber-400 mb-2">Terms & Conditions</h2>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>Pre-match, single bets in the Winner (Incl. Super Over) market for all IPL matches.</li>
            <li>Only the first bet per match, per customer, per household qualifies.</li>
            <li>Bets must be placed before the scheduled time indicated on my11six.com.</li>
            <li>Minimum stake: $5 USD.</li>
            <li>If your selection hits a six in the first two overs but goes on to lose, your bet will be paid as a winner.</li>
            <li>Bonus is claimable as cryptocurrency only within 48 hours.</li>
            <li>No cashed-out or voided bets are eligible.</li>
            <li>Please allow up to 48 hours for winnings to be processed and credited.</li>
            <li>Any user with a conflict of interest, including a professional association with my11six, will be disqualified.</li>
          </ul>

          <h3 className="text-xs font-semibold text-white mt-4 mb-1">Indian Cricket - My11six 2 Over Payout</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Place a pre-match, single bet on either team in the Winner (Incl. Super Over) market. If your team
            hits a six in the first two overs but still loses the match, your bet will be paid out as a winner.
          </p>
        </div>

        {/* Matches Grid */}
        {matches.length > 0 ? (
          <div className="grid gap-4">
            {matches.map((match) => {
              const matchIdKey = String(match._id);
              const userBet = userBets[matchIdKey];
              const countdownLabel = match.status === 'upcoming' ? getTimeUntil(match.startTime) : null;
              return (
                <div
                  key={match._id}
                  className={`bg-slate-900 rounded-2xl p-4 transition-all ${
                    userBet 
                      ? 'border-2 border-emerald-500 shadow-lg shadow-emerald-500/20' 
                      : 'border border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  {/* Bet Placed Badge */}
                  {userBet && (
                    <div className="mb-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Bet Placed
                      </span>
                      <span className="text-xs text-slate-400">
                        Amount: ₮{Number(userBet.amount || 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                {/* Match Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(match.status)}`} />
                    <span className="text-sm font-medium text-slate-400 capitalize">
                      {match.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {match.status === 'upcoming'
                        ? (countdownLabel ? `Starts in ${countdownLabel}` : formatLocalMatchTime(match.startTime))
                        : match.status === 'live'
                        ? 'In Progress'
                        : match.status === 'finished'
                        ? 'Finished'
                        : formatLocalMatchTime(match.startTime)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4">
                  {formatLocalMatchTime(match.startTime)}
                </p>

                {/* Teams */}
                <div className="flex items-center justify-between mb-4">
                  {/* Team A */}
                  <div className="flex-1 text-center">
                    <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] mx-auto mb-2 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 overflow-hidden shadow-lg shadow-amber-500/10">
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
                      <span className="text-2xl md:text-3xl font-bold text-amber-500 hidden items-center justify-center w-full h-full">
                        {getTeamShortName(match.teamA)}
                      </span>
                    </div>
                    <p className="text-white font-medium truncate">{match.teamA?.name}</p>
                    <p className="text-amber-500 font-bold">{match.odds?.teamA?.toFixed(2)}x</p>
                  </div>

                  {/* VS */}
                  <div className="px-4">
                    <span className="text-slate-500 text-lg font-bold">VS</span>
                  </div>

                  {/* Team B */}
                  <div className="flex-1 text-center">
                    <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] mx-auto mb-2 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 overflow-hidden shadow-lg shadow-orange-500/10">
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
                      <span className="text-2xl md:text-3xl font-bold text-orange-500 hidden items-center justify-center w-full h-full">
                        {getTeamShortName(match.teamB)}
                      </span>
                    </div>
                    <p className="text-white font-medium truncate">{match.teamB?.name}</p>
                    <p className="text-amber-500 font-bold">{match.odds?.teamB?.toFixed(2)}x</p>
                  </div>
                </div>

                {/* Result */}
                {match.status === 'finished' && match.result?.winner && (
                  <div className="mb-4 p-3 bg-emerald-500/10 rounded-lg text-center border border-emerald-500/20">
                    <span className="text-emerald-400 font-semibold">
                      {match.result.winner === 'teamA' ? match.teamA.name : match.teamB.name} 
                      {' '}WON!
                    </span>
                  </div>
                )}

                {/* Action Button */}
                {match.status === 'upcoming' ? (
                  betsLoading ? (
                    <button
                      disabled
                      className="block w-full py-3 bg-slate-700 text-slate-400 font-semibold rounded-xl text-center cursor-not-allowed"
                    >
                      Checking Bet...
                    </button>
                  ) : userBet ? (
                    <div className="space-y-2">
                      <span className="block text-center text-xs text-emerald-400 font-medium">
                        You already placed a bet
                      </span>
                      <Link
                        href={`/ipl-betting/${match._id}`}
                        className="w-full py-3 bg-emerald-500/20 text-emerald-400 font-semibold rounded-xl text-center flex items-center justify-center gap-2 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Bet Placed - View Details
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePlaceBetClick(match._id)}
                      disabled={checkingMatchId === match._id}
                      className="block w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-xl text-center hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {checkingMatchId === match._id ? 'Checking...' : 'Place Bet'}
                    </button>
                  )
                ) : match.status === 'live' ? (
                  userBet ? (
                    <div className="space-y-2">
                      <span className="block text-center text-xs text-emerald-400 font-medium">
                        You already placed a bet
                      </span>
                      <Link
                        href={`/ipl-betting/${match._id}`}
                        className="w-full py-3 bg-emerald-500/20 text-emerald-400 font-semibold rounded-xl text-center flex items-center justify-center gap-2 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        View Bet Details
                      </Link>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="block w-full py-3 bg-slate-700 text-slate-400 font-semibold rounded-xl text-center cursor-not-allowed"
                    >
                      Betting Closed
                    </button>
                  )
                ) : (
                  <Link
                    href={`/ipl-betting/${match._id}`}
                    className="block w-full py-3 bg-slate-800 text-slate-400 font-semibold rounded-xl text-center hover:bg-slate-700 transition-colors"
                  >
                    View Details
                  </Link>
                )}
              </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">No matches available</p>
            <p className="text-slate-500 text-sm mt-2">Admin will add upcoming IPL matches soon</p>
          </div>
        )}
      </div>
    </div>
  );
}