import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
    ChangePasswordRequest,
    FirstLoginPasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    UpdateProfileRequest,
} from '../../main/types/auth.types';
import { useAuth } from '../../providers/auth-provider';
import { AuthClient } from '../client/auth_client';

export const authKeys = {
  auth: ['auth'] as const,
  me: ['auth', 'me'] as const,
  session: ['auth', 'session'] as const,
};

export const AuthService = {
  useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data: LoginRequest) => AuthClient.login(data),
      onSuccess: (data) => {
        queryClient.setQueryData(authKeys.session, data);
        if (data.user) queryClient.setQueryData(authKeys.me, data.user);
      },
    });
  },

  useRegister() {
    return useMutation({
      mutationFn: (data: RegisterRequest) => AuthClient.register(data),
    });
  },

  useForgotPassword() {
    return useMutation({
      mutationFn: (data: ForgotPasswordRequest) => AuthClient.forgotPassword(data),
    });
  },

  useResetPassword() {
    return useMutation({
      mutationFn: (data: ResetPasswordRequest) => AuthClient.resetPassword(data),
    });
  },

  useSetFirstLoginPassword() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data: FirstLoginPasswordRequest) => AuthClient.setFirstLoginPassword(data),
      onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
    });
  },

  useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data: UpdateProfileRequest) => AuthClient.updateProfile(data),
      onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
    });
  },

  useChangePassword() {
    return useMutation({
      mutationFn: (data: ChangePasswordRequest) => AuthClient.changePassword(data),
    });
  },

  useMe(enabled = true) {
    return useQuery({
      queryKey: authKeys.me,
      queryFn: AuthClient.me,
      retry: 1,
      enabled,
    });
  },

  useRefreshToken() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: AuthClient.refreshToken,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.auth }),
    });
  },

  useLogout() {
    const queryClient = useQueryClient();
    const { logout } = useAuth();

    return useMutation({
      mutationFn: logout,
      onSuccess: () => queryClient.removeQueries({ queryKey: authKeys.auth }),
    });
  },
};