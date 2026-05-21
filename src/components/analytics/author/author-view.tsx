"use client";

import { useAuthorAnalyticsSummary } from "@/hooks/use-analytics";
import { AuthorWalkthroughCard } from "./author-walkthrough-card";

interface AuthorViewProps {
  scopedRepo?: { owner: string; repo: string };
}

export function AuthorView({ scopedRepo }: AuthorViewProps = {}) {
  const { data, isLoading } = useAuthorAnalyticsSummary();
  const allItems = data?.data?.items ?? [];
  const items = scopedRepo
    ? allItems.filter(
        (wt) => wt.owner === scopedRepo.owner && wt.repo === scopedRepo.repo,
      )
    : allItems;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            My walkthroughs
          </h2>
          <p className="text-xs text-gray-500">
            Per-reviewer reading status — who read what, not aggregated rates
          </p>
        </div>
        <span className="text-[11px] text-gray-500 bg-gray-100 rounded-full px-2.5 py-1 shrink-0">
          {items.length} walkthroughs
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-24 bg-white border border-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500">
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
