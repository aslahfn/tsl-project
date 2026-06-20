import { useCallback } from 'react';
import { newsService } from '../api/news.service';
import { useAsyncData } from './useAsyncData';
import type { NewsArticle } from '../types/api.types';

export function useNews() {
  const fetcher = useCallback(() => newsService.getAll(), []);
  return useAsyncData<NewsArticle[]>(fetcher);
}

export function useNewsArticle(slug: string) {
  const fetcher = useCallback(() => newsService.getBySlug(slug), [slug]);
  return useAsyncData<NewsArticle>(fetcher);
}
