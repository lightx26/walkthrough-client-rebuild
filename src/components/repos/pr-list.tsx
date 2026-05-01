"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PullRequest, PullRequestState } from "@/types/github";
import { PrRow } from "./pr-row";
import { Skeleton } from "@/components/ui/skeleton";

type TabKey = "all" | PullRequestState;

function PrRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

interface PrListProps {
  prs: PullRequest[];
  isLoading: boolean;
}

export function PrList({ prs, isLoading }: PrListProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const counts = {
    all: prs.length,
    open: prs.filter((p) => p.state === "open").length,
    draft: prs.filter((p) => p.state === "draft").length,
    merged: prs.filter((p) => p.state === "merged").length,
    closed: prs.filter((p) => p.state === "closed").length,
  };

  const tabs: { label: string; key: TabKey }[] = [
    { label: "All", key: "all" },
    { label: "Open", key: "open" },
    { label: "Draft", key: "draft" },
    { label: "Merged", key: "merged" },
    { label: "Closed", key: "closed" },
  ];

  const filtered =
    activeTab === "all" ? prs : prs.filter((p) => p.state === activeTab);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
      <div className="flex items-center px-5 border-b border-gray-100">
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
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        {isLoading ? (
          <>
            <PrRowSkeleton />
            <PrRowSkeleton />
            <PrRowSkeleton />
          </>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            No pull requests.
          </div>
        ) : (
          filtered.map((pr) => <PrRow key={pr.number} pr={pr} />)
        )}
      </div>
    </div>
  );
}
