import type { PullRequestState } from '@/types/github';
import { GitMerge, GitPullRequest, GitPullRequestClosed } from 'lucide-react';

export function PrStateBadge({ state }: { state: PullRequestState }) {
  if (state === 'open')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
        <GitPullRequest className="h-3.5 w-3.5" strokeWidth={2} />
        Open
      </span>
    );
  if (state === 'merged')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
        <GitMerge className="h-3.5 w-3.5" strokeWidth={2} />
        Merged
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
      <GitPullRequestClosed className="h-3.5 w-3.5" strokeWidth={2} />
      Closed
    </span>
  );
}
