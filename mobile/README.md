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

## Build & install

There's no App Store or Play Store listing yet, so getting the app onto a
phone means building it yourself. A couple of options, from quickest to most
"real":

**Fastest — Expo Go (for trying it out, not a standalone install):**
install [Expo Go](https://expo.dev/go) from the Play Store or App Store,
then run `npm run dev` in this folder and scan the QR code it prints. No
build step, but the app runs inside Expo Go rather than as its own app.

**A real, standalone build:**

1. Set up your own Google OAuth Client ID(s) first — see
   [Google OAuth setup](#google-oauth-setup) above.
2. Build with [EAS Build](https://docs.expo.dev/build/introduction/) (needs
   a free Expo account; run `npx eas build:configure` the first time):

   ```bash
   npx eas build --platform android
   ```

   (or `--platform ios`, or `--platform all`).
3. **Android:** download the `.apk` from the link EAS gives you, transfer it
   to your phone, and open it — you'll need to allow "install unknown apps"
   for whichever app you use to open it.

   **iOS:** Apple doesn't allow installing signed builds outside the App
   Store or TestFlight without a paid Apple Developer account. With one, use
   `eas submit --platform ios` to send the build to TestFlight, or run
   `npx expo run:ios` to install straight to a device connected to Xcode.

Alternatively, `npx expo run:android` / `npx expo run:ios` builds and
installs a development client directly onto a connected device or emulator,
without going through EAS at all.

## Contributing

Pull requests are welcome. Test on both Android and iOS (or at least the
simulator/emulator) if your change touches navigation, secure storage, or
the OAuth flow, since those behave differently per platform.

## License

See the [root LICENSE](../LICENSE).
