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

## Build & install

There's no Chrome Web Store listing yet, so installing the extension means
building it yourself and loading it unpacked. That's normal for a
Manifest V3 extension in developer mode — Chrome only blocks installing
extensions from a random webpage, not ones you build and load locally.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build it:

   ```bash
   npm run build
   ```

   This does two things: runs the normal Angular build, then bundles
   `src/scripts/content.ts` and `src/scripts/background.ts` — the scripts
   that run inside web pages and in the background — with esbuild, since
   those can't go through the regular Angular build pipeline. Output goes to
   `dist/extention/browser/`.

3. Load it in Chrome:

   1. Go to `chrome://extensions/`.
   2. Turn on **Developer mode** (top right).
   3. Click **Load unpacked** and select `dist/extention/browser/`.
   4. The extension should now show up in your extensions list.

4. Set up your own Google OAuth Client ID — sign-in won't work without one.
   See [Google OAuth setup](#google-oauth-setup) below.

For Edge specifically, this same unpatched build loads and runs correctly
(Edge is Chromium, so it accepts the same manifest and APIs as Chrome) — just
load it unpacked the same way as Chrome above. There's no automated Edge
build or publish step yet; that's coming back later. Firefox is close but
not identical — see the next section.

## Building for Firefox specifically

One script builds a store-ready, zipped package instead of the raw
`dist/extention/browser/` folder above:

```bash
npm run build:mozilla   # -> dist/extention/keeperpass-firefox-v<version>.zip
```

`build:mozilla` patches the manifest for the two places Firefox disagrees
with Chrome/Edge: `background.service_worker` becomes `background.scripts`
(Firefox's MV3 `service_worker` support is newer than Chrome/Edge's and not
universal), and it adds a fixed `browser_specific_settings.gecko.id` so
re-uploads are recognized as the same add-on rather than a new one each
time.

It's a plain Node script (`extention/scripts/build-firefox.mjs`) that runs
the normal `npm run build` first, so there's nothing extra to install beyond
what `npm install` already gets you.

### Publishing via GitHub Actions

`.github/workflows/publish-extension-firefox.yml` runs this script and
submits the result to addons.mozilla.org. It's manual (`workflow_dispatch`)
rather than triggered by every push — a store submission goes to real users
and isn't easily undone — and needs the version bumped in
`public/manifest.json` first (AMO rejects a re-upload of a version number
it's already seen). It uses Mozilla's own `web-ext sign` CLI (the `web-ext`
npm package, v8+), which talks to the AMO submission API directly — there's
no official GitHub Action for this, and no such thing as
`mozilla-actions/sign-addon`.

There's no Chrome workflow yet either — Chrome Web Store publishing needs a
one-time $5 developer registration fee that hasn't been paid yet.

## Google OAuth setup

Unlike a typical Chrome extension, this one uses a single OAuth 2.0 Client
ID of type **Web application** (not "Chrome Extension") shared across every
browser and platform — see the comment in
[`google-oauth-flow.ts`](src/app/core/auth/google-oauth-flow.ts) for why.
Sign-in goes through `identity.launchWebAuthFlow()`, a real WebExtensions API
that Chrome, Edge, and Firefox all implement the same way, rather than
Chrome's extension-only `chrome.identity.getAuthToken()`.

Full step-by-step instructions, including troubleshooting common errors, are
in [OAUTH_SETUP.md](OAUTH_SETUP.md).

Short version:

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/) and enable the **Google Drive API**.
2. Create an **OAuth 2.0 Client ID** of type **Web application**.
3. Load the extension unpacked in each browser you're targeting (see above),
   then call `getRedirectUrl()` (or just trigger sign-in and check the
   console) to read the redirect URI that browser actually generates — it's
   a different domain per browser (`chromiumapp.org` for Chrome/Edge, a
   different one for Firefox).
4. Add each of those redirect URIs to the Client ID's **Authorized redirect
   URIs**.
5. Put the Client ID in `src/environments/environment.ts` under
   `googleClientId`. OAuth client IDs for browser apps are public
   identifiers, not secrets, so committing this value is fine.

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
