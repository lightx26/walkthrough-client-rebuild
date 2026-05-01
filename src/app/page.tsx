"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useCurrentUser } from "@/hooks/use-auth";
import { walkthroughService } from "@/services/walkthrough.service";
import {
  ResumeReadingCard,
  AiSuggestionBanner,
  WalkthroughList,
  WeekSummaryPanel,
} from "@/components/home";

function getGreeting(name: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name} 👋`;
  if (h < 17) return `Good afternoon, ${name} 👋`;
  return `Good evening, ${name} 👋`;
}

export default function HomePage() {
  const user = useCurrentUser();
  const [showAiBanner, setShowAiBanner] = useState(true);

  const { data: recentData, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["walkthroughs", "recent"],
    queryFn: () => walkthroughService.listRecent(),
  });

  const { data: reviewedData } = useQuery({
    queryKey: ["walkthroughs", "recently-reviewed"],
    queryFn: () => walkthroughService.listRecentlyReviewed(),
  });

  const walkthroughs = recentData?.data?.items ?? [];
  const resumeReading = reviewedData?.data?.items?.[0] ?? null;
  const recentlyReviewed = reviewedData?.data?.items ?? [];

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const firstName = user?.displayName?.split(" ")[0] ?? "there";
  const draftCount = walkthroughs.filter((w) => w.status === "DRAFT").length;
  const outdatedCount = walkthroughs.filter(
    (w) => w.status === "OUTDATED",
  ).length;

  return (
    <DashboardLayout>
      {/* main scrollable area */}
      <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
        {/* heading */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-gray-900 mb-1">
            {getGreeting(firstName)}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm text-gray-400">
              {dateStr}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {draftCount > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-2.5 py-1 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  {draftCount} {draftCount === 1 ? "draft" : "drafts"}
                </span>
              )}
              {outdatedCount > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-2.5 py-1 shadow-[0_1px_2px_rgba(0,0,0,.04)]">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                  {outdatedCount} stale
                </span>
              )}
            </div>
          </div>
        </div>

        {resumeReading && <ResumeReadingCard walkthrough={resumeReading} />}

        {showAiBanner && (
          <AiSuggestionBanner onDismiss={() => setShowAiBanner(false)} />
        )}

        <WalkthroughList
          walkthroughs={walkthroughs}
          isLoading={isLoadingRecent}
        />
      </main>

      <WeekSummaryPanel
        walkthroughCount={walkthroughs.length}
        recentlyReviewed={recentlyReviewed}
      />
    </DashboardLayout>
  );
}
