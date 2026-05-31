'use client';

import type { ReviewProgress } from '@/types/analytics';
import { Check, Clock, LoaderCircle, MessageSquare, Users } from 'lucide-react';

import { UserAvatar } from '@/components/ui';

import { formatRelativeTime } from '@/utils/date-diff';

import { MatrixCell } from './matrix-cell';
import { MatrixLegendBadge } from './matrix-legend-badge';

function formatDuration(sec: number): string {
  if (sec === null || sec === undefined) return '—';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return s ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function ReadingMatrix({ data }: { data: ReviewProgress }) {
  const chapters = data.reviewers[0]?.chapters ?? [];

  return (
    <section className="rounded-xl border border-gray-200 bg-white px-5 py-4">
      <div className="mb-4">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Users className="h-4 w-4 text-violet-600" />
          Reading matrix
        </h3>
        <p className="text-xs text-gray-500">Who read which chapter</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-[10px] tracking-wider text-gray-400 uppercase">
              <th className="pr-3 pb-3 text-left font-medium">Reviewer</th>
              {chapters.map((c, i) => (
                <th key={c.chapterId} className="w-16 px-1 pb-3 text-center font-medium">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-gray-500">{i + 1}</span>
                    <span className="block max-w-24 truncate font-normal tracking-normal text-gray-400 normal-case">
                      {c.chapterTitle}
                    </span>
                  </div>
                </th>
              ))}
              <th className="px-3 pb-3 font-medium">Progress</th>
              <th className="px-3 pb-3 font-medium">Time</th>
              <th className="pb-3 pl-3 font-medium">Last active</th>
            </tr>
          </thead>
          <tbody>
            {data.reviewers.map((r) => (
              <tr key={r.userId} className="align-middle">
                <td className="py-3 pr-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <UserAvatar
                      src={r.avatarUrl}
                      username={r.username}
                      displayName={r.displayName}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-gray-900">{r.displayName || r.username}</p>
                      <p className="truncate text-[11px] text-gray-400">@{r.username}</p>
                    </div>
                  </div>
                </td>
                {r.chapters.map((c) => (
                  <td key={c.chapterId} className="w-16 px-1 py-3 text-center align-middle">
                    <MatrixCell chapter={c} />
                  </td>
                ))}
                <td className="min-w-35 px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full bg-amber-400"
                        style={{
                          width: `${Math.round(r.completionRate * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs whitespace-nowrap text-gray-700">
                      {r.readChapters}/{r.totalChapters} ch
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs whitespace-nowrap text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    {formatDuration(r.totalTimeSpentSec)}
                  </span>
                </td>
                <td className="py-3 pl-3 text-xs whitespace-nowrap text-gray-500">
                  {r.lastActiveAt ? formatRelativeTime(r.lastActiveAt) : 'Never'}
                </td>
              </tr>
            ))}
            {data.reviewers.length === 0 && (
              <tr>
                <td
                  colSpan={chapters.length + 4}
                  className="py-6 text-center text-xs text-gray-400"
                >
                  No reviewer activity yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-3 text-[11px] text-gray-500">
        <span className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
          Legend:
        </span>
        <MatrixLegendBadge color="emerald" icon={<Check className="h-3 w-3" />}>
          Read
        </MatrixLegendBadge>
        <MatrixLegendBadge color="amber" icon={<LoaderCircle className="h-3 w-3" />}>
          Not finished yet
        </MatrixLegendBadge>
        <span className="inline-flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-md border border-gray-100 bg-gray-50 text-xs text-gray-300">
            —
          </span>
          Not visited
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[9px] font-semibold text-white">
            <MessageSquare className="h-2.5 w-2.5" />
          </span>
          Comments left
        </span>
      </div>
    </section>
  );
}
