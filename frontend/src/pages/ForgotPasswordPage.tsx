import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginBox.css';
import '../styles/AuthShell.css';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Введите email');
      setMessage('');
      return;
    }
    setError('');
    navigate('/forgot-password/code');
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
            <form onSubmit={handleReset} className="login-form">
              {error && <div className="login-error">{error}</div>}
              {message && (
                <div className="login-error" style={{ background: '#d4edda', color: '#155724' }}>
                  {message}
                </div>
              )}

              <label className="login-label">Введите email:</label>
              <input
                className="login-input"
                type="email"
                name="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button type="submit" className="login-btn">Подтвердить</button>

              <div className="login-links" style={{ justifyContent: 'center' }}>
                <button
                  type="button"
                  className="login-link-btn"
                  onClick={() => navigate('/login')}
                >
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

export default ForgotPasswordPage;