'use client';

import { pinnedRepoService } from '@/services/starred.service';
import type { PinRepoRequest } from '@/types/starred';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePinnedRepos() {
  return useQuery({
    queryKey: ['pinned-repos'],
    queryFn: () => pinnedRepoService.getPinnedRepos(),
  });
}

export function useIsPinned(repoFullName: string) {
  return useQuery({
    queryKey: ['pinned-repos', 'check', repoFullName],
    queryFn: () => pinnedRepoService.isPinned(repoFullName),
    enabled: !!repoFullName,
  });
}

export function usePinRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PinRepoRequest) => pinnedRepoService.pinRepo(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pinned-repos'] });
      queryClient.invalidateQueries({ queryKey: ['repos'] });
    },
  });
}

export function useUnpinRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repoFullName: string) => pinnedRepoService.unpinRepo(repoFullName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pinned-repos'] });
      queryClient.invalidateQueries({ queryKey: ['repos'] });
    },
  });
}
