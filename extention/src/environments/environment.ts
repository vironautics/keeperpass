/**
 * OAuth client IDs for browser apps are public identifiers, not secrets —
 * they're visible in every request Google's SDK makes, so committing this
 * value is fine.
 *
 * For Chrome Extensions: This ID is scoped to the specific extension ID registered
 * in Google Cloud Console. The extension ID and client ID must match.
 */
export const environment = {
  /** Where "New Item" and other full-editor flows send the user. */
  webAppUrl: 'https://vault.keeperpass.com',
  // googleClientId: '809926786421-k7n7qg3rj2obc0i1l9q7ovkd307irkkh.apps.googleusercontent.com',
  googleClientId: '809926786421-2k9b0c71eut6q1da3ctpfdtfs4l0gpsu.apps.googleusercontent.com'
};
