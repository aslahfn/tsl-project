import { useCallback } from 'react';
import { notificationsService } from '../api/notifications.service';
import { useAsyncData } from './useAsyncData';
import type { Notification } from '../types/api.types';

export function useNotifications() {
  const fetcher = useCallback(() => notificationsService.getAll(), []);
  return useAsyncData<Notification[]>(fetcher);
}
