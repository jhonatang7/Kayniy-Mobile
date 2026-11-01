import type { ReactNode } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthGuard } from '../guards/auth-gate';

export function AuthScreen({
  children,
  scrollable = true,
  edges = ['top', 'bottom'],
}: {
  children: ReactNode;
  scrollable?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}) {
  const { isLoading } = useAuthGuard();

  if (isLoading) return null;

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={edges}>
      {scrollable ? (
        <KeyboardAwareScrollView
          bottomOffset={32}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-xl self-center">{children}</View>
        </KeyboardAwareScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
    </SafeAreaView>
  );
}