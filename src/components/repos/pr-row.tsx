'use client';

import Link from 'next/link';



import { ArrowRight, ChevronRight, Waypoints } from 'lucide-react';



import { PrStateBadge, PrStateIcon } from '@/components/repos/pr-state-badge';
import { UserAvatar } from '@/components/ui';



import { formatRelativeTime } from '@/utils/date-diff';





















































































export interface PrRowItem {
  number: number;
  title: string;
  state: 'open' | 'merged' | 'closed' | 'draft';
  updatedAt: string;
  author: {
    login: string;
    avatarUrl: string | null;
  };
  head?: { ref: string };
  base?: { ref: string };
  walkthroughsCount?: number;
}

interface PrRowProps {
  pr: PrRowItem;
  owner: string;
  repo: string;
  showRepoInfo?: boolean;
}

export function PrRow({ pr, owner, repo, showRepoInfo }: PrRowProps) {
  return (
    <Link
      href={`/repos/${owner}/${repo}/pulls/${pr.number}`}
      className="group -mx-5 flex cursor-pointer items-center gap-4 border-b border-gray-100 p-5 transition-colors last:border-0 hover:bg-gray-100/50"
    >
      <PrStateIcon state={pr.state} />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          {showRepoInfo && (
            <span className="shrink-0 text-xs text-gray-400">
              {owner}/{repo}
            </span>
          )}
          <span className="truncate text-sm font-semibold text-gray-900">{pr.title}</span>
          <span className="shrink-0 text-sm text-gray-400">#{pr.number}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <UserAvatar src={pr.author.avatarUrl} username={pr.author.login} size="sm" />
          <span className="font-medium text-gray-500">{pr.author.login}</span>
          {pr.head && (
            <>
              <span className="shrink-0">·</span>
              <code
                className="max-w-50 truncate rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500 sm:max-w-75"
                title={pr.head.ref}
              >
                {pr.head.ref}
              </code>
              {pr.base && (
                <>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                  <code
                    className="max-w-50 truncate rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500 sm:max-w-75"
                    title={pr.base.ref}
                  >
                    {pr.base.ref}
                  </code>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {pr.walkthroughsCount != null && pr.walkthroughsCount > 0 ? (
          <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
            <Waypoints className="h-3.5 w-3.5 text-gray-400" />
            {pr.walkthroughsCount === 1 ? '1 walkthrough' : `${pr.walkthroughsCount} walkthroughs`}
          </span>
        ) : pr.walkthroughsCount === 0 ? (
          <span className="text-xs text-gray-400">No walkthroughs</span>
        ) : null}
        <PrStateBadge state={pr.state} />
        <span className="text-right text-xs text-gray-400">
          last updated {formatRelativeTime(pr.updatedAt)}
        </span>
        <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-400" />
      </div>
    </Link>
  );
}
