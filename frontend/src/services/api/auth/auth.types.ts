// src/services/api/auth/auth.types.ts
import type {User} from "../users/users.types.ts";

export interface LoginRequest {
    emailOrUsername: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    name: string;
    surname: string;
    patronymic?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export type LoginResponse = AuthResponse;

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}