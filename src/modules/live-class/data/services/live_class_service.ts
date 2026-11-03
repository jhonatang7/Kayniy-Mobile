import { useQuery } from '@tanstack/react-query';

import { LiveClassClient } from '../client/live_class_client';

export const liveClassKeys = {
  all: ['live-classes'] as const,
  community: (communityId: string) => [...liveClassKeys.all, 'community', communityId] as const,
};

export const useCommunityLiveClasses = (communityId: string | undefined) =>
  useQuery({
    queryKey: liveClassKeys.community(communityId ?? ''),
    queryFn: () => {
      if (!communityId) {
        throw new Error('No se pueden cargar los lives sin una comunidad.');
      }
      return LiveClassClient.getByCommunity(communityId);
    },
    enabled: Boolean(communityId),
  });