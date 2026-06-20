import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { tokenStorage } from '../storage/tokenStorage';
import type { AuthResponse } from '../types/api.types';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && original && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) throw error;

        const { data } = await axios.post<AuthResponse>(
          `${env.apiBaseUrl}/auth/refresh`,
          { refreshToken },
        );

        await tokenStorage.setTokens(
          data.tokens.accessToken,
          data.tokens.refreshToken,
        );

        processQueue(data.tokens.accessToken);
        original.headers.Authorization = `Bearer ${data.tokens.accessToken}`;
        return apiClient(original);
      } catch (refreshError) {
        processQueue(null);
        await tokenStorage.clearTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] };
    if (Array.isArray(data?.message)) return data.message.join(', ');
    if (data?.message) return data.message;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
