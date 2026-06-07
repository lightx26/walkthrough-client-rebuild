'use client';

import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { PrStateIcon } from '@/components/repos/pr-state-badge';
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
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <UserAvatar src={pr.author.avatarUrl} username={pr.author.login} size="sm" />
            <span className="font-medium text-gray-500">{pr.author.login}</span>
          </div>
          <span className="shrink-0 text-sm text-gray-400">PR#{pr.number}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="text-right text-xs text-gray-400">{formatRelativeTime(pr.updatedAt)}</span>
        <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-400" />
      </div>
    </Link>
  );
}
