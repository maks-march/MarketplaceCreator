import React, { useMemo, useState } from 'react';
import type { User } from '../types/userTypes';
import { AuthContext } from './AuthContextObject';

// ✅ подключаем реальный API
import { authApi } from '../services/api/auth/auth.api';
import { usersApi } from '../services/api/users/users.api';
import type { LoginRequest, RegisterRequest } from '../services/api/auth/auth.types';

type Role = 'user' | 'admin';

type StoredAuth = {
  user: User;
  role: Role;
};

// Безопасно читаем localStorage
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
    return null;
  }
}

function writeAuthToStorage(value: StoredAuth | null) {
  try {
    if (!value) {
      localStorage.removeItem('auth');
      return;
    }
    localStorage.setItem('auth', JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialAuth = useMemo(() => readAuthFromStorage(), []);
  const [user, setUser] = useState<User | null>(() => initialAuth?.user ?? null);
  const [role, setRole] = useState<Role | null>(() => initialAuth?.role ?? null);

  const isAuthenticated = !!user && !!role;

  const login = async (loginOrEmail: string, password: string, userRole: Role): Promise<boolean> => {
    const credentials: LoginRequest = { emailOrUsername: loginOrEmail, password };

    const result = await authApi.login(credentials);

    if (!result.success) return false;

    // authApi.loginAsync возвращает user из backend DTO,
    // но ваш фронтовый тип User = types/userTypes.ts (id: string, login, roleLabel, etc)
    // Поэтому берём всё, что возможно, и делаем "безопасное" приведение.
    const meResult = await authApi.getMe();
    if (!meResult.success) return false;

    const apiUser = meResult.response as any;

    // Приведение к вашему UI-типу User
    const uiUser: User = {
      id: String(apiUser.id ?? apiUser.userId ?? ''),
      login: String(apiUser.username ?? apiUser.login ?? loginOrEmail),
      password: '', // пароль не храним
      email: String(apiUser.email ?? ''),
      name: String([apiUser.name, apiUser.surname, apiUser.patronymic].filter(Boolean).join(' ') || apiUser.name || ''),
      role: apiUser.isAdmin ? 'Администратор' : 'Пользователь',
      dateCreated: String(apiUser.created ?? apiUser.dateCreated ?? ''),
      avatarUrl: String(apiUser.avatarUrl ?? '/vite.svg'),
    };

    setUser(uiUser);
    setRole(userRole);
    writeAuthToStorage({ user: uiUser, role: userRole });
    return true;
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setRole(null);
      writeAuthToStorage(null);
    }
  };

  const signup = async (
    email: string,
    lastName: string,
    firstName: string,
    patronymic: string,
    loginValue: string,
    password: string
  ): Promise<boolean> => {
    const payload: RegisterRequest = {
      email: email.trim(),
      username: loginValue.trim(),
      password,
      name: firstName.trim(),
      surname: lastName.trim(),
      patronymic: patronymic?.trim() || undefined,
    };

    const result = await authApi.register(payload);
    if (!result.success) return false;

    // после регистрации можно залогинить автоматически
    return await login(payload.username, password, 'user');
  };

  const updateProfile = async (payload: any) => {
    const res: any = await usersApi.updateMe(payload);
    if (!res?.success) {
      const msg = (res?.errors && res.errors[0]) || 'Не удалось обновить профиль';
      throw new Error(msg);
    }

    const me: any = await usersApi.me();
    if (me?.success) {
      setUser(me.response ?? me.data ?? me.response?.user ?? null);
      setIsAuthenticated(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
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