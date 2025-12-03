import { useState } from 'react';
import type { User } from '../types/userTypes';
import { MOCK_USERS } from '../utils/mockData';
import { AuthContext } from './AuthContextObject';

type Role = 'user' | 'admin';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // локальная копия моков вместо мутации import'а
  const [users, setUsers] = useState<User[]>(() => [...MOCK_USERS]);
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('auth');
    return raw ? (JSON.parse(raw).user as User) : null;
  });
  const [role, setRole] = useState<Role | null>(() => {
    const raw = localStorage.getItem('auth');
    return raw ? (JSON.parse(raw).role as Role) : null;
  });

  const login = (loginOrEmail: string, password: string, userRole: Role): boolean => {
    const foundUser = users.find(
      u =>
        (u.login === loginOrEmail || u.email === loginOrEmail) &&
        u.password === password &&
        (userRole === 'admin' ? u.role === 'Администратор' : u.role === 'Пользователь')
    );
    if (foundUser) {
      setUser(foundUser);
      setRole(userRole);
      localStorage.setItem('auth', JSON.stringify({ user: foundUser, role: userRole }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('auth');
  };

  const signup = (
    email: string,
    lastName: string,
    firstName: string,
    patronymic: string,
    loginValue: string,
    password: string
  ): boolean => {
    const exists = users.some(u => u.login === loginValue || u.email === email);
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
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setRole('user');
    localStorage.setItem('auth', JSON.stringify({ user: newUser, role: 'user' }));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated: !!user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};