'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';
import { ArrowRight, ExternalLink, FileText, GitCommitHorizontal, Plus } from 'lucide-react';

import { DashboardLayout } from '@/components/layout';
import {
  PrHeaderSkeleton,
  PrStateBadge,
  WalkthroughCard,
  WalkthroughCardSkeleton,
} from '@/components/pr-detail';
import { ApiErrorState, UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { usePullRequest } from '@/hooks/use-github';
import { useWalkthroughs } from '@/hooks/use-walkthrough';

import { formatRelativeTime } from '@/utils/date-diff';

type TabKey = 'all' | 'published' | 'draft';

export default function PrDetailPage() {
  const params = useParams<{ owner: string; repo: string; prNumber: string }>();
  const owner = params.owner;
  const repo = params.repo;
  const prNumber = Number(params.prNumber);

  const currentUser = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const {
    data: prData,
    isLoading: prLoading,
    error: prError,
    refetch: refetchPr,
  } = usePullRequest({
    owner,
    repo,
    prNumber,
  });
  const { data: walkthroughsData, isLoading: walkthroughsLoading } = useWalkthroughs({
    owner,
    repo,
    prNumber,
  });

  if (prError) {
    return (
      <DashboardLayout>
        <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
          <ApiErrorState error={prError} resource="pull request" onRetry={() => refetchPr()} />
        </main>
      </DashboardLayout>
    );
  }

  const isLoading = prLoading || walkthroughsLoading;
  const pr = prData?.data;
  const walkthroughs = walkthroughsData?.data?.items ?? [];
  const isOwner =
    !!currentUser && !!pr && currentUser.username.toLowerCase() === pr.author.login.toLowerCase();

  const publishedWalkthroughs = walkthroughs.filter((w) => w.status === 'PUBLISHED');
  const draftWalkthroughs = walkthroughs.filter((w) => w.status === 'DRAFT');

  const counts = {
    all: isOwner ? walkthroughs.length : publishedWalkthroughs.length,
    published: publishedWalkthroughs.length,
    draft: draftWalkthroughs.length,
  };

  const tabs: { label: string; key: TabKey }[] = isOwner
    ? [
        { label: 'All', key: 'all' },
        { label: 'Published', key: 'published' },
        { label: 'Draft', key: 'draft' },
      ]
    : [
        { label: 'All', key: 'all' },
        { label: 'Published', key: 'published' },
      ];

  const filtered = (() => {
    if (isLoading) return [];
    const pool = isOwner ? walkthroughs : publishedWalkthroughs;
    if (activeTab === 'all') return pool;
    if (activeTab === 'published') return publishedWalkthroughs;
    if (activeTab === 'draft') return draftWalkthroughs;
    return pool;
  })();

  return (
    <DashboardLayout>
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
        <div className="mb-6">
          <div className="mb-5 flex items-center gap-1.5 text-sm text-gray-400">
            <Link href="/repos" className="transition-colors hover:text-gray-600">
              Repositories
            </Link>
            <span>/</span>
            <Link
              href={`/repos/${owner}/${repo}`}
              className="transition-colors hover:text-gray-600"
            >
              {repo}
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-700">#{prNumber}</span>
          </div>

          {isLoading ? (
            <PrHeaderSkeleton />
          ) : pr ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="mb-3 flex items-center gap-2.5">
                  <PrStateBadge state={pr.state} />
                  <span className="text-sm text-gray-400">#{pr.number}</span>
                </div>
                <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-xl">
                  <a href={pr.htmlUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open in GitHub
                  </a>
                </Button>
              </div>

              <h1 className="mb-3 text-xl font-bold text-gray-900">{pr.title}</h1>

              <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                <UserAvatar src={pr.author.avatarUrl} username={pr.author.login} size="sm" />
                <span className="font-medium text-gray-700">{pr.author.login}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-400">opened {formatRelativeTime(pr.createdAt)}</span>
                <span className="text-gray-400">·</span>
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-600">
                  {pr.head.ref}
                </code>
                <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-600">
                  {pr.base.ref}
                </code>
              </div>

              <div className="flex items-center gap-5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <GitCommitHorizontal className="h-4 w-4 text-gray-400" />
                  {pr.commits} {pr.commits === 1 ? 'commit' : 'commits'}
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-gray-400" />
                  {pr.changedFiles} {pr.changedFiles === 1 ? 'file changed' : 'files changed'}
                </span>
                <span className="font-medium text-emerald-600">+{pr.additions}</span>
                <span className="font-medium text-red-500">-{pr.deletions}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Walkthroughs</h2>
            {!isLoading && isOwner && (
              <Button asChild variant="primary" size="default" className="gap-1.5">
                <Link href={`/walkthroughs/new?owner=${owner}&repo=${repo}&prNumber=${prNumber}`}>
                  <Plus className="h-4 w-4" />
                  Create walkthrough
                </Link>
              </Button>
            )}
          </div>

          {!isLoading && (
            <div className="flex items-center gap-0.5 border-b border-gray-100 px-5">
              {tabs.map((tab) => (
                <Button
                  key={tab.key}
                  variant="ghost"
                  size="none"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'gap-1.5 rounded-none border-b-2 px-3 py-3.5 text-sm font-medium hover:bg-transparent',
                    activeTab === tab.key
                      ? 'border-primary text-primary-soft-foreground'
                      : 'text-muted-foreground hover:text-foreground border-transparent'
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-xs font-medium',
                      activeTab === tab.key
                        ? 'bg-primary-soft text-primary-soft-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {counts[tab.key]}
                  </span>
                </Button>
              ))}
            </div>
          )}

          <div className="px-5">
            {isLoading ? (
              <>
                <WalkthroughCardSkeleton />
                <WalkthroughCardSkeleton />
              </>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">No walkthroughs yet.</div>
            ) : (
              filtered.map((wt) => <WalkthroughCard key={wt.id} wt={wt} />)
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
