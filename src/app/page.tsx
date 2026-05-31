'use client';

import { useState } from 'react';

import { AlertTriangle, FileText } from 'lucide-react';

import {
  AiSuggestionBanner,
  ResumeReadingCard,
  WalkthroughList,
  WeekSummaryPanel,
} from '@/components/home';
import { DashboardLayout } from '@/components/layout';

import { useCurrentUser } from '@/hooks/use-auth';
import { useRecentWalkthroughs, useRecentlyReviewedWalkthroughs } from '@/hooks/use-walkthrough';

function getGreeting(name: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name} 👋`;
  if (h < 17) return `Good afternoon, ${name} 👋`;
  return `Good evening, ${name} 👋`;
}

export default function HomePage() {
  const user = useCurrentUser();
  const [showAiBanner, setShowAiBanner] = useState(true);

  const { data: recentData, isLoading: isLoadingRecent } = useRecentWalkthroughs();

  const { data: reviewedData } = useRecentlyReviewedWalkthroughs();

  const walkthroughs = recentData?.data?.items ?? [];
  const resumeReading = reviewedData?.data?.items?.[0] ?? null;
  const recentlyReviewed = reviewedData?.data?.items ?? [];

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const firstName = user?.displayName?.split(' ')[0] ?? 'there';
  const draftCount = walkthroughs.filter((w) => w.status === 'DRAFT').length;
  const outdatedCount = walkthroughs.filter((w) => w.status === 'OUTDATED').length;

  return (
    <DashboardLayout>
      {/* main scrollable area */}
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
        {/* heading */}
        <div className="mb-6">
          <h1 className="mb-1 text-[22px] font-bold text-gray-900">{getGreeting(firstName)}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-400">{dateStr}</p>
            <div className="flex flex-wrap items-center gap-2">
              {draftCount > 0 && (
                <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-500 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
                  <FileText className="h-3.5 w-3.5 text-amber-500" />
                  {draftCount} {draftCount === 1 ? 'draft' : 'drafts'}
                </span>
              )}
              {outdatedCount > 0 && (
                <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-500 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
                  <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                  {outdatedCount} stale
                </span>
              )}
            </div>
          </div>
        </div>

        {resumeReading && <ResumeReadingCard walkthrough={resumeReading} />}

        {showAiBanner && <AiSuggestionBanner onDismiss={() => setShowAiBanner(false)} />}

        <WalkthroughList walkthroughs={walkthroughs} isLoading={isLoadingRecent} />
      </main>

      <WeekSummaryPanel
        walkthroughCount={walkthroughs.length}
        commentCount={walkthroughs.reduce((sum, w) => sum + (w.commentCount ?? 0), 0)}
        recentlyReviewed={recentlyReviewed}
      />
    </DashboardLayout>
  );
}
