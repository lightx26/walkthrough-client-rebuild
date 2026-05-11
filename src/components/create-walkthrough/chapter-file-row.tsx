"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FileText, GripVertical, Eye, X, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrFile } from "@/types/github";
import {
  DRAG_TYPE_PR_FILE,
  DRAG_TYPE_PR_DIR,
  statusBadge,
  baseName,
} from "./file-utils";

export const DRAG_TYPE_CHAPTER_FILE = "CHAPTER_FILE";

export interface PrFileDragItem {
  type: typeof DRAG_TYPE_PR_FILE;
  file: PrFile;
}

export interface PrDirDragItem {
  type: typeof DRAG_TYPE_PR_DIR;
  dir: string;
  files: PrFile[];
}

export interface ChapterFileDragItem {
  type: typeof DRAG_TYPE_CHAPTER_FILE;
  chapterId: string;
  fileIndex: number;
  file: PrFile;
}

export type DragItem = PrFileDragItem | PrDirDragItem | ChapterFileDragItem;

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "sql")
    return <FileCode2 className="w-4 h-4 text-blue-500 shrink-0" />;
  return <FileText className="w-4 h-4 text-orange-400 shrink-0" />;
}

function dirName(filename: string) {
  const slash = filename.lastIndexOf("/");
  return slash === -1 ? null : filename.slice(0, slash + 1);
}

interface ChapterFileRowProps {
  file: PrFile;
  index: number;
  chapterId: string;
  onRemove: () => void;
  onViewDiff: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function ChapterFileRow({
  file,
  index,
  chapterId,
  onRemove,
  onViewDiff,
  onReorder,
}: ChapterFileRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const gripRef = useRef<HTMLDivElement>(null);
  const badge = statusBadge(file.status);
  const dir = dirName(file.filename);

  const [{ isDragging }, drag, dragPreview] = useDrag<
    ChapterFileDragItem,
    void,
    { isDragging: boolean }
  >({
    type: DRAG_TYPE_CHAPTER_FILE,
    item: { type: DRAG_TYPE_CHAPTER_FILE, chapterId, fileIndex: index, file },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop<ChapterFileDragItem, void>({
    accept: DRAG_TYPE_CHAPTER_FILE,
    hover(item) {
      if (item.chapterId !== chapterId) return;
      if (item.fileIndex === index) return;
      onReorder(item.fileIndex, index);
      item.fileIndex = index;
    },
  });

  drop(rowRef);
  dragPreview(rowRef);
  drag(gripRef);

  return (
    <div
      ref={rowRef}
      className={cn(
        "flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-100 group transition-opacity",
        isDragging && "opacity-40",
      )}
    >
      <span className="text-xs text-gray-400 w-4 text-center shrink-0 select-none">
        {index + 1}
      </span>
      <div
        ref={gripRef}
        className="cursor-grab active:cursor-grabbing p-0.5 shrink-0"
      >
        <GripVertical className="w-4 h-4 text-gray-300 hover:text-gray-500" />
      </div>
      {getFileIcon(file.filename)}
      <button className="flex-1 min-w-0 text-left" onClick={onViewDiff}>
        <span className="text-sm font-medium text-violet-600 hover:underline truncate block">
          {baseName(file.filename)}
        </span>
      </button>
      {dir && (
        <span className="text-xs text-gray-400 font-mono shrink-0 hidden sm:block truncate max-w-[120px]">
          {dir}
        </span>
      )}
      {(file.additions > 0 || file.deletions > 0) && (
        <span className="text-xs font-mono shrink-0">
          <span className="text-green-600">+{file.additions}</span>{" "}
          <span className="text-red-500">-{file.deletions}</span>
        </span>
      )}
      <span
        className={cn(
          "text-[10px] font-bold px-1 py-0.5 rounded shrink-0",
          badge.cls,
        )}
      >
        {badge.label}
      </span>
      <button
        onClick={onViewDiff}
        className="p-1 rounded text-gray-300 hover:text-gray-500 transition-colors shrink-0"
        title="View diff"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onRemove}
        className="p-1 rounded text-gray-300 hover:text-red-400 transition-colors shrink-0"
        title="Remove"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
