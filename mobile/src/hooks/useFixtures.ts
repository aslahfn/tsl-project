import { useCallback } from 'react';
import { fixturesService } from '../api/fixtures.service';
import { useAsyncData } from './useAsyncData';
import type { Fixture } from '../types/api.types';

export function useFixtures(status?: string) {
  const fetcher = useCallback(
    () => fixturesService.getAll(status),
    [status],
  );
  return useAsyncData<Fixture[]>(fetcher);
}

export function useMatchResults() {
  const fetcher = useCallback(() => fixturesService.getResults(), []);
  return useAsyncData<Fixture[]>(fetcher);
}

export function useLiveFixtures() {
  const fetcher = useCallback(() => fixturesService.getLive(), []);
  return useAsyncData<Fixture[]>(fetcher);
}
