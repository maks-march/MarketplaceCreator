import { apiClient, buildErrors, type BaseResponse } from '../client';
import type {
    CreateProductRequest,
    Product,
    ProductsResponse, 
    UpdateProductRequest
} from './product.types';

const productsRepository = {
    getAllAsync: async (
        page: number,
        pageSize: number
    ): Promise<ProductsResponse> => {
        const params = { page, pageSize };
        const response = await apiClient.get('/products', { params });
        return response.data;
    },
    findAsync: async (
        query: string,
        page: number,
        pageSize: number
    ): Promise<ProductsResponse> => {
        const params = { query, page, pageSize };
        const response = await apiClient.get<ProductsResponse>(`/products`, { params });
        return response.data;
    },
    getByIdAsync: async (id: string): Promise<Product> => {
        const response = await apiClient.get<Product>(`/products/${id}`);
        return response.data;
    },
    updateAsync: async (id: string, data: UpdateProductRequest): Promise<void> => {
        await apiClient.patch(`/products/${id}`, data);
    },
    deleteAsync: async (id: string): Promise<void> => {
        await apiClient.delete<{ success: boolean }>(`/products/${id}`);
    },
    createAsync: async (data: CreateProductRequest): Promise<void> => {
        await apiClient.post(`/products`, data);
    }
}

export const productsApi = {
    getAll: async (
        page: number = 1,
        pageSize: number = 20
    ): Promise<BaseResponse> => {
        return await productsRepository.getAllAsync(page, pageSize)
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
        return await productsRepository.findAsync(query, page, pageSize)
        .then((response) => {
            return { success: true, response: response, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    },
    getById: async (id: string): Promise<BaseResponse> => {
        return await productsRepository.getByIdAsync(id)
        .then((response) => {
            return { success: true, response: response, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    },
    update: async (id: string, data: UpdateProductRequest): Promise<BaseResponse> => {
        return await productsRepository.updateAsync(id, data)
        .then(() => {
            return { success: true, response: null, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    },
    delete: async (id: string): Promise<BaseResponse> => {
        return await productsRepository.deleteAsync(id)
        .then(() => {
            return { success: true, response: null, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    },
    create: async (data: CreateProductRequest): Promise<BaseResponse> => {
        return await productsRepository.createAsync(data)
        .then(() => {
            return { success: true, response: null, errors: null };
        })
        .catch((err: any) => {
            return { success: false, response: null, errors: buildErrors(err) || null };
        });
    }
}