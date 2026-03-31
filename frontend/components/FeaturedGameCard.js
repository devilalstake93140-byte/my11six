'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Play, Flame, Zap } from 'lucide-react';

// Early Six featured game data
const EARLY_SIX_GAME = {
  _id: 'early-six-featured',
  title: 'Early Six',
  description: 'Bet on the first six in 2 overs - Instant payout on six! Exclusive IPL 2026 special game with 200% bonus.',
  image: '/images/early-six.jpg',
  category: 'IPL Special',
  categoryName: 'IPL Special',
  minBet: 10,
  maxBet: 10000,
  rtp: 97,
  isFeatured: true,
  isEarlySix: true,
  popularityScore: 98,
};

export default function FeaturedGameCard() {
  const router = useRouter();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/ipl-betting');
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ====== GLOW EFFECT CONTAINER ====== */}
      <div className={`absolute -inset-1 rounded-2xl transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-green-500 opacity-60 blur-md animate-pulse" style={{ animationDuration: '2s' }} />
      </div>
      
      {/* Secondary glow */}
      <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-green-400 via-yellow-400 to-amber-500 opacity-40 blur-xl transition-opacity duration-500 ${isHovered ? 'opacity-80' : 'opacity-50'}`} />

      {/* ====== MAIN CARD ====== */}
      <div 
        className={`relative bg-[#0f172a] rounded-xl overflow-hidden border-2 border-yellow-500/50 transition-all duration-500 ${isHovered ? 'scale-105 shadow-2xl shadow-yellow-500/20' : 'scale-102'}`}
      >
        {/* Cricket Stadium Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/images/cricket-stadium-bg.jpg" 
            alt="Cricket Stadium"
            className="w-full h-full object-cover opacity-40"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-[#0f172a]/60" />
          
          {/* Stadium lights effect */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-400/20 blur-[60px]" />
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-yellow-400/20 blur-[60px]" />
          
          {/* Floating particles */}
          <div className="absolute top-10 right-20 w-3 h-3 bg-yellow-400/60 rounded-full animate-pulse" />
          <div className="absolute top-20 left-16 w-2 h-2 bg-amber-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-16 right-32 w-2 h-2 bg-green-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* ====== BADGES ====== */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {/* HOT Badge */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg shadow-red-500/40 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-bold tracking-wide">HOT</span>
          </div>
          
          {/* Featured Badge */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full shadow-lg shadow-yellow-500/40">
            <Zap className="w-3.5 h-3.5 text-black" />
            <span className="text-black text-xs font-bold">FEATURED</span>
          </div>
        </div>

        {/* IPL 2026 Badge - Right */}
        <div className="absolute top-4 right-4 z-20">
          <div className="px-3 py-1.5 bg-[#1e3a8a] border border-blue-400/50 rounded-full">
            <span className="text-blue-400 text-xs font-bold tracking-wider">IPL 2026</span>
          </div>
        </div>

        {/* ====== CONTENT ====== */}
        <div className="relative z-10 p-6">
          {/* Game Icon */}
          <div className="flex justify-center mb-4">
            <div className={`relative transition-transform duration-500 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
              {/* Glow behind icon */}
              <div className="absolute inset-0 bg-yellow-500/30 blur-xl rounded-full" />
              
              {/* Cricket Bat & Ball Icon */}
              <div className="relative w-24 h-24 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full border-2 border-yellow-500/60">
                <span className="text-5xl">🏏</span>
                {/* Ball accent */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-yellow-400" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-center text-2xl font-black text-white mb-2 tracking-wide">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-green-400 bg-clip-text text-transparent">
              EARLY SIX
            </span>
          </h3>

          {/* Tag */}
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-sm font-medium">
              IPL Special
            </span>
          </div>

          {/* Description */}
          <p className="text-center text-gray-300 text-sm mb-6 max-w-xs mx-auto">
            Bet on the first six in 2 overs. 
            <span className="text-yellow-400 font-semibold"> Instant payout!</span>
          </p>

          {/* Stats Row */}
          {/* <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-lg">₹10</div>
              <div className="text-gray-500 text-xs">Min Bet</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg">₹10K</div>
              <div className="text-gray-500 text-xs">Max Bet</div>
            </div>
            <div className="text-center">
              <div className="text-amber-400 font-bold text-lg">97%</div>
              <div className="text-gray-500 text-xs">RTP</div>
            </div>
          </div> */}

          {/* Bonus Banner */}
          <div className="flex justify-center mb-6">
            <div className="px-6 py-2 bg-gradient-to-r from-green-500/20 to-yellow-500/20 border border-green-500/40 rounded-lg">
              <span className="text-green-400 font-bold text-lg">
                +200% Bonus
              </span>
            </div>
          </div>

          {/* ====== PLAY BUTTON ====== */}
          <button
            onClick={handlePlay}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              isHovered 
                ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-black shadow-lg shadow-yellow-500/50 scale-105' 
                : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400'
            }`}
          >
            <Play className={`w-6 h-6 ${isHovered ? 'fill-black' : ''}`} />
            <span>Play Now</span>
            <Zap className="w-5 h-5" />
          </button>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-500/50 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-500/50 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-500/50 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-500/50 rounded-br-xl" />
      </div>

      {/* ====== CSS ANIMATIONS ====== */}
      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

// Export the game data for use in lists
export { EARLY_SIX_GAME };