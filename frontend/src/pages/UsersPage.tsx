import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import UserEditModal from '../components/UserEditModal';
import UserAddModal from '../components/UserAddModal';
import { usersApi } from '../services/api/users/users.api';
import type { UserLinked, UpdateUserRequest } from '../services/api/users/users.types';
import '../styles/UsersPage.css';

type UserRow = {
  id: number;
  login: string;
  role: string;
  email: string;
  date: string;
  fio?: string;
};

const mapApiUserToRow = (u: UserLinked): UserRow => ({
  id: Number(u.id),
  login: u.username ?? '',
  role: u.isAdmin ? 'admin' : 'user',
  email: '', // в UserLinked нет email в типах
  date: u.updated ?? u.сreated ?? '',
  fio: [u.surname, u.name, u.patronymic].filter(Boolean).join(' ') || '',
});

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await usersApi.getAll(1, 100);
      if (!res.success) return;
      const payload = res.response as any;
      const list: UserLinked[] = (payload?.users ?? payload ?? []) as UserLinked[];
      setUsers(list.map(mapApiUserToRow));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const handleAddUser = () => {
    // create API отсутствует — оставляем как заглушку UI
    setIsAddModalOpen(true);
  };

  const handleCreateUser = (payload: Omit<UserRow, 'id' | 'date'>) => {
    // ❗️Оставляем локально, так как API create не предоставлен
    const nextId = Math.max(0, ...users.map((u) => u.id)) + 1;
    const today = new Date().toLocaleDateString('ru-RU');

    const newUser: UserRow = {
      id: nextId,
      login: payload.login,
      fio: payload.fio,
      role: payload.role,
      email: payload.email,
      date: today,
    };

    setUsers((prev) => [...prev, newUser]);
    setIsAddModalOpen(false);
  };

  const handleViewUser = (user: UserRow) => {
    setSelectedUser(user);
    setOpenInEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserRow) => {
    setSelectedUser(user);
    setOpenInEditMode(true);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (updatedUser: UserRow) => {
    // update API есть
    const req: UpdateUserRequest = {
      username: updatedUser.login,
      name: (updatedUser.fio ?? '').split(' ')[1] || undefined,
      surname: (updatedUser.fio ?? '').split(' ')[0] || undefined,
      patronymic: (updatedUser.fio ?? '').split(' ')[2] || undefined,
      // email отсутствует в UpdateUserRequest types.ts у вас (есть email?: string там — ок)
      email: updatedUser.email || undefined,
    };

    const res = await usersApi.update(String(updatedUser.id), req);
    if (res.success) {
      setIsModalOpen(false);
      await load();
      return;
    }

    // fallback локально, если update не прошёл
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setIsModalOpen(false);
  };

  const handleDeleteUser = async (id: number) => {
    const ok = window.confirm('Удалить пользователя?');
    if (!ok) return;

    const res = await usersApi.delete(String(id));
    if (!res.success) return;

    await load();
  };

  return (
    <PageLayout>
      <div className="users-page">
        <div className="users-page__header">
          <h1 className="users-page__title">Пользователи</h1>
          <button className="users-page__add-btn" onClick={handleAddUser}>
            Добавить
          </button>
        </div>

        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="users-table">
            <div className="users-table__header">
              <div className="users-table__cell users-table__cell--id">ID</div>
              <div className="users-table__cell">Логин</div>
              <div className="users-table__cell">Роль</div>
              <div className="users-table__cell">Email</div>
              <div className="users-table__cell">Дата</div>
              <div className="users-table__cell">Действия</div>
            </div>

            <div className="users-table__body">
              {users.map((u, idx) => (
                <div
                  key={u.id}
                  className={`users-table__row ${idx % 2 === 0 ? 'users-table__row--odd' : 'users-table__row--even'}`}
                  onClick={() => handleViewUser(u)}
                >
                  <div className="users-table__cell users-table__cell--id">{u.id}</div>
                  <div className="users-table__cell">{u.login}</div>
                  <div className="users-table__cell">{u.role}</div>
                  <div className="users-table__cell">{u.email}</div>
                  <div className="users-table__cell">{u.date}</div>
                  <div className="users-table__cell">
                    <button
                      className="users-table__edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditUser(u);
                      }}
                    >
                      ✎
                    </button>
                    <button
                      className="users-table__edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(u.id);
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <UserEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onSave={handleSaveUser}
          initialEditMode={openInEditMode}
          allowEdit={openInEditMode}
        />

        <UserAddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleCreateUser}
        />
      </div>
    </PageLayout>
  );
};

export default UsersPage;