import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Toast from 'react-native-toast-message';
import 'react-native-reanimated';
import '../global.css';

import { TanstackProvider } from '@/src/modules/@core/providers/tanstack-provider';

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <TanstackProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </TanstackProvider>
    </KeyboardProvider>
  );
}
