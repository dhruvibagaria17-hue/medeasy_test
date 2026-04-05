import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('medeasy_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('medeasy_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medeasy_user');
  };

  const validatePassword = (password) => {
    const minLength = 12;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    
    if (password.length < minLength) return "Password must be at least 12 characters long";
    if (!hasSymbol) return "Password must contain at least one symbol";
    if (!hasUpper) return "Password must contain at least one capital letter";
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, validatePassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
