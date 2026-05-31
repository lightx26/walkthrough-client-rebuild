'use client';

import { useCallback } from 'react';

import { cn } from '@/lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';

import { Button } from '@/components/ui/button';

import type { ChapterDraft } from './template-form-types';

const DRAG_TYPE_CHAPTER = 'TEMPLATE_CHAPTER';

interface ChapterDragItem {
  type: typeof DRAG_TYPE_CHAPTER;
  index: number;
}

interface DraggableChapterProps {
  chapter: ChapterDraft;
  index: number;
  onRemove: () => void;
  onUpdate: (field: 'title' | 'description', value: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

export function DraggableChapter({
  chapter,
  index,
  onRemove,
  onUpdate,
  onMove,
}: DraggableChapterProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag<
    ChapterDragItem,
    void,
    { isDragging: boolean }
  >({
    type: DRAG_TYPE_CHAPTER,
    item: { type: DRAG_TYPE_CHAPTER, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop<ChapterDragItem, void>({
    accept: DRAG_TYPE_CHAPTER,
    hover(item) {
      if (item.index === index) return;
      onMove(item.index, index);
      item.index = index;
    },
  });

  const rowRef = useCallback(
    (node: HTMLDivElement | null) => {
      dragPreview(drop(node));
    },
    [dragPreview, drop]
  );

  const gripRef = useCallback(
    (node: HTMLDivElement | null) => {
      drag(node);
    },
    [drag]
  );

  return (
    <div
      ref={rowRef}
      className={cn(
        'rounded-xl border border-gray-200 bg-white px-4 py-4 transition-opacity',
        isDragging && 'opacity-40'
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <div ref={gripRef} className="shrink-0 cursor-grab p-0.5 active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-gray-300 hover:text-gray-500" />
        </div>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-50 text-xs font-bold text-violet-600">
          {index + 1}
        </span>
        <input
          type="text"
          value={chapter.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          placeholder="Chapter title"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
        />
        <Button
          variant="destructiveGhost"
          size="iconSm"
          onClick={onRemove}
          aria-label="Remove chapter"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="pl-9.5">
        <textarea
          value={chapter.description}
          onChange={(e) => onUpdate('description', e.target.value)}
          placeholder="Guidance for the author — what should this chapter cover? (optional)"
          rows={2}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
        />
      </div>
    </div>
  );
}
