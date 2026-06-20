import { apiClient } from './client';
import type { AuthResponse, User } from '../types/api.types';

export const authService = {
  async login(email: string, password: string) {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return data;
  },

  async register(name: string, email: string, password: string) {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    return data;
  },

  async logout(refreshToken?: string) {
    const { data } = await apiClient.post<{ message: string }>('/auth/logout', {
      refreshToken,
    });
    return data;
  },

  async getCurrentUser() {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },

  async refresh(refreshToken: string) {
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    return data;
  },
};
