// src/providers/AuthProvider.tsx
import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextObject';
import type {User} from "../services/api/users/users.types.ts";
import {apiClient, authApi} from "../services/api";
import type { LoginRequest, RegisterRequest } from '../services/api/auth/auth.types.ts';

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
    const setTokens = useCallback((user: User, accessToken: string, refreshToken: string) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setAuth(prev => ({ ...prev, user, accessToken, refreshToken }));
    }, []);

    // Функция очистки токенов
    const clearTokens = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAuth(prev => ({ ...prev, user: null, accessToken: null, refreshToken: null }));
    }, []);

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
                setTokens(response, token, localStorage.getItem('refresh_token') || '');
            } catch (err) {
                // Если токен невалидный - очищаем
                clearTokens();
                console.error('Session restore failed:', err);
            } finally {
                setLoading(false);
            }
        };

        restoreAuth();
    }, []);

    const login = async (request: LoginRequest) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.login(request);

            // Сохраняем в state
            setTokens(response.user, response.accessToken, response.refreshToken);

            return { success: true, response: response };
        } catch (err: any) {
            const message = err.response?.data?.message || 'Ошибка входа';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (request: RegisterRequest) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.register(request);
            if (!response || !response.accessToken || !response.refreshToken || !response.user) {
                throw new Error('Ошибка регистрации');
            }
            setTokens(response.user, response.accessToken, response.refreshToken);
            return { success: true, response: response };

        } catch (err: any) {
            const message = err.message || 'Ошибка регистрации';
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
            clearTokens();
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