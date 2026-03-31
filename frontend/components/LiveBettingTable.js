'use client';

import { useState, useEffect } from 'react';

// User name generators
const USER_PREFIXES = ['Hidden', 'User', 'Player', 'Gamer', 'Bettor', 'Lucky', 'Winner', 'Hunter'];
const USER_SUFFIXES = ['***', '**', '*', '123', '456', '01', '99', 'VIP', 'Pro'];

/**
 * Generate a masked username
 */
const generateUserName = () => {
  const prefix = USER_PREFIXES[Math.floor(Math.random() * USER_PREFIXES.length)];
  const suffix = USER_SUFFIXES[Math.floor(Math.random() * USER_SUFFIXES.length)];
  return `${prefix}${suffix}`;
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
const generateBettingActivity = () => {
  // Generate bet amount in USDT (5-500)
  const betAmount = Math.round(randomBetween(5, 500) * 100) / 100;
  
  const win = isWin();
  const bigWin = win && isBigWin();
  
  let multiplier;
  if (bigWin) {
    multiplier = randomBetween(8, 10);
  } else if (win) {
    multiplier = randomBetween(1.5, 7);
  } else {
    multiplier = randomBetween(0.5, 1.2);
  }
  
  const payout = win ? betAmount * multiplier : 0;
  
  return {
    id: generateId(),
    user: generateUserName(),
    betAmount: betAmount,
    formattedBet: `₮${betAmount.toFixed(2)}`,
    multiplier: parseFloat(multiplier.toFixed(2)),
    formattedMultiplier: `${multiplier.toFixed(2)}x`,
    payout: payout,
    formattedPayout: payout > 0 ? `₮${payout.toFixed(2)}` : '₮0.00',
    isWin: win,
    isNew: true
  };
};

/**
 * Generate initial batch of activities (25 entries)
 */
const generateInitialBatch = () => {
  const activities = [];
  
  for (let i = 0; i < 25; i++) {
    activities.push(generateBettingActivity());
  }
  
  return activities;
};

export default function LiveBettingTable() {
  const [activities, setActivities] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Initialize with preloaded data on mount
  useEffect(() => {
    setMounted(true);
    const preloaded = generateInitialBatch();
    setActivities(preloaded);
  }, []);

  // Live update: add new entry every 1-2 seconds
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = generateBettingActivity();
        const updated = [newActivity, ...prev];
        // Keep max 25 rows
        return updated.slice(0, 25);
      });
    }, Math.random() * 1000 + 1000); // 1-2 seconds random

    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="bg-[#0f172a] rounded-xl border border-slate-700/50 p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-700/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-white">Live Betting Activity</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4 px-4 py-2 text-xs font-medium text-slate-400 border-b border-slate-700/30 bg-slate-800/20">
          <div>User</div>
          <div className="text-right">Bet Amount</div>
          <div className="text-right">Multiplier</div>
          <div className="text-right">Winning</div>
        </div>

        {/* Table Body */}
        <div className="max-h-[400px] overflow-y-auto">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`grid grid-cols-4 px-4 py-3 text-sm border-b border-slate-700/20 hover:bg-slate-800/40 transition-all duration-300 ${
                activity.isNew ? 'animate-slide-in' : ''
              } ${index === 0 ? 'bg-slate-800/30' : ''}`}
              style={activity.isNew ? {
                animation: 'slideIn 0.3s ease-out forwards'
              } : {}}
            >
              {/* User */}
              <div className="text-slate-300 font-medium truncate pr-2">
                {activity.user}
              </div>

              {/* Bet Amount */}
              <div className="text-right text-slate-400 font-mono">
                {activity.formattedBet}
              </div>

              {/* Multiplier */}
              <div className={`text-right font-mono font-semibold ${
                activity.multiplier >= 2 ? 'text-yellow-400' : 'text-slate-400'
              }`}>
                {activity.formattedMultiplier}
              </div>

              {/* Winning Amount */}
              <div className={`text-right font-mono font-bold ${
                activity.isWin ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {activity.formattedPayout}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-700/30 bg-slate-800/20">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{activities.length} active bets</span>
          <span>Real-time updates</span>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}