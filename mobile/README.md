# KeeperPass — Mobile App

The KeeperPass app for iOS and Android, built with **Expo** and
**React Native**. Like every other part of KeeperPass, it's client-side
only: your vault is encrypted on the device and saved straight to your
Google Drive, with no KeeperPass server involved.

See the [root README](../README.md) for how KeeperPass works as a whole.

## Getting started

Install dependencies:

```bash
npm install
```

Start the Expo dev server:

```bash
npm run dev
```

This opens the Expo Dev Tools. From there you can:

- Press `a` to launch in the Android emulator, or run `npm run android`
- Press `i` to launch in the iOS simulator (Mac only), or run `npm run ios`
- Press `w` to run in a browser, or run `npm run web`
- Scan the QR code with the [Expo Go](https://expo.dev/go) app on a physical
  device

## Google OAuth setup

Sign-in uses `expo-auth-session` to run the Google OAuth flow, so you'll
need your own OAuth 2.0 Client ID(s) from the
[Google Cloud Console](https://console.cloud.google.com/):

1. Create a project (or use an existing one) and enable the
   **Google Drive API**.
2. Configure the OAuth consent screen and add the
   `https://www.googleapis.com/auth/drive.file` scope.
3. Create OAuth Client IDs for the platforms you're targeting (Android, iOS,
   and/or Web, depending on how you're running the app).
4. Wire the resulting Client ID(s) into the app's configuration, and make
   sure the redirect URI matches what `app/oauthredirect.tsx` expects.

As everywhere else in KeeperPass, `drive.file` is the only scope requested —
access to files the app creates itself, nothing else already in your Drive.

## Project structure

- `app/` — screens, using [Expo Router](https://expo.dev/router) for file-based navigation (`index`, `setup`, `unlock`, `items`, `recover`, `oauthredirect`, and so on).
- Vault encryption uses `@noble/ciphers` and `react-native-argon2` — the same
  Argon2id + AES-256-GCM approach as the web app and extension, just with
  native bindings instead of Web Crypto.
- Secrets that must persist (like the OAuth refresh token) use
  `expo-secure-store`, never plain storage.

## Building

For a full native build (rather than the managed Expo Go flow), this project
uses a development client:

```bash
npx expo run:android
```

For production builds, use [EAS Build](https://docs.expo.dev/build/introduction/).

## Contributing

Pull requests are welcome. Test on both Android and iOS (or at least the
simulator/emulator) if your change touches navigation, secure storage, or
the OAuth flow, since those behave differently per platform.

## License

See the [root LICENSE](../LICENSE).
