"use client";

import { useQuery } from "@tanstack/react-query";
import { githubService } from "@/services/github.service";

export function usePullRequest(
  owner: string,
  repo: string,
  prNumber: number,
) {
  return useQuery({
    queryKey: ["pr", owner, repo, prNumber],
    queryFn: () => githubService.getPullRequest(owner, repo, prNumber),
    enabled: !!owner && !!repo && !!prNumber,
  });
}
