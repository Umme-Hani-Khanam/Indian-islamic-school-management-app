import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/context/auth';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Spacing } from '@/constants/Theme';
import { H1, Body, Label, PrimaryButton } from '@/components/DesignSystem';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await signIn(username, password);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={s.main}
    >
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={s.container}>
        {/* Branding Section */}
        <View style={s.brandSection}>
          <View style={s.logoBox}>
            <Ionicons name="school" size={40} color={Palette.primary} />
          </View>
          <H1 style={s.brandTitle}>Iqra Academy</H1>
          <Body style={s.brandSub}>Nurturing minds with wisdom and grace.</Body>
        </View>

        {/* Login Form */}
        <View style={s.form}>
          <View style={s.inputGroup}>
            <Label style={s.inputLabel}>Credential / ID</Label>
            <View style={s.inputBox}>
              <Ionicons name="person-outline" size={20} color={Palette.muted} />
              <TextInput
                style={s.input}
                placeholder="Student ID or Faculty Code"
                placeholderTextColor={Palette.muted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={s.inputGroup}>
            <Label style={s.inputLabel}>Access Key</Label>
            <View style={s.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color={Palette.muted} />
              <TextInput
                style={s.input}
                placeholder="••••••••"
                placeholderTextColor={Palette.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {error && (
            <View style={s.errorBox}>
               <Ionicons name="alert-circle" size={16} color={Palette.danger} />
               <Label style={{ color: Palette.danger, textTransform: 'none' }}>{error}</Label>
            </View>
          )}

          <PrimaryButton 
            title="Secure Login" 
            onPress={handleLogin} 
            loading={loading}
          />

          <TouchableOpacity style={s.forgotBtn}>
            <Label style={s.forgotText}>Request Access Support →</Label>
          </TouchableOpacity>
        </View>

        {/* Trust Footer */}
        <View style={s.footer}>
          <Ionicons name="shield-checkmark" size={16} color={Palette.muted} />
          <Label style={s.footerText}>Secure Educational Gateway</Label>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  main: { flex: 1, backgroundColor: Palette.surface },
  container: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  brandSection: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoBox: { 
    width: 80, 
    height: 80, 
    borderRadius: 20, 
    backgroundColor: Palette.white, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: Palette.border
  },
  brandTitle: { color: Palette.text, textAlign: 'center' },
  brandSub: { color: Palette.muted, textAlign: 'center', marginTop: Spacing.xs },
  form: { gap: Spacing.l },
  inputGroup: { gap: Spacing.s },
  inputLabel: { fontWeight: '600', color: Palette.text },
  inputBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: Palette.border, 
    borderRadius: 12, 
    paddingHorizontal: Spacing.m,
    backgroundColor: Palette.white
  },
  input: { flex: 1, paddingVertical: Spacing.m, marginLeft: Spacing.s, fontSize: 16, color: Palette.text },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.s, backgroundColor: Palette.danger + '10', padding: Spacing.m, borderRadius: 8 },
  forgotBtn: { alignSelf: 'center', marginTop: Spacing.s },
  forgotText: { color: Palette.primary, textTransform: 'none', fontWeight: '700' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.s, marginTop: Spacing.xxxl, opacity: 0.5 },
  footerText: { fontSize: 12, color: Palette.muted, textTransform: 'none' }
});
