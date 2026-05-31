'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { ArrowLeft, BarChart2, Database, GitBranch, GitFork, Star } from 'lucide-react';

import { DashboardLayout } from '@/components/layout';
import { PrList } from '@/components/repos';
import { ApiErrorState, Skeleton } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { useRepository, useRepositoryPullRequests } from '@/hooks/use-github';

import { formatRelativeTime } from '@/utils/date-diff';
import { languageColor } from '@/utils/language-color';

function RepoHeaderSkeleton() {
  return (
    <div className="flex items-center gap-6 rounded-xl border border-gray-200 bg-white px-8 py-6">
      <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="flex shrink-0 items-center gap-12">
        <div className="space-y-1.5 text-center">
          <Skeleton className="mx-auto h-7 w-8" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="space-y-1.5 text-center">
          <Skeleton className="mx-auto h-7 w-8" />
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

  const { data: prsData, isLoading: prsLoading } = useRepositoryPullRequests(owner, repo);

  if (repoError) {
    return (
      <DashboardLayout>
        <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
          <ApiErrorState error={repoError} resource="repository" onRetry={() => refetchRepo()} />
        </main>
      </DashboardLayout>
    );
  }

  const repoDetails = repoData?.data;
  const prs = prsData?.data?.items ?? [];

  return (
    <DashboardLayout>
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
        <div className="mb-6">
          <div className="mb-5 flex items-center gap-1.5 text-sm text-gray-400">
            <Link
              href="/repos"
              className="flex items-center gap-1 transition-colors hover:text-gray-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Repositories
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-700">{repo}</span>
          </div>

          {repoLoading ? (
            <RepoHeaderSkeleton />
          ) : repoDetails ? (
            <div className="flex items-center gap-6 rounded-xl border border-gray-200 bg-white px-8 py-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                <Database className="h-5 w-5 text-violet-600" strokeWidth={2} />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="mb-1 text-xl font-bold text-gray-900">{repoDetails.name}</h1>
                {repoDetails.description && (
                  <p className="mb-2 truncate text-sm text-gray-500">{repoDetails.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  {repoDetails.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${languageColor(repoDetails.language)}`}
                      />
                      {repoDetails.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {repoDetails.stargazersCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    {repoDetails.forksCount}
                  </span>
                  <span>Updated {formatRelativeTime(repoDetails.updatedAt)}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-12">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{repoDetails.openPrsCount}</p>
                  <p className="mt-0.5 text-xs text-gray-400">open PRs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {repoDetails.walkthroughsCount}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">walkthroughs</p>
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
                        `/analytics?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`
                      );
                    }}
                    className="border-primary-soft gap-1.5 border"
                    title="View analytics"
                  >
                    <BarChart2 className="h-3.5 w-3.5" />
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
