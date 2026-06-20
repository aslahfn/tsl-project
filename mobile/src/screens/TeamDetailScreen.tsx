import { FlatList, StyleSheet, Text, View } from 'react-native';
import { DataView } from '../components/DataView';
import { useRealtimeRefresh } from '../context/RealtimeContext';
import { useTeam } from '../hooks/useTeams';
import { usePlayers } from '../hooks/usePlayers';
import type { TeamDetailScreenProps } from '../navigation/types';

export function TeamDetailScreen({ route }: TeamDetailScreenProps) {
  const { slug } = route.params;
  const teamState = useTeam(slug);
  const teamId = teamState.data?.id;
  const playersState = usePlayers(teamId);

  useRealtimeRefresh(() => {
    teamState.refresh();
    if (teamId) playersState.refresh();
  });

  if (teamState.loading && !teamState.data) {
    return <DataView state={teamState}>{() => null}</DataView>;
  }

  return (
    <View style={styles.container}>
      <DataView state={teamState}>
        {(team) => (
          <View style={styles.header}>
            <Text style={styles.short}>{team.shortName}</Text>
            <Text style={styles.name}>{team.name}</Text>
            <Text style={styles.meta}>Manager: {team.manager}</Text>
            <Text style={styles.meta}>Stadium: {team.stadium}</Text>
            <Text style={styles.desc}>{team.description}</Text>
          </View>
        )}
      </DataView>

      <Text style={styles.sectionTitle}>Squad</Text>
      {teamId ? (
        <DataView state={playersState} emptyTitle="No players" emptyMessage="No players registered for this team.">
          {(players) => (
            <FlatList
              data={players}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View style={styles.playerRow}>
                  <Text style={styles.number}>{item.number}</Text>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{item.name}</Text>
                    <Text style={styles.playerMeta}>{item.position} · {item.goals}G {item.assists}A</Text>
                  </View>
                </View>
              )}
            />
          )}
        </DataView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { padding: 20 },
  short: { color: '#00FF87', fontWeight: '800' },
  name: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 4 },
  meta: { color: '#9CA3AF', marginTop: 6 },
  desc: { color: '#D1D5DB', marginTop: 12, lineHeight: 20 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', paddingHorizontal: 20, marginBottom: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  playerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  number: { color: '#00FF87', width: 36, fontWeight: '800', fontSize: 16 },
  playerInfo: { flex: 1 },
  playerName: { color: '#FFFFFF', fontWeight: '600' },
  playerMeta: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
});
