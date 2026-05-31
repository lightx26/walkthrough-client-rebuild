'use client';

import type { ChapterAttentionResponse } from '@/types/analytics';
import { Eye } from 'lucide-react';

import { ChapterAttentionRow } from './chapter-attention-row';

export function ChapterAttentionList({ data }: { data: ChapterAttentionResponse }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white px-5 py-4">
      <div className="mb-4">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Eye className="h-4 w-4 text-violet-600" />
          Chapter attention
        </h3>
        <p className="text-xs text-gray-500">
          Raw per-reviewer signals — comment count is the strongest engagement indicator
        </p>
      </div>

      <div className="space-y-2">
        {data.chapters.map((c) => (
          <ChapterAttentionRow key={c.chapterId} chapter={c} />
        ))}
      </div>
    </section>
  );
}
