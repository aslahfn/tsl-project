import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { RealtimeEvent } from '../types/api.types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications() {
  if (Platform.OS === 'web') return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;
  return Notifications.getExpoPushTokenAsync();
}

export async function showLocalNotification(event: RealtimeEvent) {
  if (event.type !== 'GOAL_EVENT' && event.type !== 'KICKOFF_ALERT') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: event.title ?? 'Match Update',
      body: event.message ?? '',
      data: { ...event },
    },
    trigger: null,
  });
}
