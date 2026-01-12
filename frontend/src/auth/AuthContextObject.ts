import { createContext } from 'react';
import type { User } from '../types/userTypes';

export type Role = 'user' | 'admin';

export type AuthContextType = {
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
  updateProfile: (patch: Partial<User>) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);