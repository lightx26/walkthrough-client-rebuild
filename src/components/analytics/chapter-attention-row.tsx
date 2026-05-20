"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { ChapterAttention } from "@/types/analytics";
import { AttentionBadge } from "./attention-badge";

function formatDuration(sec: number): string {
  if (!sec) return "0s";
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return s ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function isSkim(entry: ChapterAttention["attention"][number]) {
  return !entry.scrolledToBottom && entry.timeSpentSec < 60;
}

export function ChapterAttentionRow({ chapter }: { chapter: ChapterAttention }) {
  const hasReaders = chapter.attention.length > 0;
  const [open, setOpen] = useState(hasReaders);

  const readerLabel = !hasReaders
    ? "No reads yet"
    : chapter.allRead
      ? `${chapter.attention.length} ${chapter.attention.length === 1 ? "reader" : "readers"}`
      : `${chapter.attention.length} reader · not all read`;

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-gray-50"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-semibold flex items-center justify-center shrink-0">
            {chapter.order}
          </span>
          <span className="text-sm text-gray-900 truncate">
            {chapter.chapterTitle}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-gray-500">{readerLabel}</span>
          {chapter.totalComments > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-violet-600">
              <MessageSquare className="w-3 h-3" />
              {chapter.totalComments}
            </span>
          )}
          {open ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
      </button>

      {open && hasReaders && (
        <div className="bg-gray-50/60 border-t border-gray-100 divide-y divide-gray-100">
          {chapter.attention.map((entry) => (
            <div
              key={entry.userId}
              className="flex items-center gap-3 px-3 py-2.5 flex-wrap"
            >
              <div className="flex items-center gap-2 min-w-0 w-32">
                <UserAvatar
                  src={entry.avatarUrl}
                  username={entry.username}
                  displayName={entry.displayName}
                  size="sm"
                />
                <span className="text-xs text-gray-800 truncate">
                  {entry.displayName || entry.username}
                </span>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDuration(entry.timeSpentSec)}
              </span>

              {entry.scrolledToBottom ? (
                <AttentionBadge color="emerald">Scrolled to end</AttentionBadge>
              ) : isSkim(entry) ? (
                <AttentionBadge
                  color="amber"
                  icon={<AlertTriangle className="w-3 h-3" />}
                >
                  Possibly skimmed
                </AttentionBadge>
              ) : (
                <AttentionBadge color="gray">Read</AttentionBadge>
              )}

              {entry.commentCount > 0 && (
                <AttentionBadge
                  color="violet"
                  icon={<MessageSquare className="w-3 h-3" />}
                >
                  {entry.commentCount}{" "}
                  {entry.commentCount === 1 ? "comment" : "comments"}
                </AttentionBadge>
              )}

              {entry.viewCount > 1 && (
                <AttentionBadge
                  color="violet"
                  icon={<RefreshCw className="w-3 h-3" />}
                >
                  Re-read ×{entry.viewCount}
                </AttentionBadge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
