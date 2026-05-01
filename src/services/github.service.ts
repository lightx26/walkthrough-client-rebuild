import apiClient from "@/lib/axios";
import type { DataResponse, ListData } from "@/types/api";
import type { PullRequest, Repository } from "@/types/github";

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

  async getRepository(
    owner: string,
    repo: string,
  ): Promise<DataResponse<Repository>> {
    const { data } = await apiClient.get<DataResponse<Repository>>(
      `/v1/github/repos/${owner}/${repo}`,
    );
    return data;
  },

  async getRepositoryPullRequests(
    owner: string,
    repo: string,
  ): Promise<DataResponse<ListData<PullRequest>>> {
    const { data } = await apiClient.get<DataResponse<ListData<PullRequest>>>(
      `/v1/github/repos/${owner}/${repo}/pulls`,
    );
    return data;
  },
};
