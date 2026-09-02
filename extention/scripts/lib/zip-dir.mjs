// Zips a directory's contents (not the directory itself — store uploads expect
// manifest.json at the archive root) into a single file. Pure JS (via
// `archiver`) rather than shelling out to `zip`/`Compress-Archive`, since this
// runs both on contributors' machines (Windows, macOS, Linux) and in CI.
import { ZipArchive } from 'archiver';
import { createWriteStream } from 'node:fs';

/** @param {string} sourceDir @param {string} outFile */
export function zipDir(sourceDir, outFile) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outFile);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', () => resolve(archive.pointer()));
    archive.on('warning', (err) => reject(err));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}
