// news.repository.ts
import { apiClient, buildErrors, type BaseResponse } from '../client';
import type {
    CreateNewsRequest,
    News,
    NewsResponse,
    UpdateNewsRequest,
    NewsQueryParams
} from './news.types';

const newsRepository = {
    getAllAsync: async (
        page: number,
        pageSize: number,
        query: string = ''
    ): Promise<NewsResponse> => {
        const params = { page, pageSize, query };
        const response = await apiClient.get<NewsResponse>('/news', { params });
        return response.data;
    },
    
    findAsync: async (
        query: string,
        page: number,
        pageSize: number
    ): Promise<NewsResponse> => {
        const params = { query, page, pageSize };
        const response = await apiClient.get<NewsResponse>('/news', { params });
        return response.data;
    },
    
    getByIdAsync: async (id: string): Promise<News> => {
        const response = await apiClient.get<News>(`/news/${id}`);
        return response.data;
    },
    
    updateAsync: async (id: string, data: UpdateNewsRequest): Promise<void> => {
        await apiClient.patch(`/news/${id}`, data);
    },
    
    deleteAsync: async (id: string): Promise<void> => {
        await apiClient.delete(`/news/${id}`);
    },
    
    createAsync: async (data: CreateNewsRequest): Promise<void> => {
        // Для загрузки файлов используем FormData
        const formData = new FormData();
        formData.append('Title', data.title);
        
        if (data.description) {
            formData.append('Description', data.description);
        }
        
        formData.append('BrandId', data.brandId.toString());
        
        // Добавляем файлы изображений
        if (data.imageFiles && data.imageFiles.length > 0) {
            data.imageFiles.forEach(file => {
                formData.append('ImageFiles', file);
            });
        }
        
        await apiClient.post('/news', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    // Если в Swagger есть endpoint для получения новостей пользователя
    getUserNewsAsync: async (
        page: number,
        pageSize: number,
        query: string = ''
    ): Promise<NewsResponse> => {
        const params = { page, pageSize, query };
        const response = await apiClient.get<NewsResponse>('/news/user', { params });
        return response.data;
    }
}

// news.api.ts
export const newsApi = {
    getAll: async (
        page: number = 1,
        pageSize: number = 20,
        query: string = ''
    ): Promise<BaseResponse> => {
        return await newsRepository.getAllAsync(page, pageSize, query)
            .then((response) => {
                return { success: true, response: response, errors: null };
            })
            .catch((err: any) => {
                return { success: false, response: null, errors: buildErrors(err) || null };
            });
    },
    
    find: async (
        query: string,
        page: number = 1,
        pageSize: number = 20
    ): Promise<BaseResponse> => {
        return await newsRepository.findAsync(query, page, pageSize)
            .then((response) => {
                return { success: true, response: response, errors: null };
            })
            .catch((err: any) => {
                return { success: false, response: null, errors: buildErrors(err) || null };
            });
    },
    
    getById: async (id: string): Promise<BaseResponse> => {
        return await newsRepository.getByIdAsync(id)
            .then((response) => {
                return { success: true, response: response, errors: null };
            })
            .catch((err: any) => {
                return { success: false, response: null, errors: buildErrors(err) || null };
            });
    },
    
    update: async (id: string, data: UpdateNewsRequest): Promise<BaseResponse> => {
        return await newsRepository.updateAsync(id, data)
            .then(() => {
                return { success: true, response: null, errors: null };
            })
            .catch((err: any) => {
                return { success: false, response: null, errors: buildErrors(err) || null };
            });
    },
    
    delete: async (id: string): Promise<BaseResponse> => {
        return await newsRepository.deleteAsync(id)
            .then(() => {
                return { success: true, response: null, errors: null };
            })
            .catch((err: any) => {
                return { success: false, response: null, errors: buildErrors(err) || null };
            });
    },
    
    create: async (data: CreateNewsRequest): Promise<BaseResponse> => {
        return await newsRepository.createAsync(data)
            .then(() => {
                return { success: true, response: null, errors: null };
            })
            .catch((err: any) => {
                return { success: false, response: null, errors: buildErrors(err) || null };
            });
    },
    
    // Если в Swagger есть endpoint для получения новостей пользователя
    getUserNews: async (
        page: number = 1,
        pageSize: number = 20,
        query: string = ''
    ): Promise<BaseResponse> => {
        return await newsRepository.getUserNewsAsync(page, pageSize, query)
            .then((response) => {
                return { success: true, response: response, errors: null };
            })
            .catch((err: any) => {
                return { success: false, response: null, errors: buildErrors(err) || null };
            });
    }
}

export default newsApi;