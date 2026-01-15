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

const tryUpdateMe = async (method: 'patch' | 'put', url: string, payload: any): Promise<BaseResponse> => {
    return await (apiClient as any)[method](url, payload)
      .then(() => ({ success: true, response: null, errors: null }))
      .catch((err: any) => ({ success: false, response: null, errors: buildErrors(err) || null }));
};

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
    },

    me: async (): Promise<BaseResponse> => {
        return await apiClient
            .get<UserLinked>('/auth/me')
            .then((r) => ({ success: true, response: r.data, errors: null }))
            .catch((err: any) => ({ success: false, response: null, errors: buildErrors(err) || null }));
    },

    updateMe: async (payload: UpdateUserRequest & { password?: string }): Promise<BaseResponse> => {
        // 1) узнать текущего пользователя и его id
        const meRes = await usersApi.me();
        if (!meRes.success || !meRes.response) {
            return { success: false, response: null, errors: meRes.errors ?? ['Не удалось получить текущего пользователя'] };
        }

        const me = meRes.response as any;
        const id = me?.id;
        if (id == null) {
            return { success: false, response: null, errors: ['Не удалось определить id текущего пользователя'] };
        }

        // 2) пароль сейчас не поддержан типами UpdateUserRequest и чаще всего отдельным endpoint’ом.
        //    Чтобы не “делать вид”, что пароль меняется — запрещаем отправлять его через /users/{id}.
        const { password, ...safePatch } = payload as any;
        if (password) {
            return { success: false, response: null, errors: ['Смена пароля через профиль пока не поддерживается backend'] };
        }

        // 3) обновить пользователя
        return await usersRepository
            .updateAsync(String(id), safePatch)
            .then(() => ({ success: true, response: null, errors: null }))
            .catch((err: any) => ({ success: false, response: null, errors: buildErrors(err) || null }));
    },
};