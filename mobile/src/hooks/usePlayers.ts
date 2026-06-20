import { useCallback } from 'react';
import { playersService } from '../api/players.service';
import { useAsyncData } from './useAsyncData';
import type { Player } from '../types/api.types';

export function usePlayers(teamId?: string) {
  const fetcher = useCallback(
    () => playersService.getAll(teamId),
    [teamId],
  );
  return useAsyncData<Player[]>(fetcher, [teamId]);
}

export function usePlayer(id: string) {
  const fetcher = useCallback(() => playersService.getById(id), [id]);
  return useAsyncData<Player>(fetcher, [id]);
}
