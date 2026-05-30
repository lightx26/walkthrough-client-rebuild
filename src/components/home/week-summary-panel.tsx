import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  Waypoints,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { RecentlyReviewedWalkthrough } from "@/types/walkthrough";

interface WeekSummaryPanelProps {
  walkthroughCount: number;
  commentCount: number;
  recentlyReviewed: RecentlyReviewedWalkthrough[];
}

export function WeekSummaryPanel({
  walkthroughCount,
  commentCount,
  recentlyReviewed,
}: WeekSummaryPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const summaryData = [
    {
      icon: Waypoints,
      iconColor: "text-blue-500",
      bg: "bg-blue-50",
      label: "Walkthroughs",
      value: walkthroughCount,
    },
    {
      icon: MessageSquare,
      iconColor: "text-violet-500",
      bg: "bg-violet-50",
      label: "Comments",
      value: commentCount,
    },
  ];

  if (collapsed) {
    return (
      <aside className="shrink-0 border-l border-gray-200 bg-white flex flex-col items-center py-4 px-1.5 justify-end">
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => setCollapsed(false)}
          className="text-gray-500"
          aria-label="Expand panel"
        >
          <PanelRightOpen className="w-4 h-4" />
        </Button>
      </aside>
    );
  }

  return (
    <aside className="w-70 shrink-0 border-l border-gray-200 bg-white overflow-y-auto px-5 py-5 flex flex-col">
      {/* this week */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm">This week</h3>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {summaryData.map(({ icon: Icon, iconColor, bg, label, value }) => (
            <div
              key={label}
              className="bg-gray-50 rounded-xl p-3 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center",
                    bg,
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", iconColor)} />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 leading-none mb-1">
                {value}
              </p>
              <p className="text-[11px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* recently reviewed */}
      {recentlyReviewed.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">
              Recently reviewed
            </h3>
          </div>
          <div className="space-y-3.5">
            {recentlyReviewed.slice(0, 5).map((r) => {
              const pct = Math.round((r.readChapters / r.totalChapters) * 100);
              return (
                <Link
                  key={r.walkthroughId}
                  href={`/walkthroughs/${r.walkthroughId}`}
                  className="flex items-center gap-2.5 hover:bg-gray-50 rounded-lg px-1 py-0.5 -mx-1 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {r.title}
                      </p>
                      <p className="text-xs text-gray-400 ml-2 shrink-0">
                        {r.readChapters}/{r.totalChapters} ch
                      </p>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* collapse button */}
      <div className="mt-auto flex justify-end">
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => setCollapsed(true)}
          className="text-gray-500"
          aria-label="Collapse panel"
        >
          <PanelRightClose className="w-4 h-4" />
        </Button>
      </div>
    </aside>
  );
}
