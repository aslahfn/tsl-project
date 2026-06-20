import { StyleSheet, Text, View } from 'react-native';
import { DataView } from '../components/DataView';
import { usePlayer } from '../hooks/usePlayers';
import type { PlayerDetailScreenProps } from '../navigation/types';

export function PlayerDetailScreen({ route }: PlayerDetailScreenProps) {
  const { id } = route.params;
  const state = usePlayer(id);

  return (
    <DataView state={state}>
      {(player) => (
        <View style={styles.container}>
          <Text style={styles.number}>#{player.number}</Text>
          <Text style={styles.name}>{player.name}</Text>
          <Text style={styles.team}>{player.teamName}</Text>
          <View style={styles.grid}>
            <Stat label="Position" value={player.position} />
            <Stat label="Age" value={String(player.age)} />
            <Stat label="Goals" value={String(player.goals)} />
            <Stat label="Assists" value={String(player.assists)} />
            <Stat label="Matches" value={String(player.matches)} />
            <Stat label="Rating" value={String(player.rating)} />
          </View>
        </View>
      )}
    </DataView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F', padding: 20 },
  number: { color: '#00FF87', fontWeight: '800', fontSize: 14 },
  name: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', marginTop: 8 },
  team: { color: '#9CA3AF', marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 24, gap: 12 },
  stat: { width: '30%', backgroundColor: '#111827', borderRadius: 10, padding: 12 },
  statLabel: { color: '#9CA3AF', fontSize: 12 },
  statValue: { color: '#FFFFFF', fontWeight: '700', fontSize: 18, marginTop: 4 },
});
