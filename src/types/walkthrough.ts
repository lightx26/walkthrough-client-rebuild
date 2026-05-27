export type WalkthroughStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "OUTDATED"
  | "DEPRECATED";

export interface WalkthroughAnnotation {
  id: string;
  startLine: number;
  endLine: number;
  lineSide: string;
  content: string;
  sortOrder: number;
  status: string;
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
  commitSha: string;
  version: number;
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
  version: number;
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

export interface StalenessResponse {
  stale: boolean;
  currentCommitSha: string;
  latestCommitSha: string;
  currentVersion: number;
}

export interface VersionDiffFileDiff {
  changeType: "ADDED" | "REMOVED" | "MODIFIED" | "UNCHANGED";
  filename: string;
  fromFilename: string;
  toFilename: string;
}

export interface VersionDiffChapterDiff {
  changeType: "ADDED" | "REMOVED" | "MODIFIED" | "UNCHANGED";
  title: string;
  fromTitle: string;
  toTitle: string;
  files: VersionDiffFileDiff[];
}

export interface VersionDiffAnnotationDiff {
  annotationId: string;
  filename: string;
  startLine: number;
  endLine: number;
  lineSide: string;
  content: string;
  reason: "LINE_REMOVED" | "FILE_REMOVED" | "DIFF_CHANGED";
}

export interface VersionDiffResponse {
  walkthroughId: string;
  fromVersion: number;
  toVersion: number;
  fromCommitSha: string;
  toCommitSha: string;
  chapters: VersionDiffChapterDiff[];
  outdatedAnnotations: VersionDiffAnnotationDiff[];
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
  markedAsRead?: boolean;
}
