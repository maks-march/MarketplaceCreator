import React, { createContext, useContext, useEffect, useState } from 'react';

type Role = 'admin' | 'user' | null;

type AuthContextType = {
  role: Role;
  isAuthenticated: boolean;
  login: (role: Exclude<Role, null>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const stored = localStorage.getItem('app_role');
    if (stored === 'admin' || stored === 'user') setRole(stored);
  }, []);

  const login = (r: Exclude<Role, null>) => {
    setRole(r);
    localStorage.setItem('app_role', r);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('app_role');
  };

  return (
    <AuthContext.Provider value={{ role, isAuthenticated: !!role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
