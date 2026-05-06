"use client";

import { useQuery } from "@tanstack/react-query";
import { walkthroughService } from "@/services/walkthrough.service";

export function useWalkthroughs(
  owner: string,
  repo: string,
  prNumber: number,
) {
  return useQuery({
    queryKey: ["walkthroughs", owner, repo, prNumber],
    queryFn: () => walkthroughService.list(owner, repo, prNumber),
    enabled: !!owner && !!repo && !!prNumber,
  });
}
