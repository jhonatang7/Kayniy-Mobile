import apiClient from '@/src/modules/@core/data/api_client';
import { API_ENDPOINTS } from '@/src/modules/@core/data/endpoints';
import type { RegisterLessonProgressRequest } from '../../main/types/user-progress.types';

export const UserProgressClient = {
  async registerLesson(data: RegisterLessonProgressRequest) {
    await apiClient.post(`${API_ENDPOINTS.USER_PROGRESS}/lessons`, data);
  },
};
