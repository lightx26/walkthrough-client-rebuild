'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { ProfileReviewingItem } from '@/types/profile';
import { Clock } from 'lucide-react';

import { Skeleton, UserAvatar } from '@/components/ui';

interface ReviewingPanelProps {
  items?: ProfileReviewingItem[];
  isLoading: boolean;
}

function reviewStatus(item: ProfileReviewingItem): {
  label: string;
  className: string;
} {
  const pct =
    item.totalChapters > 0 ? Math.round((item.readChapters / item.totalChapters) * 100) : 0;
  if (pct >= 100)
    return {
      label: 'Done',
      className: 'bg-green-50 text-green-700 border border-green-200',
    };
  if (pct > 0)
    return {
      label: 'In progress',
      className: 'bg-blue-50 text-blue-700 border border-blue-200',
    };
  return {
    label: 'Not started',
    className: 'bg-gray-100 text-gray-500 border border-gray-200',
  };
}

function pct(item: ProfileReviewingItem): number {
  if (item.totalChapters === 0) return 0;
  return Math.round((item.readChapters / item.totalChapters) * 100);
}

function formatTime(sec: number): string {
  if (sec < 60) return '—';
  const m = Math.round(sec / 60);
  if (m < 60) return `${m}m`;
  return `${Math.round(m / 60)}h`;
}

export function ReviewingPanel({ items, isLoading }: ReviewingPanelProps) {
  const count = items?.length ?? 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-1 text-sm font-semibold text-gray-900">
        Reviewing <span className="font-normal text-gray-400">{count}</span>
      </h2>

      {isLoading ? (
        <div className="mt-3 space-y-5">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <p className="mt-4 text-sm text-gray-400">Not reviewing anything yet.</p>
      ) : (
        <div>
          {items.map((item) => {
            const { label, className } = reviewStatus(item);
            const progress = pct(item);

            return (
              <div key={item.walkthroughId} className="border-b border-gray-100 py-4 last:border-0">
                <div className="flex items-start gap-3">
                  <UserAvatar
                    src={item.creatorAvatarUrl}
                    displayName={item.creatorDisplayName}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/walkthroughs/${item.walkthroughId}`}
                        className="truncate text-sm font-medium text-gray-900 transition-colors hover:text-violet-700"
                      >
                        {item.title}
                      </Link>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                          className
                        )}
                      >
                        {label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      by {item.creatorDisplayName} &middot; {item.owner}/{item.repo} &middot; #
                      {item.prNumber} &middot; {item.totalChapters} ch &middot;{' '}
                      <Clock className="inline h-3 w-3" /> {formatTime(item.timeSpentSec)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            progress >= 100
                              ? 'bg-green-500'
                              : progress > 0
                                ? 'bg-violet-500'
                                : 'bg-gray-200'
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-[11px] text-gray-400">
                        {progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
