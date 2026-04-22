import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { login } from '../services/api';

export default function LoginScreen({ navigation }: any) {
  const [identifier, setIdentifier] = useState('teacher1');
  const [password, setPassword] = useState('Password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please enter both login ID and password');
      return;
    }
    try {
      setLoading(true);
      const data = await login(identifier, password);
      navigation.replace('Main', { user: data.user, token: data.accessToken });
    } catch (error: any) {
      Alert.alert('Login failed', error?.response?.data?.message || 'Unable to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>School Login</Text>
        <Text style={styles.subtitle}>Teacher / Parent access</Text>
        <TextInput
          placeholder="Teacher ID or Student ID"
          style={styles.input}
          autoCapitalize="none"
          value={identifier}
          onChangeText={setIdentifier}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f7f9fb' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 6 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8, color: '#1f2937' },
  subtitle: { color: '#6b7280', marginBottom: 20 },
  input: { backgroundColor: '#f3f4f6', borderRadius: 14, padding: 16, marginBottom: 14, fontSize: 16, color: '#111827' },
  button: { backgroundColor: '#2563eb', borderRadius: 14, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
