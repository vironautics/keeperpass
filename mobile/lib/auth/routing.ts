import type { SessionPhase } from '@/lib/auth/session-store';

/**
 * Named guard predicates for `app/_layout.tsx`'s `Stack.Protected` groups.
 * Exactly one of these is true for any reachable `(phase, hasVault)` pair.
 */
function isSignedOut(phase: SessionPhase): boolean {
  return phase === 'signed-out';
}

function isCheckingVault(phase: SessionPhase, hasVault: boolean | null): boolean {
  return phase === 'awaiting-secret' && hasVault === null;
}

function isUnlockReachable(phase: SessionPhase, hasVault: boolean | null): boolean {
  return phase === 'awaiting-secret' && hasVault === true;
}

function isSetupReachable(phase: SessionPhase, hasVault: boolean | null): boolean {
  return phase === 'awaiting-secret' && hasVault === false;
}

function isReady(phase: SessionPhase): boolean {
  return phase === 'ready';
}

type AuthRoute = '/' | '/vault-check' | '/unlock' | '/setup' | '/items';

/**
 * `Stack.Protected` only controls which screens are *mounted* — it does not move you off a
 * screen whose guard just turned false (React Navigation leaves the stale route in state with
 * no component to render, i.e. a blank screen). Callers must explicitly `router.replace()` to
 * this on every `(phase, hasVault)` change to keep the visible screen in sync with the guards.
 */
function routeForPhase(phase: SessionPhase, hasVault: boolean | null): AuthRoute {
  if (isCheckingVault(phase, hasVault)) return '/vault-check';
  if (isUnlockReachable(phase, hasVault)) return '/unlock';
  if (isSetupReachable(phase, hasVault)) return '/setup';
  if (isReady(phase)) return '/items';
  return '/';
}

export {
  isCheckingVault,
  isReady,
  isSetupReachable,
  isSignedOut,
  isUnlockReachable,
  routeForPhase,
};
