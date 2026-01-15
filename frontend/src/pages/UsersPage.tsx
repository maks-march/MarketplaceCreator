import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { usersApi } from '../services/api/users/users.api';
import { authApi } from '../services/api/auth/auth.api';
import '../styles/AdminTables.css';

type UserRow = {
  id: number;
  username: string;
  name: string;
  surname: string;
  patronymic: string;
  created: string;
  isAdmin: boolean;
};

const formatFio = (u: UserRow) => {
  const parts = [u.surname, u.name, u.patronymic].filter((x) => !!x && x.trim().length > 0);
  return parts.join(' ').trim() || '—';
};

const pickUsers = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.users)) return payload.users;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

const UsersPage: React.FC = () => {
  const [items, setItems] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [view, setView] = useState<UserRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<UserRow | null>(null);

  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formSurname, setFormSurname] = useState('');
  const [formName, setFormName] = useState('');
  const [formPatronymic, setFormPatronymic] = useState('');

  const resetForm = () => {
    setFormUsername('');
    setFormEmail('');
    setFormPassword('');
    setFormSurname('');
    setFormName('');
    setFormPatronymic('');
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res: any = await usersApi.getAll(1, 1000);
      if (!res?.success) throw new Error(res?.errors?.[0] || 'Не удалось загрузить пользователей');

      const payload = res.response ?? res.data ?? null;
      const list = pickUsers(payload);

      setItems(
        list.map((u: any) => ({
          id: Number(u.id),
          username: String(u.username ?? ''),
          name: String(u.name ?? ''),
          surname: String(u.surname ?? ''),
          patronymic: String(u.patronymic ?? ''),
          created: String(u.created ?? u.createdAt ?? u.сreated ?? ''),
          isAdmin: Boolean(u.isAdmin ?? false),
        }))
      );
    } catch (e: any) {
      setError(e?.message || 'Ошибка загрузки пользователей');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const closeModals = () => {
    setCreateOpen(false);
    setEdit(null);
    setView(null);
    resetForm();
  };

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (u: UserRow) => {
    setEdit(u);
    setFormUsername(u.username);
    setFormSurname(u.surname);
    setFormName(u.name);
    setFormPatronymic(u.patronymic);
    setFormEmail(''); // email может не приходить в списке — не трогаем
    setFormPassword('');
  };

  const onDelete = async (id: number) => {
    if (!confirm('Удалить пользователя?')) return;
    setError('');
    const res = await usersApi.delete(String(id));
    if (!res.success) {
      setError(res.errors?.[0] || 'Не удалось удалить пользователя');
      return;
    }
    setView((v) => (v?.id === id ? null : v));
    setEdit((v) => (v?.id === id ? null : v));
    await load();
  };

  const onUpdate = async () => {
    if (!edit) return;
    setError('');
    const res = await usersApi.update(String(edit.id), {
      username: formUsername.trim() || undefined,
      surname: formSurname.trim() || undefined,
      name: formName.trim() || undefined,
      patronymic: formPatronymic.trim() || undefined,
      // email backend поддерживает в UpdateUserRequest, но в списке его может не быть
      email: formEmail.trim() || undefined,
    });

    if (!res.success) {
      setError(res.errors?.[0] || 'Не удалось обновить пользователя');
      return;
    }

    closeModals();
    await load();
  };

  const onCreate = async () => {
    setError('');

    // Создание пользователя через /auth/register, потому что POST /users у вас нет в API слое
    // (Если backend поддерживает POST /users — добавим отдельно.)
    const res = await authApi.register({
      email: formEmail.trim(),
      username: formUsername.trim(),
      password: formPassword,
      surname: formSurname.trim(),
      name: formName.trim(),
      patronymic: formPatronymic.trim() || undefined,
    });

    if (!res.success) {
      setError(res.errors?.[0] || 'Не удалось создать пользователя');
      return;
    }

    closeModals();
    await load();
  };

  return (
    <PageLayout>
      <div className="admin-page">
        <h1 className="admin-page__title">Пользователи</h1>

        <div className="admin-page__toolbar">
          <button className="admin-btn admin-btn--primary" onClick={openCreate}>
            + Добавить пользователя
          </button>
        </div>

        {loading && <p>Загрузка...</p>}
        {!!error && <div className="admin-error">{error}</div>}

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 70 }}>ID</th>
              <th style={{ width: 180 }}>Логин</th>
              <th>Имя</th>
              <th style={{ width: 160 }}>Роль</th>
              <th style={{ width: 160 }}>Дата регистрации</th>
              <th style={{ width: 220, textAlign: 'right' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} onClick={() => setView(u)} role="button" tabIndex={0}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{formatFio(u)}</td>
                <td>{u.isAdmin ? 'Админ' : 'Пользователь'}</td>
                <td>{u.created ? new Date(u.created).toLocaleDateString() : '—'}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="admin-table__actions">
                    <button className="admin-btn admin-btn--outline" onClick={() => openEdit(u)}>
                      Редактировать
                    </button>
                    <button className="admin-btn admin-btn--danger" onClick={() => onDelete(u.id)}>
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6}>Нет пользователей</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* View */}
        {!!view && (
          <div className="admin-modal__overlay" onClick={closeModals}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="admin-modal__title">Просмотр пользователя</h2>

              <div className="admin-form">
                <div className="admin-field">
                  <label>ID</label>
                  <div>{view.id}</div>
                </div>
                <div className="admin-field">
                  <label>Логин</label>
                  <div>{view.username}</div>
                </div>
                <div className="admin-field">
                  <label>ФИО</label>
                  <div>{formatFio(view)}</div>
                </div>
                <div className="admin-field">
                  <label>Роль</label>
                  <div>{view.isAdmin ? 'Админ' : 'Пользователь'}</div>
                </div>
              </div>

              <div className="admin-modal__footer">
                <button className="admin-btn admin-btn--danger" onClick={() => onDelete(view.id)}>
                  Удалить
                </button>
                <button className="admin-btn admin-btn--outline" onClick={() => openEdit(view)}>
                  Редактировать
                </button>
                <button className="admin-btn admin-btn--link" onClick={closeModals}>
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit */}
        {(createOpen || !!edit) && (
          <div className="admin-modal__overlay" onClick={closeModals}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="admin-modal__title">{edit ? 'Редактировать пользователя' : 'Добавить пользователя'}</h2>

              <div className="admin-form">
                <div className="admin-field">
                  <label>Логин</label>
                  <input className="admin-input" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} />
                </div>

                <div className="admin-field">
                  <label>Фамилия</label>
                  <input className="admin-input" value={formSurname} onChange={(e) => setFormSurname(e.target.value)} />
                </div>

                <div className="admin-field">
                  <label>Имя</label>
                  <input className="admin-input" value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>

                <div className="admin-field">
                  <label>Отчество</label>
                  <input className="admin-input" value={formPatronymic} onChange={(e) => setFormPatronymic(e.target.value)} />
                </div>

                {/* Для create: email+password обязательны (как в /auth/register) */}
                {!edit && (
                  <>
                    <div className="admin-field">
                      <label>Email</label>
                      <input className="admin-input" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                    </div>
                    <div className="admin-field">
                      <label>Пароль</label>
                      <input className="admin-input" type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} />
                    </div>
                  </>
                )}
              </div>

              <div className="admin-modal__footer">
                <button className="admin-btn admin-btn--link" onClick={closeModals}>
                  Отмена
                </button>
                <button
                  className="admin-btn admin-btn--primary"
                  onClick={edit ? onUpdate : onCreate}
                  disabled={
                    edit
                      ? !formUsername.trim()
                      : !formUsername.trim() || !formEmail.trim() || !formPassword || !formSurname.trim() || !formName.trim()
                  }
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default UsersPage;