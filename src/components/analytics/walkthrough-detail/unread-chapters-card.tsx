"use client";

import { BookOpen } from "lucide-react";
import { UserAvatar } from "@/components/ui";
import type { UnreadSummary } from "@/types/analytics";

export function UnreadChaptersCard({ data }: { data: UnreadSummary }) {
  if (data.unreadChapters.length === 0) {
    return null;
  }
  const pending = data.unreadChapters.length;

  return (
    <section className="bg-amber-50/50 border border-amber-200 rounded-xl px-5 py-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800">
          <BookOpen className="w-4 h-4" />
          Unread chapters
        </h3>
        <span className="inline-flex items-center text-[11px] font-medium text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2.5 py-0.5">
          {pending} {pending === 1 ? "chapter" : "chapters"} pending
        </span>
      </div>

      <div className="space-y-2">
        {data.unreadChapters.map((c) => (
          <div
            key={c.chapterId}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-[11px] font-semibold flex items-center justify-center shrink-0">
                {c.order + 1}
              </span>
              <span className="text-sm text-gray-800 truncate">
                {c.chapterTitle}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-gray-500">unread by</span>
              <div className="flex -space-x-1.5">
                {c.unreadBy.map((u) => (
                  <UserAvatar
                    key={u.userId}
                    src={u.avatarUrl}
                    username={u.username}
                    displayName={u.displayName}
                    size="sm"
                    className="ring-2 ring-amber-50"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
