import type { AxiosRequestConfig } from 'axios';

import apiClient from './api_client';

export class HttpClient {
  static async get<T>(url: string, options?: AxiosRequestConfig) {
    const response = await apiClient.get<T>(url, options);
    return response.data;
  }

  static async post<T>(
    url: string,
    data?: unknown,
    options?: AxiosRequestConfig
  ) {
    const response = await apiClient.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(
    url: string,
    data?: unknown,
    options?: AxiosRequestConfig
  ) {
    const response = await apiClient.put<T>(url, data, options);
    return response.data;
  }

  static async patch<T>(
    url: string,
    data?: unknown,
    options?: AxiosRequestConfig
  ) {
    const response = await apiClient.patch<T>(url, data, options);
    return response.data;
  }

  static async delete<T>(url: string, options?: AxiosRequestConfig) {
    const response = await apiClient.delete<T>(url, options);
    return response.data;
  }
}
