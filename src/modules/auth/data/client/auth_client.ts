import apiClient, {
  addRefreshTokenHeader,
  addWithoutTokenHeader,
} from '@/src/modules/@core/data/api_client';
import { API_ENDPOINTS } from '@/src/modules/@core/data/endpoints';
import type {
  AuthMessageResponse,
  AuthResponse,
  ChangePasswordRequest,
  FirstLoginPasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  User,
} from '../../main/types/auth.types';
import { TokenClient } from './token_client';

export const AuthClient = {
  async login(data: LoginRequest) {
    const response = await apiClient.post<AuthResponse>(`${API_ENDPOINTS.AUTH}/login-mobile`, data, {
      headers: addWithoutTokenHeader(),
      withCredentials: true,
    });
    await TokenClient.saveTokens(response.data);
    return response.data;
  },

  async register(data: RegisterRequest) {
    const response = await apiClient.post<AuthResponse>(`${API_ENDPOINTS.USER}/create-student`, data, {
      headers: addWithoutTokenHeader(),
    });
    await TokenClient.saveTokens(response.data);
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordRequest) {
    const response = await apiClient.post<AuthMessageResponse>(
      `${API_ENDPOINTS.AUTH}/forgot-password-mobile`,
      data,
      { headers: addWithoutTokenHeader() }
    );
    return response.data;
  },

  async resetPassword(data: ResetPasswordRequest) {
    const response = await apiClient.post<AuthMessageResponse>(
      `${API_ENDPOINTS.AUTH}/reset-password`,
      data,
      { headers: addWithoutTokenHeader() }
    );
    return response.data;
  },

  async me() {
    const response = await apiClient.get<User>(`${API_ENDPOINTS.AUTH}/me`);
    return response.data;
  },

  async setFirstLoginPassword(data: FirstLoginPasswordRequest) {
    const response = await apiClient.post<User>(
      `${API_ENDPOINTS.USER}/me/first-login-password`,
      data
    );
    return response.data;
  },

  async updateProfile(data: UpdateProfileRequest) {
    const response = await apiClient.patch<User>(`${API_ENDPOINTS.USER}/me/profile`, data);
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest) {
    const response = await apiClient.post<AuthMessageResponse>(
      `${API_ENDPOINTS.USER}/me/password`,
      data
    );
    return response.data;
  },

  async refreshToken() {
    const response = await apiClient.get<AuthResponse>(`${API_ENDPOINTS.AUTH}/refresh`, {
      headers: addRefreshTokenHeader(),
      withCredentials: true,
    });
    await TokenClient.saveTokens(response.data);
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post(`${API_ENDPOINTS.AUTH}/logout`, {
        headers: addWithoutTokenHeader(),
        withCredentials: true,
      });
    } finally {
      await TokenClient.clear();
    }
  },
};