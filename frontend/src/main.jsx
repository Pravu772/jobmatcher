import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import axios from 'axios';
import { SpeedInsights } from '@vercel/speed-insights/react';

// ── Axios Base Configuration ──────────────────────────────────────────────────
// In production (Vercel), VITE_API_BASE_URL points to the Render backend.
// In local dev, it's empty so the Vite proxy (/api → localhost:5000) is used.
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';
axios.defaults.withCredentials = true;

// ── Request Interceptor ───────────────────────────────────────────────────────
// Attach JWT token to requests ONLY when a valid token exists in localStorage.
// This prevents "Authorization: Bearer null" from being sent on public routes
// (e.g. /forgot-password, /reset-password/:token) when the user is logged out.
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────────────────
// Silently handle 401 responses from /api/auth/me (session check on mount).
// Without this, the AuthContext useEffect throws an uncaught 401 that can
// interfere with page rendering when a logged-out user visits a public route
// like /reset-password/:token via an email link.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only suppress 401 from the session-check endpoint — all other 401s
    // (e.g. from protected API routes) should still propagate normally.
    if (
      error.response?.status === 401 &&
      error.config?.url?.includes('/api/auth/me')
    ) {
      // Clear any stale token silently
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      // Return a resolved promise with a "not logged in" shape so AuthContext
      // catches nothing and simply sets user to null.
      return Promise.resolve({ data: { user: null } });
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
  </React.StrictMode>
);
