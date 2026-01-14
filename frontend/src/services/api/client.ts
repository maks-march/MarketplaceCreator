// src/services/api/client.ts
import axios from 'axios';

const API_BASE_URL =
  ((window as any).__ENV__?.REACT_APP_API_URL as string | undefined)?.replace(/\/+$/, '') ||
  'http://localhost:80/api/v1.0';

export interface BaseResponse {
  success: boolean;
  response: any | null;
  errors: string[] | null;
}

export const buildErrors = (err: any): string[] => {
  const errorMessages: string[] = [];

  Object.values(err.response?.data?.errors ?? []).forEach((errorArray) => {
    if (Array.isArray(errorArray)) {
      errorMessages.push(...errorArray);
    }
  });

  return errorMessages;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        // ВАЖНО: baseURL уже содержит /api/v1.0, поэтому тут добавляем путь без дублей
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // ✅ у вас в типах RefreshTokenResponse: { accessToken, refreshToken }
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_role');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };