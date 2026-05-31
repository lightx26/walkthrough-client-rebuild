"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type {
  WalkthroughStatus,
  WalkthroughSummary,
} from "@/types/walkthrough";
import { DisplayStatus, toDisplayStatus } from "@/utils/walkthrough";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
      <div className="flex items-center justify-between px-5 border-b border-gray-100">
        <div className="flex items-center gap-0.5">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant="ghost"
              size="none"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "gap-1.5 px-3 py-3.5 text-sm font-medium border-b-2 rounded-none hover:bg-transparent",
                activeTab === tab.key
                  ? "border-primary text-primary-soft-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-medium",
                  activeTab === tab.key
                    ? "bg-primary-soft text-primary-soft-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {tab.count}
              </span>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="muted"
            size="none"
            className="text-xs font-normal gap-1 px-1 py-1 hover:bg-transparent"
          >
            <Filter className="w-4 h-4 stroke-2" />
            Filter
          </Button>
        </div>
      </div>
      <div>
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
