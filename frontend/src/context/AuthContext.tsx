import React, { useEffect, useMemo, useState } from 'react';
import type { LoginRequest } from '../services/api/auth/auth.types';
import { authApi, usersApi } from '../services/api';
import type { User as UiUser } from '../types/userTypes';
import { AuthContext } from './AuthContextObject';

type Role = 'user' | 'admin';
type StoredAuth = { user: UiUser; role: Role };

function readAuthFromStorage(): StoredAuth | null {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAuth> | null;
    if (!parsed?.user) return null;
    const role = parsed.role === 'admin' || parsed.role === 'user' ? parsed.role : null;
    if (!role) return null;
    return { user: parsed.user as UiUser, role };
  } catch {
    return null;
  }
}

function writeAuthToStorage(v: StoredAuth | null) {
  try {
    if (!v) localStorage.removeItem('auth');
    else localStorage.setItem('auth', JSON.stringify(v));
  } catch {}
}

function hasToken(): boolean {
  const t = localStorage.getItem('access_token');
  return !!t && t !== 'undefined' && t !== 'null';
}

function clearTokens() {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_role');
    localStorage.removeItem('auth');
  } catch {}
}

const mapMeToUiUser = (apiUser: any): UiUser => {
  // ВАЖНО: email должен приходить с /auth/me, иначе будет пусто
  return {
    id: String(apiUser.id ?? ''),
    login: String(apiUser.username ?? ''),
    password: '',
    email: String(apiUser.email ?? ''), // ✅
    name: String([apiUser.surname, apiUser.name, apiUser.patronymic].filter(Boolean).join(' ').trim()),
    role: apiUser.isAdmin ? 'Администратор' : 'Пользователь',
    dateCreated: String(apiUser.created ?? apiUser.createdAt ?? apiUser.сreated ?? ''),
    avatarUrl: String(apiUser.avatarUrl ?? '/vite.svg'),
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialAuth = useMemo(() => readAuthFromStorage(), []);
  const [user, setUser] = useState<UiUser | null>(() => initialAuth?.user ?? null);
  const [role, setRole] = useState<Role | null>(() => initialAuth?.role ?? null);
  const [initializing, setInitializing] = useState(true);

  const isAuthenticated = !!user && !!role;

  // ✅ bootstrap из токена: после F5/переходов контекст должен восстановиться
  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        if (!hasToken()) {
          if (mounted) {
            setInitializing(false);
          }
          return;
        }

        const me = await authApi.getMe();
        if (!me.success || !me.response) {
          clearTokens();
          if (mounted) {
            setUser(null);
            setRole(null);
          }
          return;
        }

        const apiUser = me.response as any;
        const nextRole: Role = apiUser.isAdmin ? 'admin' : 'user';

        // записываем роль для UI, но guards всё равно будут опираться на контекст
        localStorage.setItem('current_role', nextRole);

        const uiUser = mapMeToUiUser(apiUser);
        if (mounted) {
          setUser(uiUser);
          setRole(nextRole);
          writeAuthToStorage({ user: uiUser, role: nextRole });
        }
      } finally {
        if (mounted) setInitializing(false);
      }
    };

    boot();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (loginOrEmail: string, password: string, expectedRole: Role): Promise<boolean> => {
    const credentials: LoginRequest = { emailOrUsername: loginOrEmail, password };
    const result = await authApi.login(credentials);
    if (!result.success) return false;

    // ✅ выясняем реальную роль через backend
    const me = await authApi.getMe();
    if (!me.success || !me.response) {
      clearTokens();
      setUser(null);
      setRole(null);
      return false;
    }

    const apiUser = me.response as any;
    const actualRole: Role = apiUser.isAdmin ? 'admin' : 'user';

    // ✅ запрет “входа не на той странице”
    // /admin/login должен впускать только admin, /login только user
    if (actualRole !== expectedRole) {
      // чистим токены, чтобы не получилось “залогинился не туда, но токен остался”
      await authApi.logout().catch(() => {});
      clearTokens();
      setUser(null);
      setRole(null);
      return false;
    }

    localStorage.setItem('current_role', actualRole);

    const uiUser = mapMeToUiUser(apiUser);
    setUser(uiUser);
    setRole(actualRole);
    writeAuthToStorage({ user: uiUser, role: actualRole });
    return true;
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      clearTokens();
      setUser(null);
      setRole(null);
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
    const payload = {
      email: email.trim(),
      username: loginValue.trim(),
      password,
      name: firstName.trim(),
      surname: lastName.trim(),
      patronymic: patronymic?.trim() || undefined,
    };

    const res = await authApi.register(payload as any);
    if (!res.success) return false;

    // после регистрации — логиним как user
    return await login(payload.username, password, 'user');
  };

  const updateProfile = async (patch: Partial<UiUser> & { avatarUrl?: string; password?: string }) => {
    // UI -> API
    const fio = (patch.name ?? '').trim();
    const parts = fio.split(' ').filter(Boolean);
    const surname = parts[0] ?? '';
    const name = parts[1] ?? '';
    const patronymic = parts.slice(2).join(' ').trim();

    const payload: any = {
      ...(patch.login ? { username: patch.login } : {}),
      ...(patch.email ? { email: patch.email } : {}),
      ...(surname ? { surname } : {}),
      ...(name ? { name } : {}),
      ...(patronymic ? { patronymic } : {}),
      ...(patch.password ? { password: patch.password } : {}),
      // avatarUrl только если это не blob:
      ...(patch.avatarUrl && !patch.avatarUrl.startsWith('blob:') ? { avatarUrl: patch.avatarUrl } : {}),
    };

    const upd = await usersApi.updateMe(payload);
    if (!upd.success) {
      throw new Error((upd.errors && upd.errors[0]) || 'Не удалось обновить профиль');
    }

    // после успешного обновления — подтягиваем актуальные данные
    const me = await authApi.getMe();
    if (!me.success || !me.response) {
      throw new Error('Профиль обновлён, но не удалось получить актуальные данные');
    }

    const apiUser = me.response as any;
    const nextRole: Role = apiUser.isAdmin ? 'admin' : 'user';
    const uiUser = mapMeToUiUser(apiUser);

    setUser(uiUser);
    setRole(nextRole);
    try {
      localStorage.setItem('current_role', nextRole);
      localStorage.setItem('auth', JSON.stringify({ user: uiUser, role: nextRole } satisfies StoredAuth));
    } catch {}
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
        // доп. поле: если у вас тип AuthContextValue не содержит initializing — не добавляйте наружу
      }}
    >
      {/* ✅ пока bootstrapping — не рендерим guards/роуты, чтобы не было ложных редиректов */}
      {initializing ? <div style={{ padding: 16 }}>Loading...</div> : children}
    </AuthContext.Provider>
  );
};