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
        limit: number = 20
    ): Promise<UsersResponse> => {
        const params = { page, limit };
        const response = await apiClient.get<UsersResponse>('/users', { params });
        return response.data;
    },

    // // Получить пользователя по ID
    // getById: async (id: string): Promise<UserResponse> => {
    //     const response = await apiClient.get<UserResponse>(`/users/${id}`);
    //     return response.data;
    // },

    // // Получить текущего пользователя (из токена)
    // getMe: async (): Promise<UserResponse> => {
    //     const response = await apiClient.get<UserResponse>('/users/me');
    //     return response.data;
    // },

    // // Создать пользователя (для админа)
    // create: async (userData: CreateUserRequest): Promise<UserResponse> => {
    //     const response = await apiClient.post<UserResponse>('/users', userData);
    //     return response.data;
    // },

    // // Обновить пользователя
    // update: async (id: string, data: UpdateUserData): Promise<UserResponse> => {
    //     const response = await apiClient.patch<UserResponse>(`/users/${id}`, data);
    //     return response.data;
    // },

    // Удалить пользователя
    delete: async (id: string): Promise<{ success: boolean }> => {
        const response = await apiClient.delete<{ success: boolean }>(`/users/${id}`);
        return response.data;
    },

    // // Изменить роль пользователя
    // changeRole: async (
    //     id: string,
    //     role: 'Пользователь' | 'Администратор'
    // ): Promise<UserResponse> => {
    //     const response = await apiClient.patch<UserResponse>(
    //         `/users/${id}/role`,
    //         { role }
    //     );
    //     return response.data;
    // },

    // // Проверить, свободен ли логин/email
    // checkAvailability: async (
    //     field: 'login' | 'email',
    //     value: string
    // ): Promise<{ available: boolean }> => {
    //     const response = await apiClient.get<{ available: boolean }>(
    //         '/users/check-availability',
    //         { params: { field, value } }
    //     );
    //     return response.data;
    // }
};