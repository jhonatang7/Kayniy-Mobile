import apiClient from '@/src/modules/@core/data/api_client';
import { API_ENDPOINTS } from '@/src/modules/@core/data/endpoints';
import type { LiveClass } from '../../main/types/live-class.types';

export const LiveClassClient = {
  async getByCommunity(communityId: string) {
    const response = await apiClient.get<LiveClass[]>(
      `${API_ENDPOINTS.LIVE_CLASSES}/community/${communityId}/mobile`
    );
    return response.data;
  },
};