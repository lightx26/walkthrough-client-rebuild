import Link from "next/link";
import { ChevronRight, MessageSquare, Waypoints } from "lucide-react";
import { WalkthroughStatusBadge } from "./walkthrough-status-badge";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/date-diff";
import type {
  WalkthroughStatus,
  WalkthroughSummary,
} from "@/types/walkthrough";
import { WalkthroughStatusIcon } from "@/components/ui/walkthrough-status-icon";

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
