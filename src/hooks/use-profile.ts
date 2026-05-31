'use client';

import { profileService } from '@/services/profile.service';
import { useQuery } from '@tanstack/react-query';

export function useProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => profileService.getByUsername(username),
    enabled: !!username,
  });
}

export function useProfileStats(username: string) {
  return useQuery({
    queryKey: ['profile-stats', username],
    queryFn: () => profileService.getStats(username),
    enabled: !!username,
  });
}

export function useUserWalkthroughs(username: string, status?: string) {
  return useQuery({
    queryKey: ['user-walkthroughs', username, status],
    queryFn: () => profileService.getUserWalkthroughs(username, status),
    enabled: !!username,
  });
}

export function useProfileActivity(username: string) {
  return useQuery({
    queryKey: ['profile-activity', username],
    queryFn: () => profileService.getActivity(username),
    enabled: !!username,
  });
}

export function useProfileReviewing(username: string) {
  return useQuery({
    queryKey: ['profile-reviewing', username],
    queryFn: () => profileService.getReviewing(username),
    enabled: !!username,
  });
}

export function useRecentPullRequests(perPage = 10) {
  return useQuery({
    queryKey: ['recent-prs', perPage],
    queryFn: () => profileService.getRecentPullRequests(perPage),
  });
}
