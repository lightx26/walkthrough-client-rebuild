import Link from 'next/link';

import type { WalkthroughSummary } from '@/types/walkthrough';
import { AlertTriangle, ChevronRight, MessageSquare, Waypoints } from 'lucide-react';

import { WalkthroughStatusIcon } from '@/components/ui/walkthrough-status-icon';

import { formatRelativeTime } from '@/utils/date-diff';

import { WalkthroughStatusBadge } from './walkthrough-status-badge';

export function WalkthroughCard({ wt }: { wt: WalkthroughSummary }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <Link
        href={`/walkthroughs/${wt.id}`}
        className="group -mx-5 flex cursor-pointer items-center gap-4 p-5 transition-colors hover:bg-gray-100/50"
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

      {wt.status === 'OUTDATED' && wt.outdatedReason && (
        <div className="mx-5 mb-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
          <p className="whitespace-pre-line text-xs leading-relaxed text-amber-700">
            {wt.outdatedReason}
          </p>
        </div>
      )}
    </div>
  );
}
