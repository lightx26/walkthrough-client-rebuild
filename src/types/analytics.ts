export interface ReviewerChapter {
  chapterId: string;
  chapterTitle: string;
  order: number;
  markedAsRead: boolean;
  timeSpentSec: number;
  commentCount: number;
  viewCount: number;
}

export interface Reviewer {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  readChapters: number;
  totalChapters: number;
  completionRate: number;
  totalTimeSpentSec: number;
  lastActiveAt: string | null;
  chapters: ReviewerChapter[];
}

export interface ReviewProgress {
  walkthroughId: string;
  totalChapters: number;
  reviewers: Reviewer[];
}

export interface AttentionEntry {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  timeSpentSec: number;
  markedAsRead: boolean;
  possiblySkimmed: boolean;
  commentCount: number;
  viewCount: number;
}

export interface ChapterAttention {
  chapterId: string;
  chapterTitle: string;
  order: number;
  totalComments: number;
  allRead: boolean;
  possiblySkimmedCount: number;
  attention: AttentionEntry[];
}

export interface ChapterAttentionResponse {
  walkthroughId: string;
  chapters: ChapterAttention[];
}

export interface UnreadByUser {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface UnreadChapter {
  chapterId: string;
  chapterTitle: string;
  order: number;
  unreadBy: UnreadByUser[];
}

export interface UnreadSummary {
  walkthroughId: string;
  allChaptersReadByAll: boolean;
  unreadChapters: UnreadChapter[];
}

export interface ReviewerStatus {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  readChapters: number;
  totalChapters: number;
  lastActiveAt: string | null;
}

import type { WalkthroughStatus } from "./walkthrough";

export interface AuthorWalkthroughSummary {
  walkthroughId: string;
  title: string;
  description: string | null;
  owner: string;
  repo: string;
  prNumber: number;
  status: WalkthroughStatus;
  totalChapters: number;
  totalComments: number;
  unreadChapterCount: number;
  lastActivityAt: string | null;
  reviewers: ReviewerStatus[];
}

export interface RepoMetricsPeriod {
  from: string;
  to: string;
}

export interface RepoMetricsSummary {
  totalWalkthroughs: number;
  totalReviews: number;
  avgCompletionRate: number;
  avgTimeToCompleteSec: number;
  avgChaptersPerWalkthrough: number;
  activeReviewers: number;
}

export interface RepoMember {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  walkthroughsReviewed: number;
  avgCompletionRate: number;
  avgTimeSpentSec: number;
  totalComments: number;
}

export interface RepoTrendPoint {
  week: string;
  avgCompletionRate: number;
  reviewsCompleted: number;
}

export interface RepoMetrics {
  repo: string;
  period: RepoMetricsPeriod;
  summary: RepoMetricsSummary;
  members: RepoMember[];
  trend: RepoTrendPoint[];
}
