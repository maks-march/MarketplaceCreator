import { createContext } from 'react';
import type { User } from '../services/api/users/users.types';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (emailOrUsername: string, password: string) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }>;
  logout: () => Promise<void>;
  signup: (
    email: string,
    name: string,
    surname: string,
    patronymic: string,
    username: string,
    password: string
  ) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);