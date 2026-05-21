"use client";

import { Eye } from "lucide-react";
import type { ChapterAttentionResponse } from "@/types/analytics";
import { ChapterAttentionRow } from "./chapter-attention-row";

export function ChapterAttentionList({
  data,
}: {
  data: ChapterAttentionResponse;
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl px-5 py-4">
      <div className="mb-4">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Eye className="w-4 h-4 text-violet-600" />
          Chapter attention
        </h3>
        <p className="text-xs text-gray-500">
          Raw per-reviewer signals — comment count is the strongest engagement
          indicator
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
