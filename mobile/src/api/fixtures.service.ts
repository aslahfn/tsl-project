import { apiClient } from './client';
import type { Fixture } from '../types/api.types';

export const fixturesService = {
  async getAll(status?: string) {
    const { data } = await apiClient.get<Fixture[]>('/fixtures', {
      params: status ? { status } : undefined,
    });
    return data;
  },

  async getResults() {
    const { data } = await apiClient.get<Fixture[]>('/fixtures/results');
    return data;
  },

  async getLive() {
    const { data } = await apiClient.get<Fixture[]>('/fixtures/live');
    return data;
  },

  async getById(id: string) {
    const { data } = await apiClient.get<Fixture>(`/fixtures/${id}`);
    return data;
  },
};
