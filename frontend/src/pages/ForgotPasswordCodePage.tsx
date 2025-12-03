import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const ForgotPasswordCodePage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Введите код из письма');
      return;
    }
    navigate('/forgot-new-password');
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

              <label className="login-label">Введите код, который пришел Вам на email:</label>
              <input
                className="login-input"
                type="text"
                name="code"
                placeholder="******"
                value={code}
                onChange={(e) => setCode(e.target.value)}
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

export default ForgotPasswordCodePage;