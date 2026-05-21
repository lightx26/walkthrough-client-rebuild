"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";

export function useAuthorAnalyticsSummary(params?: { owner?: string; repo?: string }) {
  return useQuery({
    queryKey: ["analytics", "author-summary", params?.owner, params?.repo],
    queryFn: () => analyticsService.authorSummary(params),
  });
}

export function useReviewProgress(walkthroughId: string) {
  return useQuery({
    queryKey: ["analytics", "review-progress", walkthroughId],
    queryFn: () => analyticsService.reviewProgress(walkthroughId),
    enabled: !!walkthroughId,
  });
}

export function useChapterAttention(walkthroughId: string) {
  return useQuery({
    queryKey: ["analytics", "chapter-attention", walkthroughId],
    queryFn: () => analyticsService.chapterAttention(walkthroughId),
    enabled: !!walkthroughId,
  });
}

export function useUnreadSummary(walkthroughId: string) {
  return useQuery({
    queryKey: ["analytics", "unread-summary", walkthroughId],
    queryFn: () => analyticsService.unreadSummary(walkthroughId),
    enabled: !!walkthroughId,
  });
}

interface UseRepoMetricsParams {
  owner: string;
  repo: string;
  from?: string;
  to?: string;
}

export function useRepoMetrics({ owner, repo, from, to }: UseRepoMetricsParams) {
  return useQuery({
    queryKey: ["analytics", "repo-metrics", owner, repo, from, to],
    queryFn: () => analyticsService.repoMetrics({ owner, repo, from, to }),
    enabled: !!owner && !!repo,
  });
}
