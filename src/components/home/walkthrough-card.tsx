import Link from 'next/link';

import { cn } from '@/lib/utils';
import { WalkthroughSummary } from '@/types/walkthrough';
import { ChevronRight, Clock, Waypoints } from 'lucide-react';

import { WalkthroughStatusBadge } from '@/components/pr-detail';
import { WalkthroughStatusIcon } from '@/components/ui/walkthrough-status-icon';

import { formatRelativeTime } from '@/utils/date-diff';
import { DisplayStatus, toDisplayStatus } from '@/utils/walkthrough';

function compactAge(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

const statusStyle: Record<DisplayStatus, string> = {
  Published: 'bg-green-50 text-green-700 border border-green-200',
  Draft: 'bg-amber-50 text-amber-700 border border-amber-200',
  Outdated: 'bg-gray-100 text-gray-500 border border-gray-200',
};

export function WalkthroughCard({ wt }: { wt: WalkthroughSummary }) {
  const displayStatus = toDisplayStatus(wt.status);
  if (!displayStatus) return null;

  return (
    <Link
      href={`/walkthroughs/${wt.id}`}
      className="group flex items-center gap-4 border-b border-gray-100 p-4 transition-colors last:border-0 hover:bg-gray-100/50"
    >
      <WalkthroughStatusIcon status={wt.status} />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-1.5">
          <p className="text-sm leading-snug font-medium text-gray-900 transition-colors group-hover:text-violet-700">
            {wt.title}
          </p>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              statusStyle[displayStatus]
            )}
          >
            {displayStatus}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <span className="max-w-40 truncate">
            {wt.owner}/{wt.repo}
          </span>
          <span className="text-gray-200">·</span>
          <span>#{wt.prNumber}</span>
          <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-gray-500">
            v{wt.version}
          </span>
          <span className="flex items-center gap-1">
            <Waypoints className="h-3 w-3" />
            {wt.chapterCount} ch
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Clock className="h-3 w-3 text-gray-400" />
        <span className="w-12 text-xs text-gray-400">{formatRelativeTime(wt.updatedAt)}</span>
        <ChevronRight className="ml-2 size-4 text-gray-300 transition-colors group-hover:text-gray-400" />
      </div>
    </Link>
  );
}
