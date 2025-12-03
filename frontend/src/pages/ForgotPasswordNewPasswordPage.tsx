import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginBox.css';
import '../styles/AuthShell.css';

const ForgotPasswordNewPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Введите новый пароль');
      return;
    }
    // тут могла бы быть отправка нового пароля на сервер
    navigate('/login');
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
          <h2 className="login-title">Восстановление</h2>
          <div className="login-card">
            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="login-error">{error}</div>}

              <label className="login-label">Введите новый пароль:</label>
              <input
                className="login-input"
                type="password"
                name="newPassword"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" className="login-btn">Подтвердить</button>

              <div className="login-links" style={{ justifyContent: 'center' }}>
                <button type="button" className="login-link-btn" onClick={() => navigate('/login')}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordNewPasswordPage;