import { useCallback } from 'react';
import { teamsService } from '../api/teams.service';
import { useAsyncData } from './useAsyncData';
import type { Team } from '../types/api.types';

export function useTeams() {
  const fetcher = useCallback(() => teamsService.getAll(), []);
  return useAsyncData<Team[]>(fetcher);
}

export function useTeam(slug: string) {
  const fetcher = useCallback(() => teamsService.getBySlug(slug), [slug]);
  return useAsyncData(fetcher);
}
