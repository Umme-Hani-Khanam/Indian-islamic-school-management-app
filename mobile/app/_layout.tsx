import { Slot } from 'expo-router';
import { AuthProvider } from '@/context/auth';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  if (!loaded) {
    return null; // Await fonts
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
