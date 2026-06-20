import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList } from '../navigation/types';

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('admin@tsl.com');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    clearError();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigation.goBack();
    } catch {
      // error shown via context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#6B7280"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#6B7280"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={handleLogin} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#0A0A0F" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Create an account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F', padding: 24, justifyContent: 'center' },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginBottom: 24 },
  input: { backgroundColor: '#111827', color: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 12 },
  button: { backgroundColor: '#00FF87', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#0A0A0F', fontWeight: '800' },
  link: { color: '#00FF87', textAlign: 'center', marginTop: 16 },
  error: { color: '#EF4444', marginBottom: 8 },
});
