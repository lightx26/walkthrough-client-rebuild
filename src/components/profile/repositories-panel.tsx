'use client';

import type { Repository } from '@/types/github';

import { Pagination, Skeleton } from '@/components/ui';

import { RepoCard } from './repo-card';

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
        <div key={i} className="flex items-center gap-5 border-b border-gray-100 p-6 last:border-0">
          <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3.5 w-72" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex shrink-0 items-center gap-8">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-10 w-14" />
            <Skeleton className="h-10 w-14" />
            <Skeleton className="h-4 w-4 rounded" />
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
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-sm font-semibold text-gray-900">
          Repositories <span className="font-normal text-gray-400">{total}</span>
        </h2>
      </div>

      {isLoading ? (
        <RepositoriesListSkeleton />
      ) : repositories.length === 0 ? (
        <p className="px-5 pb-5 text-sm text-gray-400">No repositories found.</p>
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
        className="justify-center px-5 pt-2 pb-5"
      />
    </div>
  );
}
