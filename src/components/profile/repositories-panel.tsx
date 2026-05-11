"use client";

import { ExternalLink, GitFork, Star } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/utils/date-diff";
import { cn } from "@/lib/utils";
import { languageColor } from "@/utils/language-color";
import type { Repository } from "@/types/github";

interface RepositoriesPanelProps {
  repositories?: Repository[];
  isLoading: boolean;
}

export function RepositoriesPanel({ repositories, isLoading }: RepositoriesPanelProps) {
  const items = repositories?.slice(0, 6) ?? [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Repositories{" "}
          <span className="text-gray-400 font-normal">{repositories?.length ?? 0}</span>
        </h2>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 transition-colors"
        >
          View on GitHub <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {isLoading ? (
        <div className="space-y-5">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No repositories found.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {items.map((repo) => {
            const color = languageColor(repo.language);
            return (
              <div key={repo.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-violet-600 hover:underline flex items-center gap-1"
                  >
                    {repo.name}
                  </a>
                </div>
                {repo.description && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span
                        className={cn("w-2.5 h-2.5 rounded-full shrink-0", color)}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
