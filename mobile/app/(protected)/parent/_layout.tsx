import { Stack } from 'expo-router';

export default function ParentLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1b5e20' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
  );
}
