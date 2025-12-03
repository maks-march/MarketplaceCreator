export interface User {
    id: string;
    login: string;
    password: string;
    email: string;
    name: string;
    role: 'Пользователь' | 'Администратор';
    dateCreated: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    role: 'user' | 'admin' | null;
  }