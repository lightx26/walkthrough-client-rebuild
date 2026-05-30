import { ArrowRight, Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/utils/date-diff";
import type { SearchHit } from "@/types/search";

function statusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case "published":
      return "bg-green-100 text-green-700";
    case "draft":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

function HighlightedTitle({
  html,
  fallback,
}: {
  html?: string;
  fallback: string;
}) {
  if (html) {
    return (
      <span
        className="[&_mark]:bg-transparent [&_mark]:text-indigo-600 [&_mark]:font-semibold"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <span>{fallback}</span>;
}

interface SearchWalkthroughItemProps {
  hit: SearchHit;
  selected: boolean;
  onClick: () => void;
}

export function SearchWalkthroughItem({
  hit,
  selected,
  onClick,
}: SearchWalkthroughItemProps) {
  return (
    <Button
      variant="ghost"
      size="none"
      onClick={onClick}
      className={cn(
        "w-full justify-start gap-3 px-4 py-2.5 text-left rounded-none font-normal group",
        selected ? "bg-indigo-50 hover:bg-indigo-50" : "hover:bg-gray-50",
      )}
    >
      <div className="shrink-0 w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center">
        <Waypoints className="w-4 h-4 text-indigo-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">
          <HighlightedTitle
            html={hit.highlights?.title?.[0]}
            fallback={hit.title}
          />
        </p>
        <p className="text-xs text-gray-400 truncate">{hit.repoFull}</p>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <span className="text-xs text-gray-400">
          {formatRelativeTime(hit.createdAt)}
        </span>
        <span
          className={cn(
            "text-xs px-1.5 py-0.5 rounded font-medium",
            statusBadgeClass(hit.status),
          )}
        >
          {hit.status.toLowerCase()}
        </span>
        <ArrowRight
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-opacity",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        />
      </div>
    </Button>
  );
}
