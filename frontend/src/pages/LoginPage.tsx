import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; 
import type { LoginRequest } from '../services/api/auth/auth.types';
import { authApi } from '../services/api';

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

    try {
      auth.login('user');
      navigate(from, { replace: true });
    } catch (err) {
      setError('Ошибка входа');
    }
  const [error, setError] = useState<string[]>([]);
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
    const result = await authApi.login(request);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.errors ?? ['Неверные данные']);
    }
    return;
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

            <form onSubmit={handleLogin} className="login-form">
              {error && (
                <div>
                  {Array.isArray(error) 
                    ? error.map((err, index) => (
                        <div className="login-error" key={index}>
                          {err}
                          {index < error.length - 1 && <br />}
                        </div>
                      ))
                    : error}
                </div>
              )}

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