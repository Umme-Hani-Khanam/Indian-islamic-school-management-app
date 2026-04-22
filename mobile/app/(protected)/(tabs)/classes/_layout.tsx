import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';
import { useEffect } from 'react';

export default function ClassesLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'PARENT') {
      router.replace('/dashboard');
    }
  }, [user]);

  if (user?.role === 'PARENT') return null;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'My Classes' }} />
      <Stack.Screen name="[classId]/students" options={{ title: 'Class Roster' }} />
      <Stack.Screen name="[classId]/student/[studentId]" options={{ title: 'Student Profile' }} />
    </Stack>
  );
}
