import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../styles/LoginPage.css'; 
import type { LoginRequest } from '../services/api/auth/auth.types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const request: LoginRequest = {
      emailOrUsername: formData.emailOrUsername,
      password: formData.password
    };
    const response = await login(request);
    if (response.success) navigate('/');
    else {
      setError(response.error || 'Неверные данные');
      return;
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
              {error && <div className="login-error">{error}</div>}

              <label className="login-label">Логин или email:</label>
              <input
                className="login-input"
                type="text"
                name="emailOrUsername"
                placeholder="Логин или example@mail.ru"
                value={formData.emailOrUsername}
                onChange={handleChange}
              />

              <label className="login-label">Пароль:</label>
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
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