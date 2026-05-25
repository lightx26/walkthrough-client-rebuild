"use client";

import { AlertCircle, Check, Clock, MessageSquare, Users } from "lucide-react";
import { UserAvatar } from "@/components/ui";
import { formatRelativeTime } from "@/utils/date-diff";
import type { ReviewProgress } from "@/types/analytics";
import { MatrixCell } from "./matrix-cell";
import { MatrixLegendBadge } from "./matrix-legend-badge";

function formatDuration(sec: number): string {
  if (!sec) return "—";
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
    <section className="bg-white border border-gray-200 rounded-xl px-5 py-4">
      <div className="mb-4">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Users className="w-4 h-4 text-violet-600" />
          Reading matrix
        </h3>
        <p className="text-xs text-gray-500">Who read which chapter</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-gray-400">
              <th className="text-left font-medium pb-3 pr-3">Reviewer</th>
              {chapters.map((c, i) => (
                <th key={c.chapterId} className="font-medium pb-3 px-1 w-18">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-gray-500">{i + 1}</span>
                    <span className="font-normal normal-case tracking-normal text-gray-400 truncate max-w-24 block">
                      {c.chapterTitle}
                    </span>
                  </div>
                </th>
              ))}
              <th className="font-medium pb-3 px-3">Progress</th>
              <th className="font-medium pb-3 px-3">Time</th>
              <th className="font-medium pb-3 pl-3">Last active</th>
            </tr>
          </thead>
          <tbody>
            {data.reviewers.map((r) => (
              <tr key={r.userId} className="align-middle">
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UserAvatar
                      src={r.avatarUrl}
                      username={r.username}
                      displayName={r.displayName}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="text-gray-900 truncate">
                        {r.displayName || r.username}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        @{r.username}
                      </p>
                    </div>
                  </div>
                </td>
                {r.chapters.map((c) => (
                  <td key={c.chapterId} className="py-3 px-1">
                    <MatrixCell chapter={c} />
                  </td>
                ))}
                <td className="py-3 px-3 min-w-35">
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-gray-100 flex-1 overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{
                          width: `${Math.round(r.completionRate * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-700 whitespace-nowrap">
                      {r.readChapters}/{r.totalChapters} ch
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-xs text-gray-600 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {formatDuration(r.totalTimeSpentSec)}
                  </span>
                </td>
                <td className="py-3 pl-3 text-xs text-gray-500 whitespace-nowrap">
                  {r.lastActiveAt
                    ? formatRelativeTime(r.lastActiveAt)
                    : "Never"}
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

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex-wrap">
        <span className="font-medium text-gray-400 uppercase tracking-wider text-[10px]">
          Legend:
        </span>
        <MatrixLegendBadge color="emerald" icon={<Check className="w-3 h-3" />}>
          Read fully
        </MatrixLegendBadge>
        <MatrixLegendBadge
          color="amber"
          icon={<AlertCircle className="w-3 h-3" />}
        >
          Read, not scrolled to end
        </MatrixLegendBadge>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-md bg-gray-50 border border-gray-100 text-gray-300 text-xs flex items-center justify-center">
            —
          </span>
          Not read
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[9px] font-semibold flex items-center justify-center">
            <MessageSquare className="w-2.5 h-2.5" />
          </span>
          Comments left
        </span>
      </div>
    </section>
  );
}
