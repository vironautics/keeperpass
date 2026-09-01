# KeeperPass — Web App

This is the main KeeperPass web app, the one that runs at
`vault.keeperpass.com`. It's built with **Angular**, and it's a purely
client-side app: there is no backend server for vault data. Everything —
encryption, decryption, and saving to Google Drive — happens in your
browser.

See the [root README](../README.md) for how KeeperPass works as a whole.

This project was generated with Angular CLI. Its UI is being migrated to
[spartan/ui](https://spartan.ng) component by component — if you're touching
a stylesheet or adding a UI component, read [SPARTAN.md](SPARTAN.md) and
[COLORS.md](COLORS.md) first, since both design systems ship at once and the
rules for keeping them from fighting are not obvious.

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

Open `http://localhost:4200/`. The app reloads automatically whenever you
change a source file.

## Google OAuth setup

The web app signs users in with Google and talks to the Google Drive API to
read and write the encrypted vault file. To run it locally you'll need your
own OAuth 2.0 Client ID from the
[Google Cloud Console](https://console.cloud.google.com/):

1. Create a project (or use an existing one).
2. Enable the **Google Drive API**.
3. Configure the OAuth consent screen and add the
   `https://www.googleapis.com/auth/drive.file` scope.
4. Create an **OAuth 2.0 Client ID** of type **Web application**, and add
   `http://localhost:4200` as an authorized JavaScript origin.
5. Wire the resulting Client ID into the app's configuration.

`drive.file` is the only scope KeeperPass ever asks for. It only grants
access to files the app itself creates — nothing else already in your Drive.

## Building

```bash
npm run build
```

Build output goes to `dist/`. The production build is optimized for
performance.

## Running tests

Unit tests run with [Vitest](https://vitest.dev/):

```bash
npm test
```

## Project structure

- `src/app/core/` — services that don't belong to one screen: encryption
  (`vault/vault-crypto.ts`), Google Drive sync, authentication, TOTP,
  validation, i18n, and so on.
- `src/app/features/` — the actual screens and dialogs, one folder per
  feature (auth, items, generator, policies, report, settings).

## Contributing

Pull requests are welcome. Please run tests before submitting one:

```bash
npm test
```

## License

See the [root LICENSE](../LICENSE).
