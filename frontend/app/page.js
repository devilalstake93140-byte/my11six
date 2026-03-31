'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import HeroBanner from '@/components/HeroBanner';
import LiveBettingTable from '@/components/LiveBettingTable';
import KYCPrompt from '@/components/KYCPrompt';
import { Trophy, Zap, Star, Target, Wallet, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handlePlayNow = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/ipl-betting');
    }
  };

  const handleAddFunds = () => {
    if (!user) {
      router.push('/login?redirect=/wallet');
    } else {
      router.push('/wallet');
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner */}
      <HeroBanner />

      {/* KYC Prompt - Only show if logged in and not verified */}
      {user && !user.isVerified && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <KYCPrompt />
        </div>
      )}

      {/* EARLY SIX - Main Game Section */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full mb-4">
              <Trophy className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium text-sm">IPL 2026 Special</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">Early Six</span> Game
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Predict when the first six will be hit in the opening overs and win instantly!
            </p>
          </div>

          {/* Main Game Card */}
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-3xl border-2 border-yellow-500/50 p-8 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />

              {/* Game Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center border-4 border-yellow-500/50">
                    <span className="text-5xl">🏏</span>
                  </div>
                  {/* Ball accent */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-2 border-yellow-400" />
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <div className="px-4 py-1.5 bg-red-500/20 border border-red-500/40 rounded-full">
                  <span className="text-red-400 text-sm font-medium">IPL Special</span>
                </div>
                <div className="px-4 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full">
                  <span className="text-green-400 text-sm font-medium">Instant Payout</span>
                </div>
                <div className="px-4 py-1.5 bg-yellow-500/20 border border-yellow-500/40 rounded-full">
                  <span className="text-yellow-400 text-sm font-medium">200% Bonus</span>
                </div>
              </div>

              {/* Game Title */}
              <h3 className="text-3xl font-black text-center text-white mb-2">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">EARLY SIX</span>
              </h3>
              <p className="text-center text-gray-400 mb-6">
                Predict the first six in opening overs
              </p>

              {/* Stats */}
              {/* <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">₹10</div>
                  <div className="text-xs text-gray-500">Min Bet</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">₹10K</div>
                  <div className="text-xs text-gray-500">Max Bet</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">97%</div>
                  <div className="text-xs text-gray-500">RTP</div>
                </div>
              </div> */}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handlePlayNow}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-black font-bold text-lg rounded-xl hover:scale-105 transition-transform shadow-lg shadow-green-500/30"
                >
                  <Target className="w-5 h-5" />
                  Play Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleAddFunds}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-yellow-500/50 text-yellow-400 font-bold text-lg rounded-xl hover:bg-yellow-500/10 transition-colors"
                >
                  <Wallet className="w-5 h-5" />
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Place Your Bet</h3>
              <p className="text-gray-400 text-sm">Choose when you think the first six will be hit</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Watch the Match</h3>
              <p className="text-gray-400 text-sm">Follow the live cricket match and wait for the six</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Win Instantly</h3>
              <p className="text-gray-400 text-sm">Get instant payout when your prediction is correct!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant Payouts</h3>
              <p className="text-gray-400 text-sm">Get your winnings immediately after the six is hit</p>
            </div>

            <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Bonus Rewards</h3>
              <p className="text-gray-400 text-sm">Get bonus on your first deposit</p>
            </div>

            <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a2a]">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Win Rewards</h3>
              <p className="text-gray-400 text-sm">High return to player for better winning chances</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Betting Activity Feed */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Live Betting Activity</h2>
          <LiveBettingTable />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a2e]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Play?</h2>
          <p className="text-gray-400 mb-8">Join now and start playing</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePlayNow}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-black font-bold text-lg rounded-xl hover:scale-105 transition-transform"
            >
              <Target className="w-5 h-5" />
              Play Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddFunds}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-yellow-500/50 text-yellow-400 font-bold text-lg rounded-xl hover:bg-yellow-500/10 transition-colors"
            >
              <Wallet className="w-5 h-5" />
              Add Funds
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}