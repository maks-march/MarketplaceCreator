import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import UserEditModal from '../components/UserEditModal'; // Импорт модалки
import usersIcon from '../assets/Groups.svg';
import pencilIcon from '../assets/Pencil.svg';
import '../styles/UsersPage.css';

type UserRow = {
  id: number;
  login: string;
  role: string;
  email: string;
  date: string;
};

const initialUsers: UserRow[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  login: 'Ник',
  role: 'Роль',
  email: 'Почта',
  date: '01.01.2024',
}));

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  
  // Новое состояние: открываем ли мы модалку для редактирования?
  const [openInEditMode, setOpenInEditMode] = useState(false);

  // Просмотр (клик по строке)
  const handleViewUser = (user: UserRow) => {
    setSelectedUser(user);
    setOpenInEditMode(false); // Только просмотр
    setIsModalOpen(true);
  };

  // Редактирование (клик по карандашу)
  const handleEditUser = (user: UserRow) => {
    setSelectedUser(user);
    setOpenInEditMode(true); // Сразу редактирование
    setIsModalOpen(true);
  };

  const handleSaveUser = (updatedUser: UserRow) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    // Модалка закроется внутри компонента или здесь setIsModalOpen(false)
  };

  return (
    <PageLayout>
      <div className="users-page">
        <div className="users-page__header">
          <img src={usersIcon} alt="" className="users-page__icon" />
          <h1 className="users-page__title">Пользователи</h1>
        </div>

        <div className="users-table">
          {/* Шапка таблицы */}
          <div className="users-table__header">
            <div className="users-table__cell users-table__cell--id">id</div>
            <div className="users-table__cell">Логин</div>
            <div className="users-table__cell">Роль</div>
            <div className="users-table__cell">Email</div>
            <div className="users-table__cell">Дата создания</div>
            <div className="users-table__cell" />
          </div>

          {/* Тело таблицы */}
          <div className="users-table__body">
            {users.map((user, i) => {
              const index = i + 1;
              const isOdd = index % 2 !== 0;

              return (
                <div
                  key={user.id}
                  className={`users-table__row ${
                    isOdd ? 'users-table__row--odd' : 'users-table__row--even'
                  }`}
                  onClick={() => handleViewUser(user)} // Клик по строке -> Просмотр
                  style={{ cursor: 'pointer' }}
                >
                  <div className="users-table__cell users-table__cell--id">{index}</div>
                  <div className="users-table__cell">{user.login}</div>
                  <div className="users-table__cell">{user.role}</div>
                  <div className="users-table__cell">{user.email}</div>
                  <div className="users-table__cell">{user.date}</div>
                  <div className="users-table__cell">
                    <button 
                      className="users-table__edit-btn" 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditUser(user); // Клик по карандашу -> Редактирование
                      }}
                    >
                      <img src={pencilIcon} alt="Edit" className="users-table__edit-icon" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      <UserEditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
        initialEditMode={openInEditMode} // Передаем режим
        allowEdit={openInEditMode}       // Если открыли для просмотра, редактирование запрещено (кнопки нет)
      />
    </PageLayout>
  );
};

export default UsersPage;