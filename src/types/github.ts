export interface RepositoryOwner {
  id: number;
  login: string;
  avatarUrl: string;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  isPrivate: boolean;
  htmlUrl: string;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  openPrsCount: number;
  walkthroughsCount: number;
  updatedAt: string;
  owner: RepositoryOwner;
}
