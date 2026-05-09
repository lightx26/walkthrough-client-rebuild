export interface RepositoryOwner {
  id: number;
  login: string;
  avatarUrl: string;
  type: string;
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

export type PullRequestState = "open" | "merged" | "closed";

export interface PullRequestAuthor {
  id: number;
  login: string;
  avatarUrl: string | null;
}

export interface BranchRef {
  label: string;
  ref: string;
  sha: string;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: PullRequestState;
  body: string | null;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  changedFiles: number;
  additions: number;
  deletions: number;
  commits: number;
  author: PullRequestAuthor;
  head: BranchRef;
  base: BranchRef;
  walkthroughsCount: number;
}

export type PrFileStatus =
  | "added"
  | "removed"
  | "modified"
  | "renamed"
  | "copied"
  | "changed"
  | "unchanged";

export interface PrFile {
  sha: string;
  filename: string;
  status: PrFileStatus;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}
