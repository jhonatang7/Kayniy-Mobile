import { create } from 'axios';

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
});

apiClient.interceptors.request.use(async (config) => {
  const token = await storage.getString('kayniy_access_token');

  if (token) {
    config.headers.set('Authorization', 'Bearer ' + token);
  }

  return config;
});

export default apiClient;
