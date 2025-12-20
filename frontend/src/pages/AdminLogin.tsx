import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/LoginPage.css';

const AdminLogin: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/admin/main';
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // выполнить реальную проверку учётных данных...
    auth.login('admin'); // пометить как admin
    navigate(from, { replace: true });
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
          {/* отличие только в заголовке */}
          <h2 className="login-title">Вход для администрации</h2>
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

              <button type="submit" className="login-btn">
                Вход
              </button>

              {/* блок с регистрацией и восстановлением УБРАН */}

              {/* возврат к обычному входу */}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  type="button"
                  className="login-link-btn"
                  onClick={() => navigate('/login')}
                >
                  Вернуться к входу для пользователей
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;