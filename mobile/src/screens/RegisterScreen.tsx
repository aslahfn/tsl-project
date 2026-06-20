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

export function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    clearError();
    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigation.goBack();
    } catch {
      // error shown via context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#6B7280"
        value={name}
        onChangeText={setName}
      />
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
        placeholder="Password (min 6 chars)"
        placeholderTextColor="#6B7280"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={handleRegister} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#0A0A0F" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
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
  error: { color: '#EF4444', marginBottom: 8 },
});
