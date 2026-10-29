import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import '../global.css';

import { TanstackProvider } from '@/src/modules/@core/providers/tanstack-provider';
import { AuthProvider } from '@/src/modules/auth/providers/auth-provider';
import { useAuthGuard } from '@/src/modules/auth/view/guards/auth-gate';

function RootNavigator() {
  useAuthGuard();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(first-login)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <TanstackProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
        <Toast />
      </TanstackProvider>
    </KeyboardProvider>
  );
}
