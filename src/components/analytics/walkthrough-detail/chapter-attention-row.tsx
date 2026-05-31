'use client';

import { useState } from 'react';

import type { ChapterAttention } from '@/types/analytics';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  LoaderCircle,
  MessageSquare,
  RefreshCw,
  Zap,
} from 'lucide-react';

import { UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { AttentionBadge } from './attention-badge';

function formatDuration(sec: number): string {
  if (!sec) return '0s';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return s ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function ChapterAttentionRow({ chapter }: { chapter: ChapterAttention }) {
  const hasReaders = chapter.attention.length > 0;
  const [open, setOpen] = useState(hasReaders);

  const readerLabel = !hasReaders
    ? 'No reads yet'
    : chapter.allRead
      ? `${chapter.attention.length} ${chapter.attention.length === 1 ? 'reader' : 'readers'}`
      : `${chapter.attention.length} reader · not all read`;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-100">
      <Button
        type="button"
        variant="ghost"
        size="none"
        onClick={() => setOpen((v) => !v)}
        className="w-full justify-between gap-3 rounded-none px-3 py-2.5 font-normal hover:bg-gray-50"
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-semibold text-gray-600">
            {chapter.order + 1}
          </span>
          <span className="truncate text-sm text-gray-900">{chapter.chapterTitle}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-[11px] text-gray-500">{readerLabel}</span>
          {chapter.totalComments > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-violet-600">
              <MessageSquare className="h-3 w-3" />
              {chapter.totalComments}
            </span>
          )}
          {open ? (
            <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          )}
        </div>
      </Button>

      {open && hasReaders && (
        <div className="divide-y divide-gray-100 border-t border-gray-100 bg-gray-50/60">
          {chapter.attention.map((entry) => (
            <div key={entry.userId} className="flex flex-wrap items-center gap-3 px-3 py-2.5">
              <div className="flex w-32 min-w-0 items-center gap-2">
                <UserAvatar
                  src={entry.avatarUrl}
                  username={entry.username}
                  displayName={entry.displayName}
                  size="sm"
                />
                <span className="truncate text-xs text-gray-800">
                  {entry.displayName || entry.username}
                </span>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                <Clock className="h-3 w-3" />
                {formatDuration(entry.timeSpentSec)}
              </span>

              {entry.markedAsRead ? (
                <AttentionBadge color="emerald" icon={<Check className="h-3 w-3" />}>
                  Read
                </AttentionBadge>
              ) : (
                <AttentionBadge color="amber" icon={<LoaderCircle className="h-3 w-3" />}>
                  Not finished yet
                </AttentionBadge>
              )}

              {entry.possiblySkimmed && (
                <AttentionBadge color="orange" icon={<Zap className="h-3 w-3" />}>
                  Possibly skimmed
                </AttentionBadge>
              )}

              {entry.commentCount > 0 && (
                <AttentionBadge color="violet" icon={<MessageSquare className="h-3 w-3" />}>
                  {entry.commentCount} {entry.commentCount === 1 ? 'comment' : 'comments'}
                </AttentionBadge>
              )}

              {entry.viewCount > 1 && (
                <AttentionBadge color="violet" icon={<RefreshCw className="h-3 w-3" />}>
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
