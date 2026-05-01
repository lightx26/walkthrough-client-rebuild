import apiClient from "@/lib/axios";
import type { DataResponse, ListData } from "@/types/api";
import type { Repository } from "@/types/github";

export const githubService = {
  async getRepositories(
    page = 1,
    perPage = 30,
    sort = "updated",
    q?: string,
  ): Promise<DataResponse<ListData<Repository>>> {
    const { data } = await apiClient.get<DataResponse<ListData<Repository>>>(
      "/v1/github/repos",
      { params: { page, perPage, sort, ...(q ? { q } : {}) } },
    );
    return data;
  },
};
