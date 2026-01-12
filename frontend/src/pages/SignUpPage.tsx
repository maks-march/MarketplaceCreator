import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../styles/SignUpPage.css';
import '../styles/AuthShell.css';
// ИСПРАВЛЕНИЕ: Подключаем существующий файл стилей
import '../styles/LoginPage.css'; 

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    lastName: '',
    firstName: '',
    patronymic: '',
    login: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    const ok = signup(
      formData.email,
      formData.lastName,
      formData.firstName,
      formData.patronymic,
      formData.login,
      formData.password
    );
    if (!ok) setError('Логин или email уже заняты');
    else navigate('/login');
  };

  return (
    <>
      <div className="auth-header">
        <div className="auth-brand">
          <span className="brand-line1">Marketplace</span>
          <span className="brand-line2">creator</span>
        </div>
      </div>

      <div className="signup-page">
        <div className="signup-shell">
          <h2 className="signup-title">Регистрация</h2>
          <div className="signup-card">
            <form onSubmit={handleSubmit} className="signup-form">
              {error && <div className="signup-error">{error}</div>}

              <label className="signup-label">Email:</label>
              <input
                className="signup-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Example@mail.ru"
              />

              <label className="signup-label">Фамилия:</label>
              <input
                className="signup-input"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Иванов"
              />

              <label className="signup-label">Имя:</label>
              <input
                className="signup-input"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Иван"
              />

              <label className="signup-label">Отчество:</label>
              <input
                className="signup-input"
                type="text"
                name="patronymic"
                value={formData.patronymic}
                onChange={handleChange}
                placeholder="Иванович"
              />

              <label className="signup-label">Логин:</label>
              <input
                className="signup-input"
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                placeholder="login"
              />

              <label className="signup-label">Пароль:</label>
              <input
                className="signup-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="******"
              />

              <label className="signup-label">Повторите пароль:</label>
              <input
                className="signup-input"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="******"
              />

              <button type="submit" className="signup-btn">Зарегистрироваться</button>
              <div className="signup-link">
                Уже есть аккаунт?{' '}
                <button type="button" className="signup-link-btn" onClick={() => navigate('/login')}>
                  Войти
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;