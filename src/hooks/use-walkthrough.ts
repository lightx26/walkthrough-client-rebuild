'use client';

import { getErrorMessage, isPublishValidationError } from '@/lib/error';
import { walkthroughService } from '@/services/walkthrough.service';
import type {
  CreateCommentRequest,
  CreateWalkthroughRequest,
  RecordChapterViewRequest,
  UpdateWalkthroughRequest,
} from '@/types/walkthrough';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseWalkthroughsParams {
  owner: string;
  repo: string;
  prNumber: number;
}

export function useWalkthroughs({ owner, repo, prNumber }: UseWalkthroughsParams) {
  return useQuery({
    queryKey: ['walkthroughs', owner, repo, prNumber],
    queryFn: () => walkthroughService.list({ owner, repo, prNumber }),
    enabled: !!owner && !!repo && !!prNumber,
  });
}

export function useWalkthrough(id: string) {
  return useQuery({
    queryKey: ['walkthrough', id],
    queryFn: () => walkthroughService.getById(id),
    enabled: !!id,
  });
}

export function useSyncCheck(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => walkthroughService.syncCheck(id),
    onSuccess: (result) => {
      queryClient.setQueryData(['walkthrough', id], result);
    },
  });
}

export function useRecentWalkthroughs() {
  return useQuery({
    queryKey: ['walkthroughs', 'recent'],
    queryFn: () => walkthroughService.listRecent(),
  });
}

export function useRecentlyReviewedWalkthroughs() {
  return useQuery({
    queryKey: ['walkthroughs', 'recently-reviewed'],
    queryFn: () => walkthroughService.listRecentlyReviewed(),
  });
}

export function useWalkthroughComments(walkthroughId: string) {
  return useQuery({
    queryKey: ['walkthrough-comments', walkthroughId],
    queryFn: () => walkthroughService.listComments(walkthroughId),
    enabled: !!walkthroughId,
  });
}

export function useFileComments(walkthroughId: string, fileId: string) {
  return useQuery({
    queryKey: ['file-comments', walkthroughId, fileId],
    queryFn: () => walkthroughService.listFileComments(walkthroughId, fileId),
    enabled: !!walkthroughId && !!fileId,
  });
}

export function useBatchFileComments(walkthroughId: string, fileIds: string[]) {
  return useQuery({
    queryKey: ['batch-file-comments', walkthroughId, fileIds],
    queryFn: () => walkthroughService.listBatchFileComments(walkthroughId, fileIds),
    enabled: !!walkthroughId && fileIds.length > 0,
  });
}

export function useCreateWalkthrough() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateWalkthroughRequest) => walkthroughService.create(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['walkthroughs', variables.owner, variables.repo, variables.prNumber],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create walkthrough.'));
    },
  });
}

export function useUpdateWalkthrough(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateWalkthroughRequest) => walkthroughService.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walkthrough', id] });
    },
    onError: (error) => {
      if (isPublishValidationError(error)) return; // edit page shows this inline
      toast.error(getErrorMessage(error, 'Failed to update walkthrough.'));
    },
  });
}

export function useDeleteWalkthrough(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => walkthroughService.delete(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['walkthrough', id] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete walkthrough.'));
    },
  });
}

export function useCreateWalkthroughComment(walkthroughId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCommentRequest) =>
      walkthroughService.createComment(walkthroughId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['walkthrough-comments', walkthroughId],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to post comment.'));
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
        queryKey: ['batch-file-comments', walkthroughId],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to post comment.'));
    },
  });
}

export function useReadProgress(walkthroughId: string) {
  return useQuery({
    queryKey: ['read-progress', walkthroughId],
    queryFn: () => walkthroughService.getReadProgress(walkthroughId),
    enabled: !!walkthroughId,
  });
}

export function useRecordChapterView(walkthroughId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RecordChapterViewRequest) =>
      walkthroughService.recordChapterView(walkthroughId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['read-progress', walkthroughId],
      });
      queryClient.invalidateQueries({
        queryKey: ['walkthroughs', 'recently-reviewed'],
      });
    },
  });
}

export function useMarkChapterRead(walkthroughId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chapterId: string) => walkthroughService.markChapterRead(walkthroughId, chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['read-progress', walkthroughId],
      });
      queryClient.invalidateQueries({
        queryKey: ['walkthroughs', 'recently-reviewed'],
      });
    },
  });
}

export function useUnmarkChapterRead(walkthroughId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chapterId: string) =>
      walkthroughService.unmarkChapterRead(walkthroughId, chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['read-progress', walkthroughId],
      });
      queryClient.invalidateQueries({
        queryKey: ['walkthroughs', 'recently-reviewed'],
      });
    },
  });
}
