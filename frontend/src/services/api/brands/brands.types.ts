import type { Product } from "../products/product.types";
import type { User } from "../users/users.types";

export interface Brand {
    id: number;
    name: string;
    // logoLink?: string;
    description: string;
    сreated: string;
    updated: string;
}

export interface BrandLinked {
    id: number;
    name: string;
    // logoLink?: string;
    description: string;
    сreated: string;
    updated: string;
    users: User[];
    products: Product[];
}

export interface UpdateBrandRequest {
    name?: string;
    // logoLink?: string;
    description?: string;
}

export interface CreateBrandRequest {
    name: string;
    // logoLink?: string;
    description?: string;
}

export interface BrandsResponse {
    users: BrandLinked[];
    page: number;
    pageSize: number;
    // nextPage?: string;
    // prevpage?:string;
}