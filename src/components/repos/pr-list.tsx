"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PullRequest, PullRequestState } from "@/types/github";
import { PrRow } from "./pr-row";
import { Skeleton } from "@/components/ui";
import { Button } from "@/components/ui/button";

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
  owner: string;
  repo: string;
}

export function PrList({ prs, isLoading, owner, repo }: PrListProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const counts = {
    all: prs.length,
    open: prs.filter((p) => p.state === "open").length,
    merged: prs.filter((p) => p.state === "merged").length,
    closed: prs.filter((p) => p.state === "closed").length,
  };

  const tabs: { label: string; key: TabKey }[] = [
    { label: "All", key: "all" },
    { label: "Open", key: "open" },
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
                {counts[tab.key]}
              </span>
            </Button>
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
          filtered.map((pr) => (
            <PrRow key={pr.number} pr={pr} owner={owner} repo={repo} />
          ))
        )}
      </div>
    </div>
  );
}
