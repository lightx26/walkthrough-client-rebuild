import Link from "next/link";
import { WalkthroughSummary } from "@/types/walkthrough";
import { DisplayStatus, toDisplayStatus } from "@/utils/walkthrough";
import { Clock, Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";

function compactAge(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

const statusStyle: Record<DisplayStatus, string> = {
  Published: "bg-green-50 text-green-700 border border-green-200",
  Draft: "bg-amber-50 text-amber-700 border border-amber-200",
  Outdated: "bg-gray-100 text-gray-500 border border-gray-200",
};

export function WalkthroughCard({ wt }: { wt: WalkthroughSummary }) {
  const displayStatus = toDisplayStatus(wt.status);
  if (!displayStatus) return null;

  return (
    <Link
      href={`/walkthroughs/${wt.id}`}
      className="flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0 group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              statusStyle[displayStatus],
            )}
          >
            {displayStatus}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-900 group-hover:text-violet-700 transition-colors leading-snug">
          {wt.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400 flex-wrap">
          <span className="truncate max-w-40">
            {wt.owner}/{wt.repo}
          </span>
          <span className="text-gray-200">·</span>
          <span>#{wt.prNumber}</span>
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px] font-mono font-medium">
            v{wt.version}
          </span>
          <span className="flex items-center gap-1">
            <Waypoints className="w-3 h-3" />
            {wt.chapterCount} ch
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {compactAge(wt.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
