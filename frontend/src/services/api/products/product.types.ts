import type { Brand } from "../brands/brands.types";

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    brandId: number;
    brand: Brand;
    category: string;
    imageLinks?: string[];
}

export interface UpdateProductRequest {
    title?: string;
    description?: string;
    price?: number;
    brandId?: number;
    category?: string;
    imageLinks?: string[];
}

export interface CreateProductRequest {
    title: string;
    description?: string;
    price: number;
    brandId?: number;
    category?: string;
    imageLinks?: string[];
}

export interface ProductsResponse {
    users: Product[];
    page: number;
    pageSize: number;
    // nextPage?: string;
    // prevpage?:string;
}