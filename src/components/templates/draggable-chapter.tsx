"use client";

import { useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ChapterDraft } from "./template-form-types";

const DRAG_TYPE_CHAPTER = "TEMPLATE_CHAPTER";

interface ChapterDragItem {
  type: typeof DRAG_TYPE_CHAPTER;
  index: number;
}

interface DraggableChapterProps {
  chapter: ChapterDraft;
  index: number;
  onRemove: () => void;
  onUpdate: (field: "title" | "description", value: string) => void;
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
    [dragPreview, drop],
  );

  const gripRef = useCallback(
    (node: HTMLDivElement | null) => {
      drag(node);
    },
    [drag],
  );

  return (
    <div
      ref={rowRef}
      className={cn(
        "bg-white border border-gray-200 rounded-xl px-4 py-4 transition-opacity",
        isDragging && "opacity-40",
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          ref={gripRef}
          className="cursor-grab active:cursor-grabbing p-0.5 shrink-0"
        >
          <GripVertical className="w-4 h-4 text-gray-300 hover:text-gray-500" />
        </div>
        <span className="w-7 h-7 rounded-md bg-violet-50 text-violet-600 text-xs font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <input
          type="text"
          value={chapter.title}
          onChange={(e) => onUpdate("title", e.target.value)}
          placeholder="Chapter title"
          className="flex-1 text-gray-600 text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
        />
        <Button
          variant="destructiveGhost"
          size="iconSm"
          onClick={onRemove}
          aria-label="Remove chapter"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="pl-9.5">
        <textarea
          value={chapter.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Guidance for the author — what should this chapter cover? (optional)"
          rows={2}
          className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 resize-none"
        />
      </div>
    </div>
  );
}
