import { apiClient } from './client';
import type { Standing } from '../types/api.types';

export const standingsService = {
  async getAll() {
    const { data } = await apiClient.get<Standing[]>('/standings');
    return data;
  },
};
