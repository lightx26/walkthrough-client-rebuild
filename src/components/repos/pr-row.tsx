'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  ArrowRight,
  ChevronRight,
  GitMerge,
  GitPullRequest,
  GitPullRequestClosed,
  GitPullRequestDraft,
  Waypoints,
} from 'lucide-react';

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

type PrState = PrRowItem['state'];

function PrStateIcon({ state }: { state: PrState }) {
  const base = 'w-9 h-9 rounded-full flex items-center justify-center shrink-0';
  if (state === 'open')
    return (
      <div className={cn(base, 'bg-emerald-50')}>
        <GitPullRequest className="h-4 w-4 text-emerald-600" strokeWidth={2} />
      </div>
    );
  if (state === 'merged')
    return (
      <div className={cn(base, 'bg-violet-50')}>
        <GitMerge className="h-4 w-4 text-violet-600" strokeWidth={2} />
      </div>
    );
  if (state === 'draft')
    return (
      <div className={cn(base, 'bg-gray-100')}>
        <GitPullRequestDraft className="h-4 w-4 text-gray-400" strokeWidth={2} />
      </div>
    );
  return (
    <div className={cn(base, 'bg-red-50')}>
      <GitPullRequestClosed className="h-4 w-4 text-red-500" strokeWidth={2} />
    </div>
  );
}

function StateBadge({ state }: { state: PrState }) {
  if (state === 'open')
    return (
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        Open
      </span>
    );
  if (state === 'merged')
    return (
      <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
        Merged
      </span>
    );
  if (state === 'draft')
    return (
      <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
        Draft
      </span>
    );
  return (
    <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600">
      Closed
    </span>
  );
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
              <span>·</span>
              <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
                {pr.head.ref}
              </code>
              {pr.base && (
                <>
                  <ArrowRight className="h-4 w-4" />
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
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
        <StateBadge state={pr.state} />
        <span className="w-12 text-right text-xs text-gray-400">
          {formatRelativeTime(pr.updatedAt)}
        </span>
        <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-400" />
      </div>
    </Link>
  );
}
