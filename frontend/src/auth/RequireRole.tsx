import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

type Props = { children: JSX.Element; role: 'admin' | 'user' };

const RequireRole: React.FC<Props> = ({ children, role }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    const loginPath = role === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (auth.role !== role) {
    // не авторизован для этой роли — редирект на главную пользователя
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireRole;
