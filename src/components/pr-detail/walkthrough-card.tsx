import Link from "next/link";
import { BookOpen, ChevronRight, MessageSquare } from "lucide-react";
import { WalkthroughStatusBadge } from "./walkthrough-status-badge";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/date-diff";
import type {
  WalkthroughStatus,
  WalkthroughSummary,
} from "@/types/walkthrough";

function walkthroughAccentColor(status: WalkthroughStatus) {
  if (status === "PUBLISHED") return "#34d399";
  if (status === "DRAFT") return "#fbbf24";
  if (status === "OUTDATED") return "#fb923c";
  return "#d1d5db";
}

function walkthroughIconColor(status: WalkthroughStatus) {
  if (status === "PUBLISHED") return "text-emerald-600";
  if (status === "DRAFT") return "text-amber-600";
  if (status === "OUTDATED") return "text-orange-500";
  return "text-gray-400";
}

export function WalkthroughCard({ wt }: { wt: WalkthroughSummary }) {
  return (
    <div
      className="flex items-start gap-4 px-5 py-4 rounded-xl border border-gray-200 bg-white"
      style={{
        borderLeftColor: walkthroughAccentColor(wt.status),
        borderLeftWidth: 4,
      }}
    >
      <div className="shrink-0 pt-7.5">
        <BookOpen
          className={cn("w-5 h-5", walkthroughIconColor(wt.status))}
          strokeWidth={1.75}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <WalkthroughStatusBadge status={wt.status} />
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-2">{wt.title}</p>
        {wt.description && (
          <p className="text-xs text-gray-500 truncate mb-2">
            {wt.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {wt.chapterCount} {wt.chapterCount === 1 ? "chapter" : "chapters"}
          </span>
          {wt.commentCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {wt.commentCount} {wt.commentCount === 1 ? "comment" : "comments"}
            </span>
          )}
          <span>{formatRelativeTime(wt.updatedAt)}</span>
        </div>
      </div>

      <Link
        href={`/walkthroughs/${wt.id}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors px-4 py-2 rounded-lg shrink-0"
      >
        Open
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
