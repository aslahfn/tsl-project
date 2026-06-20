import { FlatList, StyleSheet, Text, View } from 'react-native';
import { DataView } from '../components/DataView';
import { useRealtimeRefresh } from '../context/RealtimeContext';
import { useStandings } from '../hooks/useStandings';
import type { Standing } from '../types/api.types';

export function StandingsScreen() {
  const state = useStandings();
  useRealtimeRefresh(state.refresh);

  return (
    <DataView state={state} emptyTitle="No standings" emptyMessage="Standings will update after matches are played.">
      {(standings: Standing[]) => (
        <FlatList
          data={standings}
          keyExtractor={(item) => item.teamId}
          ListHeaderComponent={
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, styles.pos]}>#</Text>
              <Text style={[styles.headerCell, styles.team]}>Team</Text>
              <Text style={styles.headerCell}>P</Text>
              <Text style={styles.headerCell}>GD</Text>
              <Text style={styles.headerCell}>Pts</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.pos]}>{item.position}</Text>
              <Text style={[styles.cell, styles.team]}>{item.teamShort}</Text>
              <Text style={styles.cell}>{item.played}</Text>
              <Text style={styles.cell}>{item.goalDifference > 0 ? `+${item.goalDifference}` : item.goalDifference}</Text>
              <Text style={[styles.cell, styles.pts]}>{item.points}</Text>
            </View>
          )}
        />
      )}
    </DataView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', padding: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  headerCell: { color: '#9CA3AF', fontSize: 12, fontWeight: '700', width: 40, textAlign: 'center' },
  row: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#111827' },
  cell: { color: '#FFFFFF', width: 40, textAlign: 'center' },
  pos: { width: 30 },
  team: { flex: 1, textAlign: 'left', fontWeight: '600' },
  pts: { color: '#00FF87', fontWeight: '800' },
});
