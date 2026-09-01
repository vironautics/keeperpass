import { gzip as pakoGzip, ungzip as pakoUngzip } from 'pako';

function gzip(data: Uint8Array): Uint8Array {
  return pakoGzip(data);
}

function gunzip(data: Uint8Array): Uint8Array {
  return pakoUngzip(data);
}

export { gunzip, gzip };
