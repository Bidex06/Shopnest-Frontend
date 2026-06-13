import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('shopnest_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem('shopnest_token', data.token);
    localStorage.setItem('shopnest_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const { data } = await authApi.register(formData);
    localStorage.setItem('shopnest_token', data.token);
    localStorage.setItem('shopnest_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('shopnest_token');
    localStorage.removeItem('shopnest_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
