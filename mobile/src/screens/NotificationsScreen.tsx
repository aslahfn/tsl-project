import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { DataView } from '../components/DataView';
import { useRealtimeRefresh } from '../context/RealtimeContext';
import { useNotifications } from '../hooks/useNotifications';
import { notificationsService } from '../api/notifications.service';
import type { Notification } from '../types/api.types';

export function NotificationsScreen() {
  const state = useNotifications();
  useRealtimeRefresh(state.refresh);

  const markRead = async (id: string) => {
    await notificationsService.markAsRead(id);
    state.refresh();
  };

  return (
    <DataView state={state} emptyTitle="No notifications" emptyMessage="You have no notifications yet.">
      {(notifications: Notification[]) => (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.card, !item.read && styles.unread]}
              onPress={() => markRead(item.id)}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
            </Pressable>
          )}
        />
      )}
    </DataView>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: { backgroundColor: '#111827', borderRadius: 12, padding: 16, marginBottom: 12 },
  unread: { borderLeftWidth: 3, borderLeftColor: '#00FF87' },
  title: { color: '#FFFFFF', fontWeight: '700' },
  message: { color: '#9CA3AF', marginTop: 6 },
  time: { color: '#6B7280', marginTop: 8, fontSize: 11 },
});
