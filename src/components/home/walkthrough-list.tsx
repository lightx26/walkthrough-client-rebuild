"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type {
  WalkthroughStatus,
  WalkthroughSummary,
} from "@/types/walkthrough";
import { DisplayStatus, toDisplayStatus } from "@/utils/walkthrough";
import { Filter } from "lucide-react";
import { WalkthroughCard, WalkthroughRowSkeleton } from "@/components/home";

const STATUS_FILTER_MAP: Record<DisplayStatus, WalkthroughStatus> = {
  Published: "PUBLISHED",
  Draft: "DRAFT",
  Outdated: "OUTDATED",
};

interface WalkthroughListProps {
  walkthroughs: WalkthroughSummary[];
  isLoading: boolean;
}

export function WalkthroughList({
  walkthroughs,
  isLoading,
}: WalkthroughListProps) {
  const [activeTab, setActiveTab] = useState<DisplayStatus | "All">("All");

  const draftCount = walkthroughs.filter((w) => w.status === "DRAFT").length;
  const publishedCount = walkthroughs.filter(
    (w) => w.status === "PUBLISHED",
  ).length;
  const outdatedCount = walkthroughs.filter(
    (w) => w.status === "OUTDATED",
  ).length;
  const allCount = walkthroughs.filter(
    (w) => toDisplayStatus(w.status) !== null,
  ).length;

  const filtered =
    activeTab === "All"
      ? walkthroughs.filter((w) => toDisplayStatus(w.status) !== null)
      : walkthroughs.filter((w) => w.status === STATUS_FILTER_MAP[activeTab]);

  const tabs: { label: string; key: DisplayStatus | "All"; count: number }[] = [
    { label: "All", key: "All", count: allCount },
    { label: "Draft", key: "Draft", count: draftCount },
    { label: "Published", key: "Published", count: publishedCount },
    { label: "Outdated", key: "Outdated", count: outdatedCount },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
      <div className="flex items-center justify-between px-5 border-b border-gray-100">
        <div className="flex items-center gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-3.5 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-medium",
                  activeTab === tab.key
                    ? "bg-violet-100 text-violet-700"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
            <Filter className="w-4 h-4 stroke-2" />
            Filter
          </button>
        </div>
      </div>
      <div className="px-5">
        {isLoading ? (
          <>
            <WalkthroughRowSkeleton />
            <WalkthroughRowSkeleton />
            <WalkthroughRowSkeleton />
          </>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            No walkthroughs yet.
          </div>
        ) : (
          filtered.map((wt) => <WalkthroughCard key={wt.id} wt={wt} />)
        )}
      </div>
    </div>
  );
}
