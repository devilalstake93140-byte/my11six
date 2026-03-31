/**
 * API Client
 * Handles all API calls to the backend
 */

import axios from 'axios';
import Cookies from 'js-cookie';
import { getClientTimeZone, getClientTimezoneOffsetMinutes } from './time';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log all requests
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    const token = Cookies.get('token');
    const clientTimeZone = getClientTimeZone();
    const clientTimezoneOffsetMinutes = getClientTimezoneOffsetMinutes();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (clientTimeZone) {
      config.headers['x-timezone'] = clientTimeZone;
    }
    config.headers['x-timezone-offset'] = String(clientTimezoneOffsetMinutes);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Log all responses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('API Error:', error.response?.status, error.response?.data);
    // DO NOT auto-logout on 401 - let the calling component handle the error
    // Only logout if explicitly needed, not on every 401
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  googleAuth: () => api.get('/auth/google'),
  firebaseAuth: (data) => api.post('/auth/firebase', data),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/password', data),
  getActivity: (params) => api.get('/users/activity', { params }),
  submitKYC: (data) => api.post('/users/kyc', data),
  getKYCStatus: () => api.get('/users/kyc/status'),
};

// Game API
export const gameAPI = {
  getAll: (params) => api.get('/games', { params }),
  getPopular: (params) => api.get('/games/popular', { params }),
  getFeatured: () => api.get('/games/featured'),
  getCategories: () => api.get('/games/categories'),
  getById: (id) => api.get(`/games/${id}`),
};

// Wallet API
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  deposit: (data) => api.post('/wallet/deposit', data),
  withdraw: (data) => api.post('/wallet/withdraw', data),
  transfer: (data) => api.post('/wallet/transfer', data),
};

// Deposit API
export const depositAPI = {
  createRequest: (data) => api.post('/deposits/request', data),
  getMyRequests: () => api.get('/deposits/my-requests'),
  getAddresses: () => api.get('/deposits/addresses'),
  getMinDeposit: () => api.get('/deposits/min-deposit'),
};

// Transaction API
export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  gamePlay: (data) => api.post('/transactions/game-play', data),
  gameWin: (data) => api.post('/transactions/game-win', data),
};

// Betting API (Early Six IPL)
export const bettingAPI = {
  getMatches: (params) => api.get('/matches', { params }),
  getLiveMatches: () => api.get('/matches/live'),
  getUpcomingMatches: () => api.get('/matches/upcoming'),
  getMatchById: (id) => api.get(`/matches/${id}`),
  seedMatches: () => api.post('/matches/seed'),
  placeBet: (data) => api.post('/bets', data),
  getMyBets: (params) => api.get('/bets', { params }),
  getBetStats: () => api.get('/bets/stats'),
  getBetsByMatch: (matchId) => api.get(`/bets/match/${matchId}`),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  adjustUserBalance: (id, data) => api.post(`/admin/users/${id}/adjust-balance`, data),
  
  // Deposits
  getDeposits: (params) => api.get('/admin/deposits', { params }),
  manageDeposit: (id, status) => api.put(`/admin/deposits/${id}`, { status }),
  
  // Withdrawals
  getWithdrawals: (params) => api.get('/admin/withdrawals', { params }),
  manageWithdrawal: (id, status) => api.put(`/admin/withdrawals/${id}`, { status }),
  
  // Matches
  createMatch: (data) => api.post('/admin/matches', data),
  updateMatch: (id, data) => api.put(`/admin/matches/${id}`, data),
  deleteMatch: (id) => api.delete(`/admin/matches/${id}`),
  updateMatchStatus: (id, status) => api.put(`/admin/matches/${id}/status`, { status }),
  settleMatch: (id, winner) => api.put(`/admin/matches/${id}/settle`, { winner }),
  seedMatches: () => api.post('/admin/matches/seed'),
  
  // Bets
  getBets: (params) => api.get('/admin/bets', { params }),
  
  // Promo Codes
  getPromoCodes: (params) => api.get('/admin/promo-codes', { params }),
  createPromoCode: (data) => api.post('/admin/promo-codes', data),
  updatePromoCode: (id, data) => api.put(`/admin/promo-codes/${id}`, data),
  deletePromoCode: (id) => api.delete(`/admin/promo-codes/${id}`),
  
  // Wallet Settings
  getDepositSettings: () => api.get('/admin/deposit-settings'),
  updateDepositAddresses: (data) => api.put('/admin/deposit-settings', data),
};

// Settings API (public)
export const settingsAPI = {
  getDepositAddresses: () => api.get('/settings/deposit-address'),
  getMinDeposit: () => api.get('/settings/min-deposit'),
};

export default api;