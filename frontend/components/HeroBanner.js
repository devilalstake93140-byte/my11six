'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Zap, ArrowRight, Star, Target, Cpu } from 'lucide-react';

export default function HeroBanner() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: `${Math.random() * 3}s`,
    size: Math.random() * 4 + 2,
  }));

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#061018]">
      {/* Stadium Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/90 via-[#0d1f3c]/80 to-[#061018]/95" />
        <div className="absolute top-0 left-1/4 w-96 h-[600px] bg-yellow-400/10 blur-[150px] animate-pulse" style={{ animationDuration: '2s' }} />
        <div className="absolute top-0 right-1/4 w-96 h-[600px] bg-yellow-400/10 blur-[150px] animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #4a5568 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent blur-sm" />
      </div>

      {/* Floating Particles */}
      {mounted && particles.map((particle) => (
        <div key={particle.id} className="absolute rounded-full bg-yellow-400/40 animate-pulse" style={{ left: `${particle.left}%`, top: `${particle.top}%`, width: `${particle.size}px`, height: `${particle.size}px`, animationDelay: particle.delay, boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)' }} />
      ))}

      {/* RIGHT SIDE - Animated Cricket Scene */}
      {mounted && (
        <div className="absolute right-0 top-0 hidden lg:block w-[55%] h-full pointer-events-none overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/50 to-transparent" />
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-yellow-500/15 rounded-full blur-[80px]" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-8 bg-black/50 rounded-full blur-xl" />

          {/* Batsman SVG */}
          <svg className="absolute bottom-20 right-20 w-48 h-72" viewBox="0 0 120 200">
            <defs>
              <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#d4a574" /><stop offset="100%" stopColor="#a67c52" /></linearGradient>
              <linearGradient id="jg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1e40af" /><stop offset="100%" stopColor="#1e3a8a" /></linearGradient>
              <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#fef3c7" /><stop offset="50%" stopColor="#fde68a" /><stop offset="100%" stopColor="#d4a574" /></linearGradient>
            </defs>
            <ellipse cx="60" cy="130" rx="22" ry="35" fill="url(#sg)" />
            <path d="M40 95 Q38 110 38 130 L38 155 Q38 165 50 165 L70 165 Q82 165 82 155 L82 130 Q82 110 80 95 Q70 92 60 92 Q50 92 40 95" fill="url(#jg)" />
            <text x="60" y="135" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">18</text>
            <path d="M50 160 Q45 180 42 195" stroke="url(#sg)" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M70 160 Q80 175 85 190" stroke="url(#sg)" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M45 100 Q25 95 15 75" stroke="url(#sg)" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M75 100 Q90 90 95 80" stroke="url(#sg)" strokeWidth="8" fill="none" strokeLinecap="round" />
            <g className="origin-left animate-bat-swing">
              <rect x="5" y="35" width="6" height="35" rx="2" fill="#451a03" transform="rotate(-20 8 52)" />
              <rect x="-5" y="5" width="22" height="55" rx="4" fill="url(#bg)" transform="rotate(-20 8 32)" />
              <rect x="-3" y="8" width="8" height="48" rx="2" fill="#fef9c3" opacity="0.4" transform="rotate(-20 8 32)" />
            </g>
            <circle cx="60" cy="65" r="16" fill="url(#sg)" />
            <path d="M42 60 Q42 42 60 40 Q78 42 78 60 Q78 70 72 72 L48 72 Q42 70 42 60" fill="#1e3a8a" />
            <path d="M48 58 Q48 50 60 48 Q72 50 72 58" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
            <line x1="52" y1="52" x2="52" y2="65" stroke="#94a3b8" strokeWidth="1" />
            <line x1="60" y1="50" x2="60" y2="65" stroke="#94a3b8" strokeWidth="1" />
            <line x1="68" y1="52" x2="68" y2="65" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="55" cy="62" r="2" fill="#1f2937" />
            <circle cx="65" cy="62" r="2" fill="#1f2937" />
          </svg>

          {/* Animated Ball */}
          <div className="absolute bottom-32 right-80 animate-ball-sequence">
            <div className="absolute -inset-3 bg-red-500/40 rounded-full blur-lg animate-ball-glow" />
            <div className="absolute top-1/2 -translate-y-1/2 -left-16 w-14 h-1.5 bg-gradient-to-l from-red-500/70 to-transparent rounded-full" />
            <div className="absolute top-1/2 -translate-y-1/2 -left-10 w-8 h-1 bg-gradient-to-l from-red-400/50 to-transparent rounded-full" />
            <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg" />
            <div className="absolute top-0.5 left-1 w-1.5 h-1 bg-white/50 rounded-full" />
          </div>

          {/* Impact Sparks */}
          <div className="absolute bottom-44 right-56 animate-spark-burst">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            <div className="absolute top-2 left-1 w-1 h-1 bg-white/70 rounded-full" />
            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-yellow-300 rounded-full" />
          </div>

          {/* SIX! Text */}
          <div className="absolute top-32 right-40 animate-six-appear">
            <span className="text-7xl font-black text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text drop-shadow-[0_0_30px_rgba(250,204,21,0.9)]">SIX!</span>
            <div className="absolute inset-0 text-7xl font-black text-yellow-400/40 blur-md">SIX!</div>
          </div>

          {/* Power Glow */}
          <div className="absolute bottom-44 right-52 w-32 h-32 bg-gradient-to-br from-yellow-500/40 to-orange-500/20 rounded-full blur-2xl animate-power-burst" />
        </div>
      )}

      {/* LEFT SIDE - Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`text-center lg:text-left transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40 rounded-full mb-6">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-lg tracking-wider">IPL 2026</span>
              <Star className="w-4 h-4 text-yellow-400/60" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2">
              <span className="text-white">IPL 2026</span>
            </h1>

            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 blur-lg opacity-50 animate-pulse" />
              <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
                <span className="text-transparent bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 bg-clip-text drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">BET EARLY,</span>
                <br />
                <span className="text-transparent bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 bg-clip-text animate-pulse drop-shadow-[0_0_20px_rgba(74,222,128,0.9)]">SIX YOU WIN!</span>
              </h2>
            </div>

            <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-lg mx-auto lg:mx-0">
              <span className="text-green-400 font-bold">Instant Payout</span> on First Six in 2 Overs
            </p>

            <div className="mb-4">
              <span className="text-2xl md:text-3xl font-bold">
                <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">200% Welcome Bonus</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-3 px-6 py-4 bg-[#0d1f3c] border-2 border-dashed border-green-500/50 rounded-xl mb-8">
              <span className="text-gray-400 font-medium">Code:</span>
              <span className="text-green-400 font-bold text-2xl tracking-wider">WELCOME200</span>
              <button onClick={() => navigator.clipboard.writeText('WELCOME200')} className="p-2 hover:bg-green-500/20 rounded-lg transition-colors">
                <Star className="w-5 h-5 text-green-400" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => router.push('/ipl-betting')} className="group relative px-10 py-5 bg-gradient-to-r from-green-500 via-yellow-500 to-green-500 text-black font-black text-xl rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(74,222,128,0.6)]" style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }}>
                <span className="relative z-10 flex items-center gap-3">
                  <Target className="w-6 h-6" />PLAY NOW<ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1f3c]/50 rounded-full"><Zap className="w-4 h-4 text-green-400" /><span>Instant Payouts</span></div>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1f3c]/50 rounded-full"><Cpu className="w-4 h-4 text-yellow-400" /><span>Live Betting</span></div>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1f3c]/50 rounded-full"><Star className="w-4 h-4 text-orange-400" /><span>200% Bonus</span></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ball-sequence {0%{right:80px;bottom:150px;transform:translateX(0) scale(1);opacity:0}10%{opacity:1}40%{right:280px;bottom:150px;transform:translateX(0) scale(1)}45%{transform:translateX(0) scale(1.3)}55%{right:350px;bottom:300px;transform:translateX(0) scale(0.8)}90%{opacity:1}100%{right:400px;bottom:400px;transform:translateX(0) scale(0.3);opacity:0}}
        .animate-ball-sequence {animation: ball-sequence 4s ease-in-out infinite}
        @keyframes ball-glow {0%,100%{opacity:0.5}50%{opacity:1}}
        .animate-ball-glow {animation: ball-glow 0.5s ease-in-out infinite}
        @keyframes bat-swing {0%,35%{transform:rotate(-20deg)}42%{transform:rotate(-60deg)}50%{transform:rotate(-20deg)}100%{transform:rotate(-20deg)}}
        .animate-bat-swing {transform-origin:8px 52px;animation:bat-swing 4s ease-in-out infinite}
        @keyframes spark-burst {0%,40%{opacity:0;transform:scale(0)}45%{opacity:1;transform:scale(1.5)}55%{opacity:0;transform:scale(2)}100%{opacity:0;transform:scale(0)}}
        .animate-spark-burst {animation:spark-burst 4s ease-in-out infinite}
        @keyframes six-appear {0%,50%{opacity:0;transform:scale(0.5) translateY(20px)}60%{opacity:1;transform:scale(1.2) translateY(0)}70%{transform:scale(1) translateY(0)}90%{opacity:1}100%{opacity:0;transform:scale(1)}}
        .animate-six-appear {animation:six-appear 4s ease-in-out infinite}
        @keyframes power-burst {0%,40%{opacity:0;transform:scale(0.5)}50%{opacity:1;transform:scale(1.5)}70%{opacity:0.5}100%{opacity:0;transform:scale(0.5)}}
        .animate-power-burst {animation:power-burst 4s ease-in-out infinite}
        @keyframes shimmer {0%{background-position:200%0}100%{background-position:-200%0}}
      `}</style>
    </section>
  );
}
