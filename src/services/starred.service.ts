import apiClient from "@/lib/axios";
import type { DataResponse, ListData } from "@/types/api";
import type { PinnedRepo, PinRepoRequest } from "@/types/starred";

export const pinnedRepoService = {
  async getPinnedRepos(): Promise<DataResponse<ListData<PinnedRepo>>> {
    const { data } =
      await apiClient.get<DataResponse<ListData<PinnedRepo>>>(
        "/v1/pinned-repos",
      );
    return data;
  },

  async pinRepo(request: PinRepoRequest): Promise<DataResponse<PinnedRepo>> {
    const { data } = await apiClient.post<DataResponse<PinnedRepo>>(
      "/v1/pinned-repos",
      request,
    );
    return data;
  },

  async unpinRepo(repoFullName: string): Promise<DataResponse<void>> {
    const [owner, repo] = repoFullName.split("/");
    const { data } = await apiClient.delete<DataResponse<void>>(
      `/v1/pinned-repos/${owner}/${repo}`,
    );
    return data;
  },

  async isPinned(repoFullName: string): Promise<DataResponse<boolean>> {
    const [owner, repo] = repoFullName.split("/");
    const { data } = await apiClient.get<DataResponse<boolean>>(
      `/v1/pinned-repos/check/${owner}/${repo}`,
    );
    return data;
  },
};
