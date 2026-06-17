import apiClient from '@/lib/axios';
import type { DataResponse, ListData } from '@/types/api';
import type {
  CreateCommentRequest,
  CreateWalkthroughRequest,
  ReadProgress,
  RecentlyReviewedWalkthrough,
  RecordChapterViewRequest,
  UpdateWalkthroughRequest,
  Walkthrough,
  WalkthroughComment,
  WalkthroughSummary,
} from '@/types/walkthrough';

interface ListWalkthroughsParams {
  owner: string;
  repo: string;
  prNumber: number;
}

export const walkthroughService = {
  async create(request: CreateWalkthroughRequest): Promise<DataResponse<Walkthrough>> {
    const { data } = await apiClient.post<DataResponse<Walkthrough>>('/v1/walkthroughs', request);
    return data;
  },

  async list({
    owner,
    repo,
    prNumber,
  }: ListWalkthroughsParams): Promise<DataResponse<ListData<WalkthroughSummary>>> {
    const { data } = await apiClient.get<DataResponse<ListData<WalkthroughSummary>>>(
      '/v1/walkthroughs',
      { params: { owner, repo, prNumber } }
    );
    return data;
  },

  async listRecent(): Promise<DataResponse<ListData<WalkthroughSummary>>> {
    const { data } =
      await apiClient.get<DataResponse<ListData<WalkthroughSummary>>>('/v1/walkthroughs/recent');
    return data;
  },

  async getById(id: string): Promise<DataResponse<Walkthrough>> {
    const { data } = await apiClient.get<DataResponse<Walkthrough>>(`/v1/walkthroughs/${id}`);
    return data;
  },

  async syncCheck(id: string): Promise<DataResponse<Walkthrough>> {
    const { data } = await apiClient.post<DataResponse<Walkthrough>>(
      `/v1/walkthroughs/${id}/sync-check`
    );
    return data;
  },

  async update(id: string, request: UpdateWalkthroughRequest): Promise<DataResponse<Walkthrough>> {
    const { data } = await apiClient.put<DataResponse<Walkthrough>>(
      `/v1/walkthroughs/${id}`,
      request
    );
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/v1/walkthroughs/${id}`);
  },

  // ── Comments ──

  async createComment(
    walkthroughId: string,
    request: CreateCommentRequest
  ): Promise<DataResponse<WalkthroughComment>> {
    const { data } = await apiClient.post<DataResponse<WalkthroughComment>>(
      `/v1/walkthroughs/${walkthroughId}/comments`,
      request
    );
    return data;
  },

  async listComments(walkthroughId: string): Promise<DataResponse<ListData<WalkthroughComment>>> {
    const { data } = await apiClient.get<DataResponse<ListData<WalkthroughComment>>>(
      `/v1/walkthroughs/${walkthroughId}/comments`
    );
    return data;
  },

  async deleteComment(walkthroughId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/v1/walkthroughs/${walkthroughId}/comments/${commentId}`);
  },

  async listFileComments(
    walkthroughId: string,
    fileId: string
  ): Promise<DataResponse<ListData<WalkthroughComment>>> {
    const { data } = await apiClient.get<DataResponse<ListData<WalkthroughComment>>>(
      `/v1/walkthroughs/${walkthroughId}/files/${fileId}/comments`
    );
    return data;
  },

  async listBatchFileComments(
    walkthroughId: string,
    fileIds: string[]
  ): Promise<DataResponse<Record<string, WalkthroughComment[]>>> {
    const { data } = await apiClient.post<DataResponse<Record<string, WalkthroughComment[]>>>(
      `/v1/walkthroughs/${walkthroughId}/batch-file-comments`,
      fileIds
    );
    return data;
  },

  async listChapterComments(
    walkthroughId: string,
    chapterId: string
  ): Promise<DataResponse<ListData<WalkthroughComment>>> {
    const { data } = await apiClient.get<DataResponse<ListData<WalkthroughComment>>>(
      `/v1/walkthroughs/${walkthroughId}/chapters/${chapterId}/comments`
    );
    return data;
  },

  // ── Reading Progress ──

  async recordChapterView(walkthroughId: string, request: RecordChapterViewRequest): Promise<void> {
    await apiClient.post(`/v1/walkthroughs/${walkthroughId}/chapter-view-events`, request);
  },

  async markChapterRead(walkthroughId: string, chapterId: string): Promise<void> {
    await apiClient.post(`/v1/walkthroughs/${walkthroughId}/chapters/${chapterId}/read`);
  },

  async unmarkChapterRead(walkthroughId: string, chapterId: string): Promise<void> {
    await apiClient.delete(`/v1/walkthroughs/${walkthroughId}/chapters/${chapterId}/read`);
  },

  async getReadProgress(walkthroughId: string): Promise<DataResponse<ReadProgress>> {
    const { data } = await apiClient.get<DataResponse<ReadProgress>>(
      `/v1/walkthroughs/${walkthroughId}/progress`
    );
    return data;
  },

  async listRecentlyReviewed(): Promise<DataResponse<ListData<RecentlyReviewedWalkthrough>>> {
    const { data } = await apiClient.get<DataResponse<ListData<RecentlyReviewedWalkthrough>>>(
      '/v1/walkthroughs/recently-reviewed'
    );
    return data;
  },
};
