import { apiClient } from '../client';
import type {
    // User,
    UsersResponse,
    // UserResponse,
    // UpdateUserData,
    // CreateUserRequest
} from './users.types';

export const usersApi = {
    // Получить всех пользователей с пагинацией
    getAll: async (
        page: number = 1,
        pageSize: number = 20
    ): Promise<UsersResponse> => {
        const params = { page, pageSize };
        const response = await apiClient.get<UsersResponse>('/users', { params });
        return response.data;
    },

    // // Получить пользователя по ID
    // getById: async (id: string): Promise<UserResponse> => {
    //     const response = await apiClient.get<User>(`/users/${id}`);
    //     return response.data;
    // },

    // // Обновить пользователя
    // update: async (id: string, data: UpdateUserData): Promise<UserResponse> => {
    //     const response = await apiClient.patch<User>(`/users/${id}`, data);
    //     return response.data;
    // },

    // Удалить пользователя
    delete: async (id: string): Promise<{ success: boolean }> => {
        const response = await apiClient.delete<{ success: boolean }>(`/users/${id}`);
        return response.data;
    }
};