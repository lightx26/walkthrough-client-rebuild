import { cn } from '@/lib/utils';
import type { RecentPRResult } from '@/types/search';
import { ArrowRight, GitPullRequest } from 'lucide-react';

import { HighlightText } from '@/components/search';
import { Button } from '@/components/ui/button';

import { formatRelativeTime } from '@/utils/date-diff';

function prStateBadgeClass(state: string) {
  switch (state.toLowerCase()) {
    case 'open':
      return 'bg-green-100 text-green-700';
    case 'merged':
      return 'bg-purple-100 text-purple-700';
    case 'closed':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-500';
  }
}

interface Props {
  pr: RecentPRResult;
  query: string;
  selected: boolean;
  onClick: () => void;
}

export function SearchPRItem({ pr, query, selected, onClick }: Props) {
  return (
    <Button
      variant="ghost"
      size="none"
      onClick={onClick}
      className={cn(
        'group w-full justify-start gap-3 rounded-none px-4 py-2.5 text-left font-normal',
        selected ? 'bg-indigo-50 hover:bg-indigo-50' : 'hover:bg-gray-50'
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-purple-100">
        <GitPullRequest className="h-4 w-4 text-purple-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-gray-900">
          <HighlightText text={pr.title} query={query} />
        </p>
        <p className="truncate text-xs text-gray-400">
          {pr.owner}/{pr.repo} #{pr.number}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-gray-400">{formatRelativeTime(pr.createdAt)}</span>
        <span
          className={cn('rounded px-1.5 py-0.5 text-xs font-medium', prStateBadgeClass(pr.state))}
        >
          {pr.state.toLowerCase()}
        </span>
        <ArrowRight
          className={cn(
            'h-3.5 w-3.5 text-gray-400 transition-opacity',
            selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        />
      </div>
    </Button>
  );
}
