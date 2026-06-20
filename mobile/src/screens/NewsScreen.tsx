import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DataView } from '../components/DataView';
import { useRealtimeRefresh } from '../context/RealtimeContext';
import { useNews } from '../hooks/useNews';
import type { NewsArticle } from '../types/api.types';
import type { RootStackParamList } from '../navigation/types';

export function NewsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const state = useNews();
  useRealtimeRefresh(state.refresh);

  return (
    <DataView state={state} emptyTitle="No news" emptyMessage="News articles will appear here.">
      {(articles: NewsArticle[]) => (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate('NewsDetail', { slug: item.slug, title: item.title })
              }
            >
              <Text style={styles.category}>{item.category.replace('_', ' ')}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.excerpt}>{item.excerpt}</Text>
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
  category: { color: '#00FF87', fontSize: 11, fontWeight: '700' },
  title: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 6 },
  excerpt: { color: '#9CA3AF', marginTop: 8, lineHeight: 18 },
});
