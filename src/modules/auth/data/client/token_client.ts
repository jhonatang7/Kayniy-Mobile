import { jwtDecode } from 'jwt-decode';

import { storage } from '@/src/modules/@core/data/storage';

const ACCESS_TOKEN_KEY = 'kayniy_access_token';
const REFRESH_TOKEN_KEY = 'kayniy_refresh_token';

export const TokenClient = {
  getAccessToken() {
    return storage.getString(ACCESS_TOKEN_KEY);
  },

  async saveTokens(response: {
    access_token?: string;
    accessToken?: string;
    refresh_token?: string;
    refreshToken?: string;
  }) {
    const accessToken = response.access_token ?? response.accessToken;
    const refreshToken = response.refresh_token ?? response.refreshToken;

    if (!accessToken) {
      throw new Error('La respuesta de autenticación no contiene un access token.');
    }

    await storage.setString(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      await storage.setString(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  async isValid() {
    const token = await this.getAccessToken();
    if (!token) return false;

    try {
      const { exp } = jwtDecode<{ exp?: number }>(token);
      return typeof exp === 'number' && exp > Date.now() / 1000;
    } catch {
      return false;
    }
  },

  async clear() {
    await Promise.all([
      storage.delete(ACCESS_TOKEN_KEY),
      storage.delete(REFRESH_TOKEN_KEY),
    ]);
  },
};