"use client";

import Link from "next/link";
import { AlertTriangle, BarChart2, BookOpen, CheckCircle2, MessageSquare } from "lucide-react";
import { formatRelativeTime } from "@/utils/date-diff";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/user-avatar";
import { ProgressDots } from "./progress-dots";
import type { AuthorWalkthroughSummary } from "@/types/analytics";

export function AuthorWalkthroughCard({
  walkthrough,
}: {
  walkthrough: AuthorWalkthroughSummary;
}) {
  const allRead =
    walkthrough.unreadChapterCount === 0 && walkthrough.reviewers.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-[15px] font-semibold text-gray-900 truncate">
              {walkthrough.title}
            </h3>
            <span className="text-[11px] text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
              {walkthrough.repo}
            </span>
            {allRead ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                <CheckCircle2 className="w-3 h-3" />
                All chapters read
              </span>
            ) : walkthrough.unreadChapterCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                <AlertTriangle className="w-3 h-3" />
                {walkthrough.unreadChapterCount} unread{" "}
                {walkthrough.unreadChapterCount === 1 ? "chapter" : "chapters"}
              </span>
            ) : null}
          </div>
          {walkthrough.description && (
            <p className="text-xs text-gray-500 truncate">
              {walkthrough.description}
            </p>
          )}
        </div>

        <Link
          href={`/analytics/${walkthrough.walkthroughId}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-md px-3 py-1.5 shrink-0"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          Details
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-1">
          {walkthrough.reviewers.length === 0 ? (
            <p className="text-xs text-gray-400">No reviewer activity yet</p>
          ) : (
            walkthrough.reviewers.slice(0, 4).map((r) => {
              const started = r.readChapters > 0;
              return (
                <div
                  key={r.userId}
                  className="flex items-center gap-3 text-xs text-gray-600"
                >
                  <UserAvatar
                    src={r.avatarUrl}
                    username={r.username}
                    displayName={r.displayName}
                    size="sm"
                  />
                  <span className="w-20 truncate text-gray-700">
                    {r.displayName || r.username}
                  </span>
                  <ProgressDots
                    read={r.readChapters}
                    total={walkthrough.totalChapters}
                  />
                  <span
                    className={cn(
                      "text-[11px]",
                      started ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    {r.readChapters}/{walkthrough.totalChapters}
                    {" · "}
                    {started && r.lastActiveAt
                      ? formatRelativeTime(r.lastActiveAt)
                      : "not started"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-end gap-1 text-[11px] text-gray-400 shrink-0">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {walkthrough.totalChapters} ch
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {walkthrough.totalComments}
          </span>
          {walkthrough.lastActivityAt && (
            <span>{formatRelativeTime(walkthrough.lastActivityAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
