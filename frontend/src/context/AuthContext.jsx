import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        const parsed = JSON.parse(storedUser);
        if (parsed && typeof parsed.role === 'object' && parsed.role?.name) {
          parsed.role = parsed.role.name;
        }
        setUser(parsed);
      }
    } catch (e) {
      console.error("Failed to parse stored user session", e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    const normalizedUser = {
      ...userData,
      role: typeof userData?.role === 'object' ? (userData.role?.name || "") : (userData?.role || "")
    };
    setUser(normalizedUser);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    const userRole = (typeof user.role === "string" ? user.role : (user.role?.name || "")).toLowerCase();
    return roles.map(r => r.toLowerCase()).includes(userRole);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
