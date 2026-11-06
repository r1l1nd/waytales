import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Startbildschirm stehen lassen, bis die Schrift geladen ist. Sonst springt der Text sichtbar um.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Nur die Stärken laden, die die App wirklich nutzt. Jede weitere kostet Startzeit.
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  // Auch bei einem Fehler weitermachen: Dann zeigt die App eben die Systemschrift.
  const isReady = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="story-detail"
        options={{ presentation: 'modal', title: 'Geschichte' }}
      />
    </Stack>
  );
}
