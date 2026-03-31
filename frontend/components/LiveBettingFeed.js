'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { USDTIcon } from './USDTBadge';

// Games for local generation fallback
const GAMES = [
  { id: 'limbo', name: 'Limbo', icon: '🎯' },
  { id: 'dice', name: 'Dice', icon: '🎲' },
  { id: 'crash', name: 'Crash', icon: '🚀' },
  { id: 'plinko', name: 'Plinko', icon: '⚽' },
  { id: 'slots', name: 'Slots', icon: '🎰' },
  { id: 'baccarat', name: 'Baccarat', icon: '🃏' },
  { id: 'roulette', name: 'Roulette', icon: '🎡' },
  { id: 'blackjack', name: 'Blackjack', icon: '♠️' }
];

const USER_PREFIXES = ['Hidden', 'User', 'Player', 'Gamer', 'Bettor', 'Lucky', 'Winner', 'Hunter', 'Dreamer', 'Rich'];
const USER_SUFFIXES = ['***', '**', '*', '123', '456', '789', '01', '99', 'VIP', 'Pro'];
const BET_RANGES = { min: 5, max: 500 };

/**
 * Generate a masked username
 */
const generateUserName = () => {
  const prefix = USER_PREFIXES[Math.floor(Math.random() * USER_PREFIXES.length)];
  const suffix = USER_SUFFIXES[Math.floor(Math.random() * USER_SUFFIXES.length)];
  const randomNum = Math.floor(Math.random() * 999);
  return `${prefix}${suffix}${randomNum}`;
};

/**
 * Format USDT amount
 */
const formatUSDT = (amount) => {
  return '₮' + amount.toFixed(2);
};

/**
 * Format time like "10:32 PM" or "Just now"
 */
const formatTimeDisplay = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 120) return '1m ago';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Generate a random number between min and max
 */
const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Determine if bet is a win (40% win rate)
 */
const isWin = () => Math.random() < 0.4;

/**
 * Determine if big win (5% chance)
 */
const isBigWin = () => Math.random() < 0.05;

/**
 * Generate a unique ID
 */
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Generate a single betting activity entry (USDT only)
 */
const generateBettingActivity = (timestamp = Date.now()) => {
  const game = GAMES[Math.floor(Math.random() * GAMES.length)];
  
  // Generate bet amount in USDT
  const betAmount = Math.round(randomBetween(BET_RANGES.min, BET_RANGES.max) * 100) / 100;
  
  const win = isWin();
  const bigWin = win && isBigWin();
  
  let multiplier;
  if (bigWin) {
    multiplier = randomBetween(8, 10);
  } else if (win) {
    multiplier = randomBetween(1.5, 7);
  } else {
    multiplier = randomBetween(0, 1.5);
  }
  
  const payout = win ? betAmount * multiplier : 0;
  
  return {
    id: generateId(),
    gameName: game.name,
    gameIcon: game.icon,
    gameId: game.id,
    user: generateUserName(),
    time: formatTimeDisplay(timestamp),
    timestamp,
    betAmount,
    formattedBet: formatUSDT(betAmount),
    multiplier: parseFloat(multiplier.toFixed(2)),
    payout,
    formattedPayout: payout > 0 ? formatUSDT(payout) : '₮0.00',
    result: win ? 'win' : 'loss',
    isWin: win,
    isBigWin: bigWin
  };
};

/**
 * Generate initial batch of activities (30 entries - USDT only)
 */
const generateInitialBatch = () => {
  const activities = [];
  const now = Date.now();
  
  for (let i = 0; i < 30; i++) {
    const timestamp = now - Math.floor(randomBetween(1000, 300000));
    activities.push(generateBettingActivity(timestamp));
  }
  
  return activities.sort((a, b) => b.timestamp - a.timestamp);
};

export default function LiveBettingFeed() {
  const [activities, setActivities] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const localIntervalRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Initialize with preloaded data (never empty) - client-side only
  useEffect(() => {
    setMounted(true);
    const preloaded = generateInitialBatch();
    setActivities(preloaded);
    console.log('✅ Preloaded 30 betting activities (USDT only)');
  }, []);

  // Connect to socket.io
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('🔌 Connected to betting feed');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔌 Disconnected from betting feed');
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
    });

    socket.on('betting-history', (history) => {
      if (history && history.length > 0) {
        setActivities(history);
        console.log(`📡 Received ${history.length} activities from server`);
      }
    });

    socket.on('new-bet', (bet) => {
      if (bet) {
        setActivities(prev => [bet, ...prev].slice(0, 30));
      }
    });

    return () => socket.disconnect();
  }, []);

  // Local fallback generator if socket not connected
  useEffect(() => {
    if (!isConnected && activities.length > 0) {
      localIntervalRef.current = setInterval(() => {
        setActivities(prev => [generateBettingActivity(), ...prev].slice(0, 30));
      }, randomBetween(1000, 3000));
    }

    return () => {
      if (localIntervalRef.current) clearInterval(localIntervalRef.current);
    };
  }, [isConnected, activities.length]);

  // Update time displays every second
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => prev.map(activity => ({
        ...activity,
        time: formatTimeDisplay(activity.timestamp)
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a] bg-[#0a0a0a]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white font-semibold">Live Betting Feed</span>
            <USDTIcon size="xs" className="ml-1" />
          </div>
          <span className="text-xs text-gray-500">Loading...</span>
        </div>
        <div className="p-8 text-center text-gray-500">
          Loading betting activities...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a] bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white font-semibold">Live Betting Feed</span>
          <USDTIcon size="xs" className="ml-1" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{activities.length} entries</span>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-xs text-gray-500">{isConnected ? 'Live' : 'Local'}</span>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-5 gap-4 p-3 bg-[#151515] text-xs text-gray-500 font-medium uppercase tracking-wider border-b border-[#2a2a2a]">
        <div>Game</div>
        <div>User</div>
        <div className="text-right">Bet</div>
        <div className="text-right">Multiplier</div>
        <div className="text-right">Payout</div>
      </div>

      {/* Table Body - NEVER EMPTY */}
      <div className="max-h-[500px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 p-3 border-b border-[#2a2a2a] hover:bg-[#252525] transition-colors ${
                  activity.isWin ? 'bg-emerald-500/5' : activity.isBigWin ? 'bg-amber-500/10' : ''
                } ${activity.isBigWin ? 'ring-1 ring-amber-500/30' : ''}`}
              >
                {/* Game */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">{activity.gameIcon || '🎮'}</span>
                  <span className="text-white text-sm font-medium">{activity.gameName}</span>
                </div>

                {/* User */}
                <div className="text-gray-400 text-sm font-mono">
                  {activity.user}
                </div>

                {/* Bet Amount - USDT */}
                <div className="text-right font-mono text-sm text-emerald-400">
                  <USDTIcon size="sm" /> ₮{activity.betAmount.toFixed(2)}
                </div>

                {/* Multiplier */}
                <div className={`text-right font-mono text-sm font-bold ${
                  activity.isWin ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {activity.multiplier?.toFixed(2) || '1.00'}x
                </div>

                {/* Payout */}
                <div className={`text-right font-mono text-sm font-bold ${
                  activity.isWin ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {activity.isWin ? '+' : '-'}{activity.formattedPayout || '₮0.00'}
                </div>
              </motion.div>
            ))
          ) : (
            Array.from({ length: 30 }).map((_, i) => {
              const activity = generateBettingActivity(Date.now() - i * 10000);
              return (
                <div
                  key={i}
                  className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 p-3 border-b border-[#2a2a2a]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{activity.gameIcon}</span>
                    <span className="text-white text-sm font-medium">{activity.gameName}</span>
                  </div>
                  <div className="text-gray-400 text-sm font-mono">{activity.user}</div>
                  <div className="text-right font-mono text-sm text-emerald-400">
                    <USDTIcon size="sm" /> ₮{activity.betAmount.toFixed(2)}
                  </div>
                  <div className={`text-right font-mono text-sm font-bold ${
                    activity.isWin ? 'text-emerald-400' : 'text-red-400'
                  }`}>{activity.multiplier.toFixed(2)}x</div>
                  <div className={`text-right font-mono text-sm font-bold ${
                    activity.isWin ? 'text-emerald-400' : 'text-red-400'
                  }`}>{activity.isWin ? '+' : '-'}{activity.formattedPayout}</div>
                </div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#2a2a2a] bg-[#0a0a0a] text-xs text-gray-500 text-center flex items-center justify-center gap-2">
        <USDTIcon size="xs" />
        {isConnected 
          ? '🟢 Real-time updates via Socket.io' 
          : '🟡 Generating live activity locally'
        } • Auto-refreshes every 1-3 seconds
      </div>
    </div>
  );
}