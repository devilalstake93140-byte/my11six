'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText, Users, AlertCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
                <p className="text-slate-400 text-sm">Last Updated: {currentDate}</p>
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
            <p className="text-slate-300 leading-relaxed">
              Welcome to Early Six IPL. We respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          {/* Section 1: Information We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">We may collect the following types of information:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li><span className="text-white">Personal Information:</span> Name, email address, username when you register</li>
                <li><span className="text-white">Transaction Data:</span> Deposit/withdrawal history, wallet balances, bet records</li>
                <li><span className="text-white">Technical Data:</span> IP address, browser type, device information, cookies</li>
                <li><span className="text-white">Usage Data:</span> Pages visited, features used, time spent on platform</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Usage of Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-white">2. Usage of Information</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">Your data is used to:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Provide and maintain account access</li>
                <li>Process deposits and withdrawals securely</li>
                <li>Manage betting transactions and results</li>
                <li>Send important notifications and updates</li>
                <li>Improve user experience and platform functionality</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Data Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-white">3. Data Security</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                We implement appropriate security measures to protect your data, including:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Encrypted data transmission (HTTPS/SSL)</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>Access controls and authentication</li>
                <li>Regular security assessments</li>
              </ul>
              <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-amber-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <strong>Important:</strong> While we implement robust security measures, no system is 100% secure. 
                  Users must also take precautions to protect their accounts.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Cookies */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">4. Cookies</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                We may use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Session management and authentication</li>
                <li>Remembering your preferences</li>
                <li>Analytics and performance tracking</li>
                <li>Security and fraud prevention</li>
              </ul>
              <p className="text-slate-400 text-sm mt-3">
                You can control cookie settings through your browser preferences.
              </p>
            </div>
          </section>

          {/* Section 5: Third-Party Services */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-white">5. Third-Party Services</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                We may use third-party services for:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Payment processing (cryptocurrency transactions)</li>
                <li>Analytics and user tracking</li>
                <li>Cloud hosting and storage</li>
                <li>Communication services</li>
              </ul>
              <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-slate-400 text-sm">
                  <strong className="text-white">Disclaimer:</strong> We are not responsible for the privacy practices 
                  or content of third-party services. Please review their privacy policies independently.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: User Responsibility */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">6. User Responsibility</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">You are responsible for:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Keeping your login credentials secure and confidential</li>
                <li>Using strong, unique passwords</li>
                <li>Logging out after using shared devices</li>
                <li>Reporting any unauthorized access immediately</li>
                <li>Providing accurate information during registration</li>
              </ul>
              <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-red-400 text-sm">
                  <strong>Warning:</strong> We are not responsible for unauthorized access resulting from 
                  user negligence, including sharing passwords or using weak security measures.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Data Retention */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">7. Data Retention</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                We retain your data for as long as your account is active or as needed to provide services. 
                Transaction records may be retained for longer periods for legal and regulatory compliance.
                You may request deletion of your account and associated data by contacting support.
              </p>
            </div>
          </section>

          {/* Section 8: Your Rights */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">8. Your Rights</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">You have the right to:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
              <p className="text-slate-400 text-sm mt-3">
                To exercise these rights, please contact our support team.
              </p>
            </div>
          </section>

          {/* Section 9: Changes to Policy */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">9. Changes to Policy</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                Significant changes will be communicated through:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Email notification to registered users</li>
                <li>Notice on our platform homepage</li>
                <li>Updated "Last Updated" date</li>
              </ul>
              <p className="text-slate-400 text-sm mt-3">
                We encourage you to review this policy periodically.
              </p>
            </div>
          </section>

          {/* Section 10: Contact */}
          <section className="space-y-4 border-t border-slate-800 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">10. Contact Us</h2>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 space-y-3">
              <p className="text-slate-300">
                For any questions, concerns, or requests regarding this Privacy Policy, please contact us:
              </p>
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <p className="text-white font-medium">Early Six IPL Support</p>
                <p className="text-amber-500">support@earlysixipl.com</p>
              </div>
              <p className="text-slate-400 text-sm mt-3">
                We aim to respond to all inquiries within 48 hours.
              </p>
            </div>
          </section>

          {/* Agreement Notice */}
          <div className="mt-8 p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-500 mt-0.5" />
              <div>
                <h3 className="text-amber-500 font-bold text-lg mb-2">Important Notice</h3>
                <p className="text-slate-300">
                  <strong>By using this platform, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.</strong>
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  If you do not agree to this policy, please do not use our services.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}