import { ScrollView, StyleSheet, Text } from 'react-native';
import { DataView } from '../components/DataView';
import { useNewsArticle } from '../hooks/useNews';
import type { NewsDetailScreenProps } from '../navigation/types';

export function NewsDetailScreen({ route }: NewsDetailScreenProps) {
  const { slug } = route.params;
  const state = useNewsArticle(slug);

  return (
    <DataView state={state}>
      {(article) => (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Text style={styles.category}>{article.category.replace('_', ' ')}</Text>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.meta}>By {article.author} · {new Date(article.publishedAt).toLocaleDateString()}</Text>
          <Text style={styles.body}>{article.content}</Text>
        </ScrollView>
      )}
    </DataView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  content: { padding: 20 },
  category: { color: '#00FF87', fontWeight: '700', fontSize: 12 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 8 },
  meta: { color: '#9CA3AF', marginTop: 8, marginBottom: 20 },
  body: { color: '#D1D5DB', lineHeight: 24, fontSize: 15 },
});
