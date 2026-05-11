import Link from "next/link";
import { Building2, ChevronRight, GitBranch, GitFork, Globe, Lock, Pin, Star, User } from "lucide-react";
import type { Repository } from "@/types/github";
import { languageColor } from "@/utils/language-color";
import { formatRelativeTime } from "@/utils/date-diff";
import { usePinRepo, useUnpinRepo } from "@/hooks/use-starred";
import { cn } from "@/lib/utils";

export function RepoCard({ repo }: { repo: Repository }) {
  const isPinned = repo.pinned;
  const pinMutation = usePinRepo();
  const unpinMutation = useUnpinRepo();

  const handleTogglePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPinned) {
      unpinMutation.mutate(repo.fullName);
    } else {
      pinMutation.mutate({
        repoFullName: repo.fullName,
        repoName: repo.name,
        language: repo.language,
      });
    }
  };

  const isOrg = repo.owner.type === "Organization";

  return (
    <Link
      href={`/repos/${repo.owner.login}/${repo.name}`}
      className="border-b border-gray-100 last:border-0 rounded-xl p-6 flex items-center gap-5 hover:bg-gray-100/50 transition-all cursor-pointer group"
    >
      <div className="shrink-0">
        <div className="bg-[#EEF2FF] flex items-center justify-center w-9 h-9 rounded-lg">
          <GitBranch className="text-violet-600 size-4" strokeWidth={2} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-violet-600 hover:underline truncate mb-1.5">
          <span className="inline-flex items-center gap-1 mr-1.5 text-[11px] font-medium text-gray-500 align-middle">
            {isOrg ? (
              <Building2 className="w-3 h-3 text-gray-400" />
            ) : (
              <User className="w-3 h-3 text-gray-400" />
            )}
            {repo.owner.login}
            <span className="text-gray-300">/</span>
          </span>
          {repo.name}
          {repo.isPrivate ? (
            <span className="inline-flex items-center gap-1 ml-2 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 align-middle">
              <Lock className="w-3 h-3" />
              Private
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 ml-2 text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 align-middle">
              <Globe className="w-3 h-3" />
              Public
            </span>
          )}
        </h3>
        {repo.description && (
          <p className="text-sm text-gray-500 truncate mb-2">
            {repo.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${languageColor(repo.language)}`}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {repo.stargazersCount}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            {repo.forksCount}
          </span>
          <span>Updated {formatRelativeTime(repo.updatedAt)}</span>
        </div>
      </div>

      <div className="flex items-center gap-8 shrink-0">
        <button
          onClick={handleTogglePin}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            isPinned
              ? "text-violet-500 hover:text-violet-600"
              : "text-gray-300 hover:text-violet-400",
          )}
          title={isPinned ? "Unpin repository" : "Pin repository"}
        >
          <Pin className={cn("w-4 h-4", isPinned && "fill-current")} />
        </button>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{repo.openPrsCount}</p>
          <p className="text-xs text-gray-400">open PRs</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">
            {repo.walkthroughsCount}
          </p>
          <p className="text-xs text-gray-400">walkthroughs</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
      </div>
    </Link>
  );
}
