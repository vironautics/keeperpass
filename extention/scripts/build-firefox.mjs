// Builds the extension for Firefox: the shared MV3 output, patched for the
// two places Firefox's Add-on platform disagrees with Chrome/Edge, then
// zipped for upload to addons.mozilla.org.
//
//   1. `background.service_worker` is a newer addition to Firefox's MV3
//      support (121+); `background.scripts` is the form every Firefox
//      version accepts, so the Firefox build uses that instead.
//   2. Firefox wants a stable extension ID declared up front
//      (`browser_specific_settings.gecko.id`) rather than deriving one the
//      way Chrome/Edge do — without it, every reviewer upload would look
//      like a different add-on.
//
// The OAuth flow itself (`identity.launchWebAuthFlow`) needs no
// Firefox-specific handling — see `src/app/core/auth/google-oauth-flow.ts`.
import { prepareTargetDist } from './lib/prepare-dist.mjs';
import { zipDir } from './lib/zip-dir.mjs';
import path from 'node:path';

const GECKO_ID = 'extension@keeperpass.com';
const GECKO_MIN_VERSION = '109.0'; // First Firefox release with MV3 support.

const { dir, manifest, writeManifest } = prepareTargetDist('firefox');

const { service_worker, ...restBackground } = manifest.background ?? {};
manifest.background = { ...restBackground, scripts: [service_worker ?? 'background.js'] };

manifest.browser_specific_settings = {
  ...manifest.browser_specific_settings,
  gecko: {
    id: GECKO_ID,
    strict_min_version: GECKO_MIN_VERSION,
    ...manifest.browser_specific_settings?.gecko,
  },
};

writeManifest(manifest);

const outFile = path.join(path.dirname(dir), `keeperpass-firefox-v${manifest.version}.zip`);
const bytes = await zipDir(dir, outFile);

console.log(`Firefox build ready: ${outFile} (${(bytes / 1024).toFixed(0)} KiB)`);
