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
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);