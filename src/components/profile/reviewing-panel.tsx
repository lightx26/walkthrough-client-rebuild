"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar, Skeleton } from "@/components/ui";
import type { ProfileReviewingItem } from "@/types/profile";

interface ReviewingPanelProps {
  items?: ProfileReviewingItem[];
  isLoading: boolean;
}

function reviewStatus(item: ProfileReviewingItem): {
  label: string;
  className: string;
} {
  const pct =
    item.totalChapters > 0
      ? Math.round((item.readChapters / item.totalChapters) * 100)
      : 0;
  if (pct >= 100) return { label: "Done", className: "bg-green-50 text-green-700 border border-green-200" };
  if (pct > 0) return { label: "In progress", className: "bg-blue-50 text-blue-700 border border-blue-200" };
  return { label: "Not started", className: "bg-gray-100 text-gray-500 border border-gray-200" };
}

function pct(item: ProfileReviewingItem): number {
  if (item.totalChapters === 0) return 0;
  return Math.round((item.readChapters / item.totalChapters) * 100);
}

function formatTime(sec: number): string {
  if (sec < 60) return "—";
  const m = Math.round(sec / 60);
  if (m < 60) return `${m}m`;
  return `${Math.round(m / 60)}h`;
}

export function ReviewingPanel({ items, isLoading }: ReviewingPanelProps) {
  const count = items?.length ?? 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-1">
        Reviewing <span className="text-gray-400 font-normal">{count}</span>
      </h2>

      {isLoading ? (
        <div className="space-y-5 mt-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <p className="text-sm text-gray-400 mt-4">Not reviewing anything yet.</p>
      ) : (
        <div>
          {items.map((item) => {
            const { label, className } = reviewStatus(item);
            const progress = pct(item);

            return (
              <div
                key={item.walkthroughId}
                className="py-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-start gap-3">
                  <UserAvatar
                    src={item.creatorAvatarUrl}
                    displayName={item.creatorDisplayName}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/walkthroughs/${item.walkthroughId}`}
                        className="text-sm font-medium text-gray-900 hover:text-violet-700 transition-colors truncate"
                      >
                        {item.title}
                      </Link>
                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0",
                          className,
                        )}
                      >
                        {label}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      by {item.creatorDisplayName} &middot;{" "}
                      {item.owner}/{item.repo} &middot; #{item.prNumber} &middot;{" "}
                      {item.totalChapters} ch &middot;{" "}
                      <Clock className="inline w-3 h-3" /> {formatTime(item.timeSpentSec)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            progress >= 100
                              ? "bg-green-500"
                              : progress > 0
                                ? "bg-violet-500"
                                : "bg-gray-200",
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0 w-8 text-right">
                        {progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
