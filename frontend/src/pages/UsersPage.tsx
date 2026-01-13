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
            try {
                const res = await usersApi.getAll();
                if (mounted) {
                    if (res.success && res.data) {
                        // @ts-ignore
                        const list = res.data.users || [];
                        setUsers(list.map((u: any) => ({
                            id: u.id,
                            username: u.username,
                            firstName: u.name,
                            lastName: u.surname,
                            created: u.сreated,
                            isAdmin: u.isAdmin
                        })));
                    } else {
                        setError('Не удалось загрузить пользователей');
                    }
                }
            } catch (e) {
                if (mounted) setError('Ошибка при загрузке');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => { mounted = false; };
    }, []);

    return (
        <PageLayout>
            <div className="users-page">
                <h1>Пользователи</h1>
                {loading && <p>Загрузка...</p>}
                {error && <p style={{color: 'red'}}>{error}</p>}
                
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
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.firstName} {u.lastName}</td>
                                <td>{u.isAdmin ? 'Админ' : 'Пользователь'}</td>
                                <td>{new Date(u.created).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageLayout>
    );
};

export default UsersPage;