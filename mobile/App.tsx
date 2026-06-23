import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { RealtimeProvider } from './src/context/RealtimeContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { usePushNotifications } from './src/hooks/usePushNotifications';

export default function App() {
  usePushNotifications();
  
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
