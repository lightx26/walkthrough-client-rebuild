import apiClient from "@/lib/axios";
import type { DataResponse, ListData } from "@/types/api";
import type { StarredRepo, StarRepoRequest } from "@/types/starred";

export const starredRepoService = {
  async getStarredRepos(): Promise<DataResponse<ListData<StarredRepo>>> {
    const { data } = await apiClient.get<DataResponse<ListData<StarredRepo>>>(
      "/v1/starred-repos",
    );
    return data;
  },

  async starRepo(request: StarRepoRequest): Promise<DataResponse<StarredRepo>> {
    const { data } = await apiClient.post<DataResponse<StarredRepo>>(
      "/v1/starred-repos",
      request,
    );
    return data;
  },

  async unstarRepo(repoFullName: string): Promise<DataResponse<void>> {
    const [owner, repo] = repoFullName.split("/");
    const { data } = await apiClient.delete<DataResponse<void>>(
      `/v1/starred-repos/${owner}/${repo}`,
    );
    return data;
  },

  async isStarred(repoFullName: string): Promise<DataResponse<boolean>> {
    const [owner, repo] = repoFullName.split("/");
    const { data } = await apiClient.get<DataResponse<boolean>>(
      `/v1/starred-repos/check/${owner}/${repo}`,
    );
    return data;
  },
};
