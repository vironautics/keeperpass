import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

type InputProps = Omit<TextInputProps, 'secureTextEntry'> & {
  label?: string;
  error?: string;
  /** Renders as a password field with an eye toggle to reveal/hide the value. */
  secureToggle?: boolean;
};

function Input({ label, error, secureToggle, className, editable, ...props }: InputProps) {
  const [revealed, setRevealed] = React.useState(false);
  const { colorScheme } = useColorScheme();
  const placeholderColor = THEME[colorScheme ?? 'light'].mutedForeground;

  return (
    <View className="gap-1.5">
      {label ? <Text className="font-sans-semibold text-sm text-foreground">{label}</Text> : null}
      <View className="justify-center">
        <TextInput
          className={cn(
            'h-12 rounded-xl border border-input bg-background px-4 font-sans text-base text-foreground',
            secureToggle && 'pr-12',
            editable === false && 'opacity-60',
            className
          )}
          placeholderTextColor={placeholderColor}
          secureTextEntry={secureToggle ? !revealed : undefined}
          editable={editable}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        {secureToggle ? (
          <Pressable
            onPress={() => setRevealed((value) => !value)}
            hitSlop={8}
            className="absolute right-3 h-8 w-8 items-center justify-center">
            <Icon as={revealed ? EyeOff : Eye} size={18} className="text-muted-foreground" />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="text-xs text-destructive">{error}</Text> : null}
    </View>
  );
}

export { Input };
export type { InputProps };
