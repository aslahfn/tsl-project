import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function LoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00FF87" />
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
});
