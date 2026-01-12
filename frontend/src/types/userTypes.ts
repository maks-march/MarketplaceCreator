export type UserRoleLabel = 'Администратор' | 'Пользователь';

export interface User {
  id: string;
  login: string;
  password: string;
  email: string;
  name: string;
  role: UserRoleLabel;
  dateCreated: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: 'user' | 'admin' | null;
}