export interface SearchFilters {
  authorIds?: string[];
  repository?: string;
  status?: string[];
  createdFrom?: string;
  createdTo?: string;
}

export interface SearchWalkthroughRequest {
  query: string;
  filters?: SearchFilters;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ChapterHit {
  chapterIndex: number;
  field: string;
  snippet: string;
}

export interface SearchHighlights {
  title?: string[];
  description?: string[];
  chapterHits?: ChapterHit[];
}

export interface SearchHit {
  id: string;
  title: string;
  authorName: string;
  repoFull: string;
  status: string;
  createdAt: string;
  score: number;
  highlights: SearchHighlights;
}

export interface FacetEntry {
  value: string;
  count: number;
}

export interface SearchWalkthroughResponse {
  total: number;
  page: number;
  size: number;
  hits: SearchHit[];
  facets: Record<string, FacetEntry[]>;
}

export type SearchTab = "all" | "walkthroughs" | "prs" | "repos";

export interface SearchHistoryItem {
  id: string;
  query: string;
  createdAt: string;
}

export interface UserSearchResult {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}
