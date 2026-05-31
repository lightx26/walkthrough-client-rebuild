"use client";

import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { WalkthroughCard } from "@/components/home";
import type { WalkthroughSummary } from "@/types/walkthrough";

interface AuthoredWalkthroughsPanelProps {
  walkthroughs?: WalkthroughSummary[];
  total?: number;
  isLoading: boolean;
  onViewAll: () => void;
}

export function AuthoredWalkthroughsPanel({
  walkthroughs,
  isLoading,
  onViewAll,
}: AuthoredWalkthroughsPanelProps) {
  const preview = walkthroughs?.slice(0, 3) ?? [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between p-5">
        <h2 className="text-sm font-semibold text-gray-900">
          Authored walkthroughs
        </h2>
        <Button
          variant="link"
          size="none"
          onClick={onViewAll}
          className="gap-0.5 text-xs no-underline hover:no-underline"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Button>
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
