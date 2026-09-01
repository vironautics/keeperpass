import { ensureFreshToken } from '@/lib/auth/google-auth';
import { useSessionStore } from '@/lib/auth/session-store';

function disconnectSession(): void {
  void useSessionStore.getState().signOut();
}

/**
 * Returns a usable access token, refreshing it first if it's stale. Refreshing on RN is
 * necessarily interactive (see `google-auth.ts`), so only call this from a user gesture.
 * Force-disconnects (back to Start) on any failure, mirroring every Drive-touching
 * submit handler in the web app.
 */
async function ensureFreshTokenOrDisconnect(): Promise<string | null> {
  const session = useSessionStore.getState();
  if (session.accessToken && !session.tokenExpired()) {
    return session.accessToken;
  }

  try {
    const { accessToken, expiresAt } = await ensureFreshToken();
    await useSessionStore.getState().renewToken(accessToken, expiresAt);
    return accessToken;
  } catch {
    disconnectSession();
    return null;
  }
}

export { disconnectSession, ensureFreshTokenOrDisconnect };
