import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '../../providers/auth-provider';

export function useAuthGuard() {
  const { isAuthenticated, isFirstLogin, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inFirstLoginGroup = segments[0] === '(first-login)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && isFirstLogin && !inFirstLoginGroup) {
      router.replace('/(first-login)');
    } else if (isAuthenticated && !isFirstLogin && (inAuthGroup || inFirstLoginGroup)) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isFirstLogin, isLoading, router, segments]);

  return { isLoading };
}