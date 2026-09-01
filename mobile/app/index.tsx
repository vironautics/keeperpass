import { AuthScreen } from '@/components/auth-screen';
import { GoogleLogo } from '@/components/google-logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FaIcon, type FaIconName } from '@/components/ui/fa-icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useAccountStore } from '@/lib/auth/account-store';
import { signInWithGoogle } from '@/lib/auth/google-auth';
import { useSessionStore } from '@/lib/auth/session-store';
import * as React from 'react';
import { View } from 'react-native';

const BULLETS: { icon: FaIconName; text: string }[] = [
  {
    icon: 'file',
    text: 'Access is limited to the files KeeperPass creates. The rest of your Drive stays out of reach.',
  },
  {
    icon: 'lock',
    text: 'Your vault is encrypted on this device with a secret you choose next. Google stores the file; it cannot read it.',
  },
  {
    icon: 'cloud',
    text: 'There is no KeeperPass server. Nothing is sent anywhere else.',
  },
];

export default function StartScreen() {
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  async function handleGoogleSignIn() {
    if (submitting) return;
    setSubmitting(true);
    setErrorMessage('');
    try {
      const { email, name, accessToken, expiresAt } = await signInWithGoogle();
      useAccountStore.getState().updateProfile({ email, name });
      await useSessionStore.getState().signIn(accessToken, expiresAt);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title="Welcome to KeeperPass"
      description="Your vault is a single encrypted file in your own Google Drive. Sign in to open it."
      footer={
        <Text variant="muted" className="text-center text-xs">
          Signing in creates the vault file if you do not have one yet.
        </Text>
      }>
      {errorMessage ? (
        <Alert variant="destructive">
          <FaIcon name="alert" size={16} className="mt-0.5 text-destructive" />
          <View className="flex-1 gap-0.5">
            <AlertTitle>Sign-in failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </View>
        </Alert>
      ) : null}

      <Button variant="outline" className="w-full" disabled={submitting} onPress={handleGoogleSignIn}>
        {submitting ? <Spinner size={16} /> : <GoogleLogo size={16} />}
        <Text>Continue with Google</Text>
      </Button>

      <View className="gap-2.5">
        {BULLETS.map((bullet) => (
          <View key={bullet.icon} className="flex-row items-start gap-2">
            <FaIcon name={bullet.icon} size={14} className="mt-0.5 shrink-0 text-accent-strong" />
            <Text variant="muted" className="flex-1 text-xs leading-relaxed">
              {bullet.text}
            </Text>
          </View>
        ))}
      </View>
    </AuthScreen>
  );
}
