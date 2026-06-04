import { cn } from '@/lib/utils';
import { GitMerge, GitPullRequest, GitPullRequestClosed, GitPullRequestDraft } from 'lucide-react';

import { PrRowItem } from '@/components/repos/pr-row';

type PrState = PrRowItem['state'];

export function PrStateIcon({ state }: { state: PrState }) {
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

export function PrStateBadge({ state }: { state: PrState }) {
  if (state === 'open')
    return (
      <span className="rounded-full border border-emerald-700 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        Open
      </span>
    );
  if (state === 'merged')
    return (
      <span className="rounded-full border border-violet-700 bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700">
        Merged
      </span>
    );
  if (state === 'draft')
    return (
      <span className="rounded-full border border-gray-700 bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
        Draft
      </span>
    );
  return (
    <span className="rounded-full border border-red-700 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
      Closed
    </span>
  );
}
