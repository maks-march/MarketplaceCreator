import React, { useMemo, useState } from 'react';
import type { User } from '../types/userTypes';
import { MOCK_USERS } from '../utils/mockData';
import { AuthContext } from './AuthContextObject';

type Role = 'user' | 'admin';

type StoredAuth = {
  user: User;
  role: Role;
};

// ✅ Безопасно читаем localStorage (не падаем на битом JSON)
function readAuthFromStorage(): StoredAuth | null {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredAuth> | null;
    if (!parsed || !parsed.user) return null;

    const role = parsed.role === 'admin' || parsed.role === 'user' ? parsed.role : null;
    if (!role) return null;

    return { user: parsed.user as User, role };
  } catch {
    try {
      localStorage.removeItem('auth');
    } catch {
      // ignore
    }
    return null;
  }
}

// ✅ Безопасно пишем localStorage
function writeAuthToStorage(value: StoredAuth) {
  try {
    localStorage.setItem('auth', JSON.stringify(value));
  } catch {
    // ignore
  }
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
    } catch {
      // ignore
    }
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

      // обновляем users[] (моки) в рамках текущей сессии
      setUsers((uPrev) => uPrev.map((u) => (u.id === prev.id ? next : u)));

      // ✅ если role null (редкий кейс), восстанавливаем из prev.user.role
      const safeRole: Role =
        role ??
        (prev.role === 'Администратор' ? 'admin' : 'user');

      setRole(safeRole);
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