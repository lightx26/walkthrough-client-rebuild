import { BookOpen, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecentlyReviewedWalkthrough } from "@/types/walkthrough";

interface WeekSummaryPanelProps {
  walkthroughCount: number;
  recentlyReviewed: RecentlyReviewedWalkthrough[];
}

export function WeekSummaryPanel({
  walkthroughCount,
  recentlyReviewed,
}: WeekSummaryPanelProps) {
  return (
    <aside className="w-70 shrink-0 border-l border-gray-200 bg-white overflow-y-auto px-5 py-5">
      {/* this week */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm">This week</h3>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            {
              icon: BookOpen,
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
              value: "—",
            },
          ].map(({ icon: Icon, iconColor, bg, label, value }) => (
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
                <div
                  key={r.walkthroughId}
                  className="flex items-center gap-2.5"
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
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
