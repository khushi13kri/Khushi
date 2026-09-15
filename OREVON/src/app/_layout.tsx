import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { OrevonSplashOverlay } from '@/components/splash-overlay';
import { AppStateProvider } from '@/state/app-state';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppStateProvider>
        <OrevonSplashOverlay />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
      </AppStateProvider>
    </ThemeProvider>
  );
}
