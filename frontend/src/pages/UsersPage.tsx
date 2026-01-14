import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { usersApi } from '../services/api/users/users.api';
import '../styles/UsersPage.css';

type UserData = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  created: string;
  isAdmin: boolean;
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res: any = await usersApi.getAll();

        if (!mounted) return;

        if (res?.success) {
          const payload = res.response ?? res.data ?? null;

          // пробуем разные варианты структуры: либо массив, либо { users: [...] }
          const list: any[] = Array.isArray(payload) ? payload : (payload?.users ?? payload?.items ?? []);

          const mapped = list.map((u: any) => ({
            id: Number(u.id),
            username: String(u.username ?? u.userName ?? u.login ?? ''),
            firstName: String(u.name ?? u.firstName ?? ''),
            lastName: String(u.surname ?? u.lastName ?? ''),
            created: String(u.created ?? u.createdAt ?? u.updated ?? ''),
            isAdmin: Boolean(u.isAdmin ?? (u.role === 'admin')),
          }));

          setUsers(mapped);
        } else {
          setError((res?.errors && res.errors[0]) || 'Не удалось загрузить пользователей');
        }
      } catch (e) {
        if (mounted) setError('Ошибка при загрузке');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageLayout>
      <div className="users-page">
        <h1>Пользователи</h1>
        {loading && <p>Загрузка...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Имя</th>
              <th>Роль</th>
              <th>Дата регистрации</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.isAdmin ? 'Админ' : 'Пользователь'}</td>
                <td>{u.created ? new Date(u.created).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
};

export default UsersPage;