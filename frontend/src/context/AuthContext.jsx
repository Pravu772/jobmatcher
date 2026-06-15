import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Auth context for managing user session
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount.
  // This calls GET /api/auth/me — if the user is logged out (e.g. visiting
  // /reset-password/:token from email), the request interceptor in main.jsx
  // suppresses the 401 and returns { data: { user: null } } so this never throws.
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        // res.data.user is null when logged out (handled by response interceptor)
        setUser(res.data.user || null);
      } catch (err) {
        // Fallback: any unexpected error clears the session
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    }
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    }
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
    } catch (err) {
      // Ignore logout errors — always clear local state
    }
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
