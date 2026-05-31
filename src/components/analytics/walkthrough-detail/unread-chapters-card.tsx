'use client';

import type { UnreadSummary } from '@/types/analytics';
import { Waypoints } from 'lucide-react';

import { UserAvatar } from '@/components/ui';

export function UnreadChaptersCard({ data }: { data: UnreadSummary }) {
  if (data.unreadChapters.length === 0) {
    return null;
  }
  const pending = data.unreadChapters.length;

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50/50 px-5 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800">
          <Waypoints className="h-4 w-4" />
          Unread chapters
        </h3>
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
          {pending} {pending === 1 ? 'chapter' : 'chapters'} pending
        </span>
      </div>

      <div className="space-y-2">
        {data.unreadChapters.map((c) => (
          <div key={c.chapterId} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[11px] font-semibold text-amber-800">
                {c.order + 1}
              </span>
              <span className="truncate text-sm text-gray-800">{c.chapterTitle}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
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
