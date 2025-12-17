import { apiClient, buildErrors, type BaseResponse } from '../client';
import type {
    User,
    UsersResponse,
    UserLinked,
    UpdateUserRequest
} from './users.types';

const usersRepository = {
    // Получить всех пользователей с пагинацией
    getAllAsync: async (
        page: number,
        pageSize: number
    ): Promise<UsersResponse> => {
        const params = { page, pageSize };
        const response = await apiClient.get<UsersResponse>('/users', { params });
        return response.data;
    },
    findAsync: async (
        query: string,
        page: number,
        pageSize: number
    ): Promise<UsersResponse> => {
        const params = { query, page, pageSize };
        const response = await apiClient.get<UsersResponse>(`/users`, { params });
        return response.data;
    },
    // Получить пользователя по ID
    getByIdAsync: async (id: string): Promise<UserLinked> => {
        const response = await apiClient.get<UserLinked>(`/users/${id}`);
        return response.data;
    },
    // Обновить пользователя
    updateAsync: async (id: string, data: UpdateUserRequest): Promise<void> => {
        await apiClient.patch(`/users/${id}`, data);
    },
    // Удалить пользователя
    deleteAsync: async (id: string): Promise<void> => {
        await apiClient.delete(`/users/${id}`);
    }
}

export const usersApi = { 
    getAll: async (
        page: number = 1,
        pageSize: number = 20
    ): Promise<BaseResponse> => {
        return await usersRepository.getAllAsync(page, pageSize)
            .then((response) => {
                return { success: true, response: response, errors: null };
            })
            .catch((err: any) => {
                return { success: false, response: null, errors: buildErrors(err) || null };
            });
    },    

    getById: async (id: string): Promise<BaseResponse> => {
        return await usersRepository.getByIdAsync(id)
            .then((response) => {
                return { success: true, response: response, errors: null };
            })
            .catch((err: any) => {
                return { success: false, response: null, errors: buildErrors(err) || null };
            });
    },    

    update: async (id: string, data: UpdateUserRequest): Promise<BaseResponse> => {
        return await usersRepository.updateAsync(id, data)
            .then(() => {
                return { success: true, response: null, errors: null };
            })
            .catch((err: any) => {
                return { success: false, response: null, errors: buildErrors(err) || null };
            });
    },    

    delete: async (id: string): Promise<BaseResponse> => {
        return await usersRepository.deleteAsync(id)
            .then(() => {
                return { success: true, response: null, errors: null };
            })
            .catch((err: any) => {
                return { success: false, response: null, errors: buildErrors(err) || null };
            });
    }
};