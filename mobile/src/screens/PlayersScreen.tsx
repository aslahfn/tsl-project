import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DataView } from '../components/DataView';
import { useRealtimeRefresh } from '../context/RealtimeContext';
import { usePlayers } from '../hooks/usePlayers';
import type { Player } from '../types/api.types';
import type { RootStackParamList } from '../navigation/types';

export function PlayersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const state = usePlayers();
  useRealtimeRefresh(state.refresh);

  return (
    <DataView state={state} emptyTitle="No players" emptyMessage="Player data is not available yet.">
      {(players: Player[]) => (
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate('PlayerDetail', { id: item.id, name: item.name })
              }
            >
              <Text style={styles.number}>{item.number}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.teamName} · {item.position}</Text>
              <Text style={styles.stats}>{item.goals} goals · {item.assists} assists · ★ {item.rating}</Text>
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
  number: { color: '#00FF87', fontWeight: '800' },
  name: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', marginTop: 4 },
  meta: { color: '#9CA3AF', marginTop: 4 },
  stats: { color: '#D1D5DB', marginTop: 6, fontSize: 13 },
});
