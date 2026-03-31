'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from './api';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // First, check localStorage for cached user (instant)
      if (typeof window !== 'undefined') {
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }
      }

      // Then verify token with backend
      const token = Cookies.get('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.getMe();
      let userData = response.data.data.user;
      
      // Check for KYC status from localStorage (for UI-based verification)
      if (typeof window !== 'undefined') {
        const kycVerified = localStorage.getItem('kycVerified');
        if (kycVerified === 'true' && !userData.isVerified) {
          userData = { ...userData, isVerified: true };
        }
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      setUser(userData);
    } catch (err) {
      console.error('Auth check failed:', err);
      // Clear token on auth failure
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data (for balance updates)
  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.data.user);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  // Update user balance locally (instant update)
  const updateBalance = (newBalance) => {
    if (user) {
      setUser({ ...user, balance: newBalance });
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      let { token, user: userData } = response.data.data;
      
      Cookies.set('token', token, { expires: 7 });
      
      // Always save user to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      console.log('Attempting registration with:', { name, email });
      const response = await authAPI.register({ name, email, password });
      console.log('Registration response:', response.data);
      
      const { token, user: userData } = response.data.data;
      
      Cookies.set('token', token, { expires: 7 });
      
      // Always save user to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
    refreshUser,
    updateBalance,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;