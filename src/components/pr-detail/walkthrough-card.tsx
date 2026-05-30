import Link from "next/link";
import { ChevronRight, MessageSquare, Waypoints } from "lucide-react";
import { WalkthroughStatusBadge } from "./walkthrough-status-badge";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/date-diff";
import type {
  WalkthroughStatus,
  WalkthroughSummary,
} from "@/types/walkthrough";

function WalkthroughStatusIcon({ status }: { status: WalkthroughStatus }) {
  const base = "w-9 h-9 rounded-full flex items-center justify-center shrink-0";
  if (status === "PUBLISHED")
    return (
      <div className={cn(base, "bg-emerald-50")}>
        <Waypoints className="w-4 h-4 text-emerald-600" strokeWidth={2} />
      </div>
    );
  if (status === "DRAFT")
    return (
      <div className={cn(base, "bg-amber-50")}>
        <Waypoints className="w-4 h-4 text-amber-600" strokeWidth={2} />
      </div>
    );
  if (status === "OUTDATED")
    return (
      <div className={cn(base, "bg-gray-100")}>
        <Waypoints className="w-4 h-4 text-gray-500" strokeWidth={2} />
      </div>
    );
  return (
    <div className={cn(base, "bg-gray-100")}>
      <Waypoints className="w-4 h-4 text-gray-400" strokeWidth={2} />
    </div>
  );
}

export function WalkthroughCard({ wt }: { wt: WalkthroughSummary }) {
  return (
    <Link
      href={`/walkthroughs/${wt.id}`}
      className="flex items-center gap-4 p-5 border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-100/50 -mx-5 transition-colors"
    >
      <WalkthroughStatusIcon status={wt.status} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900 truncate">
            {wt.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          {wt.description && (
            <>
              <span className="truncate max-w-xs text-gray-500">
                {wt.description}
              </span>
              <span>·</span>
            </>
          )}
          <span className="flex items-center gap-1">
            <Waypoints className="w-3 h-3" />
            {wt.chapterCount} {wt.chapterCount === 1 ? "chapter" : "chapters"}
          </span>
          {wt.commentCount > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {wt.commentCount}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <WalkthroughStatusBadge status={wt.status} />
        <span className="text-xs text-gray-400 w-12 text-right">
          {formatRelativeTime(wt.updatedAt)}
        </span>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
      </div>
    </Link>
  );
}
