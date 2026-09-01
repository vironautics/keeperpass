# KeeperPass — Browser Extension

The KeeperPass browser extension. It gives you quick access to your vault
from the browser toolbar and can autofill saved logins into web pages. Like
the rest of KeeperPass, it's purely client-side: it talks directly to your
Google Drive, with no KeeperPass server in between.

Built with **Angular**. See the [root README](../README.md) for how
KeeperPass works as a whole.

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server (for working on the extension's UI in a normal browser
tab, before loading it as an actual extension):

```bash
npm start
```

Open `http://localhost:4200/`.

## Building the extension

```bash
npm run build
```

This does two things:

1. Runs the normal Angular build.
2. Bundles `src/scripts/content.ts` and `src/scripts/background.ts` — the
   scripts that run inside web pages and in the background — with esbuild,
   since those can't go through the regular Angular build pipeline.

Output goes to `dist/extention/browser/`.

## Loading it in Chrome

1. Run `npm run build`.
2. Go to `chrome://extensions/`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select `dist/extention/browser/`.
5. The extension should now show up in your extensions list.

## Google OAuth setup

The extension needs its own OAuth 2.0 Client ID, registered specifically for
a Chrome extension (these are tied to the extension's ID, not a web
origin). Full step-by-step instructions, including troubleshooting common
errors, are in [OAUTH_SETUP.md](OAUTH_SETUP.md).

Short version:

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/) and enable the **Google Drive API**.
2. Load the extension unpacked once (see above) so you can read its extension ID from `chrome://extensions/`.
3. Create an **OAuth 2.0 Client ID** of type **Chrome Extension**, using that ID.
4. Add the Client ID to `public/manifest.json` under `oauth2.client_id`.

As with every other part of KeeperPass, the only scope ever requested is
`drive.file` — access to files the extension creates itself, nothing else in
your Drive.

## Running tests

```bash
npm test
```

## Project structure

- `src/app/core/` — shared logic: encryption, Google Drive sync,
  authentication, autofill matching, and validation.
- `src/scripts/` — the content script and form detector that run inside web
  pages to find and fill login forms.
- `public/manifest.json` — the extension's manifest (permissions, OAuth
  config, entry points).

## Contributing

Pull requests are welcome. Please run tests before submitting one:

```bash
npm test
```

## License

See the [root LICENSE](../LICENSE).
