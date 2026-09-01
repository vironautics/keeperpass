import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthScreenProps = {
  title: string;
  description: string;
  /** Rendered above the title inside the card header — e.g. Recover's "Back to unlock" button. */
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/**
 * Shared chrome for every unauthenticated screen, matching ngkeeperspartan's `auth-layout`:
 * a small brand mark over a single centred card, one per step of the flow.
 */
function AuthScreen({ title, description, headerExtra, children, footer }: AuthScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerClassName="flex-grow items-center justify-center gap-8 px-4 py-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Logo height={44} />
          <Card className="w-full max-w-[420px]">
            <CardHeader>
              {headerExtra}
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
            </CardHeader>
            <CardContent className="gap-4">{children}</CardContent>
            {footer ? <CardFooter className="flex-col gap-2">{footer}</CardFooter> : null}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export { AuthScreen };
