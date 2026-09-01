import { cn } from '@/lib/utils';
import * as React from 'react';
import { Text, type TextProps } from 'react-native';

const GLYPHS = {
  alert: String.fromCodePoint(0xf071),
  file: String.fromCodePoint(0xf15b),
  lock: String.fromCodePoint(0xf30d),
  cloud: String.fromCodePoint(0xf0c2),
};

type FaIconName = keyof typeof GLYPHS;

function FaIcon({
  name,
  size = 16,
  className,
  style,
  ...props
}: { name: FaIconName; size?: number } & TextProps) {
  return (
    <Text
      className={cn('text-foreground', className)}
      style={[{ fontFamily: 'FontAwesome-Light', fontSize: size, lineHeight: size }, style]}
      {...props}>
      {GLYPHS[name]}
    </Text>
  );
}

export { FaIcon };
export type { FaIconName };
