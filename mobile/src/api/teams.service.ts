import { apiClient } from './client';
import type { Team } from '../types/api.types';

export const teamsService = {
  async getAll() {
    const { data } = await apiClient.get<Team[]>('/teams');
    return data;
  },

  async getBySlug(slug: string) {
    const { data } = await apiClient.get<Team & { players: unknown[] }>(
      `/teams/${slug}`,
    );
    return data;
  },
};
