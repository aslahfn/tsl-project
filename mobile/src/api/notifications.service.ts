import { apiClient } from './client';
import type { Notification } from '../types/api.types';

export const notificationsService = {
  async getAll() {
    const { data } = await apiClient.get<Notification[]>('/notifications');
    return data;
  },

  async markAsRead(id: string) {
    const { data } = await apiClient.patch(`/notifications/${id}/read`);
    return data;
  },
};
