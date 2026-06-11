'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { AuthorWalkthroughSummary } from '@/types/analytics';
import { AlertTriangle, BarChart2, CheckCircle2, MessageSquare, Waypoints } from 'lucide-react';

import { WalkthroughStatusBadge } from '@/components/pr-detail';
import { UserAvatar } from '@/components/ui';

import { formatRelativeTime } from '@/utils/date-diff';

import { ProgressDots } from './progress-dots';

export function AuthorWalkthroughCard({ walkthrough }: { walkthrough: AuthorWalkthroughSummary }) {
  const hasReviewActivity = walkthrough.reviewers.length > 0;
  const allRead = walkthrough.unreadChapterCount === 0 && hasReviewActivity;

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold text-gray-900">
              {walkthrough.title}
            </h3>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">
              PR #{walkthrough.prNumber}
            </span>
            <WalkthroughStatusBadge status={walkthrough.status} />
            {allRead ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                All chapters read
              </span>
            ) : walkthrough.unreadChapterCount > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                <AlertTriangle className="h-3 w-3" />
                {walkthrough.unreadChapterCount} unread{' '}
                {walkthrough.unreadChapterCount === 1 ? 'chapter' : 'chapters'}
              </span>
            ) : null}
          </div>
          {walkthrough.description && (
            <p className="truncate text-xs text-gray-500">{walkthrough.description}</p>
          )}
        </div>

        {hasReviewActivity && (
          <Link
            href={`/analytics/${walkthrough.walkthroughId}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100"
          >
            <BarChart2 className="h-3.5 w-3.5" />
            Details
          </Link>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          {walkthrough.reviewers.length === 0 ? (
            <p className="text-xs text-gray-400">No reviewer activity yet</p>
          ) : (
            walkthrough.reviewers.slice(0, 4).map((r) => {
              const started = r.readChapters > 0;
              return (
                <div key={r.userId} className="flex items-center gap-3 text-xs text-gray-600">
                  <UserAvatar
                    src={r.avatarUrl}
                    username={r.username}
                    displayName={r.displayName}
                    size="sm"
                  />
                  <span className="w-20 truncate text-gray-700">{r.displayName || r.username}</span>
                  <ProgressDots read={r.readChapters} total={walkthrough.totalChapters} />
                  <span className={cn('text-[11px]', started ? 'text-gray-500' : 'text-gray-400')}>
                    {r.readChapters}/{walkthrough.totalChapters}
                    {' · '}
                    {started && r.lastActiveAt ? formatRelativeTime(r.lastActiveAt) : 'not started'}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="flex shrink-0 items-end gap-2 text-[11px] text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Waypoints className="h-3 w-3" />
            {walkthrough.totalChapters} ch
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {walkthrough.totalComments}
          </span>
          {walkthrough.lastActivityAt && (
            <span>{formatRelativeTime(walkthrough.lastActivityAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
