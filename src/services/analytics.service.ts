import apiClient from "@/lib/axios";
import type { DataResponse, ListData } from "@/types/api";
import type {
  AuthorWalkthroughSummary,
  ChapterAttentionResponse,
  RepoMetrics,
  ReviewProgress,
  UnreadSummary,
} from "@/types/analytics";

interface RepoMetricsParams {
  owner: string;
  repo: string;
  from?: string;
  to?: string;
}

export const analyticsService = {
  async authorSummary(params?: {
    owner?: string;
    repo?: string;
  }): Promise<DataResponse<ListData<AuthorWalkthroughSummary>>> {
    const { data } = await apiClient.get<
      DataResponse<ListData<AuthorWalkthroughSummary>>
    >("/v1/analytics/author-summary", { params });
    return data;
  },

  async reviewProgress(
    walkthroughId: string,
  ): Promise<DataResponse<ReviewProgress>> {
    const { data } = await apiClient.get<DataResponse<ReviewProgress>>(
      `/v1/analytics/walkthroughs/${walkthroughId}/review-progress`,
    );
    return data;
  },

  async chapterAttention(
    walkthroughId: string,
  ): Promise<DataResponse<ChapterAttentionResponse>> {
    const { data } = await apiClient.get<
      DataResponse<ChapterAttentionResponse>
    >(`/v1/analytics/walkthroughs/${walkthroughId}/chapter-attention`);
    return data;
  },

  async unreadSummary(
    walkthroughId: string,
  ): Promise<DataResponse<UnreadSummary>> {
    const { data } = await apiClient.get<DataResponse<UnreadSummary>>(
      `/v1/analytics/walkthroughs/${walkthroughId}/unread-summary`,
    );
    return data;
  },

  async repoMetrics({
    owner,
    repo,
    from,
    to,
  }: RepoMetricsParams): Promise<DataResponse<RepoMetrics>> {
    const { data } = await apiClient.get<DataResponse<RepoMetrics>>(
      `/v1/analytics/repos/${owner}/${repo}/metrics`,
      { params: { from, to } },
    );
    return data;
  },
};
