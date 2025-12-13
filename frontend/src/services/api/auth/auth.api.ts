// src/services/api/auth/auth.api.ts
import { apiClient } from '../client';
import type { User } from '../users/users.types';
import type {
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
        return response.data;
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
    
    getMe: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    }
};