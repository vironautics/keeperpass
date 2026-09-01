import { AuthScreen } from '@/components/auth-screen';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FaIcon } from '@/components/ui/fa-icon';
import { Input } from '@/components/ui/input';
import { PasswordStrengthMeter } from '@/components/ui/password-strength-meter';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useAccountStore } from '@/lib/auth/account-store';
import { disconnectSession, ensureFreshTokenOrDisconnect } from '@/lib/auth/disconnect-session';
import { useSessionStore } from '@/lib/auth/session-store';
import { encryptVault } from '@/lib/crypto/vault-crypto';
import { GoogleAuthExpiredError, resetVault } from '@/lib/drive/google-drive';
import { matches } from '@/lib/validation/matches';
import { createEmptyVaultSnapshot } from '@/lib/vault/vault-snapshot';
import { useVaultStore } from '@/lib/vault/vault-store';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

export default function RecoverScreen() {
  const router = useRouter();
  const email = useAccountStore((state) => state.account.email);

  const [secret, setSecret] = React.useState('');
  const [confirmation, setConfirmation] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const confirmationTouched = confirmation.length > 0;
  const secretsMatch = matches(secret, confirmation);
  const canSubmit = secret.length > 0 && secretsMatch;

  async function handleRecover() {
    if (submitting || !canSubmit) return;
    setSubmitting(true);
    setErrorMessage('');

    const accessToken = await ensureFreshTokenOrDisconnect();
    if (!accessToken) {
      setSubmitting(false);
      return;
    }

    try {
      const empty = createEmptyVaultSnapshot();
      await resetVault(accessToken, JSON.stringify(await encryptVault(secret, empty)));
      useVaultStore.getState().hydrate(empty);
      useSessionStore.getState().unlock(secret);
    } catch (error) {
      if (error instanceof GoogleAuthExpiredError) {
        disconnectSession();
        return;
      }
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not recover your account. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title="Recover account"
      description="Please confirm your account and choose a new secret."
      headerExtra={
        <Button
          variant="ghost"
          size="sm"
          className="-ms-2 self-start"
          onPress={() => router.back()}>
          <Text variant="muted" className="text-sm">
            ‹ Back to unlock
          </Text>
        </Button>
      }
      footer={
        <Button variant="destructive" className="w-full" disabled={submitting || !canSubmit} onPress={handleRecover}>
          {submitting ? <Spinner size={16} className="text-white" /> : null}
          <Text className="text-white">{submitting ? 'Recovering account…' : 'Recover account'}</Text>
        </Button>
      }>
      <Input label="Email address" value={email} editable={false} />

      <View className="gap-1.5">
        <Input
          label="New secret"
          value={secret}
          onChangeText={setSecret}
          secureToggle
          placeholder="Choose a new secret"
        />
        <PasswordStrengthMeter password={secret} />
      </View>

      <Input
        label="Repeat new secret"
        value={confirmation}
        onChangeText={setConfirmation}
        secureToggle
        placeholder="Enter it again"
        error={confirmationTouched && !secretsMatch ? 'The two secrets do not match.' : undefined}
      />

      <Alert variant="destructive">
        <FaIcon name="alert" size={16} className="mt-0.5 text-destructive" />
        <View className="flex-1 gap-1">
          <AlertTitle>Please read this before you continue</AlertTitle>
          <AlertDescription>
            Your vault is encrypted with a key that only your secret can produce — nobody else
            holds a copy. Continuing here does not recover your vault. Your current vault becomes
            inaccessible under this new secret, and you'll start again with a brand new, empty
            vault. Your existing vault file isn't deleted — it's kept as a timestamped backup in
            your keeperpass folder in Google Drive.
          </AlertDescription>
        </View>
      </Alert>

      {errorMessage ? (
        <Alert variant="destructive">
          <FaIcon name="alert" size={16} className="mt-0.5 text-destructive" />
          <View className="flex-1 gap-0.5">
            <AlertTitle>Couldn't recover your account</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </View>
        </Alert>
      ) : null}
    </AuthScreen>
  );
}
