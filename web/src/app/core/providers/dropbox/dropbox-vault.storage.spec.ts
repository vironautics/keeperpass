import { TestBed } from '@angular/core/testing';
import { StorageAuthExpiredError, VaultConflictError } from '../storage-errors';
import { DropboxVaultStorage } from './dropbox-vault.storage';

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers });

const notFound = () =>
  json({ error_summary: 'path/not_found/..', error: { '.tag': 'path', path: { '.tag': 'not_found' } } }, 409);

/** Stands in for `XMLHttpRequest`, which is how uploads report progress. */
class FakeXhr {
  static requests: FakeXhr[] = [];
  static respond: (request: FakeXhr) => { status: number; body: string } = () => ({
    status: 200,
    body: JSON.stringify({ rev: 'rev-after-save' }),
  });

  headers: Record<string, string> = {};
  upload: { onprogress: ((event: unknown) => void) | null } = { onprogress: null };
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  status = 0;
  responseText = '';
  url = '';
  sent = '';

  open(_method: string, url: string) {
    this.url = url;
  }
  setRequestHeader(name: string, value: string) {
    this.headers[name] = value;
  }
  send(body: string) {
    this.sent = body;
    FakeXhr.requests.push(this);
    const { status, body: responseText } = FakeXhr.respond(this);
    this.status = status;
    this.responseText = responseText;
    this.upload.onprogress?.({ lengthComputable: true, loaded: 5, total: 10 });
    queueMicrotask(() => this.onload?.());
  }
}

/** The mode an upload asked for, read back out of its `Dropbox-API-Arg` header. */
const modeOf = (request: FakeXhr) => JSON.parse(request.headers['Dropbox-API-Arg']).mode;

describe('DropboxVaultStorage', () => {
  let storage: DropboxVaultStorage;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    FakeXhr.requests = [];
    FakeXhr.respond = () => ({ status: 200, body: JSON.stringify({ rev: 'rev-after-save' }) });
    vi.stubGlobal('XMLHttpRequest', FakeXhr);
    fetchMock = vi.spyOn(globalThis, 'fetch') as unknown as ReturnType<typeof vi.fn>;
    storage = TestBed.inject(DropboxVaultStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('vaultExists', () => {
    it('is true when the file is there', async () => {
      fetchMock.mockResolvedValue(json({ '.tag': 'file' }));

      await expect(storage.vaultExists('token')).resolves.toBe(true);
      expect(fetchMock.mock.calls[0][0]).toBe('https://api.dropboxapi.com/2/files/get_metadata');
    });

    it('is false — not an error — when there is no vault yet', async () => {
      fetchMock.mockResolvedValue(notFound());

      await expect(storage.vaultExists('token')).resolves.toBe(false);
    });

    it('throws StorageAuthExpiredError for an expired token', async () => {
      fetchMock.mockResolvedValue(
        json({ error_summary: 'expired_access_token/', error: { '.tag': 'expired_access_token' } }, 401),
      );

      await expect(storage.vaultExists('stale')).rejects.toBeInstanceOf(StorageAuthExpiredError);
    });

    it('does not mistake a missing scope for an expiry, which would disconnect in a loop', async () => {
      fetchMock.mockResolvedValue(
        json({ error: { '.tag': 'missing_scope', required_scope: 'files.metadata.read' } }, 401),
      );

      const failure = await storage.vaultExists('token').catch((error: unknown) => error);

      expect(failure).toBeInstanceOf(Error);
      expect(failure).not.toBeInstanceOf(StorageAuthExpiredError);
    });

    it('waits out a 429 and tries again', async () => {
      vi.useFakeTimers();
      fetchMock
        .mockResolvedValueOnce(new Response('', { status: 429, headers: { 'Retry-After': '2' } }))
        .mockResolvedValueOnce(json({ '.tag': 'file' }));

      const result = storage.vaultExists('token');
      await vi.advanceTimersByTimeAsync(2_000);

      await expect(result).resolves.toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('loadVault', () => {
    it('downloads the file as text', async () => {
      fetchMock.mockResolvedValue(
        new Response('ciphertext', {
          headers: { 'Dropbox-API-Result': JSON.stringify({ rev: 'abc' }) },
        }),
      );

      await expect(storage.loadVault('token')).resolves.toBe('ciphertext');
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://content.dropboxapi.com/2/files/download');
      expect(JSON.parse(init.headers['Dropbox-API-Arg'])).toEqual({ path: '/vault.json.enc' });
    });

    it('is null when there is no vault yet', async () => {
      fetchMock.mockResolvedValue(notFound());

      await expect(storage.loadVault('token')).resolves.toBeNull();
    });
  });

  describe('saveVault', () => {
    it('creates the file, refusing to overwrite one this session never read', async () => {
      await storage.saveVault('token', 'ciphertext');

      expect(FakeXhr.requests[0].url).toBe('https://content.dropboxapi.com/2/files/upload');
      expect(FakeXhr.requests[0].sent).toBe('ciphertext');
      expect(modeOf(FakeXhr.requests[0])).toEqual({ '.tag': 'add' });
    });

    it('updates exactly the revision it last read, then the one it just wrote', async () => {
      fetchMock.mockResolvedValue(
        new Response('ciphertext', {
          headers: { 'Dropbox-API-Result': JSON.stringify({ rev: 'rev-loaded' }) },
        }),
      );
      await storage.loadVault('token');

      await storage.saveVault('token', 'one');
      await storage.saveVault('token', 'two');

      expect(modeOf(FakeXhr.requests[0])).toEqual({ '.tag': 'update', update: 'rev-loaded' });
      expect(modeOf(FakeXhr.requests[1])).toEqual({ '.tag': 'update', update: 'rev-after-save' });
    });

    it('refuses to overwrite a vault another device changed in the meantime', async () => {
      FakeXhr.respond = () => ({
        status: 409,
        body: JSON.stringify({
          error: { '.tag': 'path', reason: { '.tag': 'conflict', conflict: { '.tag': 'file' } } },
        }),
      });

      await expect(storage.saveVault('token', 'ciphertext')).rejects.toBeInstanceOf(VaultConflictError);
    });

    it('throws StorageAuthExpiredError on a 401', async () => {
      FakeXhr.respond = () => ({
        status: 401,
        body: JSON.stringify({ error: { '.tag': 'invalid_access_token' } }),
      });

      await expect(storage.saveVault('stale', 'ciphertext')).rejects.toBeInstanceOf(
        StorageAuthExpiredError,
      );
    });

    it('reports upload progress from 0 to 1', async () => {
      const progress: number[] = [];

      await storage.saveVault('token', 'ciphertext', (fraction) => progress.push(fraction));

      expect(progress).toEqual([0, 0.5, 1]);
    });
  });

  describe('resetVault', () => {
    it('moves the old vault aside as a backup, then creates a fresh one', async () => {
      fetchMock.mockResolvedValue(json({ metadata: {} }));

      await storage.resetVault('token', 'fresh');

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://api.dropboxapi.com/2/files/move_v2');
      const body = JSON.parse(init.body);
      expect(body.from_path).toBe('/vault.json.enc');
      expect(body.to_path).toMatch(/^\/vault\.backup-\d+\.json\.enc$/);
      expect(modeOf(FakeXhr.requests[0])).toEqual({ '.tag': 'add' });
    });

    it('does not create a new vault if the backup failed', async () => {
      fetchMock.mockResolvedValue(json({ error: { '.tag': 'internal_error' } }, 409));

      await expect(storage.resetVault('token', 'fresh')).rejects.toThrow(/back up/);
      expect(FakeXhr.requests).toHaveLength(0);
    });
  });

  describe('detachVault', () => {
    it('renames the vault out of the way and says so', async () => {
      fetchMock.mockResolvedValue(json({ metadata: {} }));

      await expect(storage.detachVault('token')).resolves.toBe(true);
      expect(JSON.parse(fetchMock.mock.calls[0][1].body).to_path).toMatch(
        /^\/vault\.removed-.*\.json\.enc$/,
      );
    });

    it('is false when there was nothing to rename', async () => {
      fetchMock.mockResolvedValue(
        json({ error: { '.tag': 'from_lookup', from_lookup: { '.tag': 'not_found' } } }, 409),
      );

      await expect(storage.detachVault('token')).resolves.toBe(false);
    });
  });
});
