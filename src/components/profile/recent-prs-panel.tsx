"use client";

import { Skeleton } from "@/components/ui";
import { PrRow } from "@/components/repos";
import type { PrRowItem } from "@/components/repos";
import type { RecentPullRequest } from "@/types/profile";

interface RecentPrsPanelProps {
  pullRequests?: RecentPullRequest[];
  total?: number;
  isLoading: boolean;
}

function toPrRowItem(pr: RecentPullRequest): PrRowItem {
  return {
    number: pr.number,
    title: pr.title,
    state: pr.state,
    updatedAt: pr.updatedAt,
    author: pr.author,
    head: pr.headRef ? { ref: pr.headRef } : undefined,
  };
}

export function RecentPrsPanel({
  pullRequests,
  total,
  isLoading,
}: RecentPrsPanelProps) {
  const items = pullRequests ?? [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-sm font-semibold text-gray-900">
          Recent pull requests{" "}
          {total != null && (
            <span className="text-gray-400 font-normal">{total}</span>
          )}
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-4 px-5 pb-5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400 px-5 pb-5">
          No pull requests found.
        </p>
      ) : (
        <div className="px-5 pb-2">
          {items.map((pr) => (
            <PrRow
              key={pr.id}
              pr={toPrRowItem(pr)}
              owner={pr.owner}
              repo={pr.repo}
              showRepoInfo
            />
          ))}
        </div>
      )}
    </div>
  );
}
