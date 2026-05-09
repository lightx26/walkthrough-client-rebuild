"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useRepositories } from "@/hooks/use-github";
import { RepoCard } from "@/components/repos";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PER_PAGE = 20;

function RepoCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 flex items-center gap-5">
      <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3.5 w-72" />
        <Skeleton className="h-3 w-52" />
      </div>
      <div className="flex items-center gap-8 shrink-0">
        <div className="text-center space-y-1">
          <Skeleton className="h-6 w-6 mx-auto" />
          <Skeleton className="h-3 w-14" />
        </div>
        <div className="text-center space-y-1">
          <Skeleton className="h-6 w-6 mx-auto" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="w-4 h-4" />
      </div>
    </div>
  );
}

type TypeFilter = "" | "public" | "private";

export default function RepositoriesPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");

  const { data, isLoading } = useRepositories({
    page,
    perPage: PER_PAGE,
    type: typeFilter || undefined,
    language: languageFilter || undefined,
  });

  const repos = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const totalElements = data?.data?.totalElements ?? 0;

  // Extract unique owners from current page for the owner filter dropdown
  const uniqueOwners = useMemo(() => {
    const owners = repos.map((r) => ({
      login: r.owner.login,
      type: r.owner.type,
    }));
    const seen = new Set<string>();
    return owners.filter((o) => {
      if (seen.has(o.login)) return false;
      seen.add(o.login);
      return true;
    });
  }, [repos]);

  // Extract unique languages from current page for the language quick-picks
  const uniqueLanguages = useMemo(() => {
    const langs = repos
      .map((r) => r.language)
      .filter((l): l is string => !!l);
    return [...new Set(langs)].sort();
  }, [repos]);

  // Client-side owner filter (server filters handle type & language)
  const filteredRepos = ownerFilter
    ? repos.filter((r) => r.owner.login === ownerFilter)
    : repos;

  const hasActiveFilters = !!typeFilter || !!languageFilter || !!ownerFilter;

  const clearFilters = () => {
    setTypeFilter("");
    setLanguageFilter("");
    setOwnerFilter("");
    setPage(1);
  };

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-gray-900 mb-1">
            Repositories
          </h1>
          <p className="text-sm text-gray-400">
            {isLoading
              ? "Loading repositories…"
              : `${totalElements} ${totalElements === 1 ? "repository" : "repositories"} connected to your account`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as TypeFilter);
              setPage(1);
            }}
            className={cn(
              "text-sm border rounded-lg px-3 py-1.5 bg-white outline-none transition-colors cursor-pointer",
              typeFilter
                ? "border-violet-300 text-violet-700 bg-violet-50"
                : "border-gray-200 text-gray-600 hover:border-gray-300",
            )}
          >
            <option value="">All types</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          {/* Language filter */}
          <select
            value={languageFilter}
            onChange={(e) => {
              setLanguageFilter(e.target.value);
              setPage(1);
            }}
            className={cn(
              "text-sm border rounded-lg px-3 py-1.5 bg-white outline-none transition-colors cursor-pointer",
              languageFilter
                ? "border-violet-300 text-violet-700 bg-violet-50"
                : "border-gray-200 text-gray-600 hover:border-gray-300",
            )}
          >
            <option value="">All languages</option>
            {uniqueLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Owner filter */}
          <select
            value={ownerFilter}
            onChange={(e) => {
              setOwnerFilter(e.target.value);
            }}
            className={cn(
              "text-sm border rounded-lg px-3 py-1.5 bg-white outline-none transition-colors cursor-pointer",
              ownerFilter
                ? "border-violet-300 text-violet-700 bg-violet-50"
                : "border-gray-200 text-gray-600 hover:border-gray-300",
            )}
          >
            <option value="">All owners</option>
            {uniqueOwners.map((owner) => (
              <option key={owner.login} value={owner.login}>
                {owner.type === "Organization" ? `🏢 ${owner.login}` : `👤 ${owner.login}`}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors ml-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <>
              <RepoCardSkeleton />
              <RepoCardSkeleton />
              <RepoCardSkeleton />
            </>
          ) : filteredRepos.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              No repositories found.
            </div>
          ) : (
            filteredRepos.map((repo) => <RepoCard key={repo.id} repo={repo} />)
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
