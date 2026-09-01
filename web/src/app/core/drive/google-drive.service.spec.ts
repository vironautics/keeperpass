import { TestBed } from '@angular/core/testing';
import { GoogleAuthExpiredError, GoogleDriveService } from './google-drive.service';

type FetchMock = ReturnType<typeof vi.fn>;

const SESSION_URI = 'https://www.googleapis.com/upload/session/abc123';

/** Matches the `q=` search Drive requests use to find the folder vs. the file inside it. */
const isFolderQuery = (url: string) =>
  decodeURIComponent(url).includes("mimeType='application/vnd.google-apps.folder'");

const isResumableInitiate = (url: string, init?: RequestInit) =>
  url.includes('uploadType=resumable') && (init?.method === 'POST' || init?.method === 'PATCH');

function fakeHeaders(values: Record<string, string | null>) {
  return { get: (name: string) => values[name] ?? null };
}

/** A resumable-session response: `Location` on the initiate request that starts it. */
function initiateResponse() {
  return { ok: true, headers: fakeHeaders({ Location: SESSION_URI }) };
}

/**
 * A resumable chunk PUT's response, computed from its own `Content-Range`
 * header — `bytes {start}-{end}/{total}` — the same way the real Drive API
 * would: `200` once `end` reaches `total - 1`, otherwise `308` with a
 * `Range` header confirming receipt up to `end`.
 */
function chunkResponse(init?: RequestInit) {
  const range = (init?.headers as Record<string, string>)['Content-Range'];
  const match = /bytes (\d+)-(\d+)\/(\d+)/.exec(range);
  if (!match) {
    throw new Error(`Test setup error: unexpected Content-Range "${range}"`);
  }
  const [, , endStr, totalStr] = match;
  const end = Number(endStr);
  const total = Number(totalStr);

  if (end === total - 1) {
    return { ok: true, status: 200, headers: fakeHeaders({}) };
  }
  return { ok: false, status: 308, headers: fakeHeaders({ Range: `bytes=0-${end}` }) };
}

describe('GoogleDriveService', () => {
  let service: GoogleDriveService;
  let fetchMock: FetchMock;

  beforeEach(() => {
    service = TestBed.inject(GoogleDriveService);
    fetchMock = vi.spyOn(globalThis, 'fetch') as unknown as FetchMock;
  });

  describe('loadVault', () => {
    it('returns null when the keeperpass folder does not exist yet', async () => {
      fetchMock.mockResolvedValue({ ok: true, json: async () => ({ files: [] }) });

      await expect(service.loadVault('token')).resolves.toBeNull();
    });

    it('returns null when the folder exists but has no vault file yet', async () => {
      fetchMock.mockImplementation(async (url: string) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        return { ok: true, json: async () => ({ files: [] }) };
      });

      await expect(service.loadVault('token')).resolves.toBeNull();
    });

    it('downloads the file inside the keeperpass folder', async () => {
      fetchMock.mockImplementation(async (url: string) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields='))
          return { ok: true, json: async () => ({ files: [{ id: 'file-1' }] }) };
        return { ok: true, text: async () => '{"encrypted":true}' };
      });

      await expect(service.loadVault('token')).resolves.toBe('{"encrypted":true}');
      expect(fetchMock).toHaveBeenCalledWith(
        'https://www.googleapis.com/drive/v3/files/file-1?alt=media',
        expect.objectContaining({ headers: { Authorization: 'Bearer token' } }),
      );
    });

    it('throws GoogleAuthExpiredError on a 401, distinctly from any other failure', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 401 });

      await expect(service.loadVault('stale-token')).rejects.toBeInstanceOf(GoogleAuthExpiredError);
    });
  });

  describe('vaultExists', () => {
    it('is false when the keeperpass folder does not exist yet', async () => {
      fetchMock.mockResolvedValue({ ok: true, json: async () => ({ files: [] }) });

      await expect(service.vaultExists('token')).resolves.toBe(false);
    });

    it('is false when the folder exists but holds no vault file', async () => {
      fetchMock.mockImplementation(async (url: string) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        return { ok: true, json: async () => ({ files: [] }) };
      });

      await expect(service.vaultExists('token')).resolves.toBe(false);
    });

    it('is true when the vault file is there', async () => {
      fetchMock.mockImplementation(async (url: string) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        return { ok: true, json: async () => ({ files: [{ id: 'file-1' }] }) };
      });

      await expect(service.vaultExists('token')).resolves.toBe(true);
    });

    // The point of not reusing `loadVault`: this answers a yes/no question,
    // and must not pull the whole (possibly large) file to do it.
    it('never downloads the file', async () => {
      fetchMock.mockImplementation(async (url: string) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        return { ok: true, json: async () => ({ files: [{ id: 'file-1' }] }) };
      });

      // The spy is shared across this file's tests and never reset, so drop
      // earlier calls before asserting on what *this* one did.
      fetchMock.mockClear();
      await service.vaultExists('token');

      const urls = fetchMock.mock.calls.map((call: unknown[]) => String(call[0]));
      expect(urls.some((url) => url.includes('alt=media'))).toBe(false);
    });

    it('surfaces an expired token', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 401 });

      await expect(service.vaultExists('token')).rejects.toBeInstanceOf(GoogleAuthExpiredError);
    });
  });

  describe('saveVault', () => {
    it('creates the folder and the file when neither exists yet', async () => {
      const calls: { url: string; method?: string }[] = [];
      fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
        calls.push({ url, method: init?.method });
        if (isFolderQuery(url)) return { ok: true, json: async () => ({ files: [] }) };
        if (url.includes('&fields=')) return { ok: true, json: async () => ({ files: [] }) };
        if (isResumableInitiate(url, init)) return initiateResponse();
        if (url === SESSION_URI) return chunkResponse(init);
        return { ok: true, json: async () => ({ id: 'folder-1' }) };
      });

      await service.saveVault('token', '{"encrypted":true}');

      const initiate = calls.find((c) => isResumableInitiate(c.url, { method: c.method }));
      expect(initiate?.method).toBe('POST');
      expect(initiate?.url).toBe(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      );
      expect(calls.some((c) => c.url === SESSION_URI && c.method === 'PUT')).toBe(true);
    });

    it('overwrites the existing file instead of creating a second one', async () => {
      const calls: { url: string; method?: string }[] = [];
      fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
        calls.push({ url, method: init?.method });
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields='))
          return { ok: true, json: async () => ({ files: [{ id: 'file-1' }] }) };
        if (isResumableInitiate(url, init)) return initiateResponse();
        if (url === SESSION_URI) return chunkResponse(init);
        return { ok: true, json: async () => ({}) };
      });

      await service.saveVault('token', '{"encrypted":true}');

      const initiate = calls.find((c) => isResumableInitiate(c.url, { method: c.method }));
      expect(initiate?.method).toBe('PATCH');
      expect(initiate?.url).toBe(
        'https://www.googleapis.com/upload/drive/v3/files/file-1?uploadType=resumable',
      );
    });

    it('sends the correct byte length and Content-Range for a single-chunk upload', async () => {
      const content = '{"encrypted":true}'; // 19 bytes, well under one 256 KiB chunk
      let initHeaders: Record<string, string> | undefined;
      let chunkHeaders: Record<string, string> | undefined;

      fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields='))
          return { ok: true, json: async () => ({ files: [{ id: 'file-1' }] }) };
        if (isResumableInitiate(url, init)) {
          initHeaders = init?.headers as Record<string, string>;
          return initiateResponse();
        }
        if (url === SESSION_URI) {
          chunkHeaders = init?.headers as Record<string, string>;
          return chunkResponse(init);
        }
        return { ok: true, json: async () => ({}) };
      });

      await service.saveVault('token', content);

      expect(initHeaders?.['X-Upload-Content-Length']).toBe('18');
      expect(chunkHeaders?.['Content-Range']).toBe('bytes 0-17/18');
      expect(chunkHeaders?.['Content-Length']).toBe('18');
    });

    it('reports real, API-confirmed progress across multiple chunks, then completion', async () => {
      // 300 KiB forces two 256 KiB-max chunks — a single-chunk upload has no
      // intermediate progress to report, by the protocol's own design.
      const content = 'x'.repeat(300 * 1024);
      const onProgress = vi.fn();

      fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields='))
          return { ok: true, json: async () => ({ files: [{ id: 'file-1' }] }) };
        if (isResumableInitiate(url, init)) return initiateResponse();
        if (url === SESSION_URI) return chunkResponse(init);
        return { ok: true, json: async () => ({}) };
      });

      await service.saveVault('token', content, onProgress);

      const total = content.length;
      const firstChunkEnd = 256 * 1024;
      expect(onProgress).toHaveBeenCalledWith(0);
      expect(onProgress).toHaveBeenCalledWith(firstChunkEnd / total);
      expect(onProgress).toHaveBeenLastCalledWith(1);
    });

    it('surfaces a failure to start the resumable session', async () => {
      fetchMock.mockImplementation(async (url: string) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields=')) return { ok: true, json: async () => ({ files: [] }) };
        return { ok: false };
      });

      await expect(service.saveVault('token', '{}')).rejects.toThrow(/Drive/);
    });

    it('surfaces a failure when the resumable session has no Location header', async () => {
      fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields=')) return { ok: true, json: async () => ({ files: [] }) };
        if (isResumableInitiate(url, init)) return { ok: true, headers: fakeHeaders({}) };
        return { ok: true, json: async () => ({}) };
      });

      await expect(service.saveVault('token', '{}')).rejects.toThrow(/Drive/);
    });

    it('surfaces a chunk upload failure that is neither success nor 308', async () => {
      fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields=')) return { ok: true, json: async () => ({ files: [] }) };
        if (isResumableInitiate(url, init)) return initiateResponse();
        if (url === SESSION_URI) return { ok: false, status: 500, headers: fakeHeaders({}) };
        return { ok: true, json: async () => ({}) };
      });

      await expect(service.saveVault('token', '{}')).rejects.toThrow(/Drive/);
    });

    it('throws GoogleAuthExpiredError when the resumable session fails to start with a 401', async () => {
      fetchMock.mockImplementation(async (url: string) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields=')) return { ok: true, json: async () => ({ files: [] }) };
        return { ok: false, status: 401 };
      });

      await expect(service.saveVault('stale-token', '{}')).rejects.toBeInstanceOf(
        GoogleAuthExpiredError,
      );
    });

    it('throws GoogleAuthExpiredError when a chunk upload comes back 401 mid-transfer', async () => {
      fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields=')) return { ok: true, json: async () => ({ files: [] }) };
        if (isResumableInitiate(url, init)) return initiateResponse();
        if (url === SESSION_URI) return { ok: false, status: 401, headers: fakeHeaders({}) };
        return { ok: true, json: async () => ({}) };
      });

      await expect(service.saveVault('stale-token', '{}')).rejects.toBeInstanceOf(
        GoogleAuthExpiredError,
      );
    });
  });

  describe('resetVault', () => {
    it('renames the existing file out of the way, then creates a fresh one', async () => {
      const patchCalls: { url: string; body?: string }[] = [];
      fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
        if (init?.method === 'PATCH' && !url.includes('uploadType=')) {
          patchCalls.push({ url, body: init.body as string | undefined });
        }
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields='))
          return { ok: true, json: async () => ({ files: [{ id: 'old-file' }] }) };
        if (isResumableInitiate(url, init)) return initiateResponse();
        if (url === SESSION_URI) return chunkResponse(init);
        return { ok: true, json: async () => ({}) };
      });

      await service.resetVault('token', '{"encrypted":true}');

      const rename = patchCalls.find(
        (c) => c.url === 'https://www.googleapis.com/drive/v3/files/old-file',
      );
      expect(rename).toBeTruthy();
      expect(JSON.parse(rename!.body!).name).toMatch(/^vault\.backup-\d+\.json\.enc$/);
    });

    it('creates the folder and file when nothing existed yet', async () => {
      const methods: (string | undefined)[] = [];
      fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
        methods.push(init?.method);
        if (isFolderQuery(url)) return { ok: true, json: async () => ({ files: [] }) };
        if (url.includes('&fields=')) return { ok: true, json: async () => ({ files: [] }) };
        if (isResumableInitiate(url, init)) return initiateResponse();
        if (url === SESSION_URI) return chunkResponse(init);
        return { ok: true, json: async () => ({ id: 'folder-1' }) };
      });

      await service.resetVault('token', '{"encrypted":true}');

      expect(methods.filter((m) => m === 'PATCH')).toHaveLength(0);
    });

    it('surfaces a failure to back up the old file', async () => {
      fetchMock.mockImplementation(async (url: string) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields='))
          return { ok: true, json: async () => ({ files: [{ id: 'old-file' }] }) };
        return { ok: false };
      });

      await expect(service.resetVault('token', '{}')).rejects.toThrow(/back up/);
    });

    it('throws GoogleAuthExpiredError, not a generic failure, when backing up hits a 401', async () => {
      fetchMock.mockImplementation(async (url: string) => {
        if (isFolderQuery(url))
          return { ok: true, json: async () => ({ files: [{ id: 'folder-1' }] }) };
        if (url.includes('&fields='))
          return { ok: true, json: async () => ({ files: [{ id: 'old-file' }] }) };
        return { ok: false, status: 401 };
      });

      await expect(service.resetVault('stale-token', '{}')).rejects.toBeInstanceOf(
        GoogleAuthExpiredError,
      );
    });
  });
});
