export interface PinnedRepo {
  id: string;
  repoFullName: string;
  repoName: string;
  language: string | null;
  createdAt: string;
}

export interface PinRepoRequest {
  repoFullName: string;
  repoName: string;
  language?: string | null;
}
