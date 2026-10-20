import { TestBed } from '@angular/core/testing';
import { DROPBOX_OAUTH_CHANNEL, DropboxOAuth, DropboxOAuthMessage } from './dropbox-oauth';
import { codeChallengeS256, randomUrlSafe } from './pkce';

describe('PKCE', () => {
  it('matches the RFC 7636 example challenge', async () => {
    // RFC 7636, appendix B.
    expect(await codeChallengeS256('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    );
  });

  it('makes long, URL-safe, non-repeating verifiers', () => {
    const first = randomUrlSafe(64);

    expect(first).toMatch(/^[A-Za-z0-9_-]{43,128}$/);
    expect(randomUrlSafe(64)).not.toBe(first);
  });
});

describe('DropboxOAuth', () => {
  let oauth: DropboxOAuth;
  let popup: { closed: boolean; location: { href: string }; close: () => void };
  let fetchMock: ReturnType<typeof vi.fn>;

  /** What the callback page does: report into the channel the opener is listening on. */
  const report = (message: DropboxOAuthMessage) => {
    const channel = new BroadcastChannel(DROPBOX_OAUTH_CHANNEL);
    channel.postMessage(message);
    channel.close();
  };

  const stateOfPopup = () => new URL(popup.location.href).searchParams.get('state')!;

  beforeEach(() => {
    popup = { closed: false, location: { href: '' }, close: vi.fn(() => (popup.closed = true)) };
    vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window);
    fetchMock = vi.spyOn(globalThis, 'fetch') as unknown as ReturnType<typeof vi.fn>;
    oauth = TestBed.inject(DropboxOAuth);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const waitForPopupUrl = async () => {
    await vi.waitFor(() => expect(popup.location.href).not.toBe(''));
  };

  it('opens the popup immediately, before any await, so the browser allows it', () => {
    void oauth.authorize().catch(() => {});

    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('sends the user to Dropbox with PKCE, offline access and a state', async () => {
    void oauth.authorize().catch(() => {});
    await waitForPopupUrl();

    const url = new URL(popup.location.href);
    expect(url.origin + url.pathname).toBe('https://www.dropbox.com/oauth2/authorize');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('code_challenge')).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(url.searchParams.get('token_access_type')).toBe('offline');
    expect(url.searchParams.get('redirect_uri')).toBe(`${window.location.origin}/oauth/dropbox`);
    expect(url.searchParams.get('state')).toBeTruthy();
  });

  it('exchanges the code, with the verifier whose challenge it sent and no client secret', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ access_token: 'access', expires_in: 14400, refresh_token: 'refresh' }),
      ),
    );

    const grant = oauth.authorize();
    await waitForPopupUrl();
    const challenge = new URL(popup.location.href).searchParams.get('code_challenge');
    report({ state: stateOfPopup(), code: 'the-code' });

    await expect(grant).resolves.toMatchObject({ accessToken: 'access', refreshToken: 'refresh' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.dropboxapi.com/oauth2/token');
    const body = init.body as URLSearchParams;
    expect(body.get('grant_type')).toBe('authorization_code');
    expect(body.get('code')).toBe('the-code');
    expect(body.has('client_secret')).toBe(false);
    expect(await codeChallengeS256(body.get('code_verifier')!)).toBe(challenge);
    expect(popup.close).toHaveBeenCalled();
  });

  it('ignores a callback carrying someone else’s state', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ access_token: 'access' })));

    const grant = oauth.authorize();
    await waitForPopupUrl();
    report({ state: 'forged', code: 'attacker-code' });
    report({ state: stateOfPopup(), code: 'real-code' });

    await grant;
    expect((fetchMock.mock.calls[0][1].body as URLSearchParams).get('code')).toBe('real-code');
  });

  it('rejects when the user denies access', async () => {
    const grant = oauth.authorize();
    await waitForPopupUrl();
    report({ state: stateOfPopup(), error: 'access_denied', errorDescription: 'The user denied.' });

    await expect(grant).rejects.toThrow('The user denied.');
  });

  it('rejects when the popup is blocked', async () => {
    vi.spyOn(window, 'open').mockReturnValue(null);

    await expect(oauth.authorize()).rejects.toThrow(/blocked/);
  });

  // Real timers: the PKCE challenge is real async Web Crypto, which fake timers do not advance.
  const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  it('rejects when the user closes the popup before finishing', async () => {
    const grant = oauth.authorize();
    const assertion = expect(grant).rejects.toThrow(/closed/);
    await waitForPopupUrl();

    await pause(600); // the poll sees it open
    popup.closed = true;

    await assertion;
  });

  it('does not treat a popup that reads as closed from the start as the user giving up', async () => {
    // Under an enforced Cross-Origin-Opener-Policy `closed` is true immediately.
    popup.closed = true;
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ access_token: 'access' })));

    const grant = oauth.authorize();
    await waitForPopupUrl();
    await pause(1_200); // two polls, both reading `closed`
    report({ state: stateOfPopup(), code: 'the-code' });

    await expect(grant).resolves.toMatchObject({ accessToken: 'access' });
  });

  it('refreshes silently and keeps the refresh token it already had', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ access_token: 'new-access', expires_in: 14400 })),
    );

    const grant = await oauth.refresh('old-refresh');

    expect(grant).toMatchObject({ accessToken: 'new-access', refreshToken: 'old-refresh' });
    expect(grant.expiresAt).toBeGreaterThan(Date.now());
    const body = fetchMock.mock.calls[0][1].body as URLSearchParams;
    expect(body.get('grant_type')).toBe('refresh_token');
    expect(body.get('refresh_token')).toBe('old-refresh');
  });

  it('surfaces Dropbox’s own reason when a token request is refused', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'invalid_grant', error_description: 'refresh token is invalid' }), {
        status: 400,
      }),
    );

    await expect(oauth.refresh('revoked')).rejects.toThrow('refresh token is invalid');
  });
});
