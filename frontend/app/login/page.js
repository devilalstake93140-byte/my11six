'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { authAPI } from '@/lib/api';
import { signInWithGoogle } from '@/lib/firebaseAuth';
import { Gamepad2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, checkAuth } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Check user role from login response
      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else {
        // Default redirect - will be handled by authContext
        router.push('/dashboard');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      // Sign in with Google using Firebase
      const googleResult = await signInWithGoogle();

      if (googleResult.success) {
        // Send to backend - will create account if doesn't exist
        const response = await authAPI.firebaseAuth({
          idToken: googleResult.idToken,
          email: googleResult.user.email,
          name: googleResult.user.name,
          uid: googleResult.user.uid,
          photoURL: googleResult.user.photoURL
        });

        if (response.data.success) {
          const { token, user: userData } = response.data.data;
          
          // Save token and user data
          const Cookies = (await import('js-cookie')).default;
          Cookies.set('token', token, { expires: 7 });
          
          // Save user to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
          }
          
          // Update auth context state
          await checkAuth();
          
          // Redirect based on role
          if (userData.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        } else {
          setError(response.data.message || 'Failed to authenticate with backend');
        }
      } else {
        setError(googleResult.error || 'Google sign-in failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('An error occurred during Google sign-in');
    }

    setGoogleLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-black" />
            </div>
            <span className="text-2xl font-bold text-gradient">My11Six</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to continue playing</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full pl-11 pr-12 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded bg-[#0a0a0a] border-[#2a2a2a]" />
              <span className="text-gray-400">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-amber-500 hover:text-amber-400">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>

        {/* Social Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white font-medium hover:border-amber-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Register Link */}
        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-amber-500 hover:text-amber-400 font-medium">
            Sign up
          </Link>
        </p>

        {/* Legal Links */}
        <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
          <p className="text-center text-gray-500 text-xs">
            By signing in, you agree to our{' '}
            <Link href="/terms-of-service" className="text-amber-500 hover:text-amber-400 underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy-policy" className="text-amber-500 hover:text-amber-400 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <Suspense fallback={<div className="w-full max-w-md p-8">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}