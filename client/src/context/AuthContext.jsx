import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, isLoggedIn, logoutUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔍 AuthProvider - Token:', token);
    console.log('🔍 AuthProvider - User Data:', userData);
    
    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log('✅ User set:', parsed);
        setUser(parsed);
      } catch (e) {
        console.error('❌ Error parsing user:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('🔑 Login called:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};