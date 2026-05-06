"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useRepositories } from "@/hooks/use-github";
import { RepoCard } from "@/components/repos";

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

export default function RepositoriesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useRepositories({ page, perPage: PER_PAGE });

  const repos = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const totalElements = data?.data?.totalElements ?? 0;

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

        <div className="space-y-3">
          {isLoading ? (
            <>
              <RepoCardSkeleton />
              <RepoCardSkeleton />
              <RepoCardSkeleton />
            </>
          ) : repos.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              No repositories found.
            </div>
          ) : (
            repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)
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
