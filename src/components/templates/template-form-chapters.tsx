'use client';

import { LayoutTemplate, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { DraggableChapter } from './draggable-chapter';
import type { ChapterDraft } from './template-form-types';

interface TemplateFormChaptersProps {
  chapters: ChapterDraft[];
  onRemove: (key: string) => void;
  onUpdate: (key: string, field: 'title' | 'description', value: string) => void;
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
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">Chapters</h2>
          <span className="rounded bg-violet-50 px-1.5 py-0.5 text-xs font-semibold text-violet-600">
            {chapters.length}
          </span>
        </div>
        <span className="text-xs text-gray-400">Drag to reorder</span>
      </div>

      <div className="mb-4 space-y-3">
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
        className="mb-4 w-full gap-1.5 rounded-xl py-3 text-sm"
      >
        <Plus className="h-4 w-4" />
        Add chapter
      </Button>

      <div className="flex items-start gap-2.5 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
        <LayoutTemplate className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
        <p className="text-sm text-violet-700">
          Chapter titles and descriptions are pre-filled into the walkthrough builder. Authors can
          rename or delete them — the template is only a starting point.
        </p>
      </div>
    </>
  );
}
