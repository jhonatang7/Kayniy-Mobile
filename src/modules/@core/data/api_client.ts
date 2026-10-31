import { create, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { TokenClient } from '@/src/modules/auth/data/client/token_client';
import type { AuthResponse } from '@/src/modules/auth/main/types/auth.types';
import { API_ENDPOINTS } from './endpoints';
import { storage } from './storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim() ?? 'http://192.168.1.68:3000/api';

if (!apiUrl) {
  throw new Error(
    'Missing EXPO_PUBLIC_API_URL. Define it in the Expo environment before starting the app.'
  );
}

const apiClient = create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const REFRESH_TOKEN_HEADER = 'x-refresh-token';
const WITHOUT_TOKEN_HEADER = 'x-without-token';
const RETRY_HEADER = 'x-auth-retry';

export const addWithoutTokenHeader = () => ({ [WITHOUT_TOKEN_HEADER]: 'true' });
export const addRefreshTokenHeader = () => ({ [REFRESH_TOKEN_HEADER]: 'true' });

const refreshClient = create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    [REFRESH_TOKEN_HEADER]: 'true',
  },
});

let refreshPromise: Promise<void> | null = null;

const hasHeader = (config: InternalAxiosRequestConfig, name: string) => {
  return Boolean(config.headers?.get?.(name) ?? config.headers?.[name]);
};

const addToken = (config: InternalAxiosRequestConfig) => {
  const tokenPromise = TokenClient.getAccessToken();
  return tokenPromise.then((token) => {
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });
};

const updateAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .get<AuthResponse>(`${API_ENDPOINTS.AUTH}/refresh`, {
        withCredentials: true,
      })
      .then(async (response) => {
        await TokenClient.saveTokens(response.data);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  await refreshPromise;
};

apiClient.interceptors.request.use(async (config) => {
  if (hasHeader(config, WITHOUT_TOKEN_HEADER) || hasHeader(config, REFRESH_TOKEN_HEADER)) {
    return config;
  }

  const token = await storage.getString('kayniy_access_token');
  if (token && !(await TokenClient.isValid())) {
    await updateAccessToken();
  }

  return addToken(config);
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (hasHeader(originalRequest, REFRESH_TOKEN_HEADER)) {
      await TokenClient.clear();
      return Promise.reject(error);
    }

    if (hasHeader(originalRequest, WITHOUT_TOKEN_HEADER) || hasHeader(originalRequest, RETRY_HEADER)) {
      return Promise.reject(error);
    }

    originalRequest.headers.set(RETRY_HEADER, 'true');
    try {
      await updateAccessToken();
      return apiClient(originalRequest);
    } catch (refreshError) {
      await TokenClient.clear();
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
