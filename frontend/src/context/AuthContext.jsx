import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set axios to always send credentials (cookies)
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await axios.get('/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
