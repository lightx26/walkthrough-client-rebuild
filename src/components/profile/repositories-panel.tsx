"use client";

import { Skeleton, Pagination } from "@/components/ui";
import { RepoCard } from "./repo-card";
import type { Repository } from "@/types/github";

interface RepositoriesPanelProps {
  repositories: Repository[];
  total: number;
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function RepositoriesListSkeleton() {
  return (
    <div className="pb-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-5 p-6 border-b border-gray-100 last:border-0"
        >
          <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3.5 w-72" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex items-center gap-8 shrink-0">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-10 w-14" />
            <Skeleton className="h-10 w-14" />
            <Skeleton className="w-4 h-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RepositoriesPanel({
  repositories,
  total,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: RepositoriesPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-sm font-semibold text-gray-900">
          Repositories{" "}
          <span className="text-gray-400 font-normal">{total}</span>
        </h2>
      </div>

      {isLoading ? (
        <RepositoriesListSkeleton />
      ) : repositories.length === 0 ? (
        <p className="text-sm text-gray-400 px-5 pb-5">
          No repositories found.
        </p>
      ) : (
        <div className="pb-2">
          {repositories.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="px-5 pb-5 pt-2 justify-center"
      />
    </div>
  );
}
