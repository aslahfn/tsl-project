import { useCallback, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DataView } from '../components/DataView';
import { useRealtimeRefresh } from '../context/RealtimeContext';
import { useTeams } from '../hooks/useTeams';
import type { Team } from '../types/api.types';
import type { RootStackParamList } from '../navigation/types';

export function TeamsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const state = useTeams();

  const refresh = useCallback(() => state.refresh(), [state.refresh]);
  useRealtimeRefresh(refresh);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', refresh);
    return unsubscribe;
  }, [navigation, refresh]);

  return (
    <DataView state={state} emptyTitle="No teams" emptyMessage="Teams will appear once the season is set up.">
      {(teams: Team[]) => (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate('TeamDetail', { slug: item.slug, name: item.name })
              }
            >
              <Text style={styles.short}>{item.shortName}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.city} · {item.manager}</Text>
            </Pressable>
          )}
        />
      )}
    </DataView>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00FF87',
  },
  short: { color: '#00FF87', fontWeight: '800', fontSize: 12 },
  name: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 4 },
  meta: { color: '#9CA3AF', marginTop: 6, fontSize: 13 },
});
