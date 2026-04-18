import { Stack } from 'expo-router';

export default function ClassesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'My Classes' }} />
      <Stack.Screen name="[classId]/students" options={{ title: 'Class Roster' }} />
      <Stack.Screen name="[classId]/student/[studentId]" options={{ title: 'Student Profile' }} />
    </Stack>
  );
}
