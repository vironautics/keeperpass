import { Platform } from 'react-native';

type GoogleOAuthConfig = {
  clientId: string;
};

/**
 * Reads the platform's OAuth client ID from `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` /
 * `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` (see `.env`). These must be "Android"/"iOS" type
 * clients, not "Web application" — Google only accepts a custom-scheme redirect
 * (what `makeRedirectUri()` produces here) from those types.
 */
function getGoogleOAuthConfig(): GoogleOAuthConfig {
  const clientId = Platform.select({
    ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    default: undefined,
  });

  if (!clientId) {
    throw new Error(
      Platform.OS === 'ios'
        ? "Google sign-in isn't configured for iOS yet."
        : "Google sign-in isn't configured yet."
    );
  }

  return { clientId };
}

export { getGoogleOAuthConfig };
export type { GoogleOAuthConfig };
