import apiClient from '@/src/modules/@core/data/api_client';
import { API_ENDPOINTS } from '@/src/modules/@core/data/endpoints';
import type { CompleteModuleProgressRequest } from '../../main/types/user-progress.types';

export const UserModuleProgressClient = {
  async completeModule(data: CompleteModuleProgressRequest) {
    await apiClient.post(`${API_ENDPOINTS.USER_MODULE_PROGRESS}/complete`, data);
  },
};
