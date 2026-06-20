import { useCallback } from 'react';
import { standingsService } from '../api/standings.service';
import { useAsyncData } from './useAsyncData';
import type { Standing } from '../types/api.types';

export function useStandings() {
  const fetcher = useCallback(() => standingsService.getAll(), []);
  return useAsyncData<Standing[]>(fetcher);
}
