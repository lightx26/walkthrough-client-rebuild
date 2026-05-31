export interface Profile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  email?: string;
  bio?: string | null;
  githubUrl?: string;
  joinedAt: string;
}

export interface ProfileStats {
  walkthroughs: number;
  chapters: number;
  views: number;
  comments: number;
  pins: number;
  reviews: number;
}

export interface ActivityEntry {
  id: string;
  eventType: string;
  occurredAt: string;
  walkthroughId?: string;
  chapterId?: string;
  commentId?: string;
  visibility: string;
  metadata: Record<string, string>;
}

export interface ProfileReviewingItem {
  walkthroughId: string;
  title: string;
  owner: string;
  repo: string;
  prNumber: number;
  status: string;
  creatorDisplayName: string;
  creatorAvatarUrl: string;
  readChapters: number;
  totalChapters: number;
  timeSpentSec: number;
  lastReadAt: string;
}

export interface RecentPullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'merged' | 'closed' | 'draft';
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  repo: string;
  headRef?: string;
  author: {
    login: string;
    avatarUrl: string | null;
  };
}
