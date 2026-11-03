import { useQuery } from '@tanstack/react-query';

import { CommunityClient } from '../client/community_client';

export const communityKeys = {
  all: ['communities'] as const,
  details: (communityId: string) => [...communityKeys.all, 'details', communityId] as const,
};

export const useCommunityDetails = (communityId: string | undefined) =>
  useQuery({
    queryKey: communityKeys.details(communityId ?? ''),
    queryFn: () => {
      if (!communityId) {
        throw new Error('No se pueden cargar los detalles sin una comunidad.');
      }
      return CommunityClient.getDetails(communityId);
    },
    enabled: Boolean(communityId),
  });