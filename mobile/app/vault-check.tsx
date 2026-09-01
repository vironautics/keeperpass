import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Renders only while the one-time Drive vault-existence check is in flight — required by the guard design, not cosmetic. */
export default function VaultCheckScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-3 bg-background">
      <Spinner size={24} />
      <Text variant="muted" className="text-sm">
        Checking your vault…
      </Text>
    </SafeAreaView>
  );
}
