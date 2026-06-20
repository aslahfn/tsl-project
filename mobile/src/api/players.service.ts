import { apiClient } from './client';
import type { Player } from '../types/api.types';

export const playersService = {
  async getAll(teamId?: string) {
    const { data } = await apiClient.get<Player[]>('/players', {
      params: teamId ? { teamId } : undefined,
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await apiClient.get<Player>(`/players/${id}`);
    return data;
  },
};
