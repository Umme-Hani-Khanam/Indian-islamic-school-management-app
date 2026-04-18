import { View, ActivityIndicator } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/context/auth';
import { useEffect } from 'react';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(public)/login');
    }
  }, [isLoading, isAuthenticated, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Prevent flicker before redirect finishes natively
  if (!isAuthenticated) return null;

  return <Slot />;
}
