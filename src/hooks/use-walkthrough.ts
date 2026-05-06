"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { walkthroughService } from "@/services/walkthrough.service";
import { getErrorMessage } from "@/lib/error";
import type { CreateCommentRequest } from "@/types/walkthrough";

interface UseWalkthroughsParams {
  owner: string;
  repo: string;
  prNumber: number;
}

export function useWalkthroughs({
  owner,
  repo,
  prNumber,
}: UseWalkthroughsParams) {
  return useQuery({
    queryKey: ["walkthroughs", owner, repo, prNumber],
    queryFn: () => walkthroughService.list({ owner, repo, prNumber }),
    enabled: !!owner && !!repo && !!prNumber,
  });
}

export function useWalkthrough(id: string) {
  return useQuery({
    queryKey: ["walkthrough", id],
    queryFn: () => walkthroughService.getById(id),
    enabled: !!id,
  });
}

export function useRecentWalkthroughs() {
  return useQuery({
    queryKey: ["walkthroughs", "recent"],
    queryFn: () => walkthroughService.listRecent(),
  });
}

export function useRecentlyReviewedWalkthroughs() {
  return useQuery({
    queryKey: ["walkthroughs", "recently-reviewed"],
    queryFn: () => walkthroughService.listRecentlyReviewed(),
  });
}

export function useWalkthroughComments(walkthroughId: string) {
  return useQuery({
    queryKey: ["walkthrough-comments", walkthroughId],
    queryFn: () => walkthroughService.listComments(walkthroughId),
    enabled: !!walkthroughId,
  });
}

export function useFileComments(walkthroughId: string, fileId: string) {
  return useQuery({
    queryKey: ["file-comments", walkthroughId, fileId],
    queryFn: () => walkthroughService.listFileComments(walkthroughId, fileId),
    enabled: !!walkthroughId && !!fileId,
  });
}

export function useCreateWalkthroughComment(walkthroughId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCommentRequest) =>
      walkthroughService.createComment(walkthroughId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["walkthrough-comments", walkthroughId],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to post comment."));
    },
  });
}

export function useCreateFileComment(walkthroughId: string, fileId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCommentRequest) =>
      walkthroughService.createComment(walkthroughId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["file-comments", walkthroughId, fileId],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to post comment."));
    },
  });
}
