"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Clock,
  GitPullRequest,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useWalkthroughSearch,
  useRepoSearch,
  usePRSearch,
  useSearchHistory,
  useSaveSearchHistory,
} from "@/hooks/use-search";
import type { RecentPRResult, SearchFilters, SearchHit, SearchTab, UserSearchResult } from "@/types/search";
import type { Repository } from "@/types/github";
import { SearchAuthorDropdown } from "@/components/search/search-author-dropdown";
import {
  SearchDateRangeDropdown,
  type SearchDateRange,
} from "@/components/search/search-date-range-dropdown";
import { SearchWalkthroughItem } from "@/components/search/search-walkthrough-item";
import { SearchRepoItem } from "@/components/search/search-repo-item";
import { SearchPRItem } from "@/components/search/search-pr-item";

interface Props {
  onClose: () => void;
}

const TABS: { id: SearchTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "walkthroughs", label: "Walkthroughs" },
  { id: "prs", label: "Pull Requests" },
  { id: "repos", label: "Repos" },
];

// ── Main modal ───────────────────────────────────────────────────────────────

export function SearchModal({ onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedAuthor, setSelectedAuthor] = useState<UserSearchResult | null>(null);
  const [dateRange, setDateRange] = useState<SearchDateRange>({ from: "", to: "" });

  const { data: historyData } = useSearchHistory();
  const recentSearches = historyData?.data?.items ?? [];
  const saveHistory = useSaveSearchHistory();

  const filters: SearchFilters | undefined =
    selectedAuthor || dateRange.from || dateRange.to
      ? {
          ...(selectedAuthor ? { authorIds: [selectedAuthor.id] } : {}),
          ...(dateRange.from
            ? { createdFrom: new Date(dateRange.from).toISOString() }
            : {}),
          ...(dateRange.to
            ? {
                createdTo: new Date(
                  new Date(dateRange.to).setDate(
                    new Date(dateRange.to).getDate() + 1,
                  ),
                ).toISOString(),
              }
            : {}),
        }
      : undefined;

  const {
    data: walkthroughData,
    isFetching: walkthroughFetching,
    isWaitingForDebounce,
  } = useWalkthroughSearch(query, filters);

  const { data: repoData, isFetching: repoFetching } = useRepoSearch(query);
  const { hits: allPrHits, isFetching: prFetching } = usePRSearch(query);

  const allWalkthroughHits = walkthroughData?.data?.hits ?? [];
  const allRepoHits = repoData?.data?.items ?? [];

  const walkthroughHits = useMemo(
    () => (activeTab === "prs" || activeTab === "repos" ? [] : allWalkthroughHits),
    [activeTab, allWalkthroughHits],
  );
  const repoHits = useMemo(
    () => (activeTab === "walkthroughs" || activeTab === "prs" ? [] : allRepoHits),
    [activeTab, allRepoHits],
  );
  const prHits = useMemo(
    () => (activeTab === "walkthroughs" || activeTab === "repos" ? [] : allPrHits),
    [activeTab, allPrHits],
  );

  const totalResults = walkthroughHits.length + repoHits.length + prHits.length;

  const isFetching =
    (activeTab === "all" || activeTab === "walkthroughs") && walkthroughFetching ||
    (activeTab === "all" || activeTab === "repos") && repoFetching ||
    (activeTab === "all" || activeTab === "prs") && prFetching;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const openHit = useCallback(
    (hit: SearchHit) => {
      saveHistory.mutate(query);
      router.push(`/walkthroughs/${hit.id}`);
      onClose();
    },
    [query, router, onClose, saveHistory],
  );

  const openRepo = useCallback(
    (repo: Repository) => {
      router.push(`/repos/${repo.owner.login}/${repo.name}`);
      onClose();
    },
    [router, onClose],
  );

  const openPR = useCallback(
    (pr: RecentPRResult) => {
      router.push(`/repos/${pr.owner}/${pr.repo}/pulls/${pr.number}`);
      onClose();
    },
    [router, onClose],
  );

  const openSelected = useCallback(() => {
    const hit = walkthroughHits[selectedIndex];
    if (hit) openHit(hit);
  }, [walkthroughHits, selectedIndex, openHit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (walkthroughHits.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, walkthroughHits.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        openSelected();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, walkthroughHits, openSelected]);

  const showEmpty = query.trim().length === 0;
  const showNoResults =
    !showEmpty &&
    !isFetching &&
    !isWaitingForDebounce &&
    totalResults === 0;
  const showResults = !showEmpty && totalResults > 0;
  const isLoading =
    (isFetching || isWaitingForDebounce) && query.trim().length > 0 && totalResults === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search walkthroughs, PRs, repositories..."
            className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
              }}
              className="shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 flex-wrap">
          <div className="flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedIndex(0);
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:bg-gray-100",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          <SearchAuthorDropdown
            selectedAuthor={selectedAuthor}
            onSelect={(user) => {
              setSelectedAuthor(user);
              setSelectedIndex(0);
            }}
            onClear={() => {
              setSelectedAuthor(null);
              setSelectedIndex(0);
            }}
          />

          <SearchDateRangeDropdown
            range={dateRange}
            onChange={(range) => {
              setDateRange(range);
              setSelectedIndex(0);
            }}
            onClear={() => {
              setDateRange({ from: "", to: "" });
              setSelectedIndex(0);
            }}
          />

          {showResults && (
            <span className="ml-auto text-xs text-gray-400">
              {totalResults} result{totalResults !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {showEmpty && (
            <div className="flex flex-col items-center justify-center py-2 gap-2">
              {recentSearches.length === 0 ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    No recent searches
                  </p>
                  <p className="text-xs text-gray-400">
                    Your last 3 searches will appear here
                  </p>
                </>
              ) : (
                <div className="w-full px-4 py-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Recent searches
                  </p>
                  {recentSearches.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setQuery(item.query);
                        setSelectedIndex(0);
                        inputRef.current?.focus();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors"
                    >
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700">{item.query}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {showNoResults && (
            <div className="flex flex-col items-center justify-center py-12 gap-1">
              <p className="text-sm font-semibold text-gray-700">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-gray-400">Try a different search term</p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          )}

          {showResults && (
            <div className="py-1">
              {walkthroughHits.length > 0 && (
                <>
                  <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Walkthroughs {walkthroughHits.length}
                  </p>
                  {walkthroughHits.map((hit, i) => (
                    <SearchWalkthroughItem
                      key={hit.id}
                      hit={hit}
                      selected={selectedIndex === i}
                      onClick={() => openHit(hit)}
                    />
                  ))}
                </>
              )}

              {repoHits.length > 0 && (
                <>
                  <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Repositories {repoHits.length}
                  </p>
                  {repoHits.map((repo) => (
                    <SearchRepoItem
                      key={repo.id}
                      repo={repo}
                      selected={false}
                      onClick={() => openRepo(repo)}
                    />
                  ))}
                </>
              )}

              {prHits.length > 0 && (
                <>
                  <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Pull Requests {prHits.length}
                  </p>
                  {prHits.map((pr) => (
                    <SearchPRItem
                      key={pr.id}
                      pr={pr}
                      selected={false}
                      onClick={() => openPR(pr)}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <kbd className="bg-gray-200 text-gray-500 px-1 py-0.5 rounded text-[10px] font-sans">
                esc
              </kbd>
              close
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-[11px] text-gray-400">
            <GitPullRequest className="w-3 h-3" />
            Walkthrough search
          </div>
        </div>
      </div>
    </div>
  );
}
