// Shared setup for the per-store build scripts: run the normal build once,
// then hand each script a clean copy of its output to patch and zip.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../../..');
const BUILD_OUTPUT = path.join(ROOT, 'dist/extention/browser');

/**
 * Runs `npm run build` (the shared Angular + esbuild build), then copies its
 * output into `dist/extention/<target>/` so each store's manifest patch and
 * zip step can't collide with another target's.
 *
 * @param {string} target e.g. "firefox" or "edge"
 * @returns {{ dir: string, manifest: object, manifestPath: string }}
 */
export function prepareTargetDist(target) {
  execFileSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit', shell: true });

  if (!existsSync(BUILD_OUTPUT)) {
    throw new Error(`Expected build output at ${BUILD_OUTPUT}, but it doesn't exist.`);
  }

  const targetDir = path.join(ROOT, 'dist/extention', target);
  rmSync(targetDir, { recursive: true, force: true });
  mkdirSync(targetDir, { recursive: true });
  cpSync(BUILD_OUTPUT, targetDir, { recursive: true });

  const manifestPath = path.join(targetDir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  return {
    dir: targetDir,
    manifest,
    manifestPath,
    writeManifest: (updated) => writeFileSync(manifestPath, JSON.stringify(updated, null, 2) + '\n'),
  };
}

export { ROOT };
