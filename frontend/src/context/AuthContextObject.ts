import { createContext } from 'react';
import type { User } from '../types/userTypes';

type Role = 'user' | 'admin';

export interface AuthContextValue {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (loginOrEmail: string, password: string, role: Role) => boolean;
  logout: () => void;
  signup: (
    email: string,
    lastName: string,
    firstName: string,
    patronymic: string,
    loginValue: string,
    password: string
  ) => boolean;

  // ✅ NEW: обновление профиля (имя/аватар/почта/логин и т.д.)
  updateProfile: (patch: Partial<User> & { avatarUrl?: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);