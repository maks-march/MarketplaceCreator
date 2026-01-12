import React, { useMemo, useState, createContext, useContext } from 'react';
import type { User } from '../types/userTypes';
import { MOCK_USERS } from '../utils/mockData';
import { AuthContext } from '../context/AuthContextObject';

type Role = 'user' | 'admin';

type StoredAuth = {
  user: User;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (loginOrEmail: string, password: string, userRole: Role) => boolean;
  logout: () => void;
  signup: (
    email: string,
    lastName: string,
    firstName: string,
    patronymic: string,
    loginValue: string,
    password: string
  ) => boolean;
  updateProfile: (patch: Partial<User> & { avatarUrl?: string }) => void;
};

// ✅ Безопасно читаем localStorage (не падаем на битом JSON)
function readAuthFromStorage(): StoredAuth | null {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return null; // Было обрезано, восстановлено

    const parsed = JSON.parse(raw) as Partial<StoredAuth> | null;
    if (!parsed || !parsed.user) return null; // Было обрезано, восстановлено

    const role = parsed.role === 'admin' || parsed.role === 'user' ? parsed.role : null;
    if (!role) return null; // Было обрезано, восстановлено

    return { user: parsed.user as User, role };
  } catch {
    return null;
  }
}

// ✅ Безопасно пишем localStorage
function writeAuthToStorage(value: StoredAuth) {
  try {
    localStorage.setItem('auth', JSON.stringify(value));
  } catch {}
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => [...MOCK_USERS]);

  const initialAuth = useMemo(() => readAuthFromStorage(), []);

  const [user, setUser] = useState<User | null>(() => initialAuth?.user ?? null);
  const [role, setRole] = useState<Role | null>(() => initialAuth?.role ?? null);

  const login = (loginOrEmail: string, password: string, userRole: Role): boolean => {
    const foundUser = users.find(
      (u) =>
        (u.login === loginOrEmail || u.email === loginOrEmail) &&
        u.password === password &&
        (userRole === 'admin' ? u.role === 'Администратор' : u.role === 'Пользователь')
    );

    if (!foundUser) return false;

    setUser(foundUser);
    setRole(userRole);
    writeAuthToStorage({ user: foundUser, role: userRole });
    return true;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    try {
      localStorage.removeItem('auth');
    } catch {}
  };

  const signup = (
    email: string,
    lastName: string,
    firstName: string,
    patronymic: string,
    loginValue: string,
    password: string
  ): boolean => {
    const exists = users.some((u) => u.login === loginValue || u.email === email);
    if (exists) return false;

    const newUser: User = {
      id: String(users.length + 1),
      login: loginValue,
      password,
      email,
      name: `${lastName} ${firstName} ${patronymic}`.trim(),
      role: 'Пользователь',
      dateCreated: new Date().toLocaleDateString('ru-RU'),
    };

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setRole('user');
    writeAuthToStorage({ user: newUser, role: 'user' });
    return true;
  };

  const updateProfile = async (patch: Partial<User> & { avatarUrl?: string }) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch } as User;
      
      setUsers((uPrev) => uPrev.map((u) => (u.id === prev.id ? next : u)));
      
      const safeRole = role ?? (prev.role === 'Администратор' ? 'admin' : 'user');
      writeAuthToStorage({ user: next, role: safeRole });

      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
