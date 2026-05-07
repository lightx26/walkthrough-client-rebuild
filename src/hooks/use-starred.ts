"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { starredRepoService } from "@/services/starred.service";
import type { StarRepoRequest } from "@/types/starred";

export function useStarredRepos() {
  return useQuery({
    queryKey: ["starred-repos"],
    queryFn: () => starredRepoService.getStarredRepos(),
  });
}

export function useIsStarred(repoFullName: string) {
  return useQuery({
    queryKey: ["starred-repos", "check", repoFullName],
    queryFn: () => starredRepoService.isStarred(repoFullName),
    enabled: !!repoFullName,
  });
}

export function useStarRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: StarRepoRequest) => starredRepoService.starRepo(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starred-repos"] });
    },
  });
}

export function useUnstarRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repoFullName: string) => starredRepoService.unstarRepo(repoFullName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starred-repos"] });
    },
  });
}
