'use client';

import type { ProfileReviewingItem } from '@/types/profile';
import type { WalkthroughSummary } from '@/types/walkthrough';

import { AuthoredWalkthroughsPanel } from './authored-walkthroughs-panel';
import { RecentActivityPanel } from './recent-activity-panel';
import { ReviewingPanel } from './reviewing-panel';

interface OverviewTabProps {
  walkthroughs?: WalkthroughSummary[];
  walkthroughsLoading: boolean;
  totalWalkthroughs?: number;
  reviewing?: ProfileReviewingItem[];
  reviewingLoading: boolean;
  onViewAllWalkthroughs: () => void;
}

export function OverviewTab({
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
      <div className="min-w-0 flex-1 space-y-4">
        <AuthoredWalkthroughsPanel
          walkthroughs={walkthroughs}
          total={totalWalkthroughs}
          isLoading={walkthroughsLoading}
          onViewAll={onViewAllWalkthroughs}
        />
        <ReviewingPanel items={reviewing} isLoading={reviewingLoading} />
      </div>

      {/* Sidebar */}
      <div className="w-96 shrink-0 xl:w-xl">
        <RecentActivityPanel />
      </div>
    </div>
  );
}
