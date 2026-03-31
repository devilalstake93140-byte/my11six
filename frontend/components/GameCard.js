'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star } from 'lucide-react';

export default function GameCard({ game, onPlay }) {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = (e) => {
    e.preventDefault();
    if (onPlay) {
      onPlay(game);
    }
  };

  return (
    <div
      className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-amber-500/50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={game.image || '/images/game-placeholder.jpg'}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />

        {/* Play Button */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handlePlay}
            className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center transform hover:scale-110 transition-transform shadow-lg shadow-amber-500/30"
          >
            <Play className="w-6 h-6 text-black ml-1" fill="black" />
          </button>
        </div>

        {/* Featured Badge */}
        {game.isFeatured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-black text-xs font-bold rounded">
            FEATURED
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded">
          {game.categoryName || game.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-amber-500 transition-colors">
            {game.title}
          </h3>
          {game.popularityScore > 0 && (
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4" fill="currentColor" />
              <span className="text-sm font-medium">{game.popularityScore}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
          {game.description || 'Play and win exciting rewards!'}
        </p>

        {/* Bet Range */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Min: <span className="text-gray-300">₹{game.minBet}</span>
          </span>
          <span className="text-gray-500">
            Max: <span className="text-gray-300">₹{game.maxBet}</span>
          </span>
        </div>
      </div>
    </div>
  );
}