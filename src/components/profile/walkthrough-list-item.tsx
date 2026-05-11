import Link from "next/link";
import { BookOpen, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { toDisplayStatus } from "@/utils/walkthrough";
import type { WalkthroughSummary } from "@/types/walkthrough";

function compactAge(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

const statusStyle: Record<string, string> = {
  Published: "bg-green-50 text-green-700 border border-green-200",
  Draft: "bg-amber-50 text-amber-700 border border-amber-200",
  Outdated: "bg-orange-50 text-orange-700 border border-orange-200",
};

const iconBg: Record<string, string> = {
  Published: "bg-green-500",
  Draft: "bg-amber-400",
  Outdated: "bg-orange-400",
};

function isNew(updatedAt: string): boolean {
  return Date.now() - new Date(updatedAt).getTime() < 60 * 60 * 1_000;
}

export function ProfileWalkthroughItem({ wt }: { wt: WalkthroughSummary }) {
  const displayStatus = toDisplayStatus(wt.status);
  if (!displayStatus) return null;

  return (
    <Link
      href={`/walkthroughs/${wt.id}`}
      className="flex items-center py-3.5 border-b border-gray-100 last:border-0 group"
    >
      <div
        className={cn(
          "w-7 h-7 rounded flex items-center justify-center mr-3 shrink-0",
          iconBg[displayStatus],
        )}
      >
        <BookOpen className="w-3.5 h-3.5 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 group-hover:text-violet-700 transition-colors truncate">
          {wt.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span
            className={cn(
              "text-[11px] font-medium px-1.5 py-0.5 rounded-full",
              statusStyle[displayStatus],
            )}
          >
            {displayStatus}
          </span>
          {displayStatus === "Published" && isNew(wt.updatedAt) && (
            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
              NEW
            </span>
          )}
          <span className="text-[11px] text-gray-400 truncate max-w-32">
            {wt.owner}/{wt.repo}
          </span>
          <span className="text-gray-200 text-xs">·</span>
          <span className="text-[11px] text-gray-400">#{wt.prNumber}</span>
          <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
            <BookOpen className="w-3 h-3" />
            {wt.chapterCount} ch
          </span>
          {(wt.commentCount ?? 0) > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
              <MessageSquare className="w-3 h-3" />
              {wt.commentCount}
            </span>
          )}
        </div>
      </div>

      <span className="text-xs text-gray-400 ml-3 shrink-0">
        {compactAge(wt.updatedAt)}
      </span>
    </Link>
  );
}
