import { AuthScreen } from '@/components/auth-screen';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FaIcon } from '@/components/ui/fa-icon';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useAccountStore } from '@/lib/auth/account-store';
import { disconnectSession, ensureFreshTokenOrDisconnect } from '@/lib/auth/disconnect-session';
import { fetchProfile } from '@/lib/auth/google-auth';
import { useSessionStore } from '@/lib/auth/session-store';
import { decryptVault, encryptVault, VaultDecryptionError } from '@/lib/crypto/vault-crypto';
import { GoogleAuthExpiredError, loadVault, saveVault } from '@/lib/drive/google-drive';
import { createEmptyVaultSnapshot, type VaultSnapshot } from '@/lib/vault/vault-snapshot';
import { useVaultStore } from '@/lib/vault/vault-store';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

export default function UnlockScreen() {
  const router = useRouter();
  const email = useAccountStore((state) => state.account.email);

  const [secret, setSecret] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const accessToken = useSessionStore.getState().accessToken;
    if (!accessToken) return;
    fetchProfile(accessToken)
      .then((profile) => useAccountStore.getState().updateProfile(profile))
      .catch(() => {});
  }, []);

  async function handleUnlock() {
    if (submitting || !secret) return;
    setSubmitting(true);
    setErrorMessage('');

    const accessToken = await ensureFreshTokenOrDisconnect();
    if (!accessToken) {
      setSubmitting(false);
      return;
    }

    try {
      const stored = await loadVault(accessToken);
      let data: VaultSnapshot;
      if (stored) {
        data = await decryptVault<VaultSnapshot>(secret, JSON.parse(stored));
      } else {
        // Defensive: the guard already established a vault exists, but if it
        // vanished between that check and this submit, create one rather than crash.
        data = createEmptyVaultSnapshot();
        await saveVault(accessToken, JSON.stringify(await encryptVault(secret, data)));
      }
      useVaultStore.getState().hydrate(data);
      useSessionStore.getState().unlock(secret);
    } catch (error) {
      if (error instanceof GoogleAuthExpiredError) {
        disconnectSession();
        return;
      }
      if (error instanceof VaultDecryptionError) {
        setErrorMessage('Incorrect secret. Please try again.');
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : 'Something went wrong. Please try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title="Unlock your vault"
      description="Enter your secret to unlock your vault."
      footer={
        <>
          <Button variant="default" className="w-full" disabled={submitting || !secret} onPress={handleUnlock}>
            {submitting ? <Spinner size={16} className="text-primary-foreground" /> : null}
            <Text>{submitting ? 'Unlocking…' : 'Unlock'}</Text>
          </Button>
          <Button variant="ghost" size="sm" className="w-full" onPress={() => router.push('/recover')}>
            <Text variant="muted" className="text-sm">
              Forgot your secret?
            </Text>
          </Button>
        </>
      }>
      <View className="gap-1.5">
        <Input label="Email address" value={email} editable={false} />
        <Button variant="ghost" size="sm" className="self-start" onPress={disconnectSession}>
          <Text variant="muted" className="text-xs">
            Disconnect
          </Text>
        </Button>
      </View>

      <Input
        label="Secret"
        value={secret}
        onChangeText={setSecret}
        secureToggle
        autoFocus
        returnKeyType="go"
        onSubmitEditing={handleUnlock}
      />

      {errorMessage ? (
        <Alert variant="destructive">
          <FaIcon name="alert" size={16} className="mt-0.5 text-destructive" />
          <View className="flex-1 gap-0.5">
            <AlertTitle>Unlock failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </View>
        </Alert>
      ) : null}
    </AuthScreen>
  );
}
