import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { RealtimeProvider } from './src/context/RealtimeContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RealtimeProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </RealtimeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
