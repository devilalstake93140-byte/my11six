'use client';

import { useState } from 'react';
import KYCModal from './KYCModal';

export default function KYCPrompt({ onVerified }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* KYC Prompt Banner */}
      <div className="relative bg-gradient-to-r from-green-900/30 via-emerald-900/30 to-green-900/30 border border-green-500/40 rounded-2xl p-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Side - Icon and Text */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {/* Animated Ring */}
              <div className="absolute inset-0 border-2 border-green-400/50 rounded-2xl animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Complete Your KYC
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Recommended</span>
              </h3>
              <p className="text-slate-400 text-sm mt-1">Verify your identity to unlock all platform features</p>
            </div>
          </div>
          
          {/* Right Side - Button */}
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verify Now
          </button>
        </div>
        
        {/* Benefits Row */}
        <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-green-500/20">
          {[
            { icon: '✓', text: 'Full Access', color: 'text-green-400' },
            { icon: '✓', text: 'Higher Limits', color: 'text-green-400' },
            { icon: '✓', text: 'Trusted Badge', color: 'text-green-400' },
            { icon: '✓', text: 'Priority Support', color: 'text-green-400' }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-1.5 text-sm">
              <span className={item.color}>{item.icon}</span>
              <span className="text-slate-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KYC Modal */}
      <KYCModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onVerified={onVerified}
      />
    </>
  );
}