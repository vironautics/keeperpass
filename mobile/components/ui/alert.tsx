import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View, type TextProps, type ViewProps } from 'react-native';

const alertVariants = cva('flex-row gap-2.5 rounded-lg border border-border bg-card px-4 py-3', {
  variants: {
    variant: {
      default: '',
      destructive: 'border-destructive/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const alertTextVariants = cva('', {
  variants: {
    variant: {
      default: '',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type AlertProps = ViewProps & VariantProps<typeof alertVariants>;

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <TextClassContext.Provider value={alertTextVariants({ variant })}>
      <View className={cn(alertVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

function AlertTitle({ className, ...props }: TextProps) {
  return <Text className={cn('font-sans-semibold text-sm', className)} {...props} />;
}

function AlertDescription({ className, ...props }: TextProps) {
  return <Text className={cn('text-sm', className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
