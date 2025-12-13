// src/providers/AuthProvider.tsx
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextObject';
import type {User} from "../services/api/users/users.types.ts";
import {authApi} from "../services/api";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({
        user: null,
        accessToken: null,
        refreshToken: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Восстановление сессии при загрузке
    useEffect(() => {
        const restoreAuth = async () => {
            const token = localStorage.getItem('access_token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await authApi.getMe();
                setAuth({
                    user: response,
                    accessToken: token,
                    refreshToken: localStorage.getItem('refresh_token')
                });
            } catch (err) {
                // Если токен невалидный - очищаем
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                console.error('Session restore failed:', err);
            } finally {
                setLoading(false);
            }
        };

        restoreAuth();
    }, []);

    const login = async (emailOrUsername: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.login({ emailOrUsername, password });

            // Сохраняем в state
            setAuth({
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
            });

            // Сохраняем в localStorage
            localStorage.setItem('access_token', response.accessToken);
            localStorage.setItem('refresh_token', response.refreshToken);

            return { success: true, user: response.user };
        } catch (err: any) {
            const message = err.response?.data?.message || 'Ошибка входа';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (
        email: string,
        name: string,
        surname: string,
        patronymic: string,
        username: string,
        password: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.register({
                email,
                username: username,
                password,
                name,
                surname,
                patronymic
            });

            setAuth({
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
            });

            localStorage.setItem('access_token', response.accessToken);
            localStorage.setItem('refresh_token', response.refreshToken);

            return { success: true, user: response.user };
        } catch (err: any) {
            const message = err.response?.data?.message || 'Ошибка регистрации';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setAuth({ user: null, accessToken: null, refreshToken: null });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    };

    const value = {
        user: auth.user,
        isAuthenticated: !!auth.user,
        loading,
        error,
        login,
        logout,
        signup,
        clearError: () => setError(null)
    };

    if (loading) {
        return <div>Загрузка...</div>; // Или спиннер
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};