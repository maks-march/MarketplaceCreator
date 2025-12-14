import type { Brand } from "../brands/brands.types";

export interface User {
    id: number;
    username: string;
    name: string;
    surname: string;
    patronymic: string;
    isAdmin: boolean;
    сreated: string;
    updated: string;
}

export interface UserLinked {
    id: number;
    username: string;
    name: string;
    surname: string;
    patronymic: string;
    isAdmin: boolean;
    сreated: string;
    updated: string;
    brands: Brand[];
}


export interface UpdateUserRequest {
    email?: string;
    username?: string;
    name?: string;
    surname?: string;
    patronymic?: string;
}

export interface UsersResponse {
    users: User[];
    page: number;
    pageSize: number;
    // nextPage?: string;
    // prevpage?:string;
}