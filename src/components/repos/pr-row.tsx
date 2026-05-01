"use client";

import {
  ArrowLeft, ArrowRight,
  BookOpen,
  ChevronRight,
  GitMerge,
  GitPullRequest,
  GitPullRequestClosed,
  GitPullRequestDraft
} from "lucide-react";
import type { PullRequest, PullRequestState } from "@/types/github";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatRelativeTime } from "@/utils/date-diff";
import { cn } from "@/lib/utils";

function PrStateIcon({ state }: { state: PullRequestState }) {
  const base = "w-9 h-9 rounded-full flex items-center justify-center shrink-0";
  if (state === "open")
    return (
      <div className={cn(base, "bg-emerald-50")}>
        <GitPullRequest className="w-4 h-4 text-emerald-600" strokeWidth={2} />
      </div>
    );
  if (state === "draft")
    return (
      <div className={cn(base, "bg-gray-100")}>
        <GitPullRequestDraft className="w-4 h-4 text-gray-400" strokeWidth={2} />
      </div>
    );
  if (state === "merged")
    return (
      <div className={cn(base, "bg-violet-50")}>
        <GitMerge className="w-4 h-4 text-violet-600" strokeWidth={2} />
      </div>
    );
  return (
    <div className={cn(base, "bg-red-50")}>
      <GitPullRequestClosed className="w-4 h-4 text-red-500" strokeWidth={2} />
    </div>
  );
}

function StateBadge({ state }: { state: PullRequestState }) {
  if (state === "open")
    return (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        Open
      </span>
    );
  if (state === "draft")
    return (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
        Draft
      </span>
    );
  if (state === "merged")
    return (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
        Merged
      </span>
    );
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
      Closed
    </span>
  );
}

export function PrRow({ pr }: { pr: PullRequest }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 group cursor-pointer hover:bg-gray-50/50 -mx-5 px-5 transition-colors">
      <PrStateIcon state={pr.state} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900 truncate">
            {pr.title}
          </span>
          <span className="text-sm text-gray-400 shrink-0">#{pr.number}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <UserAvatar
            src={pr.author.avatarUrl}
            username={pr.author.login}
            size="sm"
          />
          <span className="font-medium text-gray-500">{pr.author.login}</span>
          <span>·</span>
          <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">
            {pr.head.ref}
          </code>
          <ArrowRight className="w-4 h-4" />
          <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">
            {pr.base.ref}
          </code>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {pr.walkthroughsCount > 0 ? (
          <span className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
            {pr.walkthroughsCount === 1
              ? "1 walkthrough"
              : `${pr.walkthroughsCount} walkthroughs`}
          </span>
        ) : (
          <span className="text-xs text-gray-400">No walkthroughs</span>
        )}
        <StateBadge state={pr.state} />
        <span className="text-xs text-gray-400 w-12 text-right">
          {formatRelativeTime(pr.updatedAt)}
        </span>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
      </div>
    </div>
  );
}
