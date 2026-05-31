import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { WalkthroughSummary } from '@/types/walkthrough';
import { MessageSquare, Waypoints } from 'lucide-react';

import { toDisplayStatus } from '@/utils/walkthrough';

function compactAge(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

const statusStyle: Record<string, string> = {
  Published: 'bg-green-50 text-green-700 border border-green-200',
  Draft: 'bg-amber-50 text-amber-700 border border-amber-200',
  Outdated: 'bg-orange-50 text-orange-700 border border-orange-200',
};

const iconBg: Record<string, string> = {
  Published: 'bg-green-500',
  Draft: 'bg-amber-400',
  Outdated: 'bg-orange-400',
};

function isNew(updatedAt: string): boolean {
  return Date.now() - new Date(updatedAt).getTime() < 60 * 60 * 1_000;
}

export function ProfileWalkthroughItem({ wt }: { wt: WalkthroughSummary }) {
  const displayStatus = toDisplayStatus(wt.status);
  if (!displayStatus) return null;

  return (
    <Link
      href={`/walkthroughs/${wt.id}`}
      className="group flex items-center border-b border-gray-100 py-3.5 last:border-0"
    >
      <div
        className={cn(
          'mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded',
          iconBg[displayStatus]
        )}
      >
        <Waypoints className="h-3.5 w-3.5 text-white" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-violet-700">
          {wt.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              'rounded-full px-1.5 py-0.5 text-[11px] font-medium',
              statusStyle[displayStatus]
            )}
          >
            {displayStatus}
          </span>
          {displayStatus === 'Published' && isNew(wt.updatedAt) && (
            <span className="rounded-full border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-600">
              NEW
            </span>
          )}
          <span className="max-w-32 truncate text-[11px] text-gray-400">
            {wt.owner}/{wt.repo}
          </span>
          <span className="text-xs text-gray-200">·</span>
          <span className="text-[11px] text-gray-400">#{wt.prNumber}</span>
          <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
            <Waypoints className="h-3 w-3" />
            {wt.chapterCount} ch
          </span>
          {(wt.commentCount ?? 0) > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
              <MessageSquare className="h-3 w-3" />
              {wt.commentCount}
            </span>
          )}
        </div>
      </div>

      <span className="ml-3 shrink-0 text-xs text-gray-400">{compactAge(wt.updatedAt)}</span>
    </Link>
  );
}
