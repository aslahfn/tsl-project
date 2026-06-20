import { StyleSheet, Text, View } from 'react-native';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import type { AsyncState } from '../hooks/useAsyncData';

interface DataViewProps<T> {
  state: AsyncState<T>;
  emptyTitle?: string;
  emptyMessage?: string;
  children: (data: T) => React.ReactNode;
}

export function DataView<T>({
  state,
  emptyTitle,
  emptyMessage,
  children,
}: DataViewProps<T>) {
  if (state.loading && !state.data) return <LoadingState />;
  if (state.error && !state.data) {
    return <ErrorState message={state.error} onRetry={state.retry} />;
  }
  if (!state.data || state.isEmpty) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }
  return (
    <View style={styles.container}>
      {state.loading && (
        <Text style={styles.refreshing}>Refreshing...</Text>
      )}
      {children(state.data)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  refreshing: {
    color: '#00FF87',
    textAlign: 'center',
    padding: 8,
    fontSize: 12,
  },
});
