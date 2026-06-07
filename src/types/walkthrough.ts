export type WalkthroughStatus = 'DRAFT' | 'PUBLISHED' | 'OUTDATED' | 'DEPRECATED';

export interface WalkthroughAnnotation {
  id: string;
  startLine: number;
  endLine: number;
  lineSide: string;
  content: string;
  sortOrder: number;
}

export interface WalkthroughFile {
  id: string;
  filename: string;
  fileSha: string;
  fileStatus: string;
  sortOrder: number;
  rawPatch?: string;
  annotations: WalkthroughAnnotation[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  files: WalkthroughFile[];
}

export interface Walkthrough {
  id: string;
  userId: string;
  creatorUsername?: string;
  creatorDisplayName?: string;
  creatorAvatarUrl?: string;
  title: string;
  description: string;
  status: WalkthroughStatus;
  outdatedReason?: string;
  commitSha: string;
  owner: string;
  repo: string;
  prNumber: number;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export interface WalkthroughSummary {
  id: string;
  userId: string;
  title: string;
  description: string;
  owner: string;
  repo: string;
  prNumber: number;
  status: WalkthroughStatus;
  outdatedReason?: string;
  chapterCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalkthroughComment {
  id: string;
  walkthroughId: string;
  userId: string;
  username: string;
  avatarUrl: string;
  content: string;
  chapterId: string | null;
  walkthroughFileId: string | null;
  diffPosition: number | null;
  parentId: string | null;
  syncStatus: string;
  replies: WalkthroughComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ReadProgress {
  id: string;
  userId: string;
  walkthroughId: string;
  lastChapterId: string;
  readChapters: number;
  totalChapters: number;
  timeSpentSec: number;
  readAt: string;
  readChapterIds: string[];
}

export interface RecentlyReviewedWalkthrough {
  walkthroughId: string;
  title: string;
  owner: string;
  repo: string;
  prNumber: number;
  status: WalkthroughStatus;
  readChapters: number;
  totalChapters: number;
  timeSpentSec: number;
  lastReadAt: string;
}

export interface ChapterFileRequest {
  filename: string;
  fileSha?: string;
  fileStatus: string;
  rawPatch?: string;
}

export interface ChapterRequest {
  title: string;
  description?: string;
  files?: ChapterFileRequest[];
}

export interface CreateWalkthroughRequest {
  owner: string;
  repo: string;
  prNumber: number;
  title: string;
  description?: string;
  status: WalkthroughStatus;
  chapters?: ChapterRequest[];
}

export interface UpdateWalkthroughRequest {
  title: string;
  description?: string;
  status: WalkthroughStatus;
  chapters?: ChapterRequest[];
}

export interface CreateCommentRequest {
  content: string;
  chapterId?: string;
  walkthroughFileId?: string;
  diffPosition?: number;
  parentId?: string;
}

export interface RecordChapterViewRequest {
  chapterId: string;
  timeSpentSec?: number;
}
