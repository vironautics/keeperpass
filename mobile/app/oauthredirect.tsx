import { routeForPhase } from '@/lib/auth/routing';
import { useSessionStore } from '@/lib/auth/session-store';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

/**
 * Google's OAuth redirect (`${applicationId}:/oauthredirect`) reopens the app as a deep link,
 * which Expo Router treats as a real navigation — landing here instead of `WebBrowser`/
 * `AuthSession` invisibly resolving the sign-in promise. This screen exists only to give that
 * deep link a real route (avoiding the "screen doesn't exist" 404), then immediately replaces
 * itself with whatever screen the *current* session state actually points to. `_layout.tsx`'s
 * own `[phase, hasVault]` effect keeps that in sync for every later transition — this one only
 * has to handle the very first landing, before any phase change may have fired.
 */
export default function OAuthRedirectScreen() {
  const router = useRouter();

  useEffect(() => {
    const { phase, hasVault } = useSessionStore.getState();
    router.replace(routeForPhase(phase, hasVault));
  }, [router]);

  return null;
}
