// src/services/api/auth/auth.api.ts
import { apiClient } from '../client';
import type { User, UserLinked } from '../users/users.types';
import type {
    UserRequest,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    RefreshTokenRequest,
    RefreshTokenResponse
} from './auth.types';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
        const response = await apiClient.post<RegisterResponse>('/auth/register', userData);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }
        throw new Error(
            `Ошибка регистрации (${response.data})`
        );
    },

    logout: async (): Promise<void> => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            await apiClient.post('/auth/logout', { refreshToken });
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
        return response.data;
    },
    
    getMe: async (): Promise<UserLinked> => {
        const response = await apiClient.get<UserLinked>('/auth/me');
        return response.data;
    }
};