export interface StarredRepo {
  id: string;
  repoFullName: string;
  repoName: string;
  language: string | null;
  createdAt: string;
}

export interface StarRepoRequest {
  repoFullName: string;
  repoName: string;
  language?: string | null;
}
