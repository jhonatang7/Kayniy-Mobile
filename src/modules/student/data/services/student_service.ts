import { useMutation } from '@tanstack/react-query';

import { StudentClient } from '../client/student_client';
import type {
  LoginRequest,
  RegisterRequest,
} from '../../main/types/student.types';

export const StudentService = {
  useLogin() {
    return useMutation({
      mutationFn: (data: LoginRequest) => StudentClient.login(data),
    });
  },

  useRegister() {
    return useMutation({
      mutationFn: (data: RegisterRequest) => StudentClient.register(data),
    });
  },
};
