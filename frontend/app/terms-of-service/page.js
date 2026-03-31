'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, Users, Gavel, Shield } from 'lucide-react';

export default function TermsOfServicePage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="bg-[#111827] border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-amber-500" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Scale className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
                <p className="text-slate-400 text-sm">Effective Date: {currentDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-8">
          
          {/* Introduction */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Welcome to Early Six IPL ("we," "our," or "us"). By accessing or using our platform, you agree to be bound by 
              these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
            </p>
            <p className="text-slate-300 leading-relaxed">
              These Terms constitute a legally binding agreement between you and Early Six IPL regarding your use of our 
              prediction gaming platform. By creating an account or using our services, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms.
            </p>
          </section>

          {/* Section 2: Eligibility */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-white">2. Eligibility</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">To use our platform, you must:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Be at least 18 years of age</li>
                <li>Have a valid email address</li>
                <li>Not be prohibited from using our services by applicable law</li>
                <li>Not have previously been banned from our platform</li>
                <li>Have full legal capacity to enter into these Terms</li>
              </ul>
              <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-amber-400 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <strong>Note:</strong> Users from jurisdictions where prediction gaming is prohibited may not use our platform.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Account Registration */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-white">3. Account Registration</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">When you create an account:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>You agree to provide accurate and complete information</li>
                <li>You are responsible for maintaining the confidentiality of your credentials</li>
                <li>You must notify us immediately of any unauthorized access</li>
                <li>One person/entity may not maintain multiple accounts</li>
                <li>You authorize us to process transactions in your account</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Prediction Gaming */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">4. Prediction Gaming Rules</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">Our prediction gaming platform operates under the following rules:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li><span className="text-white">Minimum Bet:</span> ₹10 or equivalent in USDT</li>
                <li><span className="text-white">Maximum Bet:</span> ₹500 or equivalent in USDT per match</li>
                <li><span className="text-white">Odds:</span> Determined by admin, typically 1.5x to 3.0x</li>
                <li><span className="text-white">Win Calculation:</span> Stake × Odds = Win Amount</li>
                <li><span className="text-white">One Bet Per User:</span> Only one prediction per match is allowed</li>
                <li><span className="text-white">Betting Close:</span> When match goes live, betting is disabled</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-blue-400 text-sm">
                  <strong>Important:</strong> Once a bet is placed, it cannot be cancelled or modified. 
                  Please verify your selection before confirming.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Wallet and Transactions */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">5. Wallet and Transactions</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">Regarding deposits, withdrawals, and wallet balance:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li><span className="text-white">Deposits:</span> Cryptocurrency (USDT) or mock INR deposits for demo</li>
                <li><span className="text-white">Minimum Deposit:</span> ₹25 or ₮25 equivalent</li>
                <li><span className="text-white">Minimum Withdrawal:</span> ₮50 (USDT only)</li>
                <li><span className="text-white">Maximum Withdrawal:</span> ₮1,000 per request</li>
                <li><span className="text-white">Processing Time:</span> Deposits instant, withdrawals require admin approval</li>
                <li><span className="text-white">Withdrawal Review:</span> 24-48 hours for approval</li>
              </ul>
              <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-slate-400 text-sm">
                  <strong className="text-white">Disclaimer:</strong> This is a prediction gaming platform for entertainment purposes. 
                  All deposits are final. We are not responsible for losses incurred through gameplay.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Prohibited Activities */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Gavel className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white">6. Prohibited Activities</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">You agree NOT to:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Use the platform for any illegal purposes</li>
                <li>Create multiple accounts or exploit referral systems</li>
                <li>Use automated bots, scripts, or unfair advantages</li>
                <li>Manipulate match results or collude with others</li>
                <li>Attempt to hack, exploit, or interfere with our systems</li>
                <li>Harass, abuse, or threaten other users or staff</li>
                <li>Use the platform if legally prohibited in your jurisdiction</li>
                <li>Transfer your account or share credentials with others</li>
              </ul>
              <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-red-400 text-sm">
                  <strong>Violation:</strong> Any prohibited activity may result in account suspension, 
                  forfeiture of balance, and/or legal action.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Intellectual Property */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-500" />
              </div>
              <h2 className="text-xl font-bold text-white">7. Intellectual Property</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                All content, designs, logos, trademarks, and software on our platform are the exclusive property of 
                Early Six IPL or its licensors. You may not:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Copy, reproduce, or distribute our content without permission</li>
                <li>Use our branding for commercial purposes</li>
                <li>Reverse engineer or decompile our software</li>
                <li>Remove or alter copyright notices</li>
              </ul>
            </div>
          </section>

          {/* Section 8: Limitation of Liability */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">8. Limitation of Liability</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                To the maximum extent permitted by law, Early Six IPL shall not be liable for:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Any direct, indirect, incidental, or consequential damages</li>
                <li>Loss of data, profits, or business opportunities</li>
                <li>Errors, bugs, or interruptions in service</li>
                <li>Unauthorized access to your account (unless due to our negligence)</li>
                <li>Actions of other users or third parties</li>
              </ul>
              <p className="text-slate-400 text-sm mt-3">
                Our total liability shall not exceed the amount you have deposited with us in the past 30 days.
              </p>
            </div>
          </section>

          {/* Section 9: Indemnification */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-500" />
              </div>
              <h2 className="text-xl font-bold text-white">9. Indemnification</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                You agree to indemnify and hold harmless Early Six IPL, its officers, directors, employees, and agents 
                from any claims, damages, losses, or expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Your use of the platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of a third party</li>
                <li>Your conduct or actions on the platform</li>
              </ul>
            </div>
          </section>

          {/* Section 10: Account Suspension/Termination */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">10. Account Suspension & Termination</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">We reserve the right to:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Suspend or terminate accounts that violate these Terms</li>
                <li>Freeze or confiscate balances of suspended accounts</li>
                <li>Cancel suspicious or fraudulent transactions</li>
                <li>Require additional verification at any time</li>
                <li>Terminate accounts in jurisdictions where gaming is illegal</li>
              </ul>
              <p className="text-slate-400 text-sm mt-3">
                Users may request account deletion by contacting support. Remaining balance will be returned 
                after verification, subject to withdrawal limits.
              </p>
            </div>
          </section>

          {/* Section 11: Changes to Terms */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">11. Modifications to Terms</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                We may modify these Terms at any time. Changes will be communicated via:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Email notification to registered users</li>
                <li>Notice on our platform homepage</li>
                <li>Updated "Effective Date" at the top of this page</li>
              </ul>
              <p className="text-slate-400 text-sm mt-3">
                Continued use of our platform after changes constitutes acceptance of the modified Terms.
              </p>
            </div>
          </section>

          {/* Section 12: Dispute Resolution */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">12. Dispute Resolution</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                Any disputes arising from these Terms or your use of the platform shall be resolved as follows:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li><span className="text-white">Step 1:</span> Contact our support team for resolution</li>
                <li><span className="text-white">Step 2:</span> Attempt good-faith negotiation (30 days)</li>
                <li><span className="text-white">Step 3:</span> Binding arbitration under applicable law</li>
              </ul>
              <p className="text-slate-400 text-sm mt-3">
                These Terms shall be governed by the laws of the jurisdiction where our company is registered.
              </p>
            </div>
          </section>

          {/* Section 13: Contact Information */}
          <section className="space-y-4 border-t border-slate-800 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">13. Contact Information</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                For questions regarding these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <p className="text-white font-medium">Early Six IPL - Legal Department</p>
                <p className="text-amber-500">legal@earlysixipl.com</p>
              </div>
            </div>
          </section>

          {/* Agreement Notice */}
          <div className="mt-8 p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 mt-0.5" />
              <div>
                <h3 className="text-amber-500 font-bold text-lg mb-2">Agreement to Terms</h3>
                <p className="text-slate-300">
                  <strong>By creating an account or using our services, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms of Service and our Privacy Policy.</strong>
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  If you do not agree to these Terms, please do not use our platform.
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <Link 
                    href="/privacy-policy" 
                    className="text-amber-500 hover:text-amber-400 text-sm underline"
                  >
                    View Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}