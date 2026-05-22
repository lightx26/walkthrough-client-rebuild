import { GitFork, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Repository } from "@/types/github";
import { HighlightText } from "@/components/search";

interface Props {
  repo: Repository;
  query: string;
  selected: boolean;
  onClick: () => void;
}

export function SearchRepoItem({ repo, query, selected, onClick }: Props) {
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
      <div className="shrink-0 w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
        <GitFork className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate flex items-center gap-1.5">
          {repo.isPrivate && <Lock className="w-3 h-3 text-gray-400 shrink-0" />}
          <HighlightText text={repo.fullName} query={query} />
        </p>
        {repo.description && (
          <p className="text-xs text-gray-400 truncate">{repo.description}</p>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {repo.language && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
            {repo.language}
          </span>
        )}
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
