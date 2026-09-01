import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAccountStore } from '@/lib/auth/account-store';
import { lockSession } from '@/lib/auth/lock-session';
import { useVaultStore } from '@/lib/vault/vault-store';
import * as React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Placeholder landing screen — proves the auth flow completed. Real vault/items UI is out of scope. */
export default function ItemsScreen() {
  const email = useAccountStore((state) => state.account.email);
  const name = useAccountStore((state) => state.account.name);
  const snapshot = useVaultStore((state) => state.snapshot);
  const vaultName = snapshot.vaults[0]?.name ?? 'My Vault';

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-6 bg-background px-6">
      <View className="items-center gap-2">
        <Text className="font-sans-semibold text-xl text-foreground">You're in</Text>
        <Text variant="muted" className="text-center text-sm">
          Signed in as {name ? `${name} (${email})` : email}. The vault is unlocked — item list,
          search, and editing aren't built yet.
        </Text>
        <Text variant="muted" className="text-center text-sm">
          Vault: {vaultName} · {snapshot.items.length} item{snapshot.items.length === 1 ? '' : 's'}
        </Text>
      </View>
      <Button variant="outline" onPress={lockSession}>
        <Text>Lock</Text>
      </Button>
    </SafeAreaView>
  );
}
