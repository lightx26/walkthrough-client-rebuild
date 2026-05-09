import apiClient from "@/lib/axios";
import type { DataResponse, ListData, PageData } from "@/types/api";
import type { Repository } from "@/types/github";
import type {
  RecentPRResult,
  SearchHistoryItem,
  SearchWalkthroughRequest,
  SearchWalkthroughResponse,
  UserSearchResult,
} from "@/types/search";

export const searchService = {
  async searchWalkthroughs(
    request: SearchWalkthroughRequest,
  ): Promise<DataResponse<SearchWalkthroughResponse>> {
    const { data } = await apiClient.post<
      DataResponse<SearchWalkthroughResponse>
    >("/v1/search/walkthroughs", request);
    return data;
  },

  async getHistory(): Promise<DataResponse<ListData<SearchHistoryItem>>> {
    const { data } =
      await apiClient.get<DataResponse<ListData<SearchHistoryItem>>>(
        "/v1/search/history",
      );
    return data;
  },

  async saveHistory(query: string): Promise<void> {
    await apiClient.post("/v1/search/history", { query });
  },

  async searchUsers(q: string): Promise<DataResponse<ListData<UserSearchResult>>> {
    const { data } = await apiClient.get<DataResponse<ListData<UserSearchResult>>>(
      "/v1/users/search",
      { params: { q } },
    );
    return data;
  },

  async searchRepos(q: string): Promise<DataResponse<PageData<Repository>>> {
    const { data } = await apiClient.get<DataResponse<PageData<Repository>>>(
      "/v1/github/repos",
      { params: { q, perPage: 10 } },
    );
    return data;
  },

  async searchPRs(q: string, perPage = 10): Promise<DataResponse<ListData<RecentPRResult>>> {
    const { data } = await apiClient.get<DataResponse<ListData<RecentPRResult>>>(
      "/v1/github/pulls/search",
      { params: { q, perPage } },
    );
    return data;
  },
};
