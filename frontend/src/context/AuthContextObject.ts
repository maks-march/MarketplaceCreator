import { createContext } from 'react';
import type { User } from '../services/api/users/users.types';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../services/api/auth/auth.types';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (request: LoginRequest) => Promise<{
    success: boolean;
    response?: LoginResponse;
    error?: string;
  }>;
  logout: () => Promise<void>;
  signup: (request: RegisterRequest
  ) => Promise<{
    success: boolean;
    response?: RegisterResponse;
    error?: string;
  }>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);