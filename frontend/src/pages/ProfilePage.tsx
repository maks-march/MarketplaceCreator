import React, { useState } from 'react';
import '../styles/ProfilePage.css';

const ProfilePage: React.FC = () => {
  const [profile] = useState({
    login: 'user',
    email: 'user@example.com',
    firstName: 'Иван',
    lastName: 'Петров',
    patronymic: 'Иванович',
    phone: '+7 (999) 123-45-67',
    joinDate: '01.01.2023'
  });

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Мои данные</h2>
        <div className="profile-grid">
          <div className="profile-field">
            <label className="profile-label">Фамилия</label>
            <p className="profile-value">{profile.lastName}</p>
          </div>
          <div className="profile-field">
            <label className="profile-label">Имя</label>
            <p className="profile-value">{profile.firstName}</p>
          </div>
          <div className="profile-field">
            <label className="profile-label">Отчество</label>
            <p className="profile-value">{profile.patronymic}</p>
          </div>
          <div className="profile-field">
            <label className="profile-label">Логин</label>
            <p className="profile-value">{profile.login}</p>
          </div>
          <div className="profile-field" style={{ gridColumn: '1 / -1' }}>
            <label className="profile-label">Email</label>
            <p className="profile-value">{profile.email}</p>
          </div>
          <div className="profile-field" style={{ gridColumn: '1 / -1' }}>
            <label className="profile-label">Телефон</label>
            <p className="profile-value">{profile.phone}</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="profile-btn">Сохранить изменения</button>
          <button className="profile-btn profile-btn-secondary">Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;