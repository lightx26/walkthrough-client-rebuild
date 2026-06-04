'use client';

import { riskService } from '@/services/risk.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const POLLING_INTERVAL_MS = 1500;

export function useRiskScan(walkthroughId: string) {
  return useQuery({
    queryKey: ['risk', 'scan', walkthroughId],
    queryFn: async () => {
      try {
        const res = await riskService.getScan(walkthroughId);
        return res.data;
      } catch {
        return null;
      }
    },
    enabled: !!walkthroughId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'PENDING' || status === 'ANALYZING' ? POLLING_INTERVAL_MS : false;
    },
  });
}

export function useTriggerScan(walkthroughId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => riskService.triggerScan(walkthroughId),
    onSuccess: (res) => {
      queryClient.setQueryData(['risk', 'scan', walkthroughId], res.data);
    },
  });
}

export function useMarkReviewed(walkthroughId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ riskId, reviewed }: { riskId: string; reviewed: boolean }) =>
      riskService.markReviewed(walkthroughId, riskId, reviewed),
    onSuccess: (res) => {
      // optimistic-style: update the zone in the cached scan
      queryClient.setQueryData(['risk', 'scan', walkthroughId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          risks: old.risks.map((r: any) =>
            r.id === res.data.id ? { ...r, reviewStatus: res.data.reviewStatus } : r,
          ),
        };
      });
    },
  });
}
