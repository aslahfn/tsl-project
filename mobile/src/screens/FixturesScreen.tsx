import { FlatList, StyleSheet, Text, View } from 'react-native';
import { DataView } from '../components/DataView';
import { useRealtimeRefresh } from '../context/RealtimeContext';
import { useFixtures } from '../hooks/useFixtures';
import type { Fixture } from '../types/api.types';

function FixtureCard({ fixture }: { fixture: Fixture }) {
  const isLive = fixture.status === 'LIVE';
  const isFinished = fixture.status === 'FINISHED';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.matchday}>MD {fixture.matchday}</Text>
        <Text style={[styles.status, isLive && styles.live, isFinished && styles.finished]}>
          {fixture.status}
        </Text>
      </View>
      <Text style={styles.teams}>
        {fixture.homeTeamName}
        {isFinished || isLive ? ` ${fixture.homeScore ?? 0}` : ''}
        {' vs '}
        {fixture.awayTeamName}
        {isFinished || isLive ? ` ${fixture.awayScore ?? 0}` : ''}
      </Text>
      <Text style={styles.meta}>{fixture.date} · {fixture.time} · {fixture.venue}</Text>
    </View>
  );
}

export function FixturesScreen() {
  const state = useFixtures();
  useRealtimeRefresh(state.refresh);

  return (
    <DataView state={state} emptyTitle="No fixtures" emptyMessage="The fixture list is empty.">
      {(fixtures: Fixture[]) => (
        <FlatList
          data={fixtures}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <FixtureCard fixture={item} />}
        />
      )}
    </DataView>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: { backgroundColor: '#111827', borderRadius: 12, padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  matchday: { color: '#9CA3AF', fontSize: 12 },
  status: { color: '#F59E0B', fontSize: 11, fontWeight: '700' },
  live: { color: '#EF4444' },
  finished: { color: '#00FF87' },
  teams: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  meta: { color: '#9CA3AF', marginTop: 6, fontSize: 12 },
});
