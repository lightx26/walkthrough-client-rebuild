"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart2,
  Database,
  GitBranch,
  GitFork,
  Star,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { ApiErrorState, Skeleton } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { PrList } from "@/components/repos";
import { useRepository, useRepositoryPullRequests } from "@/hooks/use-github";
import { languageColor } from "@/utils/language-color";
import { formatRelativeTime } from "@/utils/date-diff";

function RepoHeaderSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-8 py-6 flex items-center gap-6">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="flex items-center gap-12 shrink-0">
        <div className="text-center space-y-1.5">
          <Skeleton className="h-7 w-8 mx-auto" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="text-center space-y-1.5">
          <Skeleton className="h-7 w-8 mx-auto" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export default function RepoDetailsPage() {
  const params = useParams<{ owner: string; repo: string }>();
  const owner = params.owner;
  const repo = params.repo;
  const router = useRouter();

  const {
    data: repoData,
    isLoading: repoLoading,
    error: repoError,
    refetch: refetchRepo,
  } = useRepository(owner, repo);

  const { data: prsData, isLoading: prsLoading } = useRepositoryPullRequests(
    owner,
    repo,
  );

  if (repoError) {
    return (
      <DashboardLayout>
        <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
          <ApiErrorState
            error={repoError}
            resource="repository"
            onRetry={() => refetchRepo()}
          />
        </main>
      </DashboardLayout>
    );
  }

  const repoDetails = repoData?.data;
  const prs = prsData?.data?.items ?? [];

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-5">
            <Link
              href="/repos"
              className="flex items-center gap-1 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Repositories
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{repo}</span>
          </div>

          {repoLoading ? (
            <RepoHeaderSkeleton />
          ) : repoDetails ? (
            <div className="bg-white border border-gray-200 rounded-xl px-8 py-6 flex items-center gap-6">
              <div className="bg-violet-50 flex items-center justify-center w-12 h-12 rounded-xl shrink-0">
                <Database className="text-violet-600 w-5 h-5" strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {repoDetails.name}
                </h1>
                {repoDetails.description && (
                  <p className="text-sm text-gray-500 mb-2 truncate">
                    {repoDetails.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                  {repoDetails.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${languageColor(repoDetails.language)}`}
                      />
                      {repoDetails.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {repoDetails.stargazersCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" />
                    {repoDetails.forksCount}
                  </span>
                  <span>
                    Updated {formatRelativeTime(repoDetails.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-12 shrink-0">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {repoDetails.openPrsCount}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">open PRs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {repoDetails.walkthroughsCount}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">walkthroughs</p>
                </div>
                {repoDetails.walkthroughsCount > 0 && (
                  <Button
                    type="button"
                    variant="primarySoft"
                    size="xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(
                        `/analytics?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
                      );
                    }}
                    className="gap-1.5 border border-primary-soft"
                    title="View analytics"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    Analytics
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <PrList prs={prs} isLoading={prsLoading} owner={owner} repo={repo} />
      </main>
    </DashboardLayout>
  );
}
