import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
// ИСПРАВЛЕНИЕ: Импортируем существующий файл стилей
import '../styles/LoginPage.css'; 
// Удаляем или комментируем несуществующие файлы, которые вызывали сбой:
// import '../styles/LoginBox.css';
// import '../styles/AuthShell.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(loginValue, password, 'user');
    if (ok) navigate('/');
    else setError('Неверные данные');
  };

  return (
    <>
      <div className="auth-header">
        <div className="auth-brand">
          <span className="brand-line1">Marketplace</span>
          <span className="brand-line2">creator</span>
        </div>
      </div>

      <div className="login-page">
        <div className="login-shell">
          <h2 className="login-title">Вход</h2>
          <div className="login-card">
            <form onSubmit={handleLogin} className="login-form">
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

              <div className="login-links">
                <span>Нет аккаунта?{' '}
                  <button type="button" className="login-link-btn" onClick={() => navigate('/signup')}>
                    Регистрация
                  </button>
                </span>
                <span>Забыли пароль?{' '}
                  <button type="button" className="login-link-btn" onClick={() => navigate('/forgot-password')}>
                    Восстановление
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;