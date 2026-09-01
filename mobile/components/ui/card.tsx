import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { View, type ViewProps, type TextProps } from 'react-native';

function Card({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        'gap-6 rounded-xl border border-foreground/10 bg-card py-6 shadow-sm shadow-black/5',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ViewProps) {
  return <View className={cn('gap-1 px-6', className)} {...props} />;
}

function CardTitle({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn('font-sans-semibold text-base leading-normal text-card-foreground', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: TextProps) {
  return <Text className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

function CardContent({ className, ...props }: ViewProps) {
  return <View className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: ViewProps) {
  return <View className={cn('flex-row items-center px-6', className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
