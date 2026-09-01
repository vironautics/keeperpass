import { getGoogleOAuthConfig } from '@/lib/auth/google-oauth-config';
import * as Application from 'expo-application';
import { AuthRequest, exchangeCodeAsync, makeRedirectUri, ResponseType } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

/**
 * Requesting `drive.file` alongside sign-in, in one consent — never incrementally,
 * which would mean a second consent screen later. Matches the web app's scope string exactly.
 */
const SCOPES = ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/drive.file'];

const DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

const USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

/** 60s skew, matching the web app — a token is treated as expired a minute before it truly is. */
const EXPIRY_SKEW_MS = 60_000;

type GoogleTokenResult = { accessToken: string; expiresAt: number };
type GoogleProfile = { email: string; name: string };
type GoogleSignInResult = GoogleProfile & GoogleTokenResult;

function computeExpiresAt(expiresInSeconds: number | undefined): number {
  return Date.now() + (expiresInSeconds ?? 3600) * 1000 - EXPIRY_SKEW_MS;
}

/** Authorization Code + PKCE flow — the native-appropriate equivalent of the web app's implicit-flow token client. */
async function requestGoogleAccessToken(): Promise<GoogleTokenResult> {
  const { clientId } = getGoogleOAuthConfig();
  if (!Application.applicationId) {
    throw new Error('Could not determine the app identifier needed for Google sign-in.');
  }

  // Matches Expo's own Google provider convention exactly (see expo-auth-session's
  // providers/Google.ts) — Google's Android/iOS OAuth clients expect the redirect
  // scheme to be the app's own package name / bundle ID, not an arbitrary custom scheme.
  const redirectUri = makeRedirectUri({ native: `${Application.applicationId}:/oauthredirect` });

  const request = new AuthRequest({
    clientId,
    redirectUri,
    scopes: SCOPES,
    responseType: ResponseType.Code,
    usePKCE: true,
  });

  const result = await request.promptAsync(DISCOVERY);
  if (result.type !== 'success') {
    throw new Error('Google sign-in was cancelled.');
  }

  const tokenResponse = await exchangeCodeAsync(
    {
      clientId,
      code: result.params.code,
      redirectUri,
      extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
    },
    DISCOVERY
  );

  return {
    accessToken: tokenResponse.accessToken,
    expiresAt: computeExpiresAt(tokenResponse.expiresIn),
  };
}

/** Fetched via REST, not decoded from a JWT/ID token — matches the web app, which never parses the token client's response as a JWT either. */
async function fetchProfile(accessToken: string): Promise<GoogleProfile> {
  const response = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error('Could not fetch your Google profile.');
  }
  const data = await response.json();
  return { email: data.email, name: data.name };
}

async function signInWithGoogle(): Promise<GoogleSignInResult> {
  const token = await requestGoogleAccessToken();
  const profile = await fetchProfile(token.accessToken);
  return { ...profile, ...token };
}

/**
 * Web's silent, no-UI renewal (`prompt: ''`) has no RN equivalent — a stale token can only be
 * refreshed by the same interactive consent flow as sign-in. Only call this from a user gesture
 * (e.g. a submit tap), never proactively in the background.
 */
async function ensureFreshToken(): Promise<GoogleTokenResult> {
  return requestGoogleAccessToken();
}

export { ensureFreshToken, fetchProfile, signInWithGoogle };
export type { GoogleSignInResult, GoogleTokenResult };
