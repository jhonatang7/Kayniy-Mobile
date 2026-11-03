import apiClient from '@/src/modules/@core/data/api_client';
import { API_ENDPOINTS } from '@/src/modules/@core/data/endpoints';
import type { CommunityDetails } from '../../main/types/community.types';

export const CommunityClient = {
  async getDetails(communityId: string) {
    const response = await apiClient.get<CommunityDetails>(
      `${API_ENDPOINTS.COMMUNITY}/${communityId}/details`
    );
    return response.data;
  },
};