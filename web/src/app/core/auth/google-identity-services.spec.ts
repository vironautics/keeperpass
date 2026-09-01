import { GoogleIdentityServices } from './google-identity-services';

interface StubTokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: { access_token?: string; error?: string }) => void;
  error_callback?: (error: { type: 'popup_failed_to_open' | 'popup_closed' | 'unknown' }) => void;
}

function stubGoogleIdentityServices(respond: (config: StubTokenClientConfig) => void) {
  window.google = {
    accounts: {
      oauth2: {
        initTokenClient: (config: StubTokenClientConfig) => ({
          requestAccessToken: () => respond(config),
        }),
      },
    },
  } as unknown as Window['google'];
}

describe('GoogleIdentityServices', () => {
  let service: GoogleIdentityServices;

  beforeEach(() => {
    // window.google is already present, so the constructor's preload resolves
    // immediately instead of appending a real <script> tag.
    stubGoogleIdentityServices(() => {});
    service = new GoogleIdentityServices();
  });

  afterEach(() => {
    delete window.google;
  });

  it('resolves with the granted access token', async () => {
    stubGoogleIdentityServices((config) => config.callback({ access_token: 'token-abc' }));

    await expect(service.requestAccessToken('client-id', 'email')).resolves.toMatchObject({
      accessToken: 'token-abc',
    });
  });

  it('passes the client id and scope through to Google', async () => {
    let seenConfig: StubTokenClientConfig | undefined;
    stubGoogleIdentityServices((config) => {
      seenConfig = config;
      config.callback({ access_token: 'token-abc' });
    });

    await service.requestAccessToken('client-id', 'email profile');

    expect(seenConfig?.client_id).toBe('client-id');
    expect(seenConfig?.scope).toBe('email profile');
  });

  it('rejects when Google reports an error', async () => {
    stubGoogleIdentityServices((config) => config.callback({ error: 'popup_closed_by_user' }));

    await expect(service.requestAccessToken('client-id', 'email')).rejects.toThrow(
      'popup_closed_by_user',
    );
  });

  it('rejects with a readable message when the popup itself never ran (error_callback)', async () => {
    // Per Google's JS API reference this payload is only `{ type }` — no
    // `message` field — so the readable text has to come from a local map,
    // not from the error object itself.
    stubGoogleIdentityServices((config) =>
      config.error_callback?.({ type: 'popup_failed_to_open' }),
    );

    await expect(service.requestAccessToken('client-id', 'email')).rejects.toThrow(
      /blocked the Google sign-in popup/,
    );
  });

  it('falls back to a generic message for an unrecognised error_callback type', async () => {
    stubGoogleIdentityServices((config) =>
      config.error_callback?.({ type: 'something-new-google-added' as 'unknown' }),
    );

    await expect(service.requestAccessToken('client-id', 'email')).rejects.toThrow(
      /Something went wrong while contacting Google/,
    );
  });
});
