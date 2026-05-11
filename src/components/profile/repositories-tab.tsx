"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RepoCard } from "@/components/repos";
import { RecentPrsPanel } from "./recent-prs-panel";
import { useRepositories } from "@/hooks/use-github";
import { useRecentPullRequests } from "@/hooks/use-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PER_PAGE = 6;

interface RepositoriesTabProps {
  username: string;
}

export function RepositoriesTab({ username }: RepositoriesTabProps) {
  const [page, setPage] = useState(1);
  const { data: reposData, isLoading: reposLoading } = useRepositories({
    page,
    perPage: PER_PAGE,
    type: "owner",
  });
  const { data: prs, isLoading: prsLoading } = useRecentPullRequests(6);

  const repositories = reposData?.data?.items ?? [];
  const totalPages = reposData?.data?.totalPages ?? 1;
  const totalElements = reposData?.data?.totalElements ?? 0;

  // Client-side filter: only repos owned by this user
  const userRepos = repositories.filter(
    (r) => r.owner.login.toLowerCase() === username.toLowerCase(),
  );

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0 space-y-4">
        {/* Repo list header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Repositories{" "}
            <span className="text-gray-400 font-normal">{totalElements}</span>
          </h2>
        </div>

        {reposLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : userRepos.length === 0 ? (
          <p className="text-sm text-gray-400">No repositories found.</p>
        ) : (
          <div className="space-y-3">
            {userRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={cn(
                "p-1.5 rounded-md border border-gray-200 transition-colors",
                page <= 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-50",
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={cn(
                "p-1.5 rounded-md border border-gray-200 transition-colors",
                page >= totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-50",
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="w-96 xl:w-xl shrink-0">
        <RecentPrsPanel pullRequests={prs} isLoading={prsLoading} />
      </div>
    </div>
  );
}
