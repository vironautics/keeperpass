# Plan: Dropbox sign-in + storage, behind a provider-agnostic layer

Status: proposal. Nothing implemented yet.
Scope: `web/` first, then `extention/`, then `mobile/`. Google behaviour must not change at any step.

---

## 1. Goals and non-goals

**Goals**
1. A user can sign in with Dropbox and keep the encrypted vault in Dropbox, exactly as they do today with Google Drive.
2. Google keeps working, unchanged, at every commit (no big-bang refactor).
3. Adding a third provider later (OneDrive, WebDAV, ...) = one new folder + one registration line + one button + translations. No edits to guards, pages, sync, or session logic.

**Non-goals (separate follow-ups)**
- Migrating an existing vault from Drive to Dropbox (see section 9).
- Syncing one vault to two providers at once.
- A backend. The app stays client-only.

---

## 2. Findings that shape the plan (from the code)

| Finding | Consequence |
|---|---|
| Vault crypto = Argon2id from the secret + a random salt stored inside the blob (`vault-crypto.ts`). No account ID/email goes into the key. | The `vault.json.enc` blob is provider-independent. It can live in any storage with no re-encryption. Do **not** touch the blob format. |
| Google is hard-wired in ~10 places (full list in section 5). Everything calls `GoogleDriveService` / `GoogleAuthExpiredError` / `AuthService.signInWithGoogle` directly. | Introduce two interfaces and keep the *existing call signatures* as facades, so call sites barely change. |
| Auth and storage are the same token today (`drive.file` requested with sign-in). | In the abstraction a "provider" = `{ auth, storage }` pair. Identity and storage stay coupled per provider. |
| `SessionStore` persists only `accessToken` + `expiresAt` and assumes Google (hour-long token, no refresh, silent renewal via GIS `prompt:''`). | Add `providerId` (+ optional `refreshToken`). **Missing `providerId` on an existing session must default to `google`**, or every currently signed-in user is logged out on deploy. |
| Auth guard `vaultStepGuard` calls `drive.vaultExists()` directly. | Must go through the active provider's storage. |
| Three separate clients with their own copies: web (GIS token client), extension (`launchWebAuthFlow`, implicit grant), mobile (Expo AuthSession, code+PKCE). | Provider interface must be implementable by all three flows. Dropbox uses code + PKCE everywhere (no implicit grant exists for refresh tokens). |
| User-facing strings mention "Google"/"Drive" (`errors.drive.*`, recover/setup/unlock copy, 5 locales in web, plus extension). | Make copy provider-neutral (see section 7). |

---

## 3. Architecture

### 3.1 Interfaces (`web/src/app/core/providers/`)

```ts
type ProviderId = 'google' | 'dropbox'; // union grows; nothing else switches on it

interface TokenGrant {
  accessToken: string;
  expiresAt: number;            // epoch ms, already skewed
  refreshToken?: string;        // Dropbox only
}

interface ProviderProfile { email: string; name: string; }

interface AuthProvider {
  readonly id: ProviderId;
  readonly displayName: string;           // "Google", "Dropbox"
  signIn(): Promise<TokenGrant & ProviderProfile>;       // interactive, needs a click
  renew(current: TokenGrant): Promise<TokenGrant>;       // silent; throws if impossible
  fetchProfile(accessToken: string): Promise<ProviderProfile>;
}

interface VaultStorage {
  exists(token: string): Promise<boolean>;
  load(token: string): Promise<string | null>;
  save(token: string, content: string, onProgress?: UploadProgressHandler): Promise<void>;
  reset(token: string, content: string, onProgress?: UploadProgressHandler): Promise<void>; // keep old as backup
  detach(token: string): Promise<boolean>;                                                  // rename, never delete
}

interface CloudProvider { auth: AuthProvider; storage: VaultStorage; }
```

- `CLOUD_PROVIDERS` = multi injection token; `ProviderRegistry.get(id)` returns the `CloudProvider`.
- `ActiveProvider` (small service) = `registry.get(session.providerId())`. Throws a clear error if no session.
- **Errors:** new `StorageAuthExpiredError` (generic). `GoogleAuthExpiredError extends StorageAuthExpiredError` so every existing `instanceof` check and every existing test keeps passing; call sites are migrated to the base class gradually.
- Other typed errors: `VaultConflictError` (concurrent write, see 6.3), `StorageRateLimitedError(retryAfter)`.

### 3.2 Facades (the stability trick)
Keep the current public API; change only what they delegate to.

| Today | Becomes |
|---|---|
| `AuthService.signInWithGoogle()` | `AuthService.signIn(providerId)`; `signInWithGoogle()` stays as a thin alias until step 1 is merged and call sites moved |
| `AuthService.ensureFreshToken()` / `fetchProfile()` | same names, delegate to `ActiveProvider.auth` |
| `GoogleDriveService` | still exists, now *implements* `VaultStorage`; new `VaultStorageService` facade (`exists/load/save/reset/detach`) delegates to `ActiveProvider.storage`; pages/guards/sync inject the facade |
| `disconnectSession`, `ensureFreshTokenOrDisconnect` | unchanged signatures |

Result: unlock/setup/recover/master-password/profile-section/vault-sync/guard change by **one injected class and one error class**, not logic.

---

## 4. Dropbox specifics

**Registration (manual, before coding):** Dropbox App Console -> Scoped access, **App folder** access type (vault lives in `/Apps/<app>/`, mirrors `drive.file` least-privilege).
- Scopes: `account_info.read`, `files.metadata.read`, `files.metadata.write`, `files.content.read`, `files.content.write`.
- Redirect URIs (exact match): web origin(s) callback (prod, preview, `localhost:4200`), extension `getRedirectURL()` per browser (Chrome/Edge `https://<id>.chromiumapp.org/`, Firefox's different domain), mobile custom scheme.
- Only the **App key** ships in code (`environment.dropboxAppKey`). The App secret is never used or committed.

**Flow:** Authorization Code + **PKCE (S256)**, `token_access_type=offline` (gets a refresh token), `state` verified, `code_verifier` kept only for the duration of the flow.
- Token exchange: `POST https://api.dropboxapi.com/oauth2/token` with `grant_type=authorization_code`, `client_id`, `code`, `code_verifier`, `redirect_uri` (no secret).
- Renewal: same endpoint, `grant_type=refresh_token`, `client_id`. **Silent and gesture-free** (unlike GIS) - this is *better* than Google's flow, and removes the 8s popup-timeout hack for Dropbox.
- Profile: `POST /2/users/get_current_account` -> `email`, `name.display_name`.

**Storage mapping (`DropboxVaultStorage`)**

| Op | Dropbox call |
|---|---|
| `exists` | `POST api.dropboxapi.com/2/files/get_metadata` path `/vault.json.enc`; `409 path/not_found` -> `false` |
| `load` | `POST content.dropboxapi.com/2/files/download` (`Dropbox-API-Arg` header); `409 not_found` -> `null` |
| `save` | `POST content.dropboxapi.com/2/files/upload`, `mode: overwrite` (or `update` + `rev`, see 6.3), `Content-Type: application/octet-stream`. Use `XMLHttpRequest` for `upload.onprogress` (fetch has no upload progress); files under ~150 MB need no session upload |
| `reset` | `files/move_v2` -> `/vault.backup-<ts>.json.enc`, then upload fresh |
| `detach` | `files/move_v2` -> `/vault.removed-<ts>.json.enc` (never delete - same policy as Drive) |

No folder-lookup step: the app-folder root is the namespace (simpler and race-free vs Drive's find-or-create folder).

**Error mapping:** `401` + `invalid_access_token|expired_access_token` -> `StorageAuthExpiredError` (after one silent refresh attempt). `401 missing_scope` -> configuration `Error` (NOT expiry; must not disconnect-loop). `429` -> honour `Retry-After`, bounded retries, then `StorageRateLimitedError`. `5xx` -> normal save error shown by `SyncOverlay`.

**Header encoding:** `Dropbox-API-Arg` must be JSON with non-ASCII escaped (`\uXXXX`); paths here are ASCII constants, but implement the escape helper anyway for the future.

---

## 5. Every Google touchpoint and what happens to it

Web (`web/src/app/`):

| File | Change |
|---|---|
| `core/auth/google-identity-services.ts` | Untouched. Becomes an implementation detail of `GoogleAuthProvider`. |
| `core/auth/auth.service.ts` | Facade over `ActiveProvider`; constants `GOOGLE_SCOPE`, `RENEWAL_TIMEOUT_MS` move into `GoogleAuthProvider`. |
| `core/auth/session.store.ts` | Add `providerId` signal + storage key `keeperpass:provider`, optional `refreshToken` (key `keeperpass:refreshToken`). Default `google` when token exists but key absent. `signIn(providerId, grant)`, `renewToken(grant)`, `signOut()` clears all. |
| `core/auth/token-refresh.service.ts` | Calls `ensureFreshToken()` as now. For providers with silent renewal, success path is the norm; failure -> disconnect as now. |
| `core/auth/disconnect-session.ts` | Signatures unchanged; comments updated. |
| `core/auth/auth.guard.ts` | `drive.vaultExists` -> `VaultStorageService.exists`. |
| `core/drive/google-drive.service.ts` | Implements `VaultStorage` (no logic change). `GoogleAuthExpiredError extends StorageAuthExpiredError`. |
| `core/vault/vault-sync.service.ts` | Inject `VaultStorageService`; catch `StorageAuthExpiredError`; log message provider-neutral. |
| `core/account/master-password.service.ts` | Same swap. |
| `core/account/account.store.ts` | Add `providerId`; doc says "provider profile", not Google. |
| `features/auth/start/start-page.{ts,html}` | One button per registered provider (`@for`), shared `signIn(providerId)` with the existing `submitting`/error handling. Add `DropboxLogo` next to `GoogleLogo`. |
| `features/auth/unlock`, `setup`, `recover` | Swap storage facade + error class; copy neutral. `fetchProfile` call uses active provider. |
| `features/settings/profile-section` | `detachVault` via facade; "managed by Google" copy becomes `{provider}`. |
| `environments/environment.ts` | Add `dropboxAppKey`. |
| `core/i18n/translations/{en,fr,de,es,pt}.ts` | See section 7. |
| `app.routes` | New `oauth/dropbox` callback route (see 6.1). |

Extension (`extention/src/app/`): `core/auth/{auth.service,google-oauth*.ts,session.store.ts,auth.guard.ts,disconnect-session.ts}`, `core/drive/google-drive.service.ts`, `core/vault/{vault-sync,vault-unlock,vault-session}.service.ts`, `core/account/{master-password,account.store}`, `features/auth/{start,unlock}`, `scripts/background.ts`, `public/manifest.json`.
Mobile: `lib/auth/{google-auth,session-store}.ts`, `lib/drive/google-drive.ts`.

> The extension and mobile are separate codebases that duplicate web logic. They get the **same interfaces** (copied, not shared) in their own phases - no cross-package refactor in this plan.

---

## 6. Hard parts, decided up front

### 6.1 Web popup/redirect without breaking the router
- Open the popup **synchronously on click** (`window.open('about:blank')`), then navigate it once the async PKCE challenge is ready. Otherwise popup blockers fire (same class of problem the GIS code already works around with preloading).
- Callback page `/oauth/dropbox` is a minimal route registered **before** the `homeGuard` wildcard and outside every guard (otherwise it is redirected to `/start` and the code is lost). It `postMessage`s `{code,state}` to `window.opener` with strict `targetOrigin`, then closes.
- Opener validates `event.origin`, `event.source`, and `state`. A mismatch rejects the sign-in.
- Hosting must serve the SPA for `/oauth/dropbox` (check the host's rewrite rules - spike item).
- If the popup is blocked/closed: reject with the existing `errors.auth.popupBlocked` / `popupClosed` keys (reuse, don't invent).

### 6.2 Tokens and storage (security decisions)
- Same policy as today: tab-scoped `sessionStorage` (web), `chrome.storage.session` (extension), SecureStore (mobile). Never `localStorage`.
- The **refresh token is higher value** than an access token. It only ever lives in that tab-scoped store, is not logged, and is dropped on `signOut()`. We do **not** revoke on ordinary disconnect (it would force re-consent every login); we **do** call `/2/auth/token/revoke` on "delete account". The vault is end-to-end encrypted, so a stolen token exposes ciphertext only, but could delete/overwrite it - hence 6.3.
- No secrets in the repo: only the app key.

### 6.3 Write safety (stability)
Today Drive overwrites blindly. For Dropbox use `mode: update` with the `rev` returned by `load`; on conflict throw `VaultConflictError`. `VaultSyncService` surfaces it through the existing `lastError` overlay (blocking, never silent). Google keeps current behaviour until it gets the same treatment (optional later; the interface already allows an optional version token). Pending decision: whether the conflict UI offers "reload remote" or "overwrite" - default = block and show an error; no auto-merge.

### 6.4 Which vault am I looking at
Google vault and Dropbox vault are **independent**. Identity key = `(providerId, account)`. The same email on both providers is two different vaults - the UI must say which provider the session uses (sidebar + unlock card show provider name/logo) so a user does not create a second vault by accident and think the first is lost.

### 6.5 Session restore
On reload: read `providerId` (default `google` if absent) -> restore phase `awaiting-secret` as today. Unknown `providerId` value (e.g. a downgrade) -> treat as signed out, never throw.

---

## 7. i18n / copy

- Rename keys `errors.drive.*` -> `errors.storage.*` with a `{provider}` placeholder **only if** `I18nService.translate` supports parameters; check first. If not, keep keys and make strings neutral ("cloud storage"), or add per-provider keys. Decide in step 1.
- Add: `auth.start.continueWithDropbox`, Dropbox-specific errors (`missing_scope` config error, rate limit), provider labels.
- Must land in all five web locales (`en fr de es pt`) and the extension's locale set in the same PR as the code that uses them (a missing key must not render a raw key).
- Recover/setup/unlock copy that says "Google account"/"your Drive" -> "your {provider} account".

---

## 8. Phases (each is shippable, each leaves Google 100% working)

**Phase 0 - Spike (no merge).** Prove in a throwaway page: (a) CORS works from a browser origin for `oauth2/token`, `files/upload`, `files/download`, `get_metadata`, `move_v2`; (b) PKCE + refresh round trip; (c) popup + `postMessage` callback on the real host; (d) extension `launchWebAuthFlow` redirect accepted by Dropbox. **If (a) fails, stop and re-plan** (this is the one assumption not yet verified).

**Phase 1 - Refactor Google behind the interfaces (zero behaviour change).**
Add interfaces, registry, `ActiveProvider`, `StorageAuthExpiredError`, `providerId` in `SessionStore` (default `google`), facades. Move call sites to facades. Gate: all existing specs pass **unchanged** (they are the regression net); add specs for registry, default-provider restore, error subclassing.

**Phase 2 - Dropbox provider (web), behind a flag.**
`DropboxAuthProvider`, `DropboxVaultStorage`, PKCE helper, callback route, `environment.dropboxAppKey`, feature flag so prod can ship dark. Unit tests with mocked `fetch`/`XMLHttpRequest`.

**Phase 3 - UI + copy.**
Provider buttons on `/start`, provider indicator, neutral copy in 5 locales, `DropboxLogo`.

**Phase 4 - Hardening.** Rate-limit/backoff, `VaultConflictError` handling in `SyncOverlay`, revoke on delete-account, logging audit (no tokens/vault content in console; note the existing dev-only vault `console.log` in `unlock-page.ts` should be removed regardless).

**Phase 5 - Extension.** Interfaces mirrored; `DropboxOAuth` via `launchWebAuthFlow` (code + PKCE; unlike Google, Dropbox needs no secret, so no implicit-grant workaround); `manifest.json` `host_permissions` for `api.dropboxapi.com`, `content.dropboxapi.com`, `www.dropbox.com`; keep existing CSP; the OAuth flow runs in `background.ts` like Google's. Refresh tokens work here, so the extension can renew silently where Google cannot.

**Phase 6 - Mobile.** `expo-auth-session` code+PKCE with Dropbox discovery endpoints, custom-scheme redirect, same storage mapping; refresh token in SecureStore.

**Phase 7 - Enable.** Flip the flag after QA matrix (section 10).

Migration between providers is **out of scope here** and gets its own plan after Phase 7 (order of operations already decided: load old -> save new -> reload and compare -> only then `detach` old; never the reverse; confirm before touching an existing target vault).

---

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Existing signed-in users logged out by the deploy | `providerId` defaults to `google` when token present and key absent (tested). |
| Wildcard guard swallows the OAuth callback | Callback route registered before wildcard, outside guards; e2e check. |
| Popup blocked | Synchronous `window.open` on click; existing popup error copy. |
| CORS on Dropbox endpoints is not as assumed | Phase 0 gate; stop and re-plan if it fails. |
| `missing_scope` mistaken for expiry -> disconnect loop | Distinct error path; test. |
| Refresh token theft via XSS | Tab-scoped storage, E2E ciphertext, write-conflict protection, revoke on delete-account. |
| Same email on two providers confuses users | Provider shown in UI (6.4). |
| Lost update from two devices | Dropbox `rev` conflict (6.3); Google unchanged for now. |
| Raw i18n keys in one locale | Same-PR rule + a spec that all locales have the same key set. |
| Extension/mobile drift from web | Mirror the same interfaces; per-client phases; shared test vectors for the storage mapping. |
| Dropbox app stuck in "development" status (limited to 500 users until approved) | Apply for production status before Phase 7. |

---

## 10. Test plan

- **Unit:** registry/active-provider; session restore (with/without `providerId`, unknown id); `DropboxVaultStorage` for each op incl. 409/401/429/5xx; PKCE verifier/challenge vectors; state mismatch rejection; refresh single-flight (concurrent callers share one request, like `AuthService.renewal` today); `GoogleAuthExpiredError instanceof StorageAuthExpiredError`.
- **Regression:** the existing Google specs (`auth.service`, `google-drive.service`, `session.store`, `auth.guard`, `token-refresh`, `vault-sync`, unlock/setup/recover/master-password) pass unmodified after Phase 1.
- **Manual QA matrix:** {Google, Dropbox} x {first run / existing vault / wrong secret / forgot secret (recover) / change master password / import / delete account / token expiry mid-edit / reload while unlocked / popup blocked / offline / two tabs} x {web, extension, mobile}.
- **Cross-provider check:** the same secret and a blob produced under one provider decrypts when manually placed in the other (proves the blob is provider-neutral).

---

## 11. Open decisions for the owner

1. Dropbox access type: **App folder** (recommended, least privilege) vs full Dropbox.
2. Should Dropbox ship in all three clients together, or web first? (Plan assumes web first.)
3. Conflict UX on `VaultConflictError`: block-and-show (recommended) vs offer overwrite.
4. i18n: does `translate()` take parameters? (checked in Phase 1; drives the key-naming approach.)
5. Is Dropbox a **sign-in method** only, or can a Google-signed-in user also link Dropbox for storage? (Plan: provider = identity + storage pair; linking is a later feature.)

---

## 12. Progress log

**Done (web, uncommitted):**
- Phase 0: CORS preflight verified for `oauth2/token`, `files/upload`, `files/get_metadata`. Dropbox's consent page sends only a *report-only* COOP header, so the callback uses `BroadcastChannel` (survives an enforced COOP) instead of `window.opener`.
- Phase 1: provider layer (`core/providers/`), `SessionStore.providerId` (+ refresh token) with Google default for old sessions, `AuthService`/`VaultStorageService` facades, call sites moved. All 460 pre-existing specs passed **unchanged**.
- Phase 2: `DropboxOAuth` (PKCE popup + token/refresh), `DropboxAuthProvider`, `DropboxVaultStorage` (rev-guarded writes, 429 retry, `missing_scope` kept distinct from expiry), `/oauth/dropbox` callback route outside all guards.
- Phase 3: provider buttons on `/start` (a provider is offered only if `isConfigured()`; an empty `dropboxAppKey` hides Dropbox), `DropboxLogo`, `errors.dropbox.*` + neutral in-app wording in en/de/es/fr/pt.
- Tests: 500 passing, later 514 (after the migration feature).
- App key `dropboxAppKey: '03g98hw8xu109v5'` is set in `web/src/environments/environment.ts` (public by design: PKCE, no client secret).

### Move Vault feature (web, uncommitted) — Google Drive <-> Dropbox
User asked for moving a vault between providers when the secrets differ. Version 1 = migrate into an empty destination, or **Replace with backup** when the destination already holds a vault. **Merge of two existing vaults is deferred.**

Key facts for the next session:
- The vault blob is provider-independent (key = Argon2id(secret) -> AES-256-GCM, salt/IV inside the blob). So a move is "re-encrypt the in-memory snapshot (optionally with a NEW secret), write it to the destination, verify, rename the source".
- `core/providers/vault-migration.service.ts` (`VaultMigrationService`): `targets()` (configured providers except the active one), `connect(targetId)` (signs in to destination WITHOUT touching the session, returns `MigrationTarget {providerId, storageName, accessToken, email, hasVault}`), `migrate(target, {secret, replaceExisting}, onStage)`.
  - Order, never changed: encrypt snapshot -> write destination (`saveVault`, or `resetVault` when replacing = existing vault renamed to `vault.backup-<ts>.json.enc`) -> read back, decrypt, compare JSON with snapshot -> `detachVault` on source (rename to `vault.removed-<ts>...`, **never delete**).
  - Guards: destination must not hold a vault unless `replaceExisting`; session must be `ready` with a secret; no sync in flight; source token via `ensureFreshTokenOrDisconnect`. Detach failure after a verified copy returns `{sourceRenamed:false}` (success with caveat), not an error. Destination `StorageAuthExpiredError` becomes a translated "{provider} sign-in expired" message and does NOT disconnect the session. Exports `TargetVaultExistsError`, `MigrationStage`.
  - Dropbox "add" write mode means a vault created on the destination after `connect` makes the write fail instead of overwriting (not tested against real Dropbox).
- UI: `features/settings/move-vault-section/` (card, one "Move to {provider}" button per target, hidden if none) and `features/settings/move-vault-dialog/` (steps connect -> configure -> working). Configure step: destination email, existing-vault warning + required replace checkbox, keep/new-secret radios, new-secret form (strength meter + matching validator, reuses change-password keys). On success: toast (`@spartan-ng/brain/sonner`), close, `session.signOut()`, navigate `/start`. On failure: back to configure with the error. Escape/backdrop blocked while working. Wired into `settings-page` after the master-password section.
- i18n: 25 `settings.migrate.*` keys in en/de/es/fr/pt (script `i18n-migrate.cjs` in the session scratchpad; locale files use CRLF).
- Tests: `vault-migration.service.spec.ts` (happy path + call order, new secret, exists error, replace via reset, verify mismatch, read-back null, write failure, expired destination, detach failure, no secret, targets, connect), `provider-registry.spec.ts`, `dropbox-vault.storage.spec.ts`, `dropbox-oauth.spec.ts` (real timers on purpose: fake timers break Web Crypto promises), `session.store.spec.ts` extended, start-page spec updated.
- Verified: `tsc` clean (app + spec), `ng test` 514 passing / 42 files, `ng build` OK. Nothing committed.

### Safety review (answer to "are you sure it is safe?")
Confident: source renamed only after a verified copy; nothing is ever deleted; existing destination vault is backed up, not overwritten; vault is encrypted client-side so Dropbox only sees ciphertext.

NOT verified / open risks (do these before committing):
1. Never run against real Google Drive + Dropbox accounts (all tests use fakes). Needs a manual Drive->Dropbox test with throwaway accounts.
2. No component spec for `MoveVaultDialog` (button gating, replace checkbox, new-secret validation, error/return flow).
3. Not audited: local state tied to the old secret/provider after a move (cached unlock data, AccountStore). Check before trusting the "new secret" option.
4. Dropbox refresh token lives in `sessionStorage` (long-lived; XSS could steal it; attacker gets ciphertext access only).
5. Delete-account does not yet revoke the Dropbox token.
6. After choosing a new secret, the renamed old file still opens with the OLD secret; the dialog does not tell the user to delete it.

**Not done yet:** Phase 4 (hardening pass: items 3-5 above, `AccountStore` providerId, revoke on delete-account), Phase 5 (extension: `launchWebAuthFlow`, host_permissions, mirrored interfaces), Phase 6 (mobile: expo-auth-session), migration feature for extension/mobile, Merge-from-another-vault, support/FAQ page copy (still Google-specific), provider indicator in the sidebar/unlock page, unverified whether the 98 kB initial-bundle warning pre-dates these changes.

**Next-step recommendation:** dialog spec -> local-state audit -> token revocation -> manual real-account test -> commit -> then extension.

**Manual setup required in the Dropbox App Console (cannot be done from code):**
1. Redirect URIs: `http://localhost:4200/oauth/dropbox` and each deployed origin + `/oauth/dropbox`.
2. Permissions tab: tick `account_info.read`, `files.metadata.read`, `files.metadata.write`, `files.content.read`, `files.content.write`, then Submit.
3. Settings: access type = App folder.
