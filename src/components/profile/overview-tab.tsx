"use client";

import { AuthoredWalkthroughsPanel } from "./authored-walkthroughs-panel";
import { ReviewingPanel } from "./reviewing-panel";
import { RecentActivityPanel } from "./recent-activity-panel";
import type { WalkthroughSummary } from "@/types/walkthrough";
import type { ProfileReviewingItem } from "@/types/profile";

interface OverviewTabProps {
  username: string;
  walkthroughs?: WalkthroughSummary[];
  walkthroughsLoading: boolean;
  totalWalkthroughs?: number;
  reviewing?: ProfileReviewingItem[];
  reviewingLoading: boolean;
  onViewAllWalkthroughs: () => void;
}

export function OverviewTab({
  username,
  walkthroughs,
  walkthroughsLoading,
  totalWalkthroughs,
  reviewing,
  reviewingLoading,
  onViewAllWalkthroughs,
}: OverviewTabProps) {
  return (
    <div className="flex gap-6">
      {/* Main column */}
      <div className="flex-1 min-w-0 space-y-4">
        <AuthoredWalkthroughsPanel
          username={username}
          walkthroughs={walkthroughs}
          total={totalWalkthroughs}
          isLoading={walkthroughsLoading}
          onViewAll={onViewAllWalkthroughs}
        />
        <ReviewingPanel items={reviewing} isLoading={reviewingLoading} />
      </div>

      {/* Sidebar */}
      <div className="w-96 xl:w-xl shrink-0">
        <RecentActivityPanel />
      </div>
    </div>
  );
}
