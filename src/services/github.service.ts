// import apiClient from "@/lib/axios";
// import type { DataResponse, ListData } from "@/types/api";
// import type {
//   Commit,
//   FileChange,
//   PullRequest,
//   RecentPullRequest,
//   Repository,
// } from "@/types/github";
//
// export const githubService = {
//   async getRepositories(
//     page = 1,
//     perPage = 30,
//     sort = "updated",
//     q?: string,
//   ): Promise<DataResponse<ListData<Repository>>> {
//     const { data } = await apiClient.get<DataResponse<ListData<Repository>>>(
//       "/v1/github/repos",
//       { params: { page, perPage, sort, ...(q ? { q } : {}) } },
//     );
//     return data;
//   },
//
//   async getPullRequests(
//     owner: string,
//     repo: string,
//     state = "open",
//     page = 1,
//     perPage = 30,
//   ): Promise<DataResponse<ListData<PullRequest>>> {
//     const { data } = await apiClient.get<DataResponse<ListData<PullRequest>>>(
//       `/v1/github/repos/${owner}/${repo}/pulls`,
//       { params: { state, page, perPage } },
//     );
//     return data;
//   },
//
//   async getPullRequest(
//     owner: string,
//     repo: string,
//     pullNumber: number,
//   ): Promise<DataResponse<PullRequest>> {
//     const { data } = await apiClient.get<DataResponse<PullRequest>>(
//       `/v1/github/repos/${owner}/${repo}/pulls/${pullNumber}`,
//     );
//     return data;
//   },
//
//   async getPullRequestCommits(
//     owner: string,
//     repo: string,
//     pullNumber: number,
//   ): Promise<DataResponse<ListData<Commit>>> {
//     const { data } = await apiClient.get<DataResponse<ListData<Commit>>>(
//       `/v1/github/repos/${owner}/${repo}/pulls/${pullNumber}/commits`,
//     );
//     return data;
//   },
//
//   async getPullRequestFiles(
//     owner: string,
//     repo: string,
//     pullNumber: number,
//   ): Promise<DataResponse<ListData<FileChange>>> {
//     const { data } = await apiClient.get<DataResponse<ListData<FileChange>>>(
//       `/v1/github/repos/${owner}/${repo}/pulls/${pullNumber}/files`,
//     );
//     return data;
//   },
//
//   async getCommitFiles(
//     owner: string,
//     repo: string,
//     commitSha: string,
//   ): Promise<DataResponse<ListData<FileChange>>> {
//     const { data } = await apiClient.get<DataResponse<ListData<FileChange>>>(
//       `/v1/github/repos/${owner}/${repo}/commits/${commitSha}/files`,
//     );
//     return data;
//   },
//
//   async getRecentPullRequests(
//     perPage = 10,
//   ): Promise<DataResponse<ListData<RecentPullRequest>>> {
//     const { data } = await apiClient.get<
//       DataResponse<ListData<RecentPullRequest>>
//     >("/v1/github/pulls/recent", { params: { perPage } });
//     return data;
//   },
// };
