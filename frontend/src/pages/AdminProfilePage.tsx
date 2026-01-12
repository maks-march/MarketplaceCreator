import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/useAuth';
import '../styles/ProfilePage.css';
import '../styles/AdminProfilePage.css';

const AdminProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const avatarSrc = (user as any)?.avatarUrl || '/vite.svg';
  const name = user?.name ?? 'ФИО';
  const email = user?.email ?? 'Email@email.com';
  const role = user?.role ?? 'Администратор';

  return (
    <PageLayout>
      <main className="profile-page admin-profile-page">
        <div className="profile-top">
          <div className="profile-avatar-wrap">
            <img className="profile-avatar" src={avatarSrc} alt="Аватар" />

            <div className="profile-info">
              <h1 className="profile-name">{name}</h1>
              <div className="profile-email">{email}</div>
              <div className="profile-role">{role}</div>
            </div>

            <div className="profile-actions">
              <button
                className="btn btn-edit"
                type="button"
                onClick={() => navigate('/admin/profile/edit')}
              >
                ✎ Редактировать
              </button>
            </div>
          </div>
        </div>

        {/* ВАЖНО: покупки/избранное для admin не рендерим */}
      </main>
    </PageLayout>
  );
};

export default AdminProfilePage;