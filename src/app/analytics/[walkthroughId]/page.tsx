'use client';

import { use } from 'react';

import Link from 'next/link';

import { ArrowLeft, ExternalLink, MessageSquare, Users, Waypoints } from 'lucide-react';

import { ChapterAttentionList, ReadingMatrix, UnreadChaptersCard } from '@/components/analytics';
import { DashboardLayout } from '@/components/layout';
import { WalkthroughStatusBadge } from '@/components/pr-detail';
import { ApiErrorState } from '@/components/ui';

import { useChapterAttention, useReviewProgress, useUnreadSummary } from '@/hooks/use-analytics';
import { useWalkthrough } from '@/hooks/use-walkthrough';

export default function AnalyticsDetailPage({
  params,
}: {
  params: Promise<{ walkthroughId: string }>;
}) {
  const { walkthroughId } = use(params);

  const { data: wtData, error: wtError, refetch: refetchWt } = useWalkthrough(walkthroughId);
  const { data: rpData, isLoading: rpLoading } = useReviewProgress(walkthroughId);
  const { data: caData, isLoading: caLoading } = useChapterAttention(walkthroughId);
  const { data: usData } = useUnreadSummary(walkthroughId);

  if (wtError) {
    return (
      <DashboardLayout>
        <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
          <ApiErrorState error={wtError} resource="walkthrough" onRetry={() => refetchWt()} />
        </main>
      </DashboardLayout>
    );
  }

  const walkthrough = wtData?.data;
  const reviewProgress = rpData?.data;
  const chapterAttention = caData?.data;
  const unreadSummary = usData?.data;

  const reviewerCount = reviewProgress?.reviewers.length ?? 0;
  const chapterCount = walkthrough?.chapters.length ?? reviewProgress?.totalChapters ?? 0;
  const totalComments = chapterAttention?.chapters.reduce((s, c) => s + c.totalComments, 0) ?? 0;

  return (
    <DashboardLayout>
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
        {walkthrough && (
          <Link
            href={`/analytics?owner=${encodeURIComponent(walkthrough.owner)}&repo=${encodeURIComponent(walkthrough.repo)}`}
            className="mb-3 inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Analytics
          </Link>
        )}
        <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-[22px] font-bold text-gray-900">
                {walkthrough?.title ?? 'Walkthrough'}
              </h1>
              {walkthrough && (
                <>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
                    {walkthrough.repo}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
                    PR #{walkthrough.prNumber}
                  </span>
                  <WalkthroughStatusBadge status={walkthrough.status} />
                </>
              )}
            </div>
            {walkthrough?.description && (
              <p className="mt-1 text-sm text-gray-500">{walkthrough.description}</p>
            )}
          </div>

          {walkthrough && (
            <Link
              href={`/walkthroughs/${walkthrough.id}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View walkthrough
            </Link>
          )}
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {reviewerCount} {reviewerCount === 1 ? 'reviewer' : 'reviewers'}
          </span>
          <span className="text-gray-300">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Waypoints className="h-3.5 w-3.5" />
            {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
          </span>
          <span className="text-gray-300">·</span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            {totalComments} {totalComments === 1 ? 'comment' : 'comments'}
          </span>
        </div>

        <div className="space-y-4">
          {unreadSummary && <UnreadChaptersCard data={unreadSummary} />}

          {rpLoading ? (
            <SkeletonBlock />
          ) : reviewProgress ? (
            <ReadingMatrix data={reviewProgress} />
          ) : null}

          {caLoading ? (
            <SkeletonBlock />
          ) : chapterAttention ? (
            <ChapterAttentionList data={chapterAttention} />
          ) : null}
        </div>
      </main>
    </DashboardLayout>
  );
}

function SkeletonBlock() {
  return <div className="h-48 animate-pulse rounded-xl border border-gray-200 bg-white" />;
}
