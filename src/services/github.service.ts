import apiClient from "@/lib/axios";
import type { DataResponse, ListData, PageData } from "@/types/api";
import type { PrFile, PullRequest, Repository } from "@/types/github";

interface GetRepositoriesParams {
  page?: number;
  perPage?: number;
  sort?: string;
  q?: string;
}

interface GetPullRequestParams {
  owner: string;
  repo: string;
  prNumber: number;
}

export const githubService = {
  async getRepositories({
    page = 1,
    perPage = 20,
    sort = "updated",
    q,
  }: GetRepositoriesParams = {}): Promise<DataResponse<PageData<Repository>>> {
    const { data } = await apiClient.get<DataResponse<PageData<Repository>>>(
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

  async getPullRequest({
    owner,
    repo,
    prNumber,
  }: GetPullRequestParams): Promise<DataResponse<PullRequest>> {
    const { data } = await apiClient.get<DataResponse<PullRequest>>(
      `/v1/github/repos/${owner}/${repo}/pulls/${prNumber}`,
    );
    return data;
  },

  async getPullRequestFiles(
    owner: string,
    repo: string,
    prNumber: number,
  ): Promise<DataResponse<ListData<PrFile>>> {
    const { data } = await apiClient.get<DataResponse<ListData<PrFile>>>(
      `/v1/github/repos/${owner}/${repo}/pulls/${prNumber}/files`,
    );
    return data;
  },
};
