"use client";

import { LayoutTemplate, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChapterDraft } from "./template-form-types";
import { DraggableChapter } from "./draggable-chapter";

interface TemplateFormChaptersProps {
  chapters: ChapterDraft[];
  onRemove: (key: string) => void;
  onUpdate: (key: string, field: "title" | "description", value: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onAdd: () => void;
}

export function TemplateFormChapters({
  chapters,
  onRemove,
  onUpdate,
  onMove,
  onAdd,
}: TemplateFormChaptersProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900 text-base">Chapters</h2>
          <span className="text-xs text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded font-semibold">
            {chapters.length}
          </span>
        </div>
        <span className="text-xs text-gray-400">Drag to reorder</span>
      </div>

      <div className="space-y-3 mb-4">
        {chapters.map((chapter, idx) => (
          <DraggableChapter
            key={chapter.key}
            chapter={chapter}
            index={idx}
            onRemove={() => onRemove(chapter.key)}
            onUpdate={(field, value) => onUpdate(chapter.key, field, value)}
            onMove={onMove}
          />
        ))}
      </div>

      <Button
        variant="dashed"
        size="none"
        onClick={onAdd}
        className="w-full gap-1.5 py-3 rounded-xl text-sm mb-4"
      >
        <Plus className="w-4 h-4" />
        Add chapter
      </Button>

      <div className="flex items-start gap-2.5 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
        <LayoutTemplate className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
        <p className="text-sm text-violet-700">
          Chapter titles and descriptions are pre-filled into the walkthrough
          builder. Authors can rename or delete them — the template is only a
          starting point.
        </p>
      </div>
    </>
  );
}
