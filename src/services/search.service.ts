import apiClient from "@/lib/axios";
import type { DataResponse, ListData } from "@/types/api";
import type {
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
};
