import { useCallback, useEffect } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DataView } from '../components/DataView';
import { useRealtimeRefresh } from '../context/RealtimeContext';
import { useAuth } from '../context/AuthContext';
import { useStandings } from '../hooks/useStandings';
import { useFixtures, useLiveFixtures } from '../hooks/useFixtures';
import { useNews } from '../hooks/useNews';
import type { RootStackParamList } from '../navigation/types';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthenticated, user } = useAuth();
  const standings = useStandings();
  const fixtures = useFixtures();
  const live = useLiveFixtures();
  const news = useNews();

  const refreshAll = useCallback(() => {
    standings.refresh();
    fixtures.refresh();
    live.refresh();
    news.refresh();
  }, [standings, fixtures, live, news]);

  useRealtimeRefresh(refreshAll);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', refreshAll);
    return unsubscribe;
  }, [navigation, refreshAll]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FOOTBALL LEAGUE</Text>
        <Text style={styles.subtitle}>Season 08</Text>
        {isAuthenticated ? (
          <Text style={styles.user}>Welcome, {user?.name}</Text>
        ) : (
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Sign in</Text>
          </Pressable>
        )}
      </View>

      <Section title="Live Matches">
        <DataView state={live} emptyTitle="No live matches" emptyMessage="No matches are live right now.">
          {(data) => (
            <FlatList
              horizontal
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.liveCard}>
                  <Text style={styles.liveBadge}>LIVE</Text>
                  <Text style={styles.matchText}>
                    {item.homeTeamShort} {item.homeScore ?? 0} - {item.awayScore ?? 0} {item.awayTeamShort}
                  </Text>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </DataView>
      </Section>

      <Section title="Standings">
        <DataView state={standings}>
          {(data) => (
            <View>
              {data.slice(0, 4).map((row) => (
                <View key={row.teamId} style={styles.row}>
                  <Text style={styles.pos}>{row.position}</Text>
                  <Text style={styles.team}>{row.teamShort}</Text>
                  <Text style={styles.pts}>{row.points} pts</Text>
                </View>
              ))}
            </View>
          )}
        </DataView>
      </Section>

      <Section title="Upcoming Fixtures">
        <DataView state={fixtures}>
          {(data) => (
            <View>
              {data.filter((f) => f.status === 'UPCOMING').slice(0, 3).map((f) => (
                <View key={f.id} style={styles.fixtureRow}>
                  <Text style={styles.fixtureTeams}>
                    {f.homeTeamShort} vs {f.awayTeamShort}
                  </Text>
                  <Text style={styles.fixtureMeta}>{f.date} · {f.time}</Text>
                </View>
              ))}
            </View>
          )}
        </DataView>
      </Section>

      <Section title="Latest News">
        <DataView state={news}>
          {(data) => (
            <View>
              {data.slice(0, 3).map((article) => (
                <Pressable
                  key={article.id}
                  style={styles.newsRow}
                  onPress={() =>
                    navigation.navigate('NewsDetail', {
                      slug: article.slug,
                      title: article.title,
                    })
                  }
                >
                  <Text style={styles.newsTitle}>{article.title}</Text>
                  <Text style={styles.newsExcerpt}>{article.excerpt}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </DataView>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { padding: 20, paddingTop: 12 },
  title: { color: '#00FF87', fontSize: 20, fontWeight: '800' },
  subtitle: { color: '#9CA3AF', marginTop: 4 },
  user: { color: '#FFFFFF', marginTop: 8 },
  link: { color: '#00FF87', marginTop: 8, fontWeight: '600' },
  section: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  pos: { color: '#00FF87', width: 30, fontWeight: '700' },
  team: { color: '#FFFFFF', flex: 1 },
  pts: { color: '#9CA3AF' },
  fixtureRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  fixtureTeams: { color: '#FFFFFF', fontWeight: '600' },
  fixtureMeta: { color: '#9CA3AF', marginTop: 4, fontSize: 12 },
  liveCard: { backgroundColor: '#1F2937', padding: 12, borderRadius: 8, marginRight: 10, minWidth: 160 },
  liveBadge: { color: '#EF4444', fontWeight: '800', fontSize: 11, marginBottom: 6 },
  matchText: { color: '#FFFFFF', fontWeight: '700' },
  newsRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  newsTitle: { color: '#FFFFFF', fontWeight: '600' },
  newsExcerpt: { color: '#9CA3AF', marginTop: 4, fontSize: 12 },
});
