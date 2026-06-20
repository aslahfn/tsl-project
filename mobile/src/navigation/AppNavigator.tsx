import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TeamsScreen } from '../screens/TeamsScreen';
import { TeamDetailScreen } from '../screens/TeamDetailScreen';
import { PlayersScreen } from '../screens/PlayersScreen';
import { PlayerDetailScreen } from '../screens/PlayerDetailScreen';
import { FixturesScreen } from '../screens/FixturesScreen';
import { StandingsScreen } from '../screens/StandingsScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { NewsDetailScreen } from '../screens/NewsDetailScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { MoreScreen } from '../screens/MoreScreen';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0A0A0F',
    card: '#111827',
    text: '#FFFFFF',
    border: '#1F2937',
    primary: '#00FF87',
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0A0A0F' },
        headerTintColor: '#FFFFFF',
        tabBarStyle: { backgroundColor: '#111827', borderTopColor: '#1F2937' },
        tabBarActiveTintColor: '#00FF87',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home', headerTitle: 'SLS08' }} />
      <Tab.Screen name="TeamsTab" component={TeamsScreen} options={{ title: 'Teams' }} />
      <Tab.Screen name="FixturesTab" component={FixturesScreen} options={{ title: 'Fixtures' }} />
      <Tab.Screen name="StandingsTab" component={StandingsScreen} options={{ title: 'Standings' }} />
      <Tab.Screen name="MoreTab" component={MoreScreen} options={{ title: 'More' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0A0A0F' },
          headerTintColor: '#FFFFFF',
          contentStyle: { backgroundColor: '#0A0A0F' },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TeamDetail"
          component={TeamDetailScreen}
          options={({ route }) => ({ title: route.params.name })}
        />
        <Stack.Screen name="Players" component={PlayersScreen} />
        <Stack.Screen
          name="PlayerDetail"
          component={PlayerDetailScreen}
          options={({ route }) => ({ title: route.params.name })}
        />
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen
          name="NewsDetail"
          component={NewsDetailScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
