import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { WalkthroughStatus, WalkthroughSummary } from '@/types/walkthrough';
import { ChevronRight, MessageSquare, Waypoints } from 'lucide-react';

import { WalkthroughStatusIcon } from '@/components/ui/walkthrough-status-icon';

import { formatRelativeTime } from '@/utils/date-diff';

import { WalkthroughStatusBadge } from './walkthrough-status-badge';

export function WalkthroughCard({ wt }: { wt: WalkthroughSummary }) {
  return (
    <Link
      href={`/walkthroughs/${wt.id}`}
      className="group -mx-5 flex cursor-pointer items-center gap-4 border-b border-gray-100 p-5 transition-colors last:border-0 hover:bg-gray-100/50"
    >
      <WalkthroughStatusIcon status={wt.status} />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-gray-900">{wt.title}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          {wt.description && (
            <>
              <span className="max-w-xs truncate text-gray-500">{wt.description}</span>
              <span>·</span>
            </>
          )}
          <span className="flex items-center gap-1">
            <Waypoints className="h-3 w-3" />
            {wt.chapterCount} {wt.chapterCount === 1 ? 'chapter' : 'chapters'}
          </span>
          {wt.commentCount > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {wt.commentCount}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <WalkthroughStatusBadge status={wt.status} />
        <span className="w-12 text-right text-xs text-gray-400">
          {formatRelativeTime(wt.updatedAt)}
        </span>
        <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-400" />
      </div>
    </Link>
  );
}
