import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { AuthClient } from '../data/client/auth_client';
import { TokenClient } from '../data/client/token_client';
import type { User } from '../main/types/auth.types';

interface AuthContextValue {
  isAuthenticated: boolean;
  isFirstLogin: boolean;
  isLoading: boolean;
  refreshSession: (knownUser?: User) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async (knownUser?: User) => {
    setIsLoading(true);
    try {
      const accessToken = await TokenClient.getAccessToken();
      if (!accessToken) {
        setIsAuthenticated(false);
        setIsFirstLogin(false);
        return null;
      }

      if (!(await TokenClient.isValid())) {
        await AuthClient.refreshToken();
      }

      const user = knownUser ?? (await AuthClient.me());
      setIsAuthenticated(true);
      setIsFirstLogin(user.isFirstLogin);
      return user;
    } catch {
      await TokenClient.clear();
      setIsAuthenticated(false);
      setIsFirstLogin(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AuthClient.logout();
    setIsAuthenticated(false);
    setIsFirstLogin(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => refreshSession());
  }, [refreshSession]);

  const value = useMemo(
    () => ({ isAuthenticated, isFirstLogin, isLoading, refreshSession, logout }),
    [isAuthenticated, isFirstLogin, isLoading, refreshSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}