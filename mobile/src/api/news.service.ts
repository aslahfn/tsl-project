import { apiClient } from './client';
import type { NewsArticle } from '../types/api.types';

export const newsService = {
  async getAll() {
    const { data } = await apiClient.get<NewsArticle[]>('/news');
    return data;
  },

  async getBySlug(slug: string) {
    const { data } = await apiClient.get<NewsArticle>(`/news/${slug}`);
    return data;
  },
};
