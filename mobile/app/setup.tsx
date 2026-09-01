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
import { GoogleAuthExpiredError, saveVault } from '@/lib/drive/google-drive';
import { matches } from '@/lib/validation/matches';
import { createEmptyVaultSnapshot } from '@/lib/vault/vault-snapshot';
import { useVaultStore } from '@/lib/vault/vault-store';
import * as React from 'react';
import { View } from 'react-native';

export default function SetupScreen() {
  const email = useAccountStore((state) => state.account.email);
  const [secret, setSecret] = React.useState('');
  const [confirmation, setConfirmation] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const confirmationTouched = confirmation.length > 0;
  const secretsMatch = matches(secret, confirmation);
  const canSubmit = secret.length > 0 && secretsMatch;

  async function handleCreateVault() {
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
      await saveVault(accessToken, JSON.stringify(await encryptVault(secret, empty)));
      useVaultStore.getState().hydrate(empty);
      useSessionStore.getState().setHasVault(true);
      useSessionStore.getState().unlock(secret);
    } catch (error) {
      if (error instanceof GoogleAuthExpiredError) {
        disconnectSession();
        return;
      }
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not create your vault. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title="Create your vault"
      description="Choose the secret that will encrypt your vault. Everything you save is locked with it."
      footer={
        <>
          <Button variant="default" className="w-full" disabled={submitting || !canSubmit} onPress={handleCreateVault}>
            {submitting ? <Spinner size={16} className="text-primary-foreground" /> : null}
            <Text>{submitting ? 'Creating your vault…' : 'Create vault'}</Text>
          </Button>
          <Button variant="ghost" size="sm" className="w-full" onPress={disconnectSession}>
            <Text variant="muted" className="text-sm">
              Disconnect
            </Text>
          </Button>
        </>
      }>
      {email ? (
        <Text variant="muted" className="text-xs">
          Setting up for <Text className="text-xs font-sans-semibold text-foreground">{email}</Text>
        </Text>
      ) : null}

      <View className="gap-1.5">
        <Input
          label="Secret"
          value={secret}
          onChangeText={setSecret}
          secureToggle
          autoFocus
          placeholder="Choose a secret"
        />
        <PasswordStrengthMeter password={secret} />
      </View>

      <Input
        label="Repeat secret"
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
            Your vault is encrypted on this device with a key made from the secret you choose here.
            KeeperPass never receives that secret, so we could not read your vault even if we were
            asked to.{'\n\n'}
            Your secret is never sent anywhere and is never stored — nobody, not us, not Google, can
            look it up or reset it for you. If you forget it, your vault cannot be recovered. Write
            it down and keep it somewhere safe before you continue.
          </AlertDescription>
        </View>
      </Alert>

      {errorMessage ? (
        <Alert variant="destructive">
          <FaIcon name="alert" size={16} className="mt-0.5 text-destructive" />
          <View className="flex-1 gap-0.5">
            <AlertTitle>Couldn't create your vault</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </View>
        </Alert>
      ) : null}
    </AuthScreen>
  );
}
