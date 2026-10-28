import { API_ENDPOINTS } from '@/src/modules/@core/data/endpoints';
import { HttpClient } from '@/src/modules/@core/data/http_client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../../main/types/student.types';

export class StudentClient {
  static login(data: LoginRequest) {
    return HttpClient.post<AuthResponse>(`${API_ENDPOINTS.AUTH}/login`, data);
  }

  static register(data: RegisterRequest) {
    return HttpClient.post<AuthResponse>(`${API_ENDPOINTS.USER}/create-student`, data);
  }
}
