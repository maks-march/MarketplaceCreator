export interface User {
    id: string;
    username: string;
    name: string;
    surname: string;
    patronymic: string;
    isAdmin: boolean;
    сreated: string;
    updated: string;
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
}

export interface UserResponse {
    user: User;
}