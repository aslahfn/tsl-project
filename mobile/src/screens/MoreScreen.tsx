import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../navigation/types';

export function MoreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthenticated, user, logout } = useAuth();

  const links: { label: string; screen: keyof RootStackParamList }[] = [
    { label: 'Players', screen: 'Players' },
    { label: 'News', screen: 'News' },
    { label: 'Notifications', screen: 'Notifications' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>More</Text>

      {links.map((link) => (
        <Pressable
          key={link.screen}
          style={styles.link}
          onPress={() => {
            if (link.screen === 'Players') navigation.navigate('Players');
            if (link.screen === 'News') navigation.navigate('News');
            if (link.screen === 'Notifications') navigation.navigate('Notifications');
          }}
        >
          <Text style={styles.linkText}>{link.label}</Text>
        </Pressable>
      ))}

      <View style={styles.authBox}>
        {isAuthenticated ? (
          <>
            <Text style={styles.userText}>Signed in as {user?.name}</Text>
            <Pressable style={styles.button} onPress={logout}>
              <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.secondaryText}>Register</Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F', padding: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 16 },
  link: { backgroundColor: '#111827', borderRadius: 10, padding: 16, marginBottom: 10 },
  linkText: { color: '#FFFFFF', fontWeight: '600' },
  authBox: { marginTop: 24 },
  userText: { color: '#9CA3AF', marginBottom: 12 },
  button: { backgroundColor: '#00FF87', borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonText: { color: '#0A0A0F', fontWeight: '800' },
  secondaryButton: { marginTop: 10, padding: 14, alignItems: 'center' },
  secondaryText: { color: '#00FF87', fontWeight: '600' },
});
