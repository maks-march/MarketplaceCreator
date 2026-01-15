import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

import '../styles/LoginBox.css';
import '../styles/AuthShell.css';

function hasAnyTokenInStorage(): boolean {
  // подстраховка: в разных местах проекта могли использовать разные ключи
  const candidates = ['access_token', 'accessToken', 'token', 'jwt'];
  return candidates.some((k) => {
    const v = localStorage.getItem(k);
    return !!v && v !== 'undefined' && v !== 'null';
  });
}

const LoginPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError([]);
    setSubmitting(true);

    try {
      const ok = await auth.login(formData.emailOrUsername.trim(), formData.password, 'user');
      if (!ok) {
        setError(['Неверный логин/email или пароль (или это admin-аккаунт, войдите через /admin/login)']);
        return;
      }
      navigate('/user/main', { replace: true });
    } catch {
      setError(['Ошибка входа (проверьте доступность API)']);
    } finally {
      setSubmitting(false);
    }
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
              {error.length > 0 && <div className="login-error">{error[0]}</div>}

              <label className="login-label">Логин или email:</label>
              <input
                className="login-input"
                type="text"
                name="emailOrUsername"
                placeholder="Логин или example@mail.ru"
                value={formData.emailOrUsername}
                onChange={handleChange}
                autoComplete="username"
              />

              <label className="login-label">Пароль:</label>
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button type="submit" className="login-btn" disabled={submitting}>
                {submitting ? 'Входим...' : 'Войти'}
              </button>

              <div className="login-links">
                <button type="button" className="login-link-btn" onClick={() => navigate('/signup')}>
                  Регистрация
                </button>
                <button type="button" className="login-link-btn" onClick={() => navigate('/forgot-password')}>
                  Восстановление
                </button>
              </div>

              <div className="login-links" style={{ justifyContent: 'center' }}>
                <button type="button" className="login-link-btn" onClick={() => navigate('/admin/login')}>
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