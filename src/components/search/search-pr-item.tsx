import { GitPullRequest, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/date-diff";
import type { RecentPRResult } from "@/types/search";
import { HighlightText } from "@/components/search";

function prStateBadgeClass(state: string) {
  switch (state.toLowerCase()) {
    case "open":
      return "bg-green-100 text-green-700";
    case "merged":
      return "bg-purple-100 text-purple-700";
    case "closed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

interface Props {
  pr: RecentPRResult;
  query: string;
  selected: boolean;
  onClick: () => void;
}

export function SearchPRItem({ pr, query, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-left group transition-colors",
        selected ? "bg-indigo-50" : "hover:bg-gray-50",
      )}
    >
      <div className="shrink-0 w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center">
        <GitPullRequest className="w-4 h-4 text-purple-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">
          <HighlightText text={pr.title} query={query} />
        </p>
        <p className="text-xs text-gray-400 truncate">
          {pr.owner}/{pr.repo} #{pr.number}
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <span className="text-xs text-gray-400">{formatRelativeTime(pr.createdAt)}</span>
        <span
          className={cn(
            "text-xs px-1.5 py-0.5 rounded font-medium",
            prStateBadgeClass(pr.state),
          )}
        >
          {pr.state.toLowerCase()}
        </span>
        <ArrowRight
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-opacity",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        />
      </div>
    </button>
  );
}
