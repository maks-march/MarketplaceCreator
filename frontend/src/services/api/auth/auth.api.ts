// src/services/api/auth/auth.api.ts
import { apiClient, buildErrors, type BaseResponse } from '../client';
import type { User, UserLinked } from '../users/users.types';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RefreshTokenRequest,
    RefreshTokenResponse
} from './auth.types';

export const authApi = {
    loginAsync: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    login: async (credentials: LoginRequest): Promise<BaseResponse> => {
        return await authApi.loginAsync(credentials)
        .then((response) => {
            localStorage.setItem('access_token', response.accessToken);
            localStorage.setItem('refresh_token', response.refreshToken);
            return { success: true, response: null, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    },

    registerAsync: async (userData: RegisterRequest): Promise<void> => {
        const response = await apiClient.post('/auth/register', userData);
        if (response.status >= 200 && response.status < 300) {
            return;
        }
    },

    register: async (userData: RegisterRequest): Promise<BaseResponse> => {
        return await authApi.registerAsync(userData)
        .then(() => {
        return { success: true, response: null, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    },

    logout: async (): Promise<BaseResponse> => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            await apiClient.post('/auth/logout', { refreshToken });
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return { success: true, response: null, errors: null };
    },

    refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
        return response.data;
    },
    
    getMeAsync: async (): Promise<UserLinked> => {
        const response = await apiClient.get<UserLinked>('/auth/me');
        return response.data;
    },

    getMe: async (): Promise<BaseResponse> => {
        return await authApi.getMeAsync()
        .then((response) => {
            const user: User = {
                id: response.id,
                username: response.username,
                name: response.name,
                surname: response.surname,
                patronymic: response.patronymic,
                isAdmin: response.isAdmin,
                сreated: response.сreated,
                updated: response.updated
            };
            return { success: true, response: user, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    }
};