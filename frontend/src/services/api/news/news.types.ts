import type { Brand } from "../brands/brands.types";

export interface News {
    id: number;
    title: string;
    description: string;
    brandId: number;
    brand: Brand;
    imageLinks?: string[];
    created: string; // ISO date string
    updated: string; // ISO date string
}

export interface UpdateNewsRequest {
    title?: string;
    description?: string;
}

export interface CreateNewsRequest {
    title: string;
    description?: string;
    brandId: number;
    imageFiles?: File[]; // Для multipart/form-data загрузки
}

export interface NewsResponse {
    news: News[];
    page: number;
    pageSize: number;
}

export interface NewsQueryParams {
    query?: string;
    page?: number;
    pageSize?: number;
    version?: string;
    brandId?: number;
    dateFrom?: string;
    dateTo?: string;
}