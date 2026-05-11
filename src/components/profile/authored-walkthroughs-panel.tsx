"use client";

import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { WalkthroughCard } from "@/components/home";
import type { WalkthroughSummary } from "@/types/walkthrough";

interface AuthoredWalkthroughsPanelProps {
  username: string;
  walkthroughs?: WalkthroughSummary[];
  total?: number;
  isLoading: boolean;
  onViewAll: () => void;
}

export function AuthoredWalkthroughsPanel({
  username,
  walkthroughs,
  total = 0,
  isLoading,
  onViewAll,
}: AuthoredWalkthroughsPanelProps) {
  const preview = walkthroughs?.slice(0, 3) ?? [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-gray-900">
          Authored walkthroughs{" "}
          <span className="text-gray-400 font-normal">{total}</span>
        </h2>
        <button
          onClick={onViewAll}
          className="flex items-center gap-0.5 text-xs text-violet-600 hover:text-violet-700 transition-colors"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4 mt-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : preview.length === 0 ? (
        <p className="text-sm text-gray-400 mt-4">No walkthroughs yet.</p>
      ) : (
        <div>
          {preview.map((wt) => (
            <WalkthroughCard key={wt.id} wt={wt} />
          ))}
        </div>
      )}
    </div>
  );
}
