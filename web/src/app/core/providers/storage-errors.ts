/**
 * The access token is expired or revoked, so no retry of the same call can
 * succeed. Every storage throws this (or a subclass) on a 401, and every call
 * site that talks to storage catches this specific class and disconnects.
 */
export class StorageAuthExpiredError extends Error {
  constructor(message = 'Your session has expired. Please reconnect.') {
    super(message);
    this.name = 'StorageAuthExpiredError';
  }
}

/**
 * The vault in storage is not the version this session last read, so writing
 * would silently destroy someone else's changes (another device or tab saved
 * in between). Never retried automatically: the user has to reload first.
 */
export class VaultConflictError extends Error {
  constructor(message = 'Your vault was changed somewhere else. Reload to get the latest version.') {
    super(message);
    this.name = 'VaultConflictError';
  }
}
