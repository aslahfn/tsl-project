import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = 'No data yet',
  message = 'Check back later for updates.',
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0A0A0F',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
});
