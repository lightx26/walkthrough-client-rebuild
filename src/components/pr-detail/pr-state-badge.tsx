import { GitMerge, GitPullRequest, GitPullRequestClosed } from "lucide-react";
import type { PullRequestState } from "@/types/github";

export function PrStateBadge({ state }: { state: PullRequestState }) {
  if (state === "open")
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <GitPullRequest className="w-3.5 h-3.5" strokeWidth={2} />
        Open
      </span>
    );
  if (state === "merged")
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
        <GitMerge className="w-3.5 h-3.5" strokeWidth={2} />
        Merged
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
      <GitPullRequestClosed className="w-3.5 h-3.5" strokeWidth={2} />
      Closed
    </span>
  );
}
