import '@/global.css';

import {
  isCheckingVault,
  isReady,
  isSetupReachable,
  isSignedOut,
  isUnlockReachable,
  routeForPhase,
} from '@/lib/auth/routing';
import { useSessionStore } from '@/lib/auth/session-store';
import { NAV_THEME } from '@/lib/theme';
import { useFonts } from 'expo-font';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [fontsLoaded] = useFonts({
    Nunito: require('../assets/fonts/Nunito-Regular.ttf'),
    'Nunito-SemiBold': require('../assets/fonts/Nunito-SemiBold.ttf'),
    'FontAwesome-Light': require('../assets/fonts/FontAwesome-Light.ttf'),
  });

  const router = useRouter();
  const phase = useSessionStore((state) => state.phase);
  const hasVault = useSessionStore((state) => state.hasVault);
  const bootstrap = useSessionStore((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
    // Runs once on mount — bootstrap() is a stable store action, not reactive state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ready = fontsLoaded && phase !== 'bootstrapping';

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  useEffect(() => {
    if (ready) {
      router.replace(routeForPhase(phase, hasVault));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, phase, hasVault]);

  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="oauthredirect" />
        <Stack.Protected guard={isSignedOut(phase)}>
          <Stack.Screen name="index" />
        </Stack.Protected>
        <Stack.Protected guard={isCheckingVault(phase, hasVault)}>
          <Stack.Screen name="vault-check" />
        </Stack.Protected>
        <Stack.Protected guard={isUnlockReachable(phase, hasVault)}>
          <Stack.Screen name="unlock" />
          <Stack.Screen name="recover" />
        </Stack.Protected>
        <Stack.Protected guard={isSetupReachable(phase, hasVault)}>
          <Stack.Screen name="setup" />
        </Stack.Protected>
        <Stack.Protected guard={isReady(phase)}>
          <Stack.Screen name="items" />
        </Stack.Protected>
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
