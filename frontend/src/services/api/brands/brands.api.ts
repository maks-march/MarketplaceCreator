import { apiClient, buildErrors, type BaseResponse } from '../client';
import type {
    CreateBrandRequest,
    Brand,
    BrandsResponse,
    UpdateBrandRequest,
    BrandLinked
} from './brands.types';

const brandsRepository = {
    getAllAsync: async (
        page: number,
        pageSize: number
    ): Promise<BrandsResponse> => {
        const params = { page, pageSize };
        const response = await apiClient.get('/brands', { params });
        return response.data;
    },
    findAsync: async (
        query: string,
        page: number,
        pageSize: number
    ): Promise<BrandsResponse> => {
        const params = { query, page, pageSize };
        const response = await apiClient.get(`/brands`, { params });
        return response.data;
    },
    getByIdAsync: async (id: string): Promise<BrandLinked> => {
        const response = await apiClient.get<BrandLinked>(`/brands/${id}`);
        return response.data;
    },
    updateAsync: async (id: string, data: UpdateBrandRequest): Promise<void> => {
        await apiClient.patch(`/brands/${id}`, data);
    },
    deleteAsync: async (id: string): Promise<void> => {
        await apiClient.delete<{ success: boolean }>(`/brands/${id}`);
    },
    createAsync: async (data: CreateBrandRequest): Promise<void> => {
        await apiClient.post(`/brands`, data);
    }
}

export const brandsApi = {
    getAll: async (
        page: number = 1,
        pageSize: number = 20
    ): Promise<BaseResponse> => {
        return await brandsRepository.getAllAsync(page, pageSize)
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
        return await brandsRepository.findAsync(query, page, pageSize)
        .then((response) => {
            return { success: true, response: response, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    },
    getById: async (id: string): Promise<BaseResponse> => {
        return await brandsRepository.getByIdAsync(id)
        .then((response) => {
            return { success: true, response: response, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    },
    update: async (id: string, data: UpdateBrandRequest): Promise<BaseResponse> => {
        return await brandsRepository.updateAsync(id, data)
        .then(() => {
            return { success: true, response: null, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    },
    delete: async (id: string): Promise<BaseResponse> => {
        return await brandsRepository.deleteAsync(id)
        .then(() => {
            return { success: true, response: null, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    },
    create: async (data: CreateBrandRequest): Promise<BaseResponse> => {
        return await brandsRepository.createAsync(data)
        .then(() => {
            return { success: true, response: null, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    }
}