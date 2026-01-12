import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // по умолчанию перенаправляем пользователя в /user после логина
  const from = (location.state as any)?.from?.pathname || '/user';
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginValue || !password) {
      setError('Введите логин и пароль');
      return;
    }

    // ✅ реальный логин через context/AuthContext
    const ok = auth.login(loginValue.trim(), password, 'user');
    if (!ok) {
      setError('Неверный логин/email или пароль');
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <>
      {/* Хедер (как в AdminLogin) */}
      <div className="auth-header">
        <div className="auth-brand">
          <span className="brand-line1">Marketplace</span>
          <span className="brand-line2">creator</span>
        </div>
      </div>

      <div className="login-page">
        <div className="login-shell">
          <h2 className="login-title">Вход для пользователей</h2>
          <div className="login-card">
            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="login-error">{error}</div>}

              <label className="login-label">Логин или email:</label>
              <input
                className="login-input"
                type="text"
                name="login"
                placeholder="login или example@mail.ru"
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
              />

              <label className="login-label">Пароль:</label>
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="******"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <button type="submit" className="login-btn">Вход</button>

              <div className="login-actions">
                <button
                  type="button"
                  className="login-link-btn"
                  onClick={() => navigate('/signup')}
                >
                  Регистрация
                </button>

                <button
                  type="button"
                  className="login-link-btn"
                  onClick={() => navigate('/forgot-password')}
                >
                  Забыли пароль?
                </button>

                                <button
                  type="button"
                  className="login-link-btn"
                  onClick={() => navigate('/admin/login')}
                >
                  Вход для администрации
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;