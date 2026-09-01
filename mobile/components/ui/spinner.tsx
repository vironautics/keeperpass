import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react-native';
import * as React from 'react';

type SpinnerProps = Omit<React.ComponentProps<typeof Icon>, 'as'>;

function Spinner({ className, size = 16, ...props }: SpinnerProps) {
  return <Icon as={Loader2} size={size} className={cn('animate-spin', className)} {...props} />;
}

export { Spinner };
