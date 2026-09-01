import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import {
  estimatePasswordStrength,
  MIN_MASTER_PASSWORD_SCORE,
} from '@/lib/validation/password-strength';
import * as React from 'react';
import { View } from 'react-native';

const LABELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
const SEGMENTS = 4;

/** Warning-only — never blocks submission, matches Setup/Recover's actual gating. */
function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;

  const score = estimatePasswordStrength(password);
  const isWeak = score < MIN_MASTER_PASSWORD_SCORE;

  return (
    <View className="gap-1.5">
      <View className="flex-row gap-1">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <View
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full',
              i < score ? (isWeak ? 'bg-destructive' : 'bg-accent-strong') : 'bg-muted'
            )}
          />
        ))}
      </View>
      <Text className={cn('text-xs', isWeak ? 'text-destructive' : 'text-muted-foreground')}>
        {LABELS[score]}
        {isWeak ? ' — consider a stronger secret' : ''}
      </Text>
    </View>
  );
}

export { PasswordStrengthMeter };
