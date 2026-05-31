'use client';

import { useAuthorAnalyticsSummary } from '@/hooks/use-analytics';

import { AuthorWalkthroughCard } from './author-walkthrough-card';

interface AuthorViewProps {
  scopedRepo?: { owner: string; repo: string };
}

export function AuthorView({ scopedRepo }: AuthorViewProps = {}) {
  const { data, isLoading } = useAuthorAnalyticsSummary(scopedRepo);
  const items = data?.data?.items ?? [];

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">My walkthroughs</h2>
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-500">
          {items.length} walkthroughs
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          No published walkthroughs yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((wt) => (
            <AuthorWalkthroughCard key={wt.walkthroughId} walkthrough={wt} />
          ))}
        </div>
      )}
    </div>
  );
}
